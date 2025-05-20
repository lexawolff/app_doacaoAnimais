import { Stack } from 'expo-router';

export default function AuthLayout() {
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="cadastro"
        options={{
          title: 'Cadastro',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 