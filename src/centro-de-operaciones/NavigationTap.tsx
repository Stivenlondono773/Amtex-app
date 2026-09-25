import { router, usePathname } from 'expo-router';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const LOGO = require('../../assets/images/imagenes/logo1.png');

const C = {
  bgBar: 'rgba(255,255,255,0.96)',
  blue: '#1565c0',
  blueDark: '#0d47a1',
  inactive: '#8a96a8',
  border: 'rgba(21,101,192,0.12)',
  white: '#ffffff',
  blueSoft: 'rgba(21,101,192,0.07)',
};

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[ts.tabItem, active && ts.tabItemActive]} onPress={onPress}>
      {active ? <View style={ts.indicator} /> : null}
      <View style={ts.iconWrap}>{icon}</View>
      <Text style={[ts.label, active && ts.labelActive]}>{label}</Text>
    </Pressable>
  );
}

export default function NavigationTap() {
  const pathname = usePathname();

  const goTo = (screen: 'home' | 'dvts' | 'cgt') => {
    router.push(`/${screen}`);
  };

  return (
    <View style={ts.tabBar}>
      <TabButton
        label="DVTS"
        active={pathname === '/dvts'}
        onPress={() => goTo('dvts')}
        icon={<Text style={[ts.emoji, pathname === '/dvts' && ts.emojiActive]}>⚗️</Text>}
      />

      <TabButton
        label="Inicio"
        active={pathname === '/home' || pathname === '/'}
        onPress={() => goTo('home')}
        icon={
          <Image
            source={LOGO}
            style={{ width: 28, height: 28, opacity: pathname === '/home' || pathname === '/' ? 1 : 0.4 }}
            resizeMode="contain"
          />
        }
      />

      <TabButton
        label="CGT"
        active={pathname === '/cgt'}
        onPress={() => goTo('cgt')}
        icon={<Text style={[ts.emoji, pathname === '/cgt' && ts.emojiActive]}>🧪</Text>}
      />
    </View>
  );
}

const ts = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    height: Platform.OS === 'ios' ? 84 : 72,
    backgroundColor: C.bgBar,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 18,
    minHeight: 58,
  },
  tabItemActive: {
    backgroundColor: C.blueSoft,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.blue,
  },
  iconWrap: {
    width: 38,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    opacity: 0.55,
  },
  emojiActive: {
    opacity: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: C.inactive,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: C.blueDark,
    fontWeight: '800',
  },
});
