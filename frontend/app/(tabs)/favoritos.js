import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFavoritos } from '../../context/FavoritosContext';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAnimais } from '../../hooks/useAnimais';

const TelaFavoritos = () => {
  const { favoritos, toggleFavorito } = useFavoritos();
  const { animais } = useAnimais();
  const router = useRouter();
  const [animaisFavoritos, setAnimaisFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    const carregarAnimaisFavoritos = () => {
      try {
        setLoading(true);
        if (favoritos.length === 0) {
          setAnimaisFavoritos([]);
          return;
        }

        // Filtra os animais disponíveis que estão nos favoritos
        const animaisFiltrados = animais.filter(animal => 
          favoritos.includes(animal.id)
        );
        
        setAnimaisFavoritos(animaisFiltrados);
      } catch (error) {
        console.error('Erro ao carregar animais favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarAnimaisFavoritos();
  }, [favoritos, animais]);

  const handleRemoverFavorito = async (animalId) => {
    try {
      setRemovendo(true);
      await toggleFavorito(animalId);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    } finally {
      setRemovendo(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffba00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos</Text>
      {animaisFavoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem favoritos</Text>
          <TouchableOpacity 
            style={styles.btnVoltar}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.btnVoltarText}>Ver animais disponíveis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={animaisFavoritos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image 
                source={item.imagem}
                style={styles.animalImg}
                defaultSource={require('../../assets/images/flow.png')}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.desc}>{item.descricao}</Text>
                <View style={styles.locationContainer}>
                  <Text style={styles.info}>
                    <FontAwesome name="map-marker" size={13} color="#bbb" /> {item.local}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.btnRemover, removendo && styles.btnDisabled]}
                  onPress={() => handleRemoverFavorito(item.id)}
                  disabled={removendo}
                >
                  {removendo ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : (
                    <Text style={styles.btnRemoverText}>Remover dos favoritos</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  btnVoltar: {
    backgroundColor: '#ffba00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnVoltarText: {
    color: '#fff',
    fontWeight: 'bold',
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
  animalImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  btnRemover: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnRemoverText: {
    color: '#666',
    fontSize: 12,
  },
});

export default TelaFavoritos;
