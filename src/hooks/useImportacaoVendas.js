// hooks/useImportacaoVendas.js
import { useState } from 'react';
import { parseTXTMultiplos, importarLoteVendas } from '../api/endpoints';

export function useImportacaoVendas() {
  const [arquivos, setArquivos] = useState([]);
  const [dadosParsed, setDadosParsed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 });

  /**
   * Parse múltiplos arquivos TXT de vendas
   */
  async function parseArquivos(files) {
    setLoading(true);
    setProgresso({ atual: 0, total: files.length });

    try {
      // Ler todos os arquivos
      const arquivosTexto = await Promise.all(
        Array.from(files).map(async (file) => ({
          nome: file.name,
          conteudo: await file.text()
        }))
      );

      // Enviar todos de uma vez
      const response = await parseTXTMultiplos(arquivosTexto);

      const { resultados, total, processados, erros } = response;

      setDadosParsed(prev => [...prev, ...resultados]);
      setArquivos(prev => [...prev, ...Array.from(files)]);

      console.log(`✅ ${processados}/${total} arquivos processados`);
      if (erros > 0) {
        console.warn(`⚠️ ${erros} arquivos com erro`);
      }

      return resultados;

    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Importar vendas para o banco
   */
  async function importarDados(dados, opcoes = {}) {
    setLoading(true);

    try {
      const vendasValidas = dados.filter(d =>
        !d.invalido && d.unidadeId && d.data
      );

      if (vendasValidas.length === 0) {
        throw new Error('Nenhuma venda válida para importar');
      }

      const resultado = await importarLoteVendas(vendasValidas, {
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

  /**
   * Adicionar venda manual à lista
   */
  function adicionarDadoManual(dados) {
    setDadosParsed(prev => [...prev, dados]);
  }

  /**
   * Limpar tudo
   */
  function limpar() {
    setArquivos([]);
    setDadosParsed([]);
    setProgresso({ atual: 0, total: 0 });
  }

  /**
   * Atualizar campo de uma venda
   */
  function atualizarDado(index, campo, valor) {
    setDadosParsed(prev => {
      const novos = [...prev];
      novos[index] = { ...novos[index], [campo]: valor };
      return novos;
    });
  }

  /**
   * Remover venda da lista
   */
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
    removerDado,
    adicionarDadoManual
  };
}