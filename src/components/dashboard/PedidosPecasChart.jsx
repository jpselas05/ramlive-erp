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

export default function PedidosPecasChart({ data, totalPedidos, totalPecas }) {
  const [visualizacao, setVisualizacao] = useState('ambos'); // 'pedidos', 'pecas', 'ambos'

  return (
    <div className="col-span-2 bg-gray-800 rounded-2xl p-5 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Pedidos & Peças Diários</h2>
        
        <div className="flex items-center gap-4">
          {/* Totais */}
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

          {/* Toggle */}
          <div className="flex gap-1 bg-gray-900/50 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setVisualizacao('pedidos')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                visualizacao === 'pedidos'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Pedidos
            </button>
            <button
              onClick={() => setVisualizacao('pecas')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                visualizacao === 'pecas'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Peças
            </button>
            <button
              onClick={() => setVisualizacao('ambos')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                visualizacao === 'ambos'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Ambos
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="dia"
            stroke="#9CA3AF"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          
          {(visualizacao === 'pedidos' || visualizacao === 'ambos') && (
            <Bar
              dataKey="pedidos"
              name="Pedidos"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          )}
          
          {(visualizacao === 'pecas' || visualizacao === 'ambos') && (
            <Line
              type="monotone"
              dataKey="pecas"
              name="Peças"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}