import { type PropsWithChildren } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { AmtexColors, GridSize } from './amtex-theme';

const { width, height } = Dimensions.get('window');
const columns = Math.ceil(width / GridSize) + 1;
const rows = Math.ceil(height / GridSize) + 1;

export function GridBackground({ children }: PropsWithChildren) {
  return (
    <View style={styles.root}>
      <View style={styles.base} />
      <View style={styles.grid} pointerEvents="none">
        {Array.from({ length: rows }).map((_, index) => (
          <View key={`h-${index}`} style={[styles.line, styles.horizontal, { top: index * GridSize }]} />
        ))}
        {Array.from({ length: columns }).map((_, index) => (
          <View key={`v-${index}`} style={[styles.line, styles.vertical, { left: index * GridSize }]} />
        ))}
      </View>
      <View style={styles.orbTop} />
      <View style={styles.accentTopRight} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AmtexColors.bg },
  base: { ...StyleSheet.absoluteFill, backgroundColor: AmtexColors.bg },
  grid: { ...StyleSheet.absoluteFill },
  line: { position: 'absolute', backgroundColor: AmtexColors.grid },
  horizontal: { left: 0, right: 0, height: StyleSheet.hairlineWidth },
  vertical: { top: 0, bottom: 0, width: StyleSheet.hairlineWidth },
  orbTop: { position: 'absolute', top: -90, alignSelf: 'center', width: 320, height: 320, borderRadius: 160, backgroundColor: AmtexColors.orb },
  accentTopRight: { position: 'absolute', top: -40, right: -40, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(30,136,229,0.05)' },
});
