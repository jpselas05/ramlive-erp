import { Check, X, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { UNIDADES } from '../../utils/constants';

export default function PreviewTable({ dados, onRemover, onAtualizar }) {
  const dadosValidos = dados.filter(d => !d.invalido);
  const dadosInvalidos = dados.filter(d => d.invalido);

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
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Arquivo</th>
              <th className="px-4 py-3 text-left">Unidade</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-right">Faturamento</th>
              <th className="px-4 py-3 text-right">Pedidos</th>
              <th className="px-4 py-3 text-right">Peças</th>
              <th className="px-4 py-3 text-center">Ações</th>
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
                  {/* Status */}
                  <td className="px-4 py-3">
                    {isInvalido ? (
                      <div className="flex items-center gap-2 text-red-400">
                        <X size={16} />
                        <span className="text-xs">Erro</span>
                      </div>
                    ) : temAvisos ? (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertCircle size={16} />
                        <span className="text-xs">Aviso</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Check size={16} />
                        <span className="text-xs">OK</span>
                      </div>
                    )}
                  </td>

                  {/* Arquivo */}
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {dado.nomeArquivo}
                  </td>

                  {/* Unidade */}
                  <td className="px-4 py-3">
                    {dado.unidadeId ? (
                      <span className="text-emerald-400">{dado.unidadeNome}</span>
                    ) : (
                      <select
                        value={dado.unidadeId || ''}
                        onChange={(e) => {
                          const unidadeId = parseInt(e.target.value);
                          const unidade = UNIDADES.find(u => u.id === unidadeId);
                          onAtualizar(index, {
                            unidadeId,
                            unidadeNome: unidade?.nome,
                            unidadeCodigo: unidade?.codigo
                          });
                        }}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Selecione...</option>
                        {UNIDADES.map(u => (
                          <option key={u.id} value={u.id}>{u.nome}</option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* Data */}
                  <td className="px-4 py-3">
                    {dado.data ? (
                      formatDate(dado.data)
                    ) : (
                      <span className="text-red-400 text-xs">Não detectada</span>
                    )}
                  </td>

                  {/* Faturamento */}
                  <td className="px-4 py-3 text-right">
                    {isInvalido ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span className="text-emerald-400">
                        {formatCurrency(dado.faturamentoTotal || 0)}
                      </span>
                    )}
                  </td>

                  {/* Pedidos */}
                  <td className="px-4 py-3 text-right">
                    {isInvalido ? '-' : (dado.totalPedidos || 0)}
                  </td>

                  {/* Peças */}
                  <td className="px-4 py-3 text-right">
                    {isInvalido ? '-' : (dado.totalPecas || 0)}
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onRemover(index)}
                        className="p-1 hover:bg-gray-700 rounded text-red-400 hover:text-red-300"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detalhes de erros/avisos */}
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
                <p className="font-medium mb-1">{dado.nomeArquivo}:</p>
                {dado.erro && <p>• {dado.erro}</p>}
                {dado.avisos?.map((aviso, i) => (
                  <p key={i}>• {aviso}</p>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Detalhamento de pagamentos (primeiro arquivo válido) */}
      {dadosValidos.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="font-medium mb-3">Detalhamento do Pagamento (exemplo):</h3>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Dinheiro</p>
              <p className="text-sm font-medium text-emerald-400">
                {formatCurrency(dadosValidos[0].valorDinheiro || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Pix</p>
              <p className="text-sm font-medium text-purple-400">
                {formatCurrency(dadosValidos[0].valorPix || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Cartão</p>
              <p className="text-sm font-medium text-blue-400">
                {formatCurrency(dadosValidos[0].valorCartao || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Duplicata</p>
              <p className="text-sm font-medium text-amber-400">
                {formatCurrency(dadosValidos[0].valorDuplicata || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Cheque</p>
              <p className="text-sm font-medium text-pink-400">
                {formatCurrency(dadosValidos[0].valorCheque || 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}