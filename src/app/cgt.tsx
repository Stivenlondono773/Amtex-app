import { View } from 'react-native';
import CgtScreen from '../centro-de-operaciones/Cgt';
import NavigationTap from '../centro-de-operaciones/NavigationTap';

export default function CgtRoute() {
  return (
    <View style={{ flex: 1 }}>
      <CgtScreen />
      <NavigationTap />
    </View>
  );
}
