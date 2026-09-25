import {
    AmtexButton,
    AmtexColors,
    AmtexHeader,
    AmtexInput,
    GridBackground,
} from '@/components/ui';
import { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
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

type CgtProps = {
  route?: {
    params?: {
      nombre?: string;
    };
  };
};

export default function Cgt({ route }: CgtProps) {
  const nombre = route?.params?.nombre ?? 'Operario';
  const [litros, setLitros] = useState('');
  const [kilos, setKilos] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);
  const [desglose, setDesglose] = useState<DesgloseData | null>(null);
  const [errors, setErrors] = useState<CgtErrors>({});
  const [loading, setLoading] = useState(false);

  const calculate = () => {
    const nextErrors: CgtErrors = {};
    const volumen = Number.parseFloat(litros);
    const receta = Number.parseFloat(kilos);

    if (!Number.isFinite(volumen) || volumen <= 0) nextErrors.litros = 'Ingrese un número válido mayor a 0';
    if (!Number.isFinite(receta) || receta <= 0) nextErrors.kilos = 'Ingrese un número válido mayor a 0';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const kilosMfc = receta * 1.272;
      const total = (volumen * kilosMfc) / 1000;
      setResultado(total);
      setDesglose({ dato1: volumen, dato2: receta, kilosmfc: kilosMfc, operacionTotal: total });
      setLoading(false);
      Keyboard.dismiss();
    }, 600);
  };

  return (
    <GridBackground>
      <StatusBar barStyle="dark-content" backgroundColor={AmtexColors.bg} />
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AmtexHeader name={nombre} />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeader}>
            <Text style={styles.title}>Dosificación MFC</Text>
            <Text style={styles.subtitle}>Ingrese los valores del proceso para calcular</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>PARÁMETROS DE ENTRADA</Text>
            <AmtexInput
              label="VOLUMEN A DOSIFICAR (LITROS)"
              placeholder="Ej: 250"
              value={litros}
              onChangeText={value => {
                setLitros(value);
                setErrors(current => ({ ...current, litros: undefined }));
              }}
              error={errors.litros}
            />
            <AmtexInput
              label="KILOS EN RECETA MFC"
              placeholder="Ej: 100"
              value={kilos}
              onChangeText={value => {
                setKilos(value);
                setErrors(current => ({ ...current, kilos: undefined }));
              }}
              error={errors.kilos}
            />
            <View style={styles.formula}>
              <Text style={styles.formulaText}>Fórmula: (Lt × KgMFC × 1.272) ÷ 1000</Text>
            </View>
          </View>

          <AmtexButton label={loading ? 'CALCULANDO...' : 'CALCULAR'} onPress={calculate} disabled={loading} />

          <View style={[styles.resultCard, resultado !== null && styles.resultActive]}>
            <View>
              <Text style={styles.resultLabel}>RESULTADO DEL CÁLCULO</Text>
              <Text style={[styles.resultValue, resultado !== null && styles.resultValueActive]}>
                {resultado !== null ? resultado.toFixed(2) : '—'}
                <Text style={styles.unit}> Lts</Text>
              </Text>
            </View>
            <Text style={styles.badge}>{resultado !== null ? 'Calculado' : 'Sin calcular'}</Text>
          </View>

          {desglose ? (
            <View style={styles.breakdown}>
              <Text style={styles.breakdownTitle}>DESGLOSE DEL CÁLCULO</Text>
              <Text style={styles.breakdownText}>
                KgMFC ajustado = {desglose.dato2} × 1.272 = {desglose.kilosmfc.toFixed(4)} Kg
              </Text>
              <Text style={styles.breakdownText}>
                Resultado = ({desglose.dato1} × {desglose.kilosmfc.toFixed(4)}) ÷ 1000 = {desglose.operacionTotal.toFixed(2)} Lts
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </GridBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 110 },
  pageHeader: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: AmtexColors.textDark, marginBottom: 4 },
  subtitle: { fontSize: 12, color: AmtexColors.textMuted },
  card: {
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.10)',
    padding: 20,
    marginBottom: 14,
    shadowColor: AmtexColors.blue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  cardTitle: { fontSize: 10, fontWeight: '700', color: AmtexColors.textMuted, letterSpacing: 1, marginBottom: 16 },
  formula: { backgroundColor: 'rgba(21,101,192,0.04)', borderWidth: 1, borderColor: 'rgba(21,101,192,0.10)', borderRadius: 12, padding: 10 },
  formulaText: { fontSize: 10, color: AmtexColors.blue, fontStyle: 'italic' },
  resultCard: { backgroundColor: AmtexColors.white, borderRadius: 20, borderWidth: 1, borderColor: AmtexColors.border, padding: 18, marginTop: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: AmtexColors.blue, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 4 },
  resultActive: { borderColor: 'rgba(21,101,192,0.25)' },
  resultLabel: { fontSize: 10, fontWeight: '700', color: AmtexColors.textMuted, letterSpacing: 0.8, marginBottom: 4 },
  resultValue: { fontSize: 30, fontWeight: '800', color: AmtexColors.textHint },
  resultValueActive: { color: AmtexColors.blue },
  unit: { fontSize: 14, fontWeight: '600', color: AmtexColors.textMuted },
  badge: { backgroundColor: AmtexColors.blueXlight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, color: AmtexColors.blue, fontSize: 10, fontWeight: '600' },
  breakdown: { backgroundColor: AmtexColors.white, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(21,101,192,0.08)', padding: 16, gap: 8 },
  breakdownTitle: { fontSize: 9, fontWeight: '700', color: AmtexColors.textHint, letterSpacing: 1, marginBottom: 4 },
  breakdownText: { fontSize: 11, color: AmtexColors.textMuted, lineHeight: 18 },
});


