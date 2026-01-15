// components/importacao/vendas/PreviewVendas.jsx
import { Check, X, AlertCircle, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function PreviewVendas({ dados, onRemover, onConfirmar, onLimpar }) {
  const dadosValidos = dados.filter(d => !d.invalido && d.unidadeId && d.data);
  const dadosInvalidos = dados.filter(d => d.invalido);
  const temDadosValidos = dadosValidos.length > 0;

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-sm">
            <strong className="text-emerald-400">{dadosValidos.length}</strong> válidos
          </span>
        </div>
        {dadosInvalidos.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">
              <strong className="text-red-400">{dadosInvalidos.length}</strong> inválidos
            </span>
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="overflow-auto max-h-[600px] rounded-xl border border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 sticky top-0">
            <tr>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-left">Arquivo</th>
              <th className="px-3 py-3 text-left">Unidade</th>
              <th className="px-3 py-3 text-left">Data</th>
              <th className="px-3 py-3 text-right">Total</th>
              <th className="px-3 py-3 text-right">Dinheiro</th>
              <th className="px-3 py-3 text-right">Pix</th>
              <th className="px-3 py-3 text-right">Cartão</th>
              <th className="px-3 py-3 text-right">Duplicata</th>
              <th className="px-3 py-3 text-right">Cheque</th>
              <th className="px-3 py-3 text-right">Pedidos</th>
              <th className="px-3 py-3 text-right">Peças</th>
              <th className="px-3 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((dado, index) => {
              const isInvalido = dado.invalido;
              const temAvisos = dado.avisos && dado.avisos.length > 0;

              return (
                <tr
                  key={index}
                  className={`border-t border-gray-700 ${
                    isInvalido ? 'bg-red-500/10' : temAvisos ? 'bg-yellow-500/10' : ''
                  }`}
                >
                  <td className="px-3 py-3">
                    {isInvalido ? (
                      <X size={16} className="text-red-400" />
                    ) : temAvisos ? (
                      <AlertCircle size={16} className="text-yellow-400" />
                    ) : (
                      <Check size={16} className="text-emerald-400" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-gray-400 text-xs max-w-[120px] truncate">
                    {dado.nomeArquivo || 'Manual'}
                  </td>
                  <td className="px-3 py-3 text-emerald-400 text-xs">
                    {dado.unidadeNome || '-'}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {dado.data ? formatDate(dado.data) : '-'}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">
                    {isInvalido ? '-' : (
                      <span className="text-emerald-400">
                        {formatCurrency(dado.faturamentoTotal || 0)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right text-xs">
                    {isInvalido ? '-' : formatCurrency(dado.valorDinheiro || 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-purple-400">
                    {isInvalido ? '-' : formatCurrency(dado.valorPix || 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-blue-400">
                    {isInvalido ? '-' : formatCurrency(dado.valorCartao || 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-amber-400">
                    {isInvalido ? '-' : formatCurrency(dado.valorDuplicata || 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-pink-400">
                    {isInvalido ? '-' : formatCurrency(dado.valorCheque || 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-xs">
                    {isInvalido ? '-' : (dado.totalPedidos || 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-xs">
                    {isInvalido ? '-' : (dado.totalPecas || 0)}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => onRemover(index)}
                      className="p-1 hover:bg-gray-700 rounded text-red-400 hover:text-red-300 mx-auto block"
                      title="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Erros/Avisos */}
      {dados.some(d => d.erro || (d.avisos && d.avisos.length > 0)) && (
        <div className="space-y-2">
          {dados.map((dado, index) => {
            if (!dado.erro && (!dado.avisos || dado.avisos.length === 0)) return null;

            return (
              <div
                key={index}
                className={`p-3 rounded-lg border text-sm ${
                  dado.erro
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                }`}
              >
                <p className="font-medium mb-1">{dado.nomeArquivo || 'Manual'}:</p>
                {dado.erro && <p>• {dado.erro}</p>}
                {dado.avisos?.map((aviso, i) => (
                  <p key={i}>• {aviso}</p>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          onClick={onLimpar}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Cancelar
        </button>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {dadosValidos.length} venda(s) pronta(s) para importar
          </div>
          <button
            onClick={onConfirmar}
            disabled={!temDadosValidos}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              temDadosValidos
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
  );
}