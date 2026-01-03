// hooks/useUsers.js
import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      setUsers(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.response?.data?.error || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo usuário
  const createUser = async (userData) => {
    try {
      const response = await api.post('/users', userData);
      await fetchUsers(); // Recarregar lista
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao criar usuário' 
      };
    }
  };

  // Atualizar role do usuário
  const updateUserRole = async (userId, role) => {
    try {
      const response = await api.patch(`/users/${userId}/role`, { role });
      await fetchUsers(); // Recarregar lista
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Erro ao atualizar role:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao atualizar role' 
      };
    }
  };

  // Deletar usuário
  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      await fetchUsers(); // Recarregar lista
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao deletar usuário' 
      };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUserRole,
    deleteUser
  };
}