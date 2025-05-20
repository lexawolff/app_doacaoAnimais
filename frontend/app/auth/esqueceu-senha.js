import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Sucesso',
        'Um email foi enviado com instruções para redefinir sua senha.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 20 }}>
        Esqueceu sua senha?
      </Text>
      
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>
        Digite seu email e enviaremos instruções para redefinir sua senha.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>E-mail</Text>
      <TextInput
        placeholder="exemplo@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={{
          backgroundColor: '#f5f5f5',
          borderRadius: 25,
          paddingHorizontal: 20,
          paddingVertical: 12,
          marginBottom: 30,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      />

      <TouchableOpacity
        onPress={handleResetPassword}
        disabled={loading}
        style={{
          backgroundColor: '#ffba00',
          padding: 15,
          borderRadius: 25,
          alignItems: 'center',
          marginBottom: 20,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            Enviar instruções
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          padding: 15,
          borderRadius: 25,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#666', fontSize: 14 }}>
          Voltar para o <Text style={{ color: '#ffba00', fontWeight: 'bold' }}>login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
} 