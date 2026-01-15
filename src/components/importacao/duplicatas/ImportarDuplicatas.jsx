// components/importacao/duplicatas/ImportarDuplicatas.jsx
import { Upload, AlertCircle } from 'lucide-react';
import UploadZone from '../shared/UploadZone';
import ImportProgress from '../shared/ImportProgress';
import PreviewDuplicatas from './PreviewDuplicatas';
import { useImportacaoDuplicatas } from '../../../hooks/useImportacaoDuplicatas';

export default function ImportarDuplicatas({ onNotification }) {
  const {
    dadosParsed,
    loading,
    progresso,
    parseArquivos,
    importarDados,
    limpar,
    removerDado
  } = useImportacaoDuplicatas();

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

  const handleConfirmarImportacao = async () => {
    try {
      const resultado = await importarDados(dadosParsed);
      console
      const { importadas, rejeitadas } = resultado;

      if (rejeitadas > 0) {
        onNotification?.({
          type: 'warning',
          message: `⚠️ ${importadas} duplicata(s) importada(s), ${rejeitadas} rejeitada(s)`
        });
      } else {
        onNotification?.({
          type: 'success',
          message: `✅ ${importadas} duplicata(s) importada(s) com sucesso!`
        });
      }

      setTimeout(() => limpar(), 2000);

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
      <div>
        <h2 className="text-2xl font-bold">Importar Duplicatas a Receber</h2>
        <p className="text-gray-400 text-sm">
          Importe relatórios de Contas a Receber em formato TXT
        </p>
      </div>

      {/* Info */}
      {!temDados && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="font-medium text-blue-400 mb-1">Formato Esperado</p>
              <p className="text-gray-400">
                📄 Relatório "Contas a Receber" do sistema RAMLIVE contendo código do cliente e valor a receber.
                Cada arquivo deve conter duplicatas de um único dia.
              </p>
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
        <PreviewDuplicatas
          dados={dadosParsed}
          onRemover={removerDado}
          onConfirmar={handleConfirmarImportacao}
          onLimpar={limpar}
        />
      )}
    </div>
  );
}