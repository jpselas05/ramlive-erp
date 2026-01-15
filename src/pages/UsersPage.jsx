// pages/UsersPage.jsx
import { useState } from 'react';
import { UserPlus, Search, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useUsers } from '../hooks/useUsers';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { ROLES } from '../utils/constants';
import { formatRoleLabel } from '../utils/formatters';

export default function UsersPage() {
  const { users, loading, error, refetch, createUser, updateUserRole, deleteUser } = useUsers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Filtrar usuários
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Resetar formulário
  const resetForm = () => {
    setFormData({ email: '', password: '', role: 'user' });
    setFormError(null);
    setShowAddModal(false);
  };

  // Adicionar usuário
  const handleAddUser = async () => {
    if (!formData.email || !formData.password) {
      setFormError('Email e senha são obrigatórios');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setFormError(null);
    setFormLoading(true);

    const result = await createUser(formData);
    
    setFormLoading(false);
    
    if (result.success) {
      setSuccessMessage('Usuário criado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      resetForm();
    } else {
      setFormError(result.error);
    }
  };

  // Atualizar role
  const handleUpdateRole = async (userId, newRole) => {
    const result = await updateUserRole(userId, newRole);
    
    if (result.success) {
      setSuccessMessage('Role atualizada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setEditingUserId(null);
    } else {
      alert(result.error);
    }
  };

  // Deletar usuário
  const handleDeleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    
    setDeletingUserId(userId);
    const result = await deleteUser(userId);
    setDeletingUserId(null);
    
    if (result.success) {
      setSuccessMessage('Usuário deletado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert(result.error);
    }
  };

  // Obter cor da role
  const getRoleColor = (role) => {
    return ROLES.find(r => r.value === role)?.color || 'bg-gray-500';
  };


  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error && !users.length) {
    return (
      <Layout title="Gerenciamento de Usuários">
        <ErrorMessage message={error} onRetry={refetch} />
      </Layout>
    );
  }

  return (
    <Layout 
      title="Gerenciamento de Usuários"
      subtitle={`${users.length} usuário${users.length !== 1 ? 's' : ''} cadastrado${users.length !== 1 ? 's' : ''}`}
    >
      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="mb-6 bg-emerald-900/50 border border-emerald-700 rounded-xl p-4 flex items-center gap-3">
          <Check className="text-emerald-400" size={20} />
          <p className="text-emerald-300">{successMessage}</p>
        </div>
      )}

      {/* Barra de ações */}
      <div className="flex gap-4 mb-6">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por email ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-12 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Botão adicionar */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
        >
          <UserPlus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Tabela de usuários */}
      {loading ? (
        <Loading message="Carregando usuários..." />
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Cargo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Criado em</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Último login</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">{user.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingUserId === user.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm"
                            >
                              {ROLES.map(role => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleUpdateRole(user.id, formData.role)}
                              className="p-1 bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="p-1 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className={`${getRoleColor(user.role)} px-3 py-1 rounded-lg text-xs font-medium text-white`}>
                            {formatRoleLabel(user.role)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(user.last_sign_in_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setFormData({ ...formData, role: user.role });
                            }}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Editar role"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deletingUserId === user.id}
                            className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                            title="Deletar usuário"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Adicionar Usuário */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Novo Usuário</h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-red-300 text-sm">{formError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="usuario@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Cargo *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {ROLES.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={formLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}