import { AmtexLogo, GridBackground } from '@/components/ui';
import { firebaseErrorMessage, loginOperator } from '@/lib/firebase';
import { router } from 'expo-router';
import { useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
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

type FormErrors = {
  usuario?: string;
  password?: string;
};

type LoginScreenProps = {
  navigation?: {
    replace: (screen: string, params?: { usuario: string; nombre: string }) => void;
  };
  onRegister?: () => void;
};

type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureEntry?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  error?: string;
  icon: ReactNode;
};

type IconEyeProps = {
  visible: boolean;
};

const { width, height } = Dimensions.get('window');

// ─── DESIGN TOKENS AMTEX ─────────────────────────────────────
const C = {
  bg:          '#f0f2f5',
  white:       '#ffffff',
  blue:        '#1565c0',
  blueDark:    '#0d47a1',
  blueLight:   '#1e88e5',
  textDark:    '#0d1825',
  textMuted:   '#8a96a8',
  textHint:    '#b0b8c4',
  border:      '#e2e6ed',
  inputBg:     '#f7f8fa',
  labelColor:  '#5a6478',
  grid:        'rgba(21,101,192,0.045)',
  orb:         'rgba(21,101,192,0.08)',
  sheetLine:   'rgba(21,101,192,1)',
  activeInput: 'rgba(21,101,192,0.025)',
  activeBorder:'#1565c0',
  activeShadow:'rgba(21,101,192,0.12)',
  iconBg:      'rgba(21,101,192,0.08)',
  danger:      '#ef5350',
};

// ─── GRID TÉCNICA ─────────────────────────────────────────────
const GRID = 28;
const COLS = Math.ceil(width  / GRID) + 1;
const ROWS = Math.ceil(height / GRID) + 1;

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

// ─── ÍCONO SVG USUARIO ────────────────────────────────────────
function IconUser() {
  return (
    <View style={{ width: 14, height: 14, alignItems: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: C.blue }} />
      <View style={{ width: 12, height: 5, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderWidth: 1.5, borderColor: C.blue, borderBottomWidth: 0, marginTop: 1 }} />
    </View>
  );
}

function IconLock() {
  return (
    <View style={{ width: 14, height: 14, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ width: 10, height: 7, borderRadius: 2, borderWidth: 1.5, borderColor: C.blue }} />
      <View style={{ position: 'absolute', top: 0, width: 6, height: 5, borderTopLeftRadius: 3, borderTopRightRadius: 3, borderWidth: 1.5, borderColor: C.blue, borderBottomWidth: 0 }} />
    </View>
  );
}

function IconEye({ visible }: IconEyeProps) {
  return (
    <View style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 14, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: C.textHint }} />
      <View style={{ position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: C.textHint }} />
      {!visible && (
        <View style={{ position: 'absolute', width: 18, height: 1.5, backgroundColor: C.textHint, transform: [{ rotate: '-45deg' }] }} />
      )}
    </View>
  );
}

function IconArrow() {
  return (
    <View style={{ width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 8, height: 1.5, backgroundColor: C.white }} />
      <View style={{ position: 'absolute', right: 2, width: 5, height: 5, borderTopWidth: 1.5, borderRightWidth: 1.5, borderColor: C.white, transform: [{ rotate: '45deg' }] }} />
    </View>
  );
}

// ─── CAMPO DE ENTRADA ─────────────────────────────────────────
function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureEntry = false,
  showToggle = false,
  onToggle,
  error,
  icon,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    if (!error) {
      Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    }
  };

  const borderColor = borderAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [error ? C.danger : C.border, error ? C.danger : C.activeBorder],
  });

  const bgColor = borderAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [C.inputBg, error ? 'rgba(239,83,80,0.03)' : C.activeInput],
  });

  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Animated.View style={[
        s.fieldBox,
        { borderColor, backgroundColor: bgColor },
        (focused || error) && s.fieldBoxActive,
      ]}>
        {focused && !error && (
          <View style={s.fieldAccent} />
        )}
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
          secureTextEntry={secureEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} style={s.eyeBtn}>
            <IconEye visible={!secureEntry} />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Text style={s.errorText}>⚠ {error}</Text>
      )}
    </View>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────
