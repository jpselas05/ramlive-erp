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

export default function PedidosPecasChart({ data, totalPedidos, totalPecas }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Pedidos & Peças Diários</h2>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            {totalPedidos} pedidos
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            {totalPecas} peças
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="dia"
            stroke="#9CA3AF"
            tick={{ fontSize: 9 }}
            interval={0}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Bar
            dataKey="pedidos"
            name="Pedidos"
            fill="#3B82F6"
            radius={[2, 2, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="pecas"
            name="Peças"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}