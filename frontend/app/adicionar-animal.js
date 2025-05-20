import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAnimais } from '../hooks/useAnimais';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../lib/supabase';

export default function AdicionarAnimal() {
  const router = useRouter();
  const { adicionarAnimal } = useAnimais();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [tipo, setTipo] = useState('');
  const [imagem, setImagem] = useState(null);

  const handleSelecionarImagem = async () => {
    try {
      // Solicitar permissão primeiro
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar suas fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleUploadImagem = async (uri) => {
    try {

      // Verificar se o Supabase está configurado
      if (!supabase) {
        throw new Error('Supabase não está configurado');
      }

      // Preparar o arquivo
      const response = await fetch(uri);
      if (!response.ok) throw new Error('Falha ao carregar a imagem');
      
      const blob = await response.blob();
      const fileName = `${Date.now()}.jpg`;
      const filePath = `animais/${fileName}`;


      // Fazer upload usando o bucket 'animais'
      const { error: uploadError, data } = await supabase.storage
        .from('animais')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload concluído, obtendo URL pública...');

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('animais')
        .getPublicUrl(filePath);

      console.log('URL pública obtida:', publicUrl);

      // Verificar se a URL é válida
      if (!publicUrl) {
        throw new Error('URL pública não foi gerada');
      }

      return publicUrl;
    } catch (error) {
      console.error('Erro detalhado ao fazer upload da imagem:', error);
      Alert.alert(
        'Erro',
        'Não foi possível fazer upload da imagem. Tente novamente mais tarde.'
      );
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!nome || !descricao || !local || !tipo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      let imagem_url = null;

      if (imagem) {
        try {
          imagem_url = await handleUploadImagem(imagem);
          console.log('Imagem enviada com sucesso:', imagem_url);

          // Verificar se a URL é válida
          if (!imagem_url) {
            throw new Error('URL da imagem não foi gerada');
          }
        } catch (error) {
          console.error('Erro no upload da imagem:', error);
          Alert.alert(
            'Aviso',
            'O animal será adicionado sem imagem. Você pode adicionar a imagem depois.'
          );
        }
      }

      console.log('Adicionando animal com os dados:', {
        nome,
        descricao,
        local,
        tipo,
        imagem_url,
        status: 'Disponível',
      });

      const novoAnimal = await adicionarAnimal({
        nome,
        descricao,
        local,
        tipo,
        imagem_url,
        status: 'Disponível',
      });


      Alert.alert('Sucesso', 'Animal adicionado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar animal:', error);
      Alert.alert(
        'Erro',
        'Não foi possível adicionar o animal. Tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Animal</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do animal"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descreva o animal"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Local</Text>
      <TextInput
        style={styles.input}
        placeholder="Cidade/Estado"
        value={local}
        onChangeText={setLocal}
      />

      <Text style={styles.label}>Tipo</Text>
      <TextInput
        style={styles.input}
        placeholder="Gato, Cão, etc."
        value={tipo}
        onChangeText={setTipo}
      />

      <TouchableOpacity
        style={styles.btnImagem}
        onPress={handleSelecionarImagem}
        disabled={loading}
      >
        <Text style={styles.btnImagemText}>
          {imagem ? 'Alterar imagem' : 'Selecionar imagem'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSubmit}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnSubmitText}>Adicionar Animal</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  btnImagem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnImagemText: {
    color: '#666',
    fontWeight: 'bold',
  },
  btnSubmit: {
    backgroundColor: '#ffba00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 