export default function LoginScreen({ navigation, onRegister }: LoginScreenProps) {

  const [usuario,   setUsuario]   = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [errors,    setErrors]    = useState<FormErrors>({});
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState('');

  const btnScale = useRef(new Animated.Value(1)).current;

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!usuario.trim())         e.usuario  = 'El número de usuario es requerido';
    else if (usuario.length < 3) e.usuario  = 'Mínimo 3 caracteres';
    if (!password.trim())        e.password = 'La contraseña es requerida';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    return e;
  };

  const onPressIn = () => {
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  };
  const onPressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  const handleLogin = async () => {
    setApiError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      Alert.alert('Datos incompletos', Object.values(e)[0]);
      return;
    }

    setLoading(true);
    try {
      const encontrado = await loginOperator(usuario, password);

      if (navigation && typeof navigation.replace === 'function') {
        navigation.replace('Home', {
          usuario: usuario.trim(),
          nombre: encontrado.nombre,
        });
      } else {
        router.replace({
          pathname: '/home',
          params: {
            usuario: usuario.trim(),
            nombre: encontrado.nombre,
          },
        });
      }
    } catch (err: unknown) {
      const message = firebaseErrorMessage(err, 'Error al iniciar sesión');
      setApiError(message);
      Alert.alert('No se pudo iniciar sesión', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GridBackground>
      <KeyboardAvoidingView
        style={s.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Header: logo real + wordmark ── */}
      <View style={s.header}>
        <AmtexLogo size={72} />
        <View style={s.wordmark}>
          <Text style={s.brandName}>AMTEX</Text>
          <Text style={s.brandSub}>OPERACIONES DE PRODUCCIÓN</Text>
        </View>
      </View>

      {/* ── Sheet inferior ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.sheetWrap}
      >
        <ScrollView
          contentContainerStyle={s.sheetScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.sheet}>
            <View style={s.sheetLine} />
            <View style={s.handle} />

            <Text style={s.sheetTitle}>Iniciar Sesión</Text>
            <Text style={s.sheetSub}>Ingresa tus credenciales para continuar</Text>

            {apiError ? (
              <View style={s.apiError}>
                <Text style={s.apiErrorText}>🔒 {apiError}</Text>
              </View>
            ) : null}

            <InputField
              label="NÚMERO DE USUARIO"
              placeholder="Ej: 00123"
              value={usuario}
              onChangeText={v => { setUsuario(v); setErrors(e => ({ ...e, usuario: '' })); }}
              error={errors.usuario}
              icon={<IconUser />}
            />

            <InputField
              label="CONTRASEÑA"
              placeholder="••••••••"
              value={password}
              onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
              secureEntry={!showPass}
              showToggle
              onToggle={() => setShowPass(v => !v)}
              error={errors.password}
              icon={<IconLock />}
            />

            <TouchableOpacity
              onPress={handleLogin}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              disabled={loading}
              activeOpacity={1}
            >
              <Animated.View style={[s.cta, loading && s.ctaLoading, { transform: [{ scale: btnScale }] }]}>
                <View style={s.ctaShine} />
                <Text style={s.ctaText}>
                  {loading ? 'Verificando...' : 'INGRESAR'}
                </Text>
                {!loading && (
                  <View style={s.ctaIconWrap}>
                    <IconArrow />
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>

            <View style={s.footer}>
              <View style={s.footerLine} />
              <View style={s.footerMid}>
                <Text style={s.footerText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={onRegister ?? (() => router.push('/register'))}>
                  <Text style={s.footerLink}>Crear cuenta →</Text>
                </TouchableOpacity>
              </View>
              <View style={s.footerLine} />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      </KeyboardAvoidingView>
    </GridBackground>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  bgBase: {
    ...StyleSheet.absoluteFill,
    backgroundColor: C.bg,
  },

  // Grid
  line:  { position: 'absolute', backgroundColor: C.grid },
  lineH: { left: 0, right: 0, height: StyleSheet.hairlineWidth },
  lineV: { top: 0, bottom: 0, width: StyleSheet.hairlineWidth },

  // Orbes
  orbTop: {
    position: 'absolute', top: -80, alignSelf: 'center',
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: C.orb,
  },
  accentTR: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(30,136,229,0.05)',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 24,
    gap: 12,
  },

  // Caja del ícono
  iconBox: {
    width: 72, height: 72,
    borderRadius: 22,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',   // ← importante para que el jpg respete el borderRadius
  },
  iconShine: {
    position: 'absolute',
    top: 0, left: 8, right: 8, height: 1,
    backgroundColor: 'rgba(21,101,192,0.2)',
    borderRadius: 1,
  },

  // ─── LOGO ────────────────────────────────────────────────────
  logoImg: {
    width: 54,
    height: 54,
  },

  // Wordmark
  wordmark: { alignItems: 'center', gap: 4 },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: 8,
  },
  brandSub: {
    fontSize: 8,
    fontWeight: '500',
    color: C.textMuted,
    letterSpacing: 2,
  },

  // Sheet
  sheetWrap: { flex: 1 },
  sheetScroll: { flexGrow: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 28,
    paddingBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetLine: {
    position: 'absolute',
    top: 0, left: 60, right: 60,
    height: 2,
    backgroundColor: C.blue,
    borderRadius: 2,
    opacity: 0.7,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 22,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 12,
    color: C.textMuted,
    marginBottom: 24,
  },

  // Error API
  apiError: {
    backgroundColor: 'rgba(239,83,80,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(239,83,80,0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  apiErrorText: { fontSize: 12, color: C.danger },

  // Campos
  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.labelColor,
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  fieldBox: {
    height: 52,
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 11,
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
    left: 0, top: 8, bottom: 8,
    width: 3,
    backgroundColor: C.blue,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  fieldIconWrap: {
    width: 30, height: 30,
    borderRadius: 9,
    backgroundColor: C.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldIconActive: {
    backgroundColor: 'rgba(21,101,192,0.12)',
  },
  fieldInput: {
    flex: 1,
    fontSize: 13,
    color: C.textDark,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  errorText: {
    fontSize: 11,
    color: C.danger,
    marginTop: 4,
    marginLeft: 2,
  },

  // Botón CTA
  cta: {
    height: 54,
    borderRadius: 16,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 22,
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  ctaLoading: { opacity: 0.75 },
  ctaShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
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
  ctaIconWrap: {
    width: 28, height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
    gap: 6,
  },
  footerLine: { flex: 1, height: 1, backgroundColor: C.border },
  footerMid: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  footerText: { fontSize: 12, color: C.textMuted },
  footerLink: { fontSize: 12, color: C.blue, fontWeight: '700' },
});