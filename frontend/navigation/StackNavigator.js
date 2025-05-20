import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from '../app/tela-login';
import Home from '../app/(tabs)/index';
import Cadastro from '../app/cadastro';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <Stack.Screen name="Login" component={TelaLogin} />
      ) } (
        <Stack.Screen name="Cadastro" component={Cadastro} />
      )
    </Stack.Navigator>
  );
}
