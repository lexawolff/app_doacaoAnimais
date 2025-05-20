import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { Stack, useRouter, useSegments, Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { FavoritosProvider } from '../context/FavoritosContext';

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  // Se estiver na tela de início, permite o acesso
  if (segments[0] === 'inicio') {
    return (
      <FavoritosProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="inicio" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="formulario-adocao" />
        </Stack>
      </FavoritosProvider>
    );
  }

  // Se não estiver autenticado e não estiver na tela de auth ou início, redireciona para início
  if (!user && segments[0] !== 'auth' && segments[0] !== 'inicio') {
    return <Redirect href="/inicio" />;
  }

  // Se estiver autenticado e estiver na tela de auth ou início, redireciona para tabs
  if (user && (segments[0] === 'auth' || segments[0] === 'inicio')) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <FavoritosProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="inicio" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="formulario-adocao" />
      </Stack>
    </FavoritosProvider>
  );
}
