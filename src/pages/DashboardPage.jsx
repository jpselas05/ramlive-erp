import { useEffect, useState } from 'react';
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
  const [ocultarDiasNulos, setOcultarDiasNulos] = useState(false);
  // Auto-selecionar primeira unidade
  useEffect(() => {
    if (unidades.length > 0 && !unidadeSelecionada) {
      setUnidadeSelecionada(unidades[0].id);
    }
  }, [unidades, unidadeSelecionada]);

  const { data: dashboardData, loading, error, refetch } = useDashboard(
    unidadeSelecionada,
    anoSelecionado,
    mesSelecionado + 1
  );

  const unidadeAtual = unidades.find(u => u.id === unidadeSelecionada);

  const preencherMesCompleto = (vendas, ano, mes) => {
    // Descobrir quantos dias tem o mês
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    // Criar array com todos os dias
    const diasCompletos = Array.from({ length: ultimoDia }, (_, i) => {
      const dia = i + 1;

      // Buscar se existe venda para este dia
      const vendaDoDia = vendas.find(v => new Date(v.data).getDate() === dia);

      if (vendaDoDia && vendaDoDia.dia_operacional) {
        return {
          dia,
          faturamento: parseFloat(vendaDoDia.faturamento_total),
          temVenda: true,
          dados: vendaDoDia // Guardar dados completos para o modal
        };
      }

      // Dia sem venda
      return {
        dia,
        faturamento: null,
        temVenda: false,
        dados: null
      };
    });

    return diasCompletos;
  };


  // Preparar dados para gráficos
  const faturamentoDataCompleto = dashboardData?.vendas
    ? preencherMesCompleto(dashboardData.vendas, anoSelecionado, mesSelecionado)
    : [];

  const vendasDiariasCompleto = dashboardData?.vendas
    ? preencherMesCompleto(dashboardData.vendas, anoSelecionado, mesSelecionado).map(item => ({
      dia: item.dia,
      pedidos: item.dados?.total_pedidos || null,
      pecas: item.dados?.total_pecas || null,
    }))
    : [];

  const faturamentoData = ocultarDiasNulos
    ? faturamentoDataCompleto.filter(item => item.temVenda)
    : faturamentoDataCompleto;

  const vendasDiarias = ocultarDiasNulos
    ? vendasDiariasCompleto.filter(item => item.pedidos !== null || item.pecas !== null)
    : vendasDiariasCompleto;




  // Calcular média acumulada
  let acumulado = 0;
  let diasComVenda = 0;
  const dataComMedia = faturamentoData.map((item) => {
    if (item.temVenda && item.faturamento !== null) {
      acumulado += item.faturamento;
      diasComVenda++;
      return { ...item, media: acumulado / diasComVenda };
    }
    return { ...item, media: diasComVenda > 0 ? acumulado / diasComVenda : null };
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


  const resumo = dashboardData?.resumo || {
    totalMes: 0,
    mediaDia: 0,
    melhorDia: 0,
    totalPedidos: 0,
    totalPecas: 0,
    progressoMeta: 0
  };

  const metricas = {
    ticketMedio: resumo.totalPedidos > 0 ? resumo.totalMes / resumo.totalPedidos : 0,
    valorMedioPeca: resumo.totalPecas > 0 ? resumo.totalMes / resumo.totalPecas : 0,
    pecasPorPedido: resumo.totalPedidos > 0 ? resumo.totalPecas / resumo.totalPedidos : 0
  };
  const meta = dashboardData?.meta || 0;
  const temDadosNoMes = dashboardData && (resumo.totalMes > 0 || resumo.totalPedidos > 0)
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
        <div>
          <label className="text-sm text-gray-400 block mb-2">Visualização</label>
          <button
            onClick={() => setOcultarDiasNulos(!ocultarDiasNulos)}
            className={`w-full px-4 py-2 rounded-lg border transition-all ${ocultarDiasNulos
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
              }`}
          >
            {ocultarDiasNulos ? '✓ Dias com venda' : 'Mostrar todos os dias'}
          </button>
        </div>
      </div>

      {/* Seletor de Mês */}
      <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-xl border border-gray-700 overflow-x-auto">
        {MESES.map((mes, i) => (
          <button
            key={i}
            onClick={() => setMesSelecionado(i)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${mesSelecionado === i
              ? 'bg-emerald-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
          >
            {mes}
          </button>
        ))}
      </div>

      {
        loading ? (
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
                unidade={unidadeAtual?.nome}
              />
              <FormasPagamentoChart formasPagamento={formasPagamento} />
            </div>

            {/* Gráficos secundários */}
            <div className="grid grid-cols-3 gap-4">
              <PedidosPecasChart
                data={vendasDiarias}
                totalPedidos={resumo.totalPedidos}
                totalPecas={resumo.totalPecas}
              />

              {/* Métricas do Mês */}
              <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                <h2 className="font-semibold mb-4">Métricas do Mês</h2>

                {temDadosNoMes ? (
                  <div className="space-y-4">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Ticket Médio</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {formatCurrency(metricas.ticketMedio)}
                      </p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Valor Médio por Peça</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {formatCurrency(metricas.valorMedioPeca)}
                      </p>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Peças por Pedido</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {metricas.pecasPorPedido.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Nenhuma venda registrada
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Selecione uma unidade para visualizar o dashboard
          </div>
        )
      }
    </Layout >
  );
}