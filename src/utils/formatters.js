import { MESES, MESES_COMPLETOS } from './constants';
import { ROLES } from '../utils/constants';

export const formatCurrency = (value) => {
    const amount = typeof value === 'string' ? parseFloat(value) : value;

    return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

export const formatK = (value) => {
    return `${(value / 1000).toFixed(0)}k`;
};

export const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';

    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
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