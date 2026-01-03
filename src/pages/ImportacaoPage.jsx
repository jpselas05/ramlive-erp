import { useState } from 'react';
import Layout from '../components/layout/Layout';
import UploadZone from '../components/importacao/UploadZone';
import PreviewTable from '../components/importacao/PreviewTable';
import ImportProgress from '../components/importacao/ImportProgress';
import Notification from '../components/common/Notification';
import { useImportacao } from '../hooks/useImportacao';
import { Check, AlertCircle } from 'lucide-react';

export default function ImportacaoPage() {
  const {
    dadosParsed,
    loading,
    progresso,
    parseArquivos,
    importarDados,
    limpar,
    atualizarDado,
    removerDado
  } = useImportacao();

  const [notification, setNotification] = useState(null);

  const handleFilesSelected = async (files) => {
    try {
      const resultados = await parseArquivos(files);
      
      const validos = resultados.filter(r => !r.invalido).length;
      const invalidos = resultados.filter(r => r.invalido).length;
      
      if (validos > 0) {
        setNotification({
          type: 'success',
          message: `✅ ${validos} arquivo(s) processado(s) com sucesso${invalidos > 0 ? ` (${invalidos} com erro)` : ''}`
        });
      } else {
        setNotification({
          type: 'error',
          message: '❌ Nenhum arquivo válido encontrado'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Erro ao processar arquivos: ${error.message}`
      });
    }
  };

  const handleConfirmarImportacao = async () => {
    try {
      const resultado = await importarDados(dadosParsed);
      
      setNotification({
        type: 'success',
        message: `✅ ${resultado.importados} venda(s) importada(s) com sucesso!`
      });
      
      // Limpar após 2 segundos
      setTimeout(() => {
        limpar();
      }, 2000);
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Erro ao importar: ${error.message}`
      });
    }
  };

  const handleAtualizar = (index, updates) => {
    Object.keys(updates).forEach(campo => {
      atualizarDado(index, campo, updates[campo]);
    });
  };

  const dadosValidos = dadosParsed.filter(d => !d.invalido && d.unidadeId && d.data);
  const temDadosValidos = dadosValidos.length > 0;

  return (
    <Layout title="Importação de Dados" subtitle="Importe relatórios RAMLIVE em lote">
      {/* Notificação */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-medium text-blue-400 mb-1">Como funciona?</p>
            <ol className="text-gray-400 space-y-1 list-decimal list-inside">
              <li>Selecione ou arraste um ou mais arquivos TXT (relatórios RAMLIVE)</li>
              <li>O sistema detecta automaticamente: Unidade, Data, Valores e Formas de Pagamento</li>
              <li>Revise os dados na tabela de preview</li>
              <li>Confirme a importação para salvar no banco de dados</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      {dadosParsed.length === 0 && (
        <UploadZone
          onFilesSelected={handleFilesSelected}
          disabled={loading}
          loading={loading}
        />
      )}

      {/* Progress */}
      {loading && progresso.total > 0 && (
        <div className="mt-6">
          <ImportProgress
            atual={progresso.atual}
            total={progresso.total}
            mensagem="Processando arquivos..."
          />
        </div>
      )}

      {/* Preview */}
      {dadosParsed.length > 0 && !loading && (
        <div className="space-y-6">
          <PreviewTable
            dados={dadosParsed}
            onRemover={removerDado}
            onAtualizar={handleAtualizar}
          />

          {/* Ações */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={limpar}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">
                {dadosValidos.length} venda(s) pronta(s) para importar
              </div>
              <button
                onClick={handleConfirmarImportacao}
                disabled={!temDadosValidos || loading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  temDadosValidos && !loading
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Check size={20} />
                Confirmar Importação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {dadosParsed.length === 0 && !loading && (
        <div className="mt-12 text-center text-gray-500">
          <p>Nenhum arquivo carregado ainda</p>
        </div>
      )}
    </Layout>
  );
}