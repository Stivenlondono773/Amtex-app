import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AmtexColors } from './amtex-theme';

type AmtexButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AmtexButton({ label, onPress, disabled = false }: AmtexButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled} activeOpacity={0.9}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 15, backgroundColor: AmtexColors.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: AmtexColors.blue, shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.3, shadowRadius: 13, elevation: 8 },
  disabled: { opacity: 0.65 },
  label: { color: AmtexColors.white, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  arrow: { color: AmtexColors.white, fontSize: 20, lineHeight: 20 },
});
