import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import DvtsScreen from '../centro-de-operaciones/Dvts';
import NavigationTap from '../centro-de-operaciones/NavigationTap';

export default function DvtsRoute() {
  const params = useLocalSearchParams<{ nombre?: string; usuario?: string }>();

  const navigation = {
    navigate: (screen: string) => {
      const sharedParams = {
        nombre: params.nombre as string | undefined,
        usuario: params.usuario as string | undefined,
      };

      if (screen === 'Home') {
        router.push({ pathname: '/home', params: sharedParams });
      }
      if (screen === 'Cgt') {
        router.push({ pathname: '/cgt', params: sharedParams });
      }
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <DvtsScreen
        navigation={navigation as any}
        route={{
          params: {
            nombre: params.nombre as string | undefined,
            usuario: params.usuario as string | undefined,
          },
        }}
      />
      <NavigationTap />
    </View>
  );
}
