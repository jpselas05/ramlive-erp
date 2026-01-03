import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
                paddingAngle={2}
              >
                {formasPagamento
                  .filter(item => item.value > 0)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
              </Pie>
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
                  {cat.value > 0 ? `${cat.percentage}%` : '-'}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Sem dados disponíveis
        </div>
      )}
    </div>
  );
}