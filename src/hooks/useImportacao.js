import { useState } from 'react';
import { parseTXT, importarLote } from '../lib/endpoints';
import { UNIDADES } from '../utils/constants';

export function useImportacao() {
  const [arquivos, setArquivos] = useState([]);
  const [dadosParsed, setDadosParsed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 });

  // Parse múltiplos arquivos
  async function parseArquivos(files) {
    setLoading(true);
    setProgresso({ atual: 0, total: files.length });
    
    const resultados = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const texto = await files[i].text();
        const response = await parseTXT(texto);
        
        // Response já vem direto do axios interceptor (response.data)
        const dados = response.dados;
        
        // Adicionar nome do arquivo
        dados.nomeArquivo = files[i].name;
        
        // Se não detectou unidade, tentar pelo nome do arquivo
        if (!dados.unidadeId) {
          const unidadeDetectada = detectarUnidadePorNome(files[i].name);
          if (unidadeDetectada) {
            dados.unidadeId = unidadeDetectada.id;
            dados.unidadeNome = unidadeDetectada.nome;
            dados.unidadeCodigo = unidadeDetectada.codigo;
          }
        }
        
        resultados.push(dados);
        setProgresso({ atual: i + 1, total: files.length });
        
      } catch (error) {
        console.error(`Erro ao processar ${files[i].name}:`, error);
        resultados.push({
          nomeArquivo: files[i].name,
          erro: error.message,
          invalido: true
        });
      }
    }
    
    setDadosParsed(resultados);
    setArquivos(Array.from(files));
    setLoading(false);
    
    return resultados;
  }

  // Importar para o banco
  async function importarDados(dados, opcoes = {}) {
    setLoading(true);
    
    try {
      // Filtrar apenas dados válidos
      const vendasValidas = dados.filter(d => 
        !d.invalido && d.unidadeId && d.data
      );
      
      if (vendasValidas.length === 0) {
        throw new Error('Nenhuma venda válida para importar');
      }
      
      // Remover campos desnecessários antes de enviar
      const vendasLimpas = vendasValidas.map(v => ({
        unidadeId: v.unidadeId,
        data: v.data,
        faturamentoTotal: v.faturamentoTotal,
        totalPedidos: v.totalPedidos,
        totalPecas: v.totalPecas,
        valorDinheiro: v.valorDinheiro,
        valorPix: v.valorPix,
        valorCartao: v.valorCartao,
        valorDuplicata: v.valorDuplicata,
        valorCheque: v.valorCheque,
        diaOperacional: v.diaOperacional ?? true
      }));
      
      const resultado = await importarLote(vendasLimpas, {
        permitirParcial: true,
        validarDuplicados: true,
        ...opcoes
      });
      
      return resultado;
      
    } catch (error) {
      console.error('Erro ao importar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function limpar() {
    setArquivos([]);
    setDadosParsed([]);
    setProgresso({ atual: 0, total: 0 });
  }

  function atualizarDado(index, campo, valor) {
    setDadosParsed(prev => {
      const novos = [...prev];
      novos[index] = { ...novos[index], [campo]: valor };
      return novos;
    });
  }

  function removerDado(index) {
    setDadosParsed(prev => prev.filter((_, i) => i !== index));
    setArquivos(prev => prev.filter((_, i) => i !== index));
  }

  return {
    arquivos,
    dadosParsed,
    loading,
    progresso,
    parseArquivos,
    importarDados,
    limpar,
    atualizarDado,
    removerDado
  };
}

// Helper para detectar unidade pelo nome do arquivo
function detectarUnidadePorNome(filename) {
  const upper = filename.toUpperCase();
  
  for (const unidade of UNIDADES) {
    const aliases = [
      unidade.codigo.toUpperCase(), 
      unidade.nome.toUpperCase(),
      unidade.nome.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
    ];
    
    for (const alias of aliases) {
      if (upper.includes(alias)) {
        return unidade;
      }
    }
  }
  
  return null;
}