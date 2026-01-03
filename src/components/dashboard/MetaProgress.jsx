import { formatCurrency, formatPercent, MESES_COMPLETOS } from '../../utils/formatters';

export default function MetaProgress({ mes, meta, totalMes, progressoMeta }) {
  return (
    <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl p-5 border border-emerald-500/30 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            Progresso da Meta de {MESES_COMPLETOS[mes]}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Meta: {meta > 0 ? formatCurrency(meta) : 'Não definida'} | Atual: {formatCurrency(totalMes)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-emerald-400">
            {formatPercent(progressoMeta)}
          </p>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progressoMeta, 100)}%` }}
        />
      </div>
    </div>
  );
}