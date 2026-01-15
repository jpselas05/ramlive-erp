// components/importacao/vendas/ImportarVendas.jsx
import { useState } from 'react';
import { Upload, Plus, AlertCircle } from 'lucide-react';
import UploadZone from '../shared/UploadZone';
import ImportProgress from '../shared/ImportProgress';
import PreviewVendas from './PreviewVendas';
import VendaManualModal from './VendaManualModal';
import { useImportacaoVendas } from '../../../hooks/useImportacaoVendas';

export default function ImportarVendas({ onNotification }) {
  const [modalAberto, setModalAberto] = useState(false);
  const {
    dadosParsed,
    loading,
    progresso,
    parseArquivos,
    importarDados,
    limpar,
    adicionarDadoManual,
    removerDado
  } = useImportacaoVendas();

  const handleFilesSelected = async (files) => {
    try {
      const resultados = await parseArquivos(files);

      const validos = resultados.filter(r => !r.invalido).length;
      const invalidos = resultados.filter(r => r.invalido).length;

      if (validos > 0) {
        onNotification?.({
          type: 'success',
          message: `✅ ${validos} arquivo(s) processado(s)${invalidos > 0 ? ` (${invalidos} com erro)` : ''}`
        });
      } else {
        onNotification?.({
          type: 'error',
          message: '❌ Nenhum arquivo válido encontrado'
        });
      }
    } catch (error) {
      onNotification?.({
        type: 'error',
        message: `Erro ao processar arquivos: ${error.message}`
      });
    }
  };

  const handleManualSubmit = (dados) => {
    adicionarDadoManual(dados);
    setModalAberto(false);
    onNotification?.({
      type: 'success',
      message: '✅ Venda adicionada à lista de importação'
    });
  };

  const handleConfirmarImportacao = async () => {
    try {
      const resultado = await importarDados(dadosParsed);

      const { importadas, rejeitadas } = resultado;

      if (rejeitadas > 0) {
        onNotification?.({
          type: 'warning',
          message: `⚠️ ${importadas} venda(s) importada(s), ${rejeitadas} rejeitada(s)`
        });
      } else {
        onNotification?.({
          type: 'success',
          message: `✅ ${importadas} venda(s) importada(s) com sucesso!`
        });
      }

      setTimeout(() => limpar(), 200);

    } catch (error) {
      onNotification?.({
        type: 'error',
        message: `Erro ao importar: ${error.message}`
      });
    }
  };

  const temDados = dadosParsed.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Importar Vendas</h2>
          <p className="text-gray-400 text-sm">
            Importe arquivos TXT ou cadastre vendas manualmente
          </p>
        </div>

        {/* Botão Cadastro Manual */}
        <button
          onClick={() => setModalAberto(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Cadastro Manual
        </button>
      </div>

      {/* Info */}
      {!temDados && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="font-medium text-blue-400 mb-1">Como funciona?</p>
              <ol className="text-gray-400 space-y-1 list-decimal list-inside">
                <li>Selecione ou arraste arquivos TXT (relatórios RAMLIVE)</li>
                <li>O sistema detecta automaticamente: Unidade, Data, Valores</li>
                <li>Revise os dados na tabela de preview</li>
                <li>Confirme a importação para salvar no banco</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Upload Zone ou Botão Adicionar */}
      {!temDados ? (
        <UploadZone
          onFilesSelected={handleFilesSelected}
          disabled={loading}
          loading={loading}
        />
      ) : (
        <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 cursor-pointer w-fit transition-colors">
          <Upload size={18} />
          Adicionar Mais Arquivos
          <input
            type="file"
            multiple
            accept=".txt"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                handleFilesSelected(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
            className="hidden"
          />
        </label>
      )}

      {/* Progress */}
      {loading && progresso.total > 0 && (
        <ImportProgress
          atual={progresso.atual}
          total={progresso.total}
          mensagem="Processando arquivos..."
        />
      )}

      {/* Preview */}
      {temDados && !loading && (
        <PreviewVendas
          dados={dadosParsed}
          onRemover={removerDado}
          onConfirmar={handleConfirmarImportacao}
          onLimpar={limpar}
        />
      )}

      {/* Modal */}
      <VendaManualModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
}