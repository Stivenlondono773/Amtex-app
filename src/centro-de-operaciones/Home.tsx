import { AmtexHeader, GridBackground } from '@/components/ui';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeRoute = {
  params?: {
    nombre?: string;
    usuario?: string;
  };
};

type HomeNavigation = {
  navigate: (screen: string) => void;
};

type HomeProps = {
  navigation?: HomeNavigation;
  route?: HomeRoute;
};

// ─── LOGO OFICIAL AMTEX ──────────────────────────────────────
const { width, height } = Dimensions.get('window');

// ─── DESIGN TOKENS AMTEX ─────────────────────────────────────
const C = {
  bg:         '#f0f2f5',
  white:      '#ffffff',
  blue:       '#1565c0',
  blueDark:   '#0d47a1',
  blueLight:  '#1e88e5',
  textDark:   '#0d1825',
  textMuted:  '#8a96a8',
  border:     '#e2e6ed',
  grid:       'rgba(21,101,192,0.045)',
  orb:        'rgba(21,101,192,0.08)',
};

// ─── GRID TÉCNICA — misma del Login y Splash ─────────────────
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

// ─── HOME SCREEN ─────────────────────────────────────────────
export default function Home({ navigation, route }: HomeProps) {

  // Datos del usuario que viene del Login
  // Cuando conectes Firebase estos vendrán de cred.user
  const nombre  = route?.params?.nombre  ?? 'Operario';
  const usuario = route?.params?.usuario ?? '';
  return (
    <GridBackground>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Fondo gris azulado — idéntico al Login y Splash */}
      <SafeAreaView style={s.safeArea}>

        {/* ── App Bar: logo AMTEX + nombre operario ── */}
        <AmtexHeader name={nombre} />

        {/* ── Contenido ── */}
        <View style={s.content}>

          {/* Bienvenida */}
          <View style={s.welcome}>
            <Text style={s.welcomeTitle}>Operaciones</Text>
            <Text style={s.welcomeSub}>Selecciona el módulo a ejecutar</Text>
            <View style={s.brandSep} />
          </View>

          {/* Label de sección */}
          <Text style={s.sectionLabel}>MÓDULOS DISPONIBLES</Text>

          {/* ── Tarjeta DVTS ──────────────────────────────── */}
          <TouchableOpacity
            style={s.moduleCard}
            onPress={() => navigation?.navigate('Dvts')}
            activeOpacity={0.85}
          >
            <View style={[s.cardAccent, { backgroundColor: C.blueLight }]} />
            <View style={[s.moduleIcon, { backgroundColor: 'rgba(30,136,229,0.07)', borderColor: 'rgba(30,136,229,0.14)' }]}>
              <Text style={s.moduleEmoji}>⚗️</Text>
            </View>
            <View style={s.moduleInfo}>
              <Text style={s.moduleTitle}>DVTS</Text>
              <Text style={s.moduleDesc}>
                Dosificación y volumen{'\n'}de tanques de producción
              </Text>
            </View>
            <View style={s.moduleArrow}>
              <View style={s.arrowShine} />
              <Text style={s.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          {/* ── Tarjeta CGT ───────────────────────────────── */}
          <TouchableOpacity
            style={s.moduleCard}
            onPress={() => navigation?.navigate('Cgt')}
            activeOpacity={0.85}
          >
            <View style={[s.cardAccent, { backgroundColor: C.blue }]} />
            <View style={[s.moduleIcon, { backgroundColor: 'rgba(21,101,192,0.07)', borderColor: 'rgba(21,101,192,0.14)' }]}>
              <Text style={s.moduleEmoji}>🧪</Text>
            </View>
            <View style={s.moduleInfo}>
              <Text style={s.moduleTitle}>CGT</Text>
              <Text style={s.moduleDesc}>
                Control y gestión de{'\n'}temperaturas de proceso
              </Text>
            </View>
            <View style={s.moduleArrow}>
              <View style={s.arrowShine} />
              <Text style={s.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </GridBackground>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────
const s = StyleSheet.create({

  // Raíz y fondo
  root:   { flex: 1, backgroundColor: C.bg },
  bgBase: { ...StyleSheet.absoluteFill, backgroundColor: C.bg },

  // Grid técnica
  line:  { position: 'absolute', backgroundColor: C.grid },
  lineH: { left: 0, right: 0, height: StyleSheet.hairlineWidth },
  lineV: { top: 0, bottom: 0, width: StyleSheet.hairlineWidth },

  // Orbes
  orbTop: {
    position: 'absolute', top: -80, alignSelf: 'center',
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: C.orb,
  },
  accentTR: {
    position: 'absolute', top: -50, right: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(30,136,229,0.05)',
  },

  safeArea: { flex: 1 },

  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21,101,192,0.07)',
  },
  appLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appLogoBox: {
    width: 36, height: 36,
    borderRadius: 11,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  appLogoShine: {
    position: 'absolute',
    top: 0, left: 4, right: 4, height: 1,
    backgroundColor: 'rgba(21,101,192,0.18)',
    borderRadius: 1,
  },
  appLogoImg: {
    width: 24,
    height: 24,
  },
  appLogoText: {
    fontSize: 17,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: 5,
  },
  appUser: {
    alignItems: 'flex-end',
    gap: 2,
  },
  appUserLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: C.textMuted,
    letterSpacing: 1.5,
  },
  appUserName: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textDark,
  },

  // Contenido
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 20,
  },

  // Bienvenida
  welcome:      { gap: 4 },
  welcomeTitle: { fontSize: 23, fontWeight: '800', color: C.textDark, letterSpacing: -0.3 },
  welcomeSub:   { fontSize: 12, color: C.textMuted },
  brandSep: {
    width: 40, height: 2,
    borderRadius: 2,
    backgroundColor: C.blue,
    opacity: 0.6,
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 2,
  },

  // Tarjeta de módulo
  moduleCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },

  // Acento lateral — mismo patrón que inputs del Login
  cardAccent: {
    position: 'absolute',
    left: 0, top: 14, bottom: 14,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },

  // Ícono del módulo
  moduleIcon: {
    width: 54, height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moduleEmoji: { fontSize: 24 },

  // Info del módulo
  moduleInfo: { flex: 1 },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  moduleDesc: {
    fontSize: 11,
    color: C.textMuted,
    lineHeight: 16,
  },

  // Flecha — mismo gradiente que botón CTA del Login
  moduleArrow: {
    width: 34, height: 34,
    borderRadius: 11,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    flexShrink: 0,
  },
  arrowShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },
  arrowText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
  },
});