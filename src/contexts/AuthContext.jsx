// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Função para extrair role do JWT
  const extractRoleFromToken = (token) => {
    if (!token) return 'user';

    try {
      const decoded = jwtDecode(token);

      // Verificar se token expirou
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('⚠️ Token expirado');
        return null;
      }

      // O Supabase coloca custom claims diretamente no JWT
      return decoded.user_role || decoded.role || 'user';
    } catch (error) {
      console.error('❌ Erro ao decodificar token:', error);
      return null;
    }
  };

  // ✅ Função para verificar expiração do token
  const isTokenExpired = (session) => {
    if (!session?.expires_at) return true;
    
    // expires_at está em segundos, Date.now() em milissegundos
    const expiresAt = session.expires_at * 1000;
    const now = Date.now();
    
    // Adicionar margem de 60 segundos
    return expiresAt - now < 60000;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateUser = (session) => {
    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }

    const token = session.access_token;
    const role = extractRoleFromToken(token);

    // ✅ Se role for null (token inválido/expirado), fazer logout
    if (!role) {
      console.warn('⚠️ Token inválido, fazendo logout...');
      signOut();
      return;
    }

    const userData = {
      id: session.user.id,
      email: session.user.email,
      user_role: role,
      user_metadata: session.user.user_metadata,
      created_at: session.user.created_at,
      last_sign_in_at: session.user.last_sign_in_at,
      expires_at: session.expires_at
    };

    setUser(userData);
    setLoading(false);
  };

  useEffect(() => {
    // ✅ Buscar sessão inicial
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Verificar se token está expirado
      if (session && isTokenExpired(session)) {
        console.warn('⚠️ Token expirado na inicialização, fazendo logout...');
        await signOut();
        return;
      }
      
      updateUser(session);
    };

    initializeAuth();

    // ✅ Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        // Se for TOKEN_REFRESHED ou SIGNED_IN, verificar expiração
        if (session && isTokenExpired(session)) {
          console.warn('⚠️ Token expirado, fazendo logout...');
          await signOut();
          return;
        }

        // Eventos que devem fazer logout
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setUser(null);
          return;
        }

        updateUser(session);
      }
    );

    // ✅ Verificar expiração a cada 30 segundos
    const expirationCheckInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && isTokenExpired(session)) {
        console.warn('⚠️ Token expirou (verificação periódica), fazendo logout...');
        await signOut();
      }
    }, 30000); // A cada 30 segundos

    return () => {
      subscription.unsubscribe();
      clearInterval(expirationCheckInterval);
    };
  }, []);

const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Traduzir e melhorar mensagens de erro do Supabase
        let mensagemErro = 'Erro ao fazer login';

        switch (error.message) {
          case 'Invalid login credentials':
            mensagemErro = 'E-mail ou senha incorretos';
            break;
          case 'Email not confirmed':
            mensagemErro = 'E-mail não confirmado. Verifique sua caixa de entrada';
            break;
          case 'User not found':
            mensagemErro = 'Usuário não encontrado';
            break;
          case 'Too many requests':
            mensagemErro = 'Muitas tentativas. Aguarde alguns minutos';
            break;
          case 'Email rate limit exceeded':
            mensagemErro = 'Limite de tentativas excedido. Tente novamente mais tarde';
            break;
          default:
            // Verificar se contém palavras-chave específicas
            if (error.message.includes('password')) {
              mensagemErro = 'Senha incorreta';
            } else if (error.message.includes('email')) {
              mensagemErro = 'E-mail inválido ou não cadastrado';
            } else if (error.message.includes('network')) {
              mensagemErro = 'Erro de conexão. Verifique sua internet';
            } else {
              mensagemErro = error.message;
            }
        }

        const erro = new Error(mensagemErro);
        erro.code = error.status;
        erro.originalError = error;
        throw erro;
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  };

  const recuperarSenha = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/ramlive-erp/redefinir-senha`
      });

      if (error) throw error;
      return { message: 'Email enviado com sucesso' };
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      throw error;
    }
  };

  const redefinirSenha = async (novaSenha) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: novaSenha
      });

      if (error) throw error;
      return { message: 'Senha redefinida com sucesso' };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    recuperarSenha,
    redefinirSenha
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};