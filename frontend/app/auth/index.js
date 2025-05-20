import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      await login(email, senha);
      console.log('Login bem-sucedido');
    } catch (error) {
      console.error('Erro no login:', error);
      let mensagemErro = 'Não foi possível fazer login.';
      
      if (error.message.includes('Invalid login credentials')) {
        mensagemErro = 'E-mail ou senha incorretos.';
      } else if (error.message.includes('Email not confirmed')) {
        mensagemErro = 'Por favor, confirme seu e-mail antes de fazer login.';
      }
      
      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 40 }}>
        Bem-vindo
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
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      />

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Senha</Text>
      <TextInput
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
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
        style={styles.forgotPassword}
        onPress={() => router.push('/auth/esqueceu-senha')}
      >
        <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleLogin}
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
            Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/auth/cadastro')}
        disabled={loading}
        style={{
          padding: 15,
          borderRadius: 25,
          alignItems: 'center',
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text style={{ color: '#666', fontSize: 14 }}>
          Ainda não tem conta? <Text style={{ color: '#ffba00', fontWeight: 'bold' }}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
}); 