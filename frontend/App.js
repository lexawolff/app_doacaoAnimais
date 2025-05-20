import { FavoritosProvider } from './context/FavoritosContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <FavoritosProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </FavoritosProvider>
  );
}

import 'expo-router/entry';
