import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'favoritos':
              iconName = 'paw';
              break;
            case 'perfil':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff7b00',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          href: '/(tabs)/'
        }} 
      />
      <Tabs.Screen 
        name="favoritos" 
        options={{ 
          title: 'Favoritos',
          href: '/(tabs)/favoritos'
        }} 
      />
      <Tabs.Screen 
        name="perfil" 
        options={{ 
          title: 'Perfil',
          href: '/(tabs)/perfil'
        }} 
      />
    </Tabs>
  );
}
