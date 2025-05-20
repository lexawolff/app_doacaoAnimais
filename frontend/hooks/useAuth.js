import { useState, useEffect, useRef } from 'react';
import supabase from '../lib/supabase';
import { Platform } from 'react-native';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Verificar sessão atual
    const checkUser = async () => {
      try {
        const user = supabase.auth.user();

        if (!mounted.current) return;

        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (!mounted.current) return;
        console.error('useAuth - Erro ao verificar usuário:', error);
        setError(error.message);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    checkUser();

    // Monitorar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted.current) return;
      
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted.current = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, senha) => {
    try {
      // Verifica se o usuário existe
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        console.log('useAuth - Erro ao verificar usuário:', userError);
      }

      // Tenta fazer login
      const { data, error } = await supabase.auth.signIn({
        email,
        password: senha
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Email ou senha incorretos. Por favor, verifique suas credenciais.');
        }
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        return { user: data.user };
      } else {
        throw new Error('Usuário não encontrado na resposta');
      }
    } catch (error) {
      console.error('useAuth - Erro no login:', error);
      setError(error.message);
      throw error;
    }
  };

  const cadastro = async (email, senha, nome, dataNascimento, nomeUsuario) => {
    try {
      console.log('Iniciando cadastro...');
      const { user, error } = await supabase.auth.signUp({
        email,
        password: senha
      });

      console.log('Resposta completa do signUp:', { user, error });

      if (error) {
        console.error('Erro no signUp:', error);
        if (error.status === 429) {
          throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente.');
        }
        throw error;
      }

      if (!user) {
        console.error('Dados do usuário não encontrados:', user);
        throw new Error('Erro ao criar usuário');
      }

      console.log('Usuário criado com sucesso:', user);

      // Salva dados extras no perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id_user: user.id,
            nome: nome,
            nome_usuario: nomeUsuario,
            data_nascimento: dataNascimento,
            email: email,
            email_confirmed: false,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw profileError;
      }

      console.log('Perfil criado com sucesso');
      return { user };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('useAuth - Erro no logout:', error);
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);

      if (error) {
        console.error('useAuth - Erro ao enviar email de redefinição:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('useAuth - Erro na redefinição de senha:', error);
      setError(error.message);
      throw error;
    }
  };

  return { user, loading, error, login, cadastro, logout, resetPassword };
}
