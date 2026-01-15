import api from './api';

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
export const parseTXTMultiplos = async (arquivos) => {
  return api.post('/vendas/parse-txt-multiplos', {
    arquivos, // Array de { nome: string, conteudo: string }
  });
};

// NOVO: Importar múltiplas vendas em lote
export const importarLoteVendas = async (vendas, opcoes = {}) => {
  return api.post('/vendas/importar-lote', {
    vendas,
    opcoes,
  });
};

// ============================================
// DUPLICATAS
// ============================================
export const getDuplicatasMes = async (unidadeId, ano, mes) => {
  return api.get(`/duplicatas/${unidadeId}/${ano}/${mes}`);
};

export const getDuplicatasPorData = async (unidadeId, data) => {
  return api.get(`/duplicatas/${unidadeId}/${data}`);
};

export const getResumoMesDuplicatas = async (unidadeId, ano, mes) => {
  return api.get(`/duplicatas/${unidadeId}/${ano}/${mes}/resumo`);
};

export const parseDuplicatasTXT = async (arquivos) => {
  return api.post('/duplicatas/parse-txt-multiplos', {
    arquivos, // Array de { nome: string, conteudo: string }
  });
};

export const importarLoteDuplicatas = async (duplicatas, opcoes = {}) => {
  return api.post('/duplicatas/importar-lote', {
    duplicatas,
    opcoes,
  });
};

export const deletarDuplicatasPorData = async (unidadeId, data) => {
  return api.delete(`/duplicatas/${unidadeId}/${data}`);
};

export const deletarDuplicata = async (id) => {
  return api.delete(`/duplicatas/${id}`);
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

// ============================================
// USUÁRIOS
// ============================================
export const getUsers = async () => {
  return api.get('/users');
};

export const getUserById = async (id) => {
  return api.get(`/users/${id}`);
};

export const createUser = async (userData) => {
  return api.post('/users', userData);
};

export const updateUserRole = async (userId, role) => {
  return api.patch(`/users/${userId}/role`, { role });
};

export const deleteUser = async (userId) => {
  return api.delete(`/users/${userId}`);
};