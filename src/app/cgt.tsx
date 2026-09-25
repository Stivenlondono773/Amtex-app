import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import CgtScreen from '../centro-de-operaciones/Cgt';
import NavigationTap from '../centro-de-operaciones/NavigationTap';

export default function CgtRoute() {
  const params = useLocalSearchParams<{ nombre?: string; usuario?: string }>();

  return (
    <View style={{ flex: 1 }}>
      <CgtScreen
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
