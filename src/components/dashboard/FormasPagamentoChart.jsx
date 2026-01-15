import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

// Componente customizado do Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-1">{data.name}</p>
        <p className="text-emerald-400 text-sm">
          {formatCurrency(data.value)}
        </p>
        <p className="text-gray-400 text-xs">
          {data.percentage}% do total
        </p>
      </div>
    );
  }
  return null;
};

export default function FormasPagamentoChart({ formasPagamento }) {
  const temDados = formasPagamento.some(fp => fp.value > 0);

  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
      <h2 className="font-semibold mb-4">Formas de Pagamento</h2>

      {temDados ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={formasPagamento.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {formasPagamento
                  .filter(item => item.value > 0)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                  ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-2">
            {formasPagamento.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-gray-300">{cat.name}</span>
                </div>
                <span className="text-white font-medium">
                  {cat.value > 0 ? formatCurrency(cat.value) : '-'}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Nenhuma venda registrada
        </div>
      )}
    </div>
  );
}