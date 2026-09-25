import SplashScreen from '@/centro-de-operaciones/SplashScreen';
import { useState } from 'react';
import LoginScreen from '../centro-de-operaciones/LoginScreen';

export default function IndexRoute() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <LoginScreen />;
}
