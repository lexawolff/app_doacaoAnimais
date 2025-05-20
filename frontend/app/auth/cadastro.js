import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function Cadastro() {
  const router = useRouter();
  const { cadastro } = useAuth();
  const [nome, setNome] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [aceitouPolitica, setAceitouPolitica] = useState(false);
  const [loading, setLoading] = useState(false);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha) => {
    return senha.length >= 8;
  };

  const handleCadastro = async () => {
    if (!nome || !nomeUsuario || !email || !senha || !dataNascimento) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }
    if (!validarSenha(senha)) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (!aceitouPolitica) {
      Alert.alert('Erro', 'Você precisa aceitar a política de privacidade.');
      return;
    }
    setLoading(true);
    try {
      await cadastro(email, senha, nome, dataNascimento, nomeUsuario);
      console.log('Cadastro bem-sucedido');
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmar a conta.');
      router.push('/auth');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      let mensagemErro = 'Não foi possível realizar o cadastro.';
      if (error.message.includes('Email address is invalid')) {
        mensagemErro = 'Por favor, insira um e-mail válido.';
      } else if (error.message.includes('already registered')) {
        mensagemErro = 'Este e-mail já está cadastrado.';
      } else if (error.message.includes('password')) {
        mensagemErro = 'A senha deve ter pelo menos 8 caracteres.';
      }
      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 40 }}>
        Cadastre-se para ter acesso
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Nome completo</Text>
      <TextInput
        placeholder="Insira seu nome completo"
        value={nome}
        onChangeText={setNome}
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

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Usuário</Text>
      <TextInput
        placeholder="Insira seu nome de usuário"
        value={nomeUsuario}
        onChangeText={setNomeUsuario}
        style={{backgroundColor: '#f5f5f5',
          borderRadius: 25,
          paddingHorizontal: 20,
          paddingVertical: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      />

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
        placeholder="Mínimo de 8 caracteres"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
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

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Data de nascimento</Text>
      <TextInput
        placeholder="00/00/0000"
        value={dataNascimento}
        onChangeText={setDataNascimento}
        keyboardType="numeric"
        maxLength={10}
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

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => setAceitouPolitica(!aceitouPolitica)}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 1.5,
            borderColor: '#ccc',
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          {aceitouPolitica ? (
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#ffba00',
            }} />
          ) : null}
        </TouchableOpacity>
        <Text style={{ fontSize: 13, color: '#888', flex: 1, flexWrap: 'wrap' }}>
          Ao se cadastrar voce concorda com a nossa{' '}
          <Text style={{ color: '#ffba00', fontWeight: 'bold', textDecorationLine: 'underline' }}>
            política de privacidade.
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleCadastro}
        disabled={loading || !aceitouPolitica}
        style={{
          backgroundColor: '#ffba00',
          borderRadius: 25,
          paddingVertical: 16,
          alignItems: 'center',
          marginBottom: 10,
          opacity: loading || !aceitouPolitica ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            Cadastro
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}