// components/RequireRole.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './common/Loading';

export default function RequireRole({ children, roles = [] }) {
  const { user, loading } = useAuth();


  // Aguardar carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading message="Verificando permissões..." />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const hasPermission = roles.includes(user.user_role);

  if (!hasPermission) return <Navigate to="/" replace />;;

  return children;
}