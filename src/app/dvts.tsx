import { router } from 'expo-router';
import { View } from 'react-native';
import DvtsScreen from '../centro-de-operaciones/Dvts';
import NavigationTap from '../centro-de-operaciones/NavigationTap';

export default function DvtsRoute() {
  const navigation = {
    navigate: (screen: string) => {
      if (screen === 'Home') {
        router.push('/home');
      }
      if (screen === 'Cgt') {
        router.push('/cgt');
      }
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <DvtsScreen navigation={navigation as any} />
      <NavigationTap />
    </View>
  );
}
