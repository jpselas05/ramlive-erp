// hooks/useImportacaoDuplicatas.js
import { useState } from 'react';
import { parseDuplicatasTXT, importarLoteDuplicatas } from '../api/endpoints';

export function useImportacaoDuplicatas() {
  const [arquivos, setArquivos] = useState([]);
  const [dadosParsed, setDadosParsed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 });

  /**
   * Parse múltiplos arquivos TXT de duplicatas
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
      const response = await parseDuplicatasTXT(arquivosTexto);

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
   * Importar duplicatas para o banco
   */
  async function importarDados(dados, opcoes = {}) {
    setLoading(true);

    try {
      // Pegar duplicatas válidas de todos os arquivos parseados
      const duplicatasValidas = dados
        .filter(d => !d.invalido && d.unidadeId && d.data && d.duplicatas)
        .flatMap(d => 
          d.duplicatas.map(dup => ({
            unidadeId: d.unidadeId,
            dataReferencia: d.data,
            codigoCliente: dup.codigoCliente,
            valorAReceber: dup.valorAReceber
          }))
        );

      if (duplicatasValidas.length === 0) {
        throw new Error('Nenhuma duplicata válida para importar');
      }

      const resultado = await importarLoteDuplicatas(duplicatasValidas, {
        validarDuplicados: true,
        ...opcoes
      });
      return resultado;

    } catch (error) {
      console.error('Erro ao importar duplicatas:', error);
      throw error;
    } finally {
      setLoading(false);
    }
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
   * Atualizar campo de um arquivo parseado
   */
  function atualizarDado(index, campo, valor) {
    setDadosParsed(prev => {
      const novos = [...prev];
      novos[index] = { ...novos[index], [campo]: valor };
      return novos;
    });
  }

  /**
   * Remover arquivo da lista
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
    removerDado
  };
}