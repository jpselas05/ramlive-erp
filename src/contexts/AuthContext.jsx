// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { jwtDecode } from 'jwt-decode'; // import correto

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const extractRoleFromToken = (token) => {
    if (!token) return 'user';
    
    try {
      const decoded = jwtDecode(token);
      
      // Debug: ver o que tem no token
      
      // Tentar diferentes lugares onde o role pode estar
      const role = decoded.user_role || 
                   decoded.role || 
                   decoded.user_metadata?.role ||
                   decoded.app_metadata?.role ||
                   'user';
      
      
      return role;
    } catch (error) {
      console.error('❌ Erro ao decodificar token:', error);
      return 'user';
    }
  };

  const updateUser = (session) => {
    if (!session) {
      setUser(null);
      setAccessToken(null);
      setLoading(false);
      return;
    }

    const token = session.access_token;
    const role = extractRoleFromToken(token);

    const userData = {
      id: session.user.id,
      email: session.user.email,
      user_role: role, // role extraído do token
      user_metadata: session.user.user_metadata,
      created_at: session.user.created_at,
      last_sign_in_at: session.user.last_sign_in_at
    };


    setUser(userData);
    setAccessToken(token);
    
    // Salvar token no localStorage para o axios
    localStorage.setItem('token', token);
    
    setLoading(false);
  };

  useEffect(() => {
    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUser(session);
    });

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      updateUser(data.session);
      return data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
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

      updateUser(data.session);
      return data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    accessToken,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};