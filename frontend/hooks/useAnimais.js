import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

// Lista de animais disponíveis localmente
const animaisIniciais = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nome: 'Luna',
    tipo: 'Gato',
    descricao: 'Gatinha carinhosa e brincalhona',
    local: 'São Paulo, SP',
    status: 'Disponível',
    imagem: require('../assets/images/flow.png')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    nome: 'Thor',
    tipo: 'Cão',
    descricao: 'Cachorro dócil e protetor',
    local: 'Rio de Janeiro, RJ',
    status: 'Disponível',
    imagem: require('../assets/images/max.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    nome: 'Patinho',
    tipo: 'Especial',
    descricao: 'Patinho que precisa de cuidados especiais',
    local: 'Belo Horizonte, MG',
    status: 'Disponível',
    imagem: require('../assets/images/caramelo.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    nome: 'Bolinha',
    tipo: 'Gato',
    descricao: 'Gatinha carinhosa e brincalhona',
    local: 'Curitiba, PR',
    status: 'Disponível',
    imagem: require('../assets/images/gata.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    nome: 'Mariah',
    tipo: 'Gato',
    descricao: 'Gatinha muito dócil e carinhosa',
    local: 'São Paulo, SP',
    status: 'Disponível',
    imagem: require('../assets/images/mariah.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    nome: 'Sol',
    tipo: 'Gato',
    descricao: ' Gatinha super dócil e dengosa',
    local: 'Rio de Janeiro, RJ',
    status: 'Disponível',
    imagem: require('../assets/images/sol.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    nome: 'Lia',
    tipo: 'Gato',
    descricao: 'Gatinha tranquila e independente',
    local: 'Belo Horizonte, MG',
    status: 'Disponível',
    imagem: require('../assets/images/lia.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    nome: 'Morgana',
    tipo: 'Cão',
    descricao: 'Cadela muito carinhosa e brincalhona',
    local: 'São Paulo, SP',
    status: 'Disponível',
    imagem: require('../assets/images/morgana.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    nome: 'Lila',
    tipo: 'Cão',
    descricao: 'Cachorrinha muito dócil e carinhosa',
    local: 'Rio de Janeiro, RJ',
    status: 'Disponível',
    imagem: require('../assets/images/Lila.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    nome: 'Jack',
    tipo: 'Cão',
    descricao: 'Cachorro muito brincalhão e protetor',
    local: 'Belo Horizonte, MG',
    status: 'Disponível',
    imagem: require('../assets/images/jack.png')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    nome: 'Jonas',
    tipo: 'Idoso',
    descricao: 'Cachorro muito dócil e carinhoso',
    local: 'São Paulo, SP',
    status: 'Disponível',
    imagem: require('../assets/images/jonas.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    nome: 'Bob',
    tipo: 'Idoso',
    descricao: 'Cachorro muito brincalhão e alegre',
    local: 'Rio de Janeiro, RJ',
    status: 'Disponível',
    imagem: require('../assets/images/Bob.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    nome: 'Belo',
    tipo: 'Idoso',
    descricao: 'Cachorro muito dócil e protetor',
    local: 'Belo Horizonte, MG',
    status: 'Disponível',
    imagem: require('../assets/images/Belo.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    nome: 'Vick',
    tipo: 'Especial',
    descricao: 'Cachorro muito carinhoso e brincalhão',
    local: 'São Paulo, SP',
    status: 'Disponível',
    imagem: require('../assets/images/vick.jpg')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    nome: 'Luck',
    tipo: 'Especial',
    descricao: 'Cachorro muito dócil e alegre',
    local: 'Rio de Janeiro, RJ',
    status: 'Disponível',
    imagem: require('../assets/images/luck.jpeg')
  }
];

export const useAnimais = () => {
  const [animais, setAnimais] = useState(animaisIniciais);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const adicionarAnimal = async (novoAnimal) => {
    try {
      setLoading(true);
      // Adiciona o novo animal à lista local
      const animalComId = {
        ...novoAnimal,
        id: `550e8400-e29b-41d4-a716-${Math.random().toString(36).substr(2, 9)}`,
        status: 'Disponível'
      };
      setAnimais([...animais, animalComId]);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removerAnimal = async (id) => {
    try {
      setLoading(true);
      // Remove o animal da lista local
      setAnimais(animais.filter(animal => animal.id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    animais,
    loading,
    error,
    adicionarAnimal,
    removerAnimal
  };
}; 