import { Platform } from 'react-native';

export const AmtexColors = {
  bg: '#f0f2f5',
  white: '#ffffff',
  blue: '#1565c0',
  blueDark: '#0d47a1',
  blueLight: '#1e88e5',
  blueXlight: '#e8f0fe',
  textDark: '#0d1825',
  textMuted: '#8a96a8',
  textHint: '#b0b8c4',
  border: '#e2e6ed',
  inputBg: '#f7f8fa',
  grid: 'rgba(21,101,192,0.045)',
  orb: 'rgba(21,101,192,0.08)',
  danger: '#ef5350',
  success: '#2e7d32',
} as const;

export const AmtexSpacing = {
  screen: 22,
  field: 13,
  card: 20,
  radius: 15,
} as const;

export const GridSize = 28;
export const GridDimensions = {
  width: 320,
  height: 320,
};

export const bottomInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
