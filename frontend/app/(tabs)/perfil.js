import { View, Text, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import supabase from '../../lib/supabase';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

// Importa a versão web do Supabase se estiver no navegador
if (Platform.OS === 'web') {
  import('../../lib/supabase.web').then(module => {
    Object.assign(supabase, module.default);
  });
}

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [foto, setFoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      console.log('Usuário autenticado:', user);

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        router.replace('/auth');
        return;
      }

      console.log('ID do usuário:', user.id);
      console.log('Email do usuário:', user.email);

      // Primeiro, vamos verificar se o perfil existe
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id_user', user.id);

      console.log('Resposta da busca:', { profiles, error });

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
      }

      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        setUser(user);
        setNome(profile.nome || '');
        setNomeUsuario(profile.nome_usuario || '');
        setEmail(profile.email || user.email || '');
        setDataNascimento(profile.data_nascimento || '');
        setTelefone(profile.telefone || '');
        setEndereco(profile.endereco || '');
        setCidade(profile.cidade || '');
        setEstado(profile.estado || '');
        setCep(profile.cep || '');
        setFoto(profile.foto);
      } else {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id_user: user.id,
              email: user.email,
              nome: user.email.split('@')[0],
              nome_usuario: user.email.split('@')[0],
              created_at: new Date().toISOString(),
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar perfil:', createError);
          throw createError;
        }

        if (newProfile) {
          console.log('Novo perfil criado:', newProfile);
          setUser(user);
          setNome(newProfile.nome || '');
          setNomeUsuario(newProfile.nome_usuario || '');
          setEmail(newProfile.email || user.email || '');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      if (error.message === 'Failed to fetch') {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar o perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarConta = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const user = supabase.auth.user();
              
              if (!user) {
                Alert.alert('Erro', 'Usuário não autenticado');
                return;
              }

              // Primeiro deleta o perfil
              const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id_user', user.id);

              if (profileError) throw profileError;

              // Depois deleta a conta
              const { error: deleteError } = await supabase.auth.signOut();
              if (deleteError) throw deleteError;

              Alert.alert('Sucesso', 'Sua conta foi excluída com sucesso');
              router.replace('/auth');
            } catch (error) {
              console.error('Erro ao deletar conta:', error);
              Alert.alert('Erro', 'Não foi possível excluir sua conta');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleAtualizarPerfil = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      // Prepara os dados para atualização
      const dadosAtualizacao = {
        nome,
        nome_usuario: nomeUsuario,
        data_nascimento: dataNascimento,
        telefone,
        endereco,
        cidade,
        estado,
        cep: cep ? parseInt(cep.replace(/\D/g, '')) : null
      };

      console.log('Dados para atualização:', dadosAtualizacao);

      const { error } = await supabase
        .from('profiles')
        .update(dadosAtualizacao)
        .eq('id_user', user.id);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw error;
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled) {
        await handleUploadFoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto');
    }
  };

  const handleUploadFoto = async (uri) => {
    try {
      setUploading(true);
      const user = supabase.auth.user();
      if (!user) throw new Error('Usuário não encontrado');

      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `fotos-perfil/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('fotos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          foto: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id_user', user.id);

      if (updateError) throw updateError;
      setFoto(publicUrl);
      Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      Alert.alert('Erro', 'Não foi possível fazer upload da foto');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#ffba00" />
        <Text style={estilos.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.scrollContainer} contentContainerStyle={estilos.scrollContent}>
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Informações Pessoais</Text>
        <View style={estilos.avatarContainer}>
          <View style={estilos.avatarCircle}>
            {foto ? (
              <Image source={{ uri: foto }} style={estilos.avatarImg} />
            ) : (
              <Image source={require('../../assets/images/avatar-placeholder.png')} style={estilos.avatarImg} />
            )}
          </View>
          <TouchableOpacity style={estilos.alterarBtn} onPress={handleSelecionarFoto} disabled={uploading}>
            <Text style={estilos.alterarBtnText}>Alterar</Text>
          </TouchableOpacity>
        </View>
        <Text style={estilos.label}>Nome</Text>
        <TextInput
          style={estilos.input}
          placeholder="Seu nome completo"
          value={nome}
          onChangeText={setNome}
        />
        <Text style={estilos.label}>Nome de Usuário</Text>
        <TextInput
          style={estilos.input}
          placeholder="Seu nome de usuário"
          value={nomeUsuario}
          onChangeText={setNomeUsuario}
        />
        <Text style={estilos.label}>E-mail</Text>
        <TextInput
          style={estilos.input}
          placeholder="Seu e-mail"
          value={email}
          editable={false}
        />
        <Text style={estilos.label}>Telefone</Text>
        <TextInput
          style={estilos.input}
          placeholder="Seu telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        <Text style={estilos.label}>Data de Nascimento</Text>
        <TextInput
          style={estilos.input}
          placeholder="00/00/0000"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />
        <Text style={estilos.label}>Endereço</Text>
        <TextInput
          style={estilos.input}
          placeholder="Seu endereço"
          value={endereco}
          onChangeText={setEndereco}
        />
        <Text style={estilos.label}>Cidade</Text>
        <TextInput
          style={estilos.input}
          placeholder="Sua cidade"
          value={cidade}
          onChangeText={setCidade}
        />
        <Text style={estilos.label}>Estado</Text>
        <TextInput
          style={estilos.input}
          placeholder="Seu estado"
          value={estado}
          onChangeText={setEstado}
        />
        <Text style={estilos.label}>CEP</Text>
        <TextInput
          style={estilos.input}
          placeholder="Seu CEP"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={[estilos.btnSalvar, loading && estilos.btnDisabled]} 
          onPress={handleAtualizarPerfil} 
          disabled={loading}
        >
          <LinearGradient
            colors={['#ffba00', '#ff7b00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={estilos.gradient}
          >
            <Text style={estilos.btnSalvarText}>
              {loading ? 'SALVANDO...' : 'SALVAR'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[estilos.btnSair, loading && estilos.btnDisabled]} 
          onPress={handleLogout} 
          disabled={loading}
        >
          <LinearGradient
            colors={['#f11d28', '#fe612c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={estilos.gradient}
          >
            <Text style={estilos.btnSairText}>
              {loading ? 'SAINDO...' : 'SAIR'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={estilos.btnDeletarConta} 
          onPress={handleDeletarConta} 
          disabled={loading}
        >
          <Text style={estilos.btnDeletarContaText}>
            Excluir minha conta
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarImg: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 30,
  },
  alterarBtn: {
    backgroundColor: '#8fd3ff',
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginTop: -8,
  },
  alterarBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
    color: '#222',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnSalvar: {
    marginTop: 24,
    borderRadius: 25,
    overflow: 'hidden',
  },
  btnSair: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnSalvarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  btnSairText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  btnDeletarConta: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDeletarContaText: {
    color: '#f11d28',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
