import { useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type CgtErrors = {
  litros?: string;
  kilos?: string;
};

type DesgloseData = {
  dato1: number;
  dato2: number;
  kilosmfc: number;
  operacionTotal: number;
};

type InputFieldProps = {
  label: string;
  unit: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  icon: ReactNode;
};

const { width, height } = Dimensions.get('window');

// ─── DESIGN TOKENS AMTEX ─────────────────────────────────────
const C = {
  bg: '#f0f2f5',
  white: '#ffffff',
  blue: '#1565c0',
  blueDark: '#0d47a1',
  blueLight: '#1e88e5',
  blueXlight: '#e8f0fe',
  textDark: '#0d1825',
  textMid: '#3d4a5c',
  textMuted: '#8a96a8',
  textHint: '#b0b8c4',
  border: '#e2e6ed',
  inputBg: '#f7f8fa',
  labelColor: '#5a6478',
  grid: 'rgba(21,101,192,0.045)',
  orb: 'rgba(21,101,192,0.08)',
  iconBg: 'rgba(21,101,192,0.08)',
  activeBorder: '#1565c0',
  activeInput: 'rgba(21,101,192,0.025)',
  danger: '#ef5350',
};

const GRID = 28;
const COLS = Math.ceil(width / GRID) + 1;
const ROWS = Math.ceil(height / GRID) + 1;

// ─── GRID TÉCNICA ─────────────────────────────────────────────
function Grid() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: ROWS }).map((_, i) => (
        <View key={`h${i}`} style={[s.line, s.lineH, { top: i * GRID }]} />
      ))}
      {Array.from({ length: COLS }).map((_, i) => (
        <View key={`v${i}`} style={[s.line, s.lineV, { left: i * GRID }]} />
      ))}
    </View>
  );
}

// ─── ÍCONOS ───────────────────────────────────────────────────
function IconFlask() {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          borderWidth: 1.5,
          borderColor: C.blue,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          width: 12,
          height: 5,
          borderRadius: 2,
          borderWidth: 1.5,
          borderColor: C.blue,
          marginTop: -1,
        }}
      />
    </View>
  );
}

function IconWeight() {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 10,
          height: 8,
          borderRadius: 2,
          borderWidth: 1.5,
          borderColor: C.blue,
        }}
      />
      <View
        style={{
          width: 6,
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderWidth: 1.5,
          borderColor: C.blue,
          borderBottomWidth: 0,
          position: 'absolute',
          top: 0,
        }}
      />
    </View>
  );
}

function IconArrow() {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ width: 8, height: 1.5, backgroundColor: C.white }} />
      <View
        style={{
          position: 'absolute',
          right: 2,
          width: 5,
          height: 5,
          borderTopWidth: 1.5,
          borderRightWidth: 1.5,
          borderColor: C.white,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

// ─── INPUT FIELD REUTILIZABLE ─────────────────────────────────
function InputField({
  label,
  unit,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = () => {
    setFocused(false);
    if (!error) {
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? C.danger : C.border,
      error ? C.danger : C.activeBorder,
    ],
  });
  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.inputBg, error ? 'rgba(239,83,80,0.03)' : C.activeInput],
  });

  return (
    <View style={s.fieldWrap}>
      {/* Label + Unidad */}
      <View style={s.fieldLabelRow}>
        <Text style={s.fieldLabel}>{label}</Text>
        <View style={s.unitChip}>
          <Text style={s.unitText}>{unit}</Text>
        </View>
      </View>

      {/* Input box */}
      <Animated.View
        style={[
          s.fieldBox,
          { borderColor, backgroundColor: bgColor },
          (focused || error) && s.fieldBoxActive,
        ]}>
        {focused && !error && <View style={s.fieldAccent} />}
        <View style={[s.fieldIconWrap, focused && s.fieldIconActive]}>
          {icon}
        </View>
        <TextInput
          style={s.fieldInput}
          placeholder={placeholder}
          placeholderTextColor={C.textHint}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="numeric"
          autoCorrect={false}
          selectionColor={C.blue}
        />
      </Animated.View>

      {/* Error inline */}
      {error ? <Text style={s.errorText}>⚠ {error}</Text> : null}
    </View>
  );
}

