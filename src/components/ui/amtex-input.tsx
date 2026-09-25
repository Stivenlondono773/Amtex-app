import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AmtexColors } from './amtex-theme';

type AmtexInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export function AmtexInput({ label, placeholder, value, onChangeText, error, secureTextEntry = false, onToggleSecure, autoCapitalize = 'none' }: AmtexInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused, error && styles.fieldError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AmtexColors.textHint}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          selectionColor={AmtexColors.blue}
        />
        {onToggleSecure ? (
          <TouchableOpacity onPress={onToggleSecure} style={styles.toggle}>
            <Text style={styles.toggleText}>{secureTextEntry ? 'Mostrar' : 'Ocultar'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 13 },
  label: { fontSize: 10, fontWeight: '700', color: AmtexColors.textMuted, letterSpacing: 0.8, marginBottom: 6 },
  field: { minHeight: 50, borderWidth: 1.5, borderColor: AmtexColors.border, borderRadius: 13, backgroundColor: AmtexColors.inputBg, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  fieldFocused: { borderColor: AmtexColors.blue, backgroundColor: 'rgba(21,101,192,0.025)' },
  fieldError: { borderColor: AmtexColors.danger, backgroundColor: 'rgba(239,83,80,0.03)' },
  input: { flex: 1, fontSize: 13, color: AmtexColors.textDark, paddingVertical: 0 },
  toggle: { paddingLeft: 10, paddingVertical: 8 },
  toggleText: { fontSize: 10, fontWeight: '700', color: AmtexColors.blue },
  error: { fontSize: 11, color: AmtexColors.danger, marginTop: 4 },
});
