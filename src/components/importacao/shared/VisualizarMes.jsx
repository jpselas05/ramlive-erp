import { useState } from 'react';
import { Calendar, Search, CheckCircle, XCircle } from 'lucide-react';
import { UNIDADES } from '../../../utils/constants';
import { getVendasMes } from '../../../api/endpoints';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function VisualizarMes() {
    const [filtros, setFiltros] = useState({
        unidadeId: '',
        ano: new Date().getFullYear(),
        mes: new Date().getMonth() + 1
    });

    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [consultado, setConsultado] = useState(false);

    const meses = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ];

    const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    const handleConsultar = async () => {
        if (!filtros.unidadeId || !filtros.ano || !filtros.mes) {
            return;
        }

        setLoading(true);
        try {
            const response = await getVendasMes(
                filtros.unidadeId,
                filtros.ano,
                filtros.mes
            );
            const lista = Array.isArray(response?.data) ? response.data : [];
            setVendas(lista);
            setConsultado(true);
        } catch (error) {
            console.error('Erro ao consultar vendas:', error);
            setVendas([]);
            setConsultado(true);
        } finally {
            setLoading(false);
        }
    };

    // Gerar todos os dias do mês
    const getDiasDoMes = () => {
        const ultimoDia = new Date(filtros.ano, filtros.mes, 0).getDate();
        return Array.from({ length: ultimoDia }, (_, i) => i + 1);
    };

    // Buscar venda de um dia específico
    const getVendaDoDia = (dia) => {
        const diaStr = String(dia).padStart(2, '0');
        return vendas.find(v => String(v.data).slice(8, 10) === diaStr);
    };


    const diasDoMes = getDiasDoMes();
    const diasComVenda = vendas.length;
    const diasSemVenda = diasDoMes.length - diasComVenda;
    const totalFaturamento = vendas.reduce(
        (acc, v) => acc + Number(v.faturamento_total ?? 0),
        0
    );


    const podeConsultar = filtros.unidadeId && filtros.ano && filtros.mes;
    const unidadeSelecionada = UNIDADES.find(u => u.id === parseInt(filtros.unidadeId));
    const mesSelecionado = meses.find(m => m.value === parseInt(filtros.mes));

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Calendar className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Visualizar Vendas do Mês</h3>
                        <p className="text-sm text-gray-400">Consulte os dias com vendas cadastradas</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {/* Unidade */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Unidade *</label>
                        <select
                            value={filtros.unidadeId}
                            onChange={(e) => {
                                setFiltros(prev => ({ ...prev, unidadeId: e.target.value }));
                                setConsultado(false);
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        >
                            <option value="">Selecione a unidade</option>
                            {UNIDADES.map(u => (
                                <option key={u.id} value={u.id}>{u.nome}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ano */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Ano *</label>
                        <select
                            value={filtros.ano}
                            onChange={(e) => {
                                setFiltros(prev => ({ ...prev, ano: e.target.value }));
                                setConsultado(false);
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        >
                            {anos.map(ano => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                    </div>

                    {/* Mês */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Mês *</label>
                        <select
                            value={filtros.mes}
                            onChange={(e) => {
                                setFiltros(prev => ({ ...prev, mes: e.target.value }));
                                setConsultado(false);
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                        >
                            {meses.map(mes => (
                                <option key={mes.value} value={mes.value}>{mes.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleConsultar}
                    disabled={!podeConsultar || loading}
                    className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${podeConsultar && !loading
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <Search size={18} />
                    {loading ? 'Consultando...' : 'Consultar'}
                </button>
            </div>

            {/* Resumo */}
            {consultado && (
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <p className="text-sm text-gray-400 mb-1">Total de Dias</p>
                        <p className="text-2xl font-bold">{diasDoMes.length}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                        <p className="text-sm text-emerald-400 mb-1">Dias com Venda</p>
                        <p className="text-2xl font-bold text-emerald-400">{diasComVenda}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-sm text-red-400 mb-1">Dias sem Venda</p>
                        <p className="text-2xl font-bold text-red-400">{diasSemVenda}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-sm text-blue-400 mb-1">Faturamento Total</p>
                        <p className="text-2xl font-bold text-blue-400">
                            {formatCurrency(totalFaturamento)}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabela de Dias */}
            {consultado && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="font-semibold">
                            {unidadeSelecionada?.nome} - {mesSelecionado?.label}/{filtros.ano}
                        </h3>
                    </div>

                    <div className="overflow-auto max-h-[600px]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left w-20">Dia</th>
                                    <th className="px-4 py-3 text-left w-32">Data</th>
                                    <th className="px-4 py-3 text-center w-24">Status</th>
                                    <th className="px-4 py-3 text-right">Faturamento</th>
                                    <th className="px-4 py-3 text-right">Pedidos</th>
                                    <th className="px-4 py-3 text-right">Peças</th>
                                    <th className="px-4 py-3 text-right">Dinheiro</th>
                                    <th className="px-4 py-3 text-right">Pix</th>
                                    <th className="px-4 py-3 text-right">Cartão</th>
                                    <th className="px-4 py-3 text-right">Duplicata</th>
                                    <th className="px-4 py-3 text-right">Cheque</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diasDoMes.map(dia => {
                                    const venda = getVendaDoDia(dia);
                                    const temVenda = !!venda;
                                    const dataCompleta = `${filtros.ano}-${String(filtros.mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

                                    return (
                                        <tr
                                            key={dia}
                                            className={`border-t border-gray-700 ${temVenda ? 'bg-emerald-500/5' : 'bg-red-500/5'
                                                }`}
                                        >
                                            <td className="px-4 py-3 font-semibold">{dia}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
                                                {formatDate(dataCompleta)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {temVenda ? (
                                                    <CheckCircle size={18} className="text-emerald-400 mx-auto" />
                                                ) : (
                                                    <XCircle size={18} className="text-red-400 mx-auto" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {temVenda ? (
                                                    <span className="text-emerald-400">
                                                        {formatCurrency(venda.faturamento_total)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {temVenda ? venda.total_pedidos : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {temVenda ? venda.total_pecas : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs">
                                                {temVenda ? formatCurrency(venda.valor_dinheiro) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-purple-400">
                                                {temVenda ? formatCurrency(venda.valor_pix) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-blue-400">
                                                {temVenda ? formatCurrency(venda.valor_cartao) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-amber-400">
                                                {temVenda ? formatCurrency(venda.valor_duplicata) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-pink-400">
                                                {temVenda ? formatCurrency(venda.valor_cheque) : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Estado vazio */}
            {!consultado && (
                <div className="mt-12 text-center text-gray-500">
                    <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Selecione uma unidade e período para visualizar as vendas</p>
                </div>
            )}
        </div>
    );
}