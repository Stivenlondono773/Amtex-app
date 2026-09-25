import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DvtsProps = {
  navigation?: NavigationProp<ParamListBase>;
  route?: {
    params?: {
      nombre?: string;
      usuario?: string;
    };
  };
};

const LOGO = require('../../assets/images/imagenes/logo1.png');
const { width, height } = Dimensions.get('window');

const C = {
  bg: '#f0f2f5',
  white: '#ffffff',
  blue: '#1565c0',
  blueDark: '#0d47a1',
  blueLight: '#1e88e5',
  textDark: '#0d1825',
  textMuted: '#8a96a8',
  border: '#e2e6ed',
  grid: 'rgba(21,101,192,0.045)',
  orb: 'rgba(21,101,192,0.08)',
  success: '#2e7d32',
  softBlue: '#eaf3ff',
  shadow: 'rgba(21,101,192,0.12)',
};

const GRID = 28;
const COLS = Math.ceil(width / GRID) + 1;
const ROWS = Math.ceil(height / GRID) + 1;

function Grid() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: ROWS }).map((_, i) => (
        <View key={`h-${i}`} style={[styles.line, styles.lineH, { top: i * GRID }]} />
      ))}
      {Array.from({ length: COLS }).map((_, i) => (
        <View key={`v-${i}`} style={[styles.line, styles.lineV, { left: i * GRID }]} />
      ))}
    </View>
  );
}

export default function Dvts({ navigation, route }: DvtsProps) {
  const nombre = route?.params?.nombre ?? 'Operario';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={styles.bgBase} />
      <Grid />
      <View style={styles.orbTop} />
      <View style={styles.accentTR} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <View style={styles.logoBox}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.brandName}>AMTEX</Text>
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerLabel}>BIENVENIDO</Text>
            <Text style={styles.headerTitle}>{nombre}</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelLabel}>SISTEMA ACTIVO</Text>
              <Text style={styles.panelTitle}>Reactor y tanques</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>ONLINE</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Volumen</Text>
              <Text style={styles.metricValue}>86.4%</Text>
              <Text style={styles.metricHint}>capacidad</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Presión</Text>
              <Text style={styles.metricValue}>2.1 bar</Text>
              <Text style={styles.metricHint}>estable</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Estado de operación</Text>
            <Text style={styles.infoText}>
              El sistema se encuentra en operación normal, con balance de carga e integración
              estable entre líneas de proceso.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation?.navigate('Home')}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryText}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation?.navigate('Cgt')}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryText}>CGT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  bgBase: {
    ...StyleSheet.absoluteFill,
    backgroundColor: C.bg,
  },
  line: {
    position: 'absolute',
    backgroundColor: C.grid,
  },
  lineH: {
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  lineV: {
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
  },
  orbTop: {
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: C.orb,
  },
  accentTR: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(30,136,229,0.05)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingBottom: 18,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 26,
    height: 26,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: 4,
  },
  headerTextWrap: {
    alignItems: 'flex-end',
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: C.blueDark,
    letterSpacing: 1,
  },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.10)',
    padding: 20,
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  panelLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 1.8,
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textDark,
    marginTop: 4,
  },
  statusPill: {
    backgroundColor: 'rgba(46,125,50,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.success,
    letterSpacing: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: C.softBlue,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.08)',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: C.blueDark,
    marginTop: 8,
  },
  metricHint: {
    marginTop: 4,
    fontSize: 11,
    color: C.textMuted,
  },
  infoCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.08)',
    padding: 18,
    marginBottom: 18,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.textDark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: C.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#edf3fb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.08)',
  },
  secondaryText: {
    color: C.blueDark,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: C.blue,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
