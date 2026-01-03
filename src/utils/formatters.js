import { MESES, MESES_COMPLETOS } from './constants';
import { ROLES } from '../utils/constants';

export const formatCurrency = (value) => {
    return `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatK = (value) => {
    return `${(value / 1000).toFixed(0)}k`;
};

export const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

export const formatRoleLabel = (role) => {
    return ROLES.find(r => r.value === role)?.label || role;
}

export const formatUserName = (email) => {
  if (!email) return 'Usuário';
  const namePart = email.split('@')[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
};

// Re-exportar constantes para facilitar imports
export { MESES, MESES_COMPLETOS, ROLES };