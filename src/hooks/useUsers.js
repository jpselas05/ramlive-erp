import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUserRole, deleteUser } from '../api/endpoints';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(); // Retorna { success, count, data }
      
      // ✅ EXTRAIR SÓ O ARRAY DATA
      setUsers(response.data || []); // ← AQUI ESTAVA O PROBLEMA
      
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.message || 'Erro ao carregar usuários');
      setUsers([]); // ✅ Garantir que sempre seja array
    } finally {
      setLoading(false);
    }
  };

  // Criar novo usuário
  const create = async (userData) => {
    try {
      const response = await createUser(userData);
      await fetchUsers();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      return { 
        success: false, 
        error: err.message || 'Erro ao criar usuário' 
      };
    }
  };

  // Atualizar role
  const updateRole = async (userId, role) => {
    try {
      const response = await updateUserRole(userId, role);
      await fetchUsers();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao atualizar role:', err);
      return { 
        success: false, 
        error: err.message || 'Erro ao atualizar role' 
      };
    }
  };

  // Deletar usuário
  const remove = async (userId) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      return { 
        success: false, 
        error: err.message || 'Erro ao deletar usuário' 
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
    createUser: create,
    updateUserRole: updateRole,
    deleteUser: remove
  };
}