import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import HomeScreen from '../centro-de-operaciones/Home';
import NavigationTap from '../centro-de-operaciones/NavigationTap';

export default function HomeRoute() {
  const params = useLocalSearchParams<{ nombre?: string; usuario?: string }>();

  const navigation = {
    navigate: (screen: string) => {
      if (screen === 'Dvts') {
        router.push('/dvts');
      }
      if (screen === 'Cgt') {
        router.push('/cgt');
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
