import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

// Criar o contexto com um valor inicial
const FavoritosContext = createContext();

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
};

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarFavoritos = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      
      if (!user) {
        setFavoritos([]);
        return;
      }

      const { data, error } = await supabase
        .from('favoritos')
        .select('animal_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao carregar favoritos:', error);
        setError(error.message);
        return;
      }

      setFavoritos(data.map(fav => fav.animal_id));
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFavoritos();

    // Inscrever-se para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        carregarFavoritos();
      } else if (event === 'SIGNED_OUT') {
        setFavoritos([]);
      }
    });

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const isFavorito = (animalId) => {
    return favoritos.includes(animalId);
  };

  const toggleFavorito = async (animalId) => {
    try {
      const user = supabase.auth.user();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const isFav = isFavorito(animalId);

      if (isFav) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('user_id', user.id)
          .eq('animal_id', animalId);

        if (error) throw error;
        setFavoritos(favoritos.filter(id => id !== animalId));
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('favoritos')
          .insert([
            {
              user_id: user.id,
              animal_id: animalId,
              created_at: new Date().toISOString()
            }
          ]);

        if (error) throw error;
        setFavoritos([...favoritos, animalId]);
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      throw error;
    }
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, loading, error, isFavorito, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};
