import {
  AmtexButton,
  AmtexColors,
  AmtexInput,
  AmtexLogo,
  GridBackground,
} from '@/components/ui';
import { firebaseErrorMessage, registerOperator } from '@/lib/firebase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type RegisterErrors = {
  nombre?: string;
  usuario?: string;
  password?: string;
  confirmarPassword?: string;
};

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): RegisterErrors => {
    const nextErrors: RegisterErrors = {};
    if (!nombre.trim()) nextErrors.nombre = 'Ingresa el nombre del operario';
    if (!usuario.trim()) nextErrors.usuario = 'Ingresa el número del operario';
    else if (usuario.trim().length < 3) nextErrors.usuario = 'Mínimo 3 caracteres';
    else if (!/^[a-zA-Z0-9._-]+$/.test(usuario.trim())) nextErrors.usuario = 'Usa solo letras, números, punto, guion o guion bajo';
    if (password.length < 6) nextErrors.password = 'Mínimo 6 caracteres';
    if (!confirmarPassword) nextErrors.confirmarPassword = 'Confirma la contraseña';
    else if (password !== confirmarPassword) nextErrors.confirmarPassword = 'Las contraseñas no coinciden';
    return nextErrors;
  };

  const update = (field: keyof RegisterErrors, value: string, setter: (value: string) => void) => {
    setter(value);
    setErrors(current => ({ ...current, [field]: undefined }));
    setRegistered(false);
    setApiError('');
  };

  const handleRegister = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setApiError('');
    try {
      await registerOperator({
        nombre,
        numeroOperario: usuario,
        password,
        confirmarPassword,
      });
      setRegistered(true);
      setTimeout(() => router.back(), 900);
    } catch (error: unknown) {
      setApiError(firebaseErrorMessage(error, 'No se pudo completar el registro'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GridBackground>
      <StatusBar barStyle="dark-content" backgroundColor={AmtexColors.bg} />
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <AmtexLogo size={58} />
          <Text style={styles.brandName}>AMTEX</Text>
          <Text style={styles.brandSub}>REGISTRO DE OPERACIONES</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.sheet}>
            <View style={styles.sheetLine} />
            <View style={styles.handle} />
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Registra los datos del operario para continuar</Text>
            {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

            <AmtexInput
              label="NOMBRE COMPLETO"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChangeText={value => update('nombre', value, setNombre)}
              autoCapitalize="words"
              error={errors.nombre}
            />
            <AmtexInput
              label="NÚMERO DE OPERARIO"
              placeholder="Ej: op003"
              value={usuario}
              onChangeText={value => update('usuario', value, setUsuario)}
              error={errors.usuario}
            />
            <AmtexInput
              label="CONTRASEÑA"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={value => update('password', value, setPassword)}
              secureTextEntry={!showPassword}
              onToggleSecure={() => setShowPassword(current => !current)}
              error={errors.password}
            />
            <AmtexInput
              label="CONFIRMAR CONTRASEÑA"
              placeholder="Repite tu contraseña"
              value={confirmarPassword}
              onChangeText={value => update('confirmarPassword', value, setConfirmarPassword)}
              secureTextEntry={!showConfirmation}
              onToggleSecure={() => setShowConfirmation(current => !current)}
              error={errors.confirmarPassword}
            />

            {registered ? <Text style={styles.success}>Registro completado. Regresando al inicio...</Text> : null}
            <AmtexButton label={loading ? 'GUARDANDO...' : 'REGISTRAR OPERARIO'} onPress={handleRegister} disabled={registered || loading} />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>¿Ya tienes cuenta? Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GridBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 42, paddingBottom: 18, gap: 6 },
  brandName: { fontSize: 21, fontWeight: '800', color: AmtexColors.textDark, letterSpacing: 7 },
  brandSub: { fontSize: 8, fontWeight: '600', color: AmtexColors.textMuted, letterSpacing: 1.7 },
  scroll: { flexGrow: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: AmtexColors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderTopWidth: 1, borderColor: AmtexColors.border, paddingHorizontal: 26, paddingTop: 16, paddingBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 12 },
  sheetLine: { position: 'absolute', top: 0, left: 60, right: 60, height: 2, backgroundColor: AmtexColors.blue, borderRadius: 2, opacity: 0.7 },
  handle: { width: 40, height: 4, backgroundColor: AmtexColors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  title: { fontSize: 24, fontWeight: '800', color: AmtexColors.textDark, marginBottom: 4 },
  subtitle: { fontSize: 12, color: AmtexColors.textMuted, marginBottom: 20 },
  success: { color: AmtexColors.success, fontSize: 11, fontWeight: '600', marginBottom: 12 },
  error: { color: '#d32f2f', fontSize: 11, fontWeight: '600', marginBottom: 12 },
  backButton: { alignItems: 'center', paddingTop: 18 },
  backText: { color: AmtexColors.blueDark, fontSize: 12, fontWeight: '700' },
});
