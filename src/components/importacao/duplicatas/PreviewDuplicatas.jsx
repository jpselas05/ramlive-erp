// components/importacao/duplicatas/PreviewDuplicatas.jsx
import { Check, X, AlertCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useState } from 'react';

export default function PreviewDuplicatas({ dados, onRemover, onConfirmar, onLimpar }) {
  const [expandidos, setExpandidos] = useState({});

  const dadosValidos = dados.filter(d => !d.invalido && d.unidadeId && d.data);
  const dadosInvalidos = dados.filter(d => d.invalido);
  const temDadosValidos = dadosValidos.length > 0;

  // Calcular totais
  const totalDuplicatas = dadosValidos.reduce((acc, d) => acc + (d.duplicatas?.length || 0), 0);
  const totalValor = dadosValidos.reduce((acc, d) => 
    acc + (d.duplicatas?.reduce((sum, dup) => sum + dup.valorAReceber, 0) || 0), 
  0);

  const toggleExpandir = (index) => {
    setExpandidos(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Arquivos</p>
          <p className="text-2xl font-bold">{dados.length}</p>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <p className="text-sm text-emerald-400 mb-1">Válidos</p>
          <p className="text-2xl font-bold text-emerald-400">{dadosValidos.length}</p>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-sm text-blue-400 mb-1">Total Duplicatas</p>
          <p className="text-2xl font-bold text-blue-400">{totalDuplicatas}</p>
        </div>
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <p className="text-sm text-purple-400 mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-purple-400">{formatCurrency(totalValor)}</p>
        </div>
      </div>

      {/* Lista de Arquivos */}
      <div className="space-y-2">
        {dados.map((dado, index) => {
          const isInvalido = dado.invalido;
          const temAvisos = dado.avisos && dado.avisos.length > 0;
          const isExpandido = expandidos[index];
          const qtdDuplicatas = dado.duplicatas?.length || 0;
          const valorTotal = dado.duplicatas?.reduce((sum, d) => sum + d.valorAReceber, 0) || 0;

          return (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden ${
                isInvalido ? 'bg-red-500/10 border-red-500/30' : 
                temAvisos ? 'bg-yellow-500/10 border-yellow-500/30' : 
                'border-gray-700'
              }`}
            >
              {/* Header do Arquivo */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => !isInvalido && toggleExpandir(index)}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Status */}
                  <div>
                    {isInvalido ? (
                      <X size={20} className="text-red-400" />
                    ) : temAvisos ? (
                      <AlertCircle size={20} className="text-yellow-400" />
                    ) : (
                      <Check size={20} className="text-emerald-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium">{dado.nomeArquivo || 'Arquivo'}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>{dado.unidadeNome || 'Unidade não identificada'}</span>
                      <span>•</span>
                      <span>{dado.data ? formatDate(dado.data) : 'Data não identificada'}</span>
                      {!isInvalido && (
                        <>
                          <span>•</span>
                          <span className="text-blue-400">{qtdDuplicatas} duplicata(s)</span>
                          <span>•</span>
                          <span className="text-purple-400">{formatCurrency(valorTotal)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expandir */}
                  {!isInvalido && qtdDuplicatas > 0 && (
                    <div>
                      {isExpandido ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  )}

                  {/* Remover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemover(index);
                    }}
                    className="p-2 hover:bg-gray-700 rounded text-red-400 hover:text-red-300"
                    title="Remover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Lista de Duplicatas (Expandido) */}
              {isExpandido && dado.duplicatas && (
                <div className="border-t border-gray-700 bg-gray-800/30">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left">Código Cliente</th>
                        <th className="px-4 py-2 text-right">Valor a Receber</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dado.duplicatas.map((dup, i) => (
                        <tr key={i} className="border-t border-gray-700/50">
                          <td className="px-4 py-2 font-mono text-xs">{dup.codigoCliente}</td>
                          <td className="px-4 py-2 text-right font-medium text-emerald-400">
                            {formatCurrency(dup.valorAReceber)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Erros/Avisos */}
              {(dado.erro || temAvisos) && (
                <div className="border-t border-gray-700 p-3 text-sm">
                  {dado.erro && <p className="text-red-400">• {dado.erro}</p>}
                  {dado.avisos?.map((aviso, i) => (
                    <p key={i} className="text-yellow-400">• {aviso}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
            {totalDuplicatas} duplicata(s) pronta(s) para importar
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