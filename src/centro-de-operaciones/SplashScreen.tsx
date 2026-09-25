import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type SplashScreenProps = {
  onFinish?: () => void;
};

// ─── LOGO OFICIAL AMTEX ──────────────────────────────────────
const LOGO = require('../../assets/images/imagenes/logo1.png');
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
  grid:       'rgba(21,101,192,0.045)',
  orb:        'rgba(21,101,192,0.08)',
};

// ─── GRID TÉCNICA (misma del login) ──────────────────────────
const GRID  = 28;
const COLS  = Math.ceil(width  / GRID) + 1;
const ROWS  = Math.ceil(height / GRID) + 1;

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

// ─── TRIÁNGULO AMTEX ─────────────────────────────────────────
function Triangle({ size = 48 }) {
  const h      = Math.round(size * 0.9);
  const inSize = Math.round(size * 0.56);
  const inH    = Math.round(inSize * 0.9);
  const dSize  = Math.round(size * 0.22);
  const dH     = Math.round(dSize * 0.9);

  return (
    <View style={{ width: size, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Exterior azul */}
      <View style={{
        position: 'absolute',
        width: 0, height: 0,
        borderLeftWidth:   size / 2,
        borderRightWidth:  size / 2,
        borderBottomWidth: h,
        borderLeftColor:   'transparent',
        borderRightColor:  'transparent',
        borderBottomColor: C.blue,
      }} />
      {/* Interior blanco */}
      <View style={{
        position: 'absolute',
        top: h - inH - 2,
        width: 0, height: 0,
        borderLeftWidth:   inSize / 2,
        borderRightWidth:  inSize / 2,
        borderBottomWidth: inH,
        borderLeftColor:   'transparent',
        borderRightColor:  'transparent',
        borderBottomColor: C.white,
      }} />
      {/* Punto central */}
      <View style={{
        position: 'absolute',
        top: h - dH - 4,
        width: 0, height: 0,
        borderLeftWidth:   dSize / 2,
        borderRightWidth:  dSize / 2,
        borderBottomWidth: dH,
        borderLeftColor:   'transparent',
        borderRightColor:  'transparent',
        borderBottomColor: 'rgba(21,101,192,0.45)',
      }} />
    </View>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────
// Props:
//   onFinish: () => void  — llamado cuando termina, para navegar al Login
//
// Uso en App.js:
//   <SplashScreen onFinish={() => setScreen('Login')} />
// ─────────────────────────────────────────────────────────────
export default function SplashScreen({ onFinish }: SplashScreenProps) {

  // Animaciones de entrada
  const iconOpacity  = useRef(new Animated.Value(0)).current;
  const iconScale    = useRef(new Animated.Value(0.72)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textY        = useRef(new Animated.Value(10)).current;
  const sepOpacity   = useRef(new Animated.Value(0)).current;
  const loadOpacity  = useRef(new Animated.Value(0)).current;

  // Pulso del anillo alrededor del ícono
  const pulseScale   = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.8)).current;

  // Progreso (no usa native driver — anima width/left)
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Texto "Cargando..."
  const [phase, setPhase] = useState(0);
  const frames = ['Cargando', 'Cargando.', 'Cargando..', 'Cargando...'];

  useEffect(() => {

    // ── 1. Entrada escalonada ──
    Animated.sequence([
      Animated.delay(250),
      Animated.parallel([
        Animated.timing(iconOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(iconScale,   { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      ]),
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(sepOpacity,  { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.timing(loadOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // ── 2. Pulso del anillo ──
    const doPulse = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale,   { toValue: 1.1,  duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseScale,   { toValue: 1,    duration: 1200, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, { toValue: 0.12, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.75, duration: 1200, useNativeDriver: true }),
        ]),
      ]).start(({ finished }) => { if (finished) doPulse(); });
    };
    setTimeout(doPulse, 1200);

    // ── 3. Barra de progreso en loop ──
    const doProgress = () => {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: false,
      }).start(({ finished }) => { if (finished) doProgress(); });
    };
    setTimeout(doProgress, 1400);

    // ── 4. Puntos animados ──
    const dotTimer = setInterval(() => {
      setPhase(p => (p + 1) % 4);
    }, 450);

    // ── 5. Navegar al Login ──
    const navTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3500);

    return () => {
      clearInterval(dotTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const barLeft = progressAnim.interpolate({
    inputRange:  [0, 0.4, 0.85, 1],
    outputRange: ['-40%', '10%', '90%', '110%'],
  });

  const barWidth = progressAnim.interpolate({
    inputRange:  [0, 0.25, 0.65, 1],
    outputRange: ['0%', '40%', '40%', '10%'],
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Fondo gris azulado */}
      <View style={s.bgBase} />

      {/* Grid técnica */}
      <Grid />

      {/* Orbes de luz */}
      <View style={s.orbTop} />
      <View style={s.orbBottom} />
      <View style={s.accentTR} />
      <View style={s.accentBL} />

      {/* ── Contenido central ── */}
      <View style={s.center}>

        {/* Anillo de pulso */}
        <Animated.View style={[s.pulseRing, {
          transform:  [{ scale: pulseScale }],
          opacity:    pulseOpacity,
        }]} />

        {/* Caja del ícono */}
        <Animated.View style={[s.iconBox, {
          opacity:   iconOpacity,
          transform: [{ scale: iconScale }],
        }]}>
          <View style={s.iconShine} />
          <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
        </Animated.View>

        {/* Wordmark */}
        <Animated.View style={[s.wordmark, {
          opacity:   textOpacity,
          transform: [{ translateY: textY }],
        }]}>
          <Text style={s.brandName}>AMTEX</Text>
          <Text style={s.brandSub}>OPERACIONES DE PRODUCCIÓN</Text>
        </Animated.View>

        {/* Separador azul de marca */}
        <Animated.View style={[s.separator, { opacity: sepOpacity }]} />

      </View>

      {/* ── Área de carga ── */}
      <Animated.View style={[s.loadArea, { opacity: loadOpacity }]}>
        <View style={s.track}>
          <Animated.View style={[s.bar, { left: barLeft, width: barWidth }]} />
        </View>
        <Text style={s.loadText}>{frames[phase]}</Text>
      </Animated.View>

      {/* Versión */}
      <Animated.Text style={[s.version, { opacity: loadOpacity }]}>
        v1.0.0
      </Animated.Text>

    </View>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgBase: {
    ...StyleSheet.absoluteFill,
    backgroundColor: C.bg,
  },

  // Grid
  line:  { position: 'absolute', backgroundColor: C.grid },
  lineH: { left: 0, right: 0, height: StyleSheet.hairlineWidth },
  lineV: { top: 0, bottom: 0,  width:  StyleSheet.hairlineWidth },

  // Orbes
  orbTop: {
    position: 'absolute', top: -100, alignSelf: 'center',
    width: 340, height: 340, borderRadius: 170,
    backgroundColor: C.orb,
  },
  orbBottom: {
    position: 'absolute', bottom: -100, alignSelf: 'center',
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(21,101,192,0.05)',
  },
  accentTR: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(30,136,229,0.05)',
  },
  accentBL: {
    position: 'absolute', bottom: -40, left: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(30,136,229,0.04)',
  },

  // Centro
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pulso
  pulseRing: {
    position: 'absolute',
    width: 108, height: 108,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(21,101,192,0.2)',
    backgroundColor: 'transparent',
  },

  // Caja ícono
  iconBox: {
    width: 88, height: 88,
    borderRadius: 26,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(21,101,192,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  iconShine: {
    position: 'absolute',
    top: 0, left: 10, right: 10, height: 1,
    backgroundColor: 'rgba(21,101,192,0.22)',
    borderRadius: 1,
  },
  logoImg: {
    width:  52,
    height: 52,
  },

  // Wordmark
  wordmark: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 5,
  },
  brandName: {
    fontSize: 30,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: 10,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '500',
    color: C.textMuted,
    letterSpacing: 2.5,
  },

  // Separador
  separator: {
    width: 48, height: 2,
    borderRadius: 2,
    backgroundColor: C.blue,
    opacity: 0.6,
  },

  // Carga
  loadArea: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    gap: 12,
  },
  track: {
    width: 140, height: 3,
    backgroundColor: 'rgba(21,101,192,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: C.blueLight,
    borderRadius: 2,
  },
  loadText: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
    letterSpacing: 1.5,
    minWidth: 100,
    textAlign: 'center',
  },

  // Versión
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(138,150,168,0.5)',
    letterSpacing: 1,
  },
});
