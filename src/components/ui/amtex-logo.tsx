import { Image, StyleSheet, View } from 'react-native';
import { AmtexColors } from './amtex-theme';

const LOGO = require('../../../assets/images/imagenes/logo1.png');

export function AmtexLogo({ size = 40 }: { size?: number }) {
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Image source={LOGO} style={{ width: size * 0.68, height: size * 0.68 }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: AmtexColors.white, borderWidth: 1, borderColor: 'rgba(21,101,192,0.13)', alignItems: 'center', justifyContent: 'center', shadowColor: AmtexColors.blue, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5, overflow: 'hidden' },
});
