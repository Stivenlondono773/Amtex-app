import { StyleSheet, Text, View } from 'react-native';
import { AmtexLogo } from './amtex-logo';
import { AmtexColors } from './amtex-theme';

type AmtexHeaderProps = {
  name: string;
};

export function AmtexHeader({ name }: AmtexHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <AmtexLogo size={36} />
        <Text style={styles.brandName}>AMTEX</Text>
      </View>
      <View style={styles.user}>
        <Text style={styles.greeting}>BIENVENIDO</Text>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.75)', borderBottomWidth: 1, borderBottomColor: 'rgba(21,101,192,0.07)', zIndex: 10 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { fontSize: 17, fontWeight: '800', color: AmtexColors.textDark, letterSpacing: 5 },
  user: { alignItems: 'flex-end', gap: 2, maxWidth: '48%' },
  greeting: { fontSize: 9, fontWeight: '700', color: AmtexColors.textMuted, letterSpacing: 1.2 },
  name: { fontSize: 13, fontWeight: '700', color: AmtexColors.blueDark },
});
