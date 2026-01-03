import api from '../lib/api';

// ============================================
// UNIDADES
// ============================================
export const getUnidades = async () => {
  return api.get('/unidades');
};

export const getUnidadePorId = async (id) => {
  return api.get(`/unidades/${id}`);
};

// ============================================
// VENDAS
// ============================================
export const getVendasMes = async (unidadeId, ano, mes) => {
  return api.get(`/vendas/${unidadeId}/${ano}/${mes}`);
};

// NOVO: Parse TXT (sem inserir no banco)
export const parseTXT = async (arquivoTXT) => {
  return api.post('/vendas/parse-txt', {
    arquivo: arquivoTXT,
  });
};

// NOVO: Importar múltiplas vendas em lote
export const importarLote = async (vendas, opcoes = {}) => {
  return api.post('/vendas/importar-lote', {
    vendas,
    opcoes,
  });
};

// Método antigo (compatibilidade)
export const importarVenda = async (arquivoTXT) => {
  return api.post('/vendas/importar', {
    arquivo: arquivoTXT,
  });
};

export const atualizarVenda = async (id, dados) => {
  return api.put(`/vendas/${id}`, dados);
};

export const deletarVenda = async (id) => {
  return api.delete(`/vendas/${id}`);
};

// ============================================
// DASHBOARD
// ============================================
export const getDashboard = async (unidadeId, ano, mes) => {
  return api.get(`/dashboard/${unidadeId}/${ano}/${mes}`);
};

export const getResumoAnual = async (unidadeId, ano) => {
  return api.get(`/dashboard/resumo/${unidadeId}/${ano}`);
};

// ============================================
// METAS
// ============================================
export const getMeta = async (unidadeId, ano, mes) => {
  return api.get(`/metas/${unidadeId}/${ano}/${mes}`);
};

export const definirMeta = async (unidadeId, ano, mes, valorMeta) => {
  return api.post('/metas', {
    unidadeId,
    ano,
    mes,
    valorMeta,
  });
};

// ============================================
// AUTENTICAÇÃO (se precisar chamar do backend)
// ============================================
export const getCurrentUser = async () => {
  return api.get('/auth/me');
};