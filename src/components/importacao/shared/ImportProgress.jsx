import { Loader2 } from 'lucide-react';

export default function ImportProgress({ atual, total, mensagem }) {
  const percentual = total > 0 ? (atual / total) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
        <div>
          <p className="font-medium">{mensagem || 'Processando...'}</p>
          <p className="text-sm text-gray-400">
            {atual} de {total} arquivos
          </p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          style={{ width: `${percentual}%` }}
        />
      </div>

      {/* Percentual */}
      <p className="text-right text-sm text-gray-400 mt-2">
        {percentual.toFixed(0)}%
      </p>
    </div>
  );
}