// ─── COMPONENTE CGT ───────────────────────────────────────────
export default function Cgt() {
  // ── Estado (lógica original preservada) ──────────────────
  const [litrosdosi, setLitrosdosi] = useState('');
  const [kgdmfc, setKgmfc] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<CgtErrors>({});
  const [desglose, setDesglose] = useState<DesgloseData | null>(null);

  // Animación del botón
  const btnScale = useRef(new Animated.Value(1)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;

  const onPressIn = () =>
    Animated.spring(btnScale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();

  // ── Validación ────────────────────────────────────────────
  const validate = (): CgtErrors => {
    const e: CgtErrors = {};
    const d1 = parseFloat(litrosdosi);
    const d2 = parseFloat(kgdmfc);
    if (isNaN(d1) || d1 <= 0) e.litros = 'Ingrese un número válido mayor a 0';
    if (isNaN(d2) || d2 <= 0) e.kilos = 'Ingrese un número válido mayor a 0';
    return e;
  };

  // ── Operación (lógica original exacta) ───────────────────
  const operacion = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    resultAnim.setValue(0);

    setTimeout(() => {
      const dato1 = parseFloat(litrosdosi);
      const dato2 = parseFloat(kgdmfc);

      // ── LÓGICA ORIGINAL ──────────────────────────────────
      const kilosmfc = dato2 * 1.272;
      const litros = dato1;
      const operacionTotal = (litros * kilosmfc) / 1000;
      // ─────────────────────────────────────────────────────

      setResultado(operacionTotal);
      setDesglose({ dato1, dato2, kilosmfc, operacionTotal });
      setLoading(false);

      // Animar resultado
      Animated.spring(resultAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 80,
      }).start();

      Keyboard.dismiss();
    }, 600);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Fondo */}
      <View style={s.bgBase} />
      <Grid />
      <View style={s.orbTop} />
      <View style={s.orbTR} />

      {/* App Bar */}

      <View style={s.appBar}>
        <View style={s.appBrand}>
          <View style={s.logoBox}>
            <Image
              style={s.logoamtex}
              source={require('../../assets/images/imagenes/logo1.png')}
            />
            <View style={s.logoShine} />
          </View>
          <Text style={s.appName}>AMTEX</Text>
        </View>
        <View style={s.appUser}>
          <Text style={s.appGreet}>BIENVENIDO</Text>
          <Text style={s.appRole}>Operario</Text>
        </View>
      </View>
      <View style={s.appBarSep} />

      {/* Contenido scrollable */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* ── Título de pantalla ── */}
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>Dosificación MFC</Text>
            <Text style={s.pageSub}>
              Ingrese los valores del proceso para calcular
            </Text>
          </View>

          {/* ── Card de parámetros ── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.cardAccentBar} />
              <Text style={s.cardHeaderText}>PARÁMETROS DE ENTRADA</Text>
            </View>

            <InputField
              label="Volumen a dosificar"
              unit="Litros (Lt)"
              placeholder="Ej: 250"
              value={litrosdosi}
              onChangeText={(v: string) => {
                setLitrosdosi(v);
                setErrors((e) => ({ ...e, litros: '' }));
              }}
              error={errors.litros}
              icon={<IconFlask />}
            />

            <InputField
              label="Kilos en receta MFC"
              unit="Kilogramos (Kg)"
              placeholder="Ej: 100"
              value={kgdmfc}
              onChangeText={(v: string) => {
                setKgmfc(v);
                setErrors((e) => ({ ...e, kilos: '' }));
              }}
              error={errors.kilos}
              icon={<IconWeight />}
            />

            {/* Fórmula hint */}
            <View style={s.formulaHint}>
              <Text style={s.formulaIcon}>∫</Text>
              <Text style={s.formulaText}>
                Fórmula: (Lt × KgMFC × 1.272) ÷ 1000
              </Text>
            </View>
          </View>

          {/* ── Botón Calcular ── */}
          <TouchableOpacity
            onPress={operacion}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={loading}
            activeOpacity={1}>
            <Animated.View
              style={[
                s.cta,
                loading && s.ctaLoading,
                { transform: [{ scale: btnScale }] },
              ]}>
              <View style={s.ctaShine} />
              <Text style={s.ctaText}>
                {loading ? 'Calculando...' : 'CALCULAR'}
              </Text>
              {!loading && (
                <View style={s.ctaArrowWrap}>
                  <IconArrow />
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* ── Resultado ── */}
          <Animated.View
            style={[
              s.resultCard,
              resultado !== null && s.resultCardActive,
              {
                transform: [
                  {
                    scale: resultAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.96, 1],
                    }),
                  },
                ],
                opacity:
                  resultado !== null
                    ? resultAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    : 1,
              },
            ]}>
            <View style={s.resultLeft}>
              <Text style={s.resultLabel}>RESULTADO DEL CÁLCULO</Text>
              <Text
                style={[
                  s.resultValue,
                  resultado !== null && s.resultValueActive,
                ]}>
                {resultado !== null ? resultado.toFixed(2) : '—'}
                <Text style={s.resultUnit}> Lts</Text>
              </Text>
            </View>
            <View
              style={[
                s.resultBadge,
                resultado !== null ? s.resultBadgeDone : s.resultBadgeIdle,
              ]}>
              <Text
                style={[
                  s.resultBadgeText,
                  resultado !== null
                    ? s.resultBadgeTextDone
                    : s.resultBadgeTextIdle,
                ]}>
                {resultado !== null ? 'Calculado ✓' : 'Sin calcular'}
              </Text>
            </View>
          </Animated.View>

          {/* ── Desglose del cálculo (aparece tras calcular) ── */}
          {desglose && (
            <View style={s.desgloseCard}>
              <Text style={s.desgloseTitle}>DESGLOSE DEL CÁLCULO</Text>
              <View style={s.desgloseStep}>
                <View style={s.desgloseNum}>
                  <Text style={s.desgloseNumText}>1</Text>
                </View>
                <Text style={s.desgloseText}>
                  KgMFC ajustado = {desglose.dato2} × 1.272 ={' '}
                  <Text style={s.desgloseVal}>
                    {desglose.kilosmfc.toFixed(4)} Kg
                  </Text>
                </Text>
              </View>
              <View style={s.desgloseStep}>
                <View style={s.desgloseNum}>
                  <Text style={s.desgloseNumText}>2</Text>
                </View>
                <Text style={s.desgloseText}>
                  Resultado = ({desglose.dato1} × {desglose.kilosmfc.toFixed(4)}
                  ) ÷ 1000 ={' '}
                  <Text style={s.desgloseVal}>
                    {desglose.operacionTotal.toFixed(2)} Lts
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  bgBase: { ...StyleSheet.absoluteFill, backgroundColor: C.bg },

  // Grid
  line: { position: 'absolute', backgroundColor: C.grid },
  lineH: { left: 0, right: 0, height: StyleSheet.hairlineWidth },
  lineV: { top: 0, bottom: 0, width: StyleSheet.hairlineWidth },

  // Orbes
  orbTop: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: C.orb,
  },
  orbTR: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(30,136,229,0.05)',
  },

  // App Bar

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21,101,192,0.07)',
    position: 'relative',
    zIndex: 10,
  },
  logoamtex: { width: 36, height: 36, resizeMode: 'contain' },

  appBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  logoShine: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 1,
    backgroundColor: 'rgba(21,101,192,0.2)',
  },

  appName: {
    fontWeight: '800',
    fontSize: 18,
    color: C.textDark,
    letterSpacing: 4,
  },
  appUser: { alignItems: 'flex-end' },
  appGreet: {
    fontSize: 9,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 0.8,
  },
  appRole: { fontSize: 13, fontWeight: '700', color: C.blueDark },
  appBarSep: {
    height: 1,
    backgroundColor: 'rgba(21,101,192,0.06)',
    marginHorizontal: 0,
    zIndex: 10,
  },

  // Scroll
  scroll: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 40 },

  // Context chip

  // Page header
  pageHeader: { marginBottom: 20 },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  pageSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.10)',
    padding: 20,
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardAccentBar: {
    width: 3,
    height: 18,
    backgroundColor: C.blue,
    borderRadius: 2,
  },
  cardHeaderText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.labelColor,
    letterSpacing: 1,
  },

  // Field
  fieldWrap: { marginBottom: 14 },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.labelColor,
    letterSpacing: 0.7,
  },
  unitChip: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  unitText: { fontSize: 9, fontWeight: '500', color: C.textHint },
  fieldBox: {
    height: 52,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    overflow: 'hidden',
  },
  fieldBoxActive: {
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fieldAccent: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: C.blue,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  fieldIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: C.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldIconActive: { backgroundColor: 'rgba(21,101,192,0.12)' },
  fieldInput: {
    flex: 1,
    fontSize: 13,
    color: C.textDark,
    paddingVertical: 0,
  },
  errorText: { fontSize: 11, color: C.danger, marginTop: 4, marginLeft: 2 },

  // Formula hint
  formulaHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(21,101,192,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.10)',
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
  },
  formulaIcon: { fontSize: 14, color: C.blue },
  formulaText: {
    fontSize: 10,
    color: C.blue,
    fontWeight: '500',
    fontStyle: 'italic',
    flex: 1,
  },

  // CTA
  cta: {
    height: 54,
    borderRadius: 16,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  ctaLoading: { opacity: 0.75 },
  ctaShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 1.5,
  },
  ctaArrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Result card
  resultCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(21,101,192,0.08)',
    padding: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 14,
  },
  resultCardActive: {
    borderColor: 'rgba(21,101,192,0.25)',
    shadowColor: C.blue,
    shadowOpacity: 0.1,
  },
  resultLeft: {},
  resultLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.labelColor,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 30,
    fontWeight: '800',
    color: C.textHint,
    letterSpacing: -0.5,
  },
  resultValueActive: { color: C.blue },
  resultUnit: { fontSize: 14, fontWeight: '600', color: C.textMuted },
  resultBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  resultBadgeIdle: { backgroundColor: C.bg },
  resultBadgeDone: { backgroundColor: C.blueXlight },
  resultBadgeText: { fontSize: 10, fontWeight: '600' },
  resultBadgeTextIdle: { color: C.textMuted },
  resultBadgeTextDone: { color: C.blue },

  // Desglose
  desgloseCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.08)',
    padding: 16,
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  desgloseTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: C.textHint,
    letterSpacing: 1,
    marginBottom: 10,
  },
  desgloseStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  desgloseNum: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: C.blueXlight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  desgloseNumText: { fontSize: 9, fontWeight: '700', color: C.blue },
  desgloseText: { fontSize: 11, color: C.textMuted, flex: 1, lineHeight: 18 },
  desgloseVal: { fontWeight: '700', color: C.textDark, fontStyle: 'italic' },
});
