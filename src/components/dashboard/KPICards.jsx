import { DollarSign, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function KPICards({ resumo, meta, progressoMeta }) {
  const cards = [
    {
      label: 'Faturamento Mês',
      value: formatCurrency(resumo.totalMes),
      icon: DollarSign,
      change: `${resumo.diasTrabalhados} dias`,
      up: true,
      color: 'emerald'
    },
    {
      label: 'Média Diária',
      value: formatCurrency(resumo.mediaDia),
      icon: TrendingUp,
      change: 'Por dia útil',
      up: true,
      color: 'blue'
    },
    {
      label: 'Melhor Dia',
      value: formatCurrency(resumo.melhorDia),
      icon: Calendar,
      change: 'Pico de vendas',
      up: true,
      color: 'amber'
    },
    {
      label: 'Faltam',
      value: meta > 0 ? formatCurrency(Math.max(0, meta - resumo.totalMes)) : 'Sem meta',
      icon: TrendingUp,
      change: meta > 0 ? `${progressoMeta.toFixed(1)}% atingido` : 'Sem meta',
      up: false,
      color: 'purple'
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-xl bg-${card.color}-500/20`}>
              <card.icon size={20} className={`text-${card.color}-400`} />
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                card.up ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {card.up && <ArrowUpRight size={12} />}
              {card.change}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{card.label}</p>
          <p className="text-2xl font-bold mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}