import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useDashboard } from '../hooks/useDashboard';
import MetaProgress from '../components/dashboard/MetaProgress';
import KPICards from '../components/dashboard/KPICards';
import FaturamentoChart from '../components/dashboard/FaturamentoChart';
import FormasPagamentoChart from '../components/dashboard/FormasPagamentoChart';
import PedidosPecasChart from '../components/dashboard/PedidosPecasChart';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { UNIDADES, MESES, MESES_COMPLETOS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

export default function DashboardPage() {
  const unidades = UNIDADES;
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

  // Auto-selecionar primeira unidade
  useState(() => {
    if (unidades.length > 0 && !unidadeSelecionada) {
      setUnidadeSelecionada(unidades[0].id);
    }
  }, [unidades]);

  const { data: dashboardData, loading, error, refetch } = useDashboard(
    unidadeSelecionada,
    anoSelecionado,
    mesSelecionado + 1
  );

  const unidadeAtual = unidades.find(u => u.id === unidadeSelecionada);

  // Preparar dados para gráficos
  const faturamentoData = dashboardData?.vendas.map(v => ({
    dia: new Date(v.data).getDate(),
    faturamento: v.dia_operacional ? parseFloat(v.faturamento_total) : null,
  })) || [];

  const vendasDiarias = dashboardData?.vendas.map(v => ({
    dia: new Date(v.data).getDate(),
    pedidos: v.dia_operacional ? v.total_pedidos : null,
    pecas: v.dia_operacional ? v.total_pecas : null,
  })) || [];

  // Calcular média acumulada
  let acumulado = 0;
  let diasComVenda = 0;
  const dataComMedia = faturamentoData.map((item) => {
    if (item.faturamento !== null) {
      acumulado += item.faturamento;
      diasComVenda++;
      return { ...item, media: acumulado / diasComVenda };
    }
    return { ...item, media: diasComVenda > 0 ? acumulado / diasComVenda : 0 };
  });

  // Formas de pagamento para gráfico
  const formasPagamento = dashboardData ? [
    { name: 'Dinheiro', value: dashboardData.formasPagamento.dinheiro, color: '#10B981' },
    { name: 'Pix', value: dashboardData.formasPagamento.pix, color: '#8B5CF6' },
    { name: 'Cartão', value: dashboardData.formasPagamento.cartao, color: '#3B82F6' },
    { name: 'Duplicata', value: dashboardData.formasPagamento.duplicata, color: '#F59E0B' },
    { name: 'Cheque', value: dashboardData.formasPagamento.cheque, color: '#EC4899' },
  ].map(fp => ({
    ...fp,
    percentage: dashboardData.resumo.totalMes > 0 
      ? (fp.value / dashboardData.resumo.totalMes * 100).toFixed(2)
      : 0
  })) : [];

  const resumoVendas = formasPagamento.map(fp => ({
    nome: fp.name,
    valor: fp.value,
    color: fp.color
  }));

  const resumo = dashboardData?.resumo || {
    totalMes: 0,
    mediaDia: 0,
    melhorDia: 0,
    totalPedidos: 0,
    totalPecas: 0,
    progressoMeta: 0
  };

  const meta = dashboardData?.meta || 0;

  if (error && !dashboardData) {
    return (
      <Layout title="Dashboard">
        <ErrorMessage message={error} onRetry={refetch} />
      </Layout>
    );
  }

  return (
    <Layout 
      title={`Dashboard - ${unidadeAtual?.nome || 'Ramlive'}`}
      subtitle={`${MESES_COMPLETOS[mesSelecionado]} ${anoSelecionado}`}
    >
      {/* Seletores */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-400 block mb-2">Unidade</label>
          <select
            value={unidadeSelecionada || ''}
            onChange={(e) => setUnidadeSelecionada(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          >
            {unidades.map(u => (
              <option key={u.id} value={u.id}>{u.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-2">Ano</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAnoSelecionado(anoSelecionado - 1)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700"
            >
              ←
            </button>
            <div className="flex-1 text-center text-xl font-bold text-emerald-400">
              {anoSelecionado}
            </div>
            <button
              onClick={() => setAnoSelecionado(anoSelecionado + 1)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Seletor de Mês */}
      <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-xl border border-gray-700 overflow-x-auto">
        {MESES.map((mes, i) => (
          <button
            key={i}
            onClick={() => setMesSelecionado(i)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              mesSelecionado === i
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {mes}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading message="Carregando dashboard..." />
      ) : dashboardData ? (
        <>
          {/* Meta Progress */}
          <MetaProgress
            mes={mesSelecionado}
            meta={meta}
            totalMes={resumo.totalMes}
            progressoMeta={resumo.progressoMeta}
          />

          {/* KPIs */}
          <KPICards resumo={resumo} meta={meta} progressoMeta={resumo.progressoMeta} />

          {/* Gráficos principais */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <FaturamentoChart
              data={dataComMedia}
              mes={mesSelecionado}
              ano={anoSelecionado}
            />
            <FormasPagamentoChart formasPagamento={formasPagamento} />
          </div>

          {/* Gráficos secundários */}
          <div className="grid grid-cols-2 gap-4">
            <PedidosPecasChart
              data={vendasDiarias}
              totalPedidos={resumo.totalPedidos}
              totalPecas={resumo.totalPecas}
            />

            {/* Resumo Vendas */}
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <h2 className="font-semibold mb-4">Resumo das Vendas</h2>
              <div className="space-y-3">
                {resumoVendas.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-sm text-gray-300">{item.nome}</p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {formatCurrency(item.valor)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-12">
          Selecione uma unidade para visualizar o dashboard
        </div>
      )}
    </Layout>
  );
}