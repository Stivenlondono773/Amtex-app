import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import HomeScreen from '../centro-de-operaciones/Home';
import NavigationTap from '../centro-de-operaciones/NavigationTap';

export default function HomeRoute() {
  const params = useLocalSearchParams<{ nombre?: string; usuario?: string }>();

  const navigation = {
    navigate: (screen: string) => {
      const sharedParams = {
        nombre: params.nombre as string | undefined,
        usuario: params.usuario as string | undefined,
      };

      if (screen === 'Dvts') {
        router.push({ pathname: '/dvts', params: sharedParams });
      }
      if (screen === 'Cgt') {
        router.push({ pathname: '/cgt', params: sharedParams });
      }
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen
        navigation={navigation}
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
