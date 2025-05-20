import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useFavoritos } from '../../context/FavoritosContext';
import { useAnimais } from '../../hooks/useAnimais';
import { FontAwesome } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import supabase from '../../lib/supabase';

const categorias = ['Gatos', 'Cães', 'Animais especiais', 'Idosos'];

export default function Home() {
  const router = useRouter();
  const { isFavorito, toggleFavorito, loading: loadingFavoritos } = useFavoritos();
  const { animais, loading: loadingAnimais } = useAnimais();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Gatos');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [favoritando, setFavoritando] = useState(false);

  useEffect(() => {
    const fetchNome = async () => {
      try {
        const user = supabase.auth.user();
        if (!user) return;

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id_user', user.id);

        if (error) {
          console.error('Erro ao buscar nome:', error);
          return;
        }

        if (profiles && profiles.length > 0) {
          const profile = profiles[0];
          setNomeUsuario(profile.nome || '');
        } else {
          // Se não encontrar o perfil, tenta criar um novo
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
            return;
          }

          if (newProfile) {
            setNomeUsuario(newProfile.nome || '');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar nome:', error);
      }
    };
    fetchNome();
  }, []);

  const handleAdotar = (nome) => {
    router.push(`/formulario-adocao?nomeAnimal=${nome}`);
  };

  const handleToggleFavorito = async (animalId) => {
    try {
      setFavoritando(true);
      await toggleFavorito(animalId);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o favorito. Tente novamente.');
    } finally {
      setFavoritando(false);
    }
  };

  if (loadingFavoritos || loadingAnimais) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffba00" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Saudação e ícone */}
      <View style={styles.header}>
        <Text style={styles.hello}>Olá, {nomeUsuario || 'Fulano'}!</Text>
      </View>

      {/* Banner */}
      <LinearGradient colors={['#ffba00', '#ff7b00']} style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerText}>
            Fazemos a ponte entre você e seu melhor amigo! :)
          </Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Encontre seu amigo!
            </Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../../assets/images/cat.png')} style={styles.bannerImage} />
      </LinearGradient>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#bbb" style={{ marginLeft: 12 }} />
        <TextInput
          placeholder="Buscar"
          style={styles.searchInput}
          placeholderTextColor="#bbb"
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtros}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategoriaSelecionada(cat)}
            style={[
              styles.filtroBtn,
              categoriaSelecionada === cat && styles.filtroSelecionado,
            ]}
          >
            <Text
              style={[
                styles.filtroTexto,
                categoriaSelecionada === cat && { color: '#fff' },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de animais */}
      {animais.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum animal disponível no momento</Text>
          <Text style={styles.emptySubText}>Volte mais tarde para ver novos animais</Text>
        </View>
      ) : (
        animais
          .filter((a) => {
            if (categoriaSelecionada === 'Gatos') return a.tipo === 'Gato';
            if (categoriaSelecionada === 'Cães') return a.tipo === 'Cão';
            if (categoriaSelecionada === 'Animais especiais') return a.tipo === 'Especial';
            if (categoriaSelecionada === 'Idosos') return a.tipo === 'Idoso';
            return true;
          })
          .map((animal) => (
            <View key={animal.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image 
                  source={animal.imagem}
                  style={styles.animalImg}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.nome}>{animal.nome}</Text>
                <Text style={styles.desc}>{animal.descricao}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.info}> 
                    <FontAwesome name="map-marker" size={13} color="#bbb" /> {animal.local} {'   '}
                    <Text style={{ color: 'green' }}>{animal.status}</Text>
                  </Text>
                  <FontAwesome name="paw" size={13} color="#ffba00" style={{ marginLeft: 8 }} />
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.btnAdotar} onPress={() => handleAdotar(animal.nome)}>
                    <Text style={styles.btnAdotarText}>Quero Adotar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleToggleFavorito(animal.id)}
                    disabled={favoritando}
                  >
                    {favoritando ? (
                      <ActivityIndicator size="small" color="#ffba00" style={{ marginLeft: 10 }} />
                    ) : (
                      <FontAwesome
                        name={isFavorito(animal.id) ? 'heart' : 'heart-o'}
                        size={24}
                        color={isFavorito(animal.id) ? 'red' : 'gray'}
                        style={{ marginLeft: 10 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  hello: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  banner: {
    backgroundColor: '#ffcc80',
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  bannerBtn: {
    backgroundColor: '#ff7b00',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bannerImage: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 15,
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginLeft: 8,
  },
  filtros: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
    flexWrap: 'wrap',
  },
  filtroBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  filtroSelecionado: {
    backgroundColor: '#ffba00',
  },
  filtroTexto: {
    color: '#333',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
  },
  animalImg: {
    width: '100%',
    height: '100%',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  desc: {
    color: '#444',
    marginBottom: 2,
    fontSize: 13,
  },
  info: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  btnAdotar: {
    backgroundColor: '#ffba00',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  btnAdotarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: '#ff2d55',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ffba00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
