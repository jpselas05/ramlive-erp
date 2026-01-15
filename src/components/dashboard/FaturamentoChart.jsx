import { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { formatCurrency, formatK, MESES_COMPLETOS } from '../../utils/formatters';
import DiaDetalheModal from './DiaDetalheModal';

export default function FaturamentoChart({ data, mes, ano, unidade }) {
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const diaData = data.find(d => d.dia === label);

      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">Dia {label}</p>
          {diaData?.temVenda ? (
            <>
              {payload.map((entry, index) => (
                <p
                  key={index}
                  style={{
                    color: entry.name === 'Faturamento' ? '#ffffff' : entry.color
                  }}
                  className="text-sm"
                >
                  {entry.name}: {formatCurrency(entry.value)}
                </p>
              ))}
              <p className="text-xs text-gray-400 mt-2 italic">Clique para ver detalhes</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Sem vendas neste dia</p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (data && data.dia) {
      const diaData = data;
      setDiaSelecionado(diaData);
    }
  };

  return (
    <>
      <div className="col-span-2 bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Faturamento Diário</h2>
          <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
            {MESES_COMPLETOS[mes]} {ano}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="dia"
              stroke="#9CA3AF"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tickFormatter={formatK}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="faturamento"
              name="Faturamento"
              fill="url(#barGrad)"
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              cursor="pointer"
            />
            <Line
              type="monotone"
              dataKey="media"
              name="Média"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Modal */}
      {diaSelecionado && (
        <DiaDetalheModal
          dia={diaSelecionado.dia}
          dados={diaSelecionado.dados}
          mes={mes}
          ano={ano}
          unidade={unidade}
          onClose={() => setDiaSelecionado(null)}
        />
      )}
    </>
  );
}