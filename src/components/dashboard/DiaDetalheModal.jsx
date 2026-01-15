import { X, Banknote, Smartphone, CreditCard, FileText, Landmark } from 'lucide-react';
import { formatCurrency, MESES_COMPLETOS } from '../../utils/formatters';

export default function DiaDetalheModal({ dia, dados, mes, ano, unidade, onClose }) {
    if (!dia) return null;
    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;

    const faturamento = dados ? parseFloat(dados.faturamento_total || 0) : 0;
    const qtdPedidos = dados?.total_pedidos || 0;
    const qtdPecas = dados?.total_pecas || 0;

    const metrics = {
        ticketMedio: qtdPedidos > 0 ? faturamento / qtdPedidos : 0,
        pecasPorPedido: qtdPedidos > 0 ? (qtdPecas / qtdPedidos) : 0,
        valorPorPeca: qtdPecas > 0 ? faturamento / qtdPecas : 0
    };




    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-auto custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Relatório do dia {dia}</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {dataFormatada} - {unidade} - {MESES_COMPLETOS[mes]} {ano}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Fechar (ESC)"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-6">
                    {dados ? (
                        <>
                            {/* Resumo Principal */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                                    <p className="text-sm text-emerald-400 mb-1">Faturamento</p>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {formatCurrency(dados.faturamento_total)}
                                    </p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                    <p className="text-sm text-blue-400 mb-1">Pedidos</p>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {dados.total_pedidos}
                                    </p>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                    <p className="text-sm text-purple-400 mb-1">Peças</p>
                                    <p className="text-2xl font-bold text-purple-400">
                                        {dados.total_pecas}
                                    </p>
                                </div>
                            </div>

                            {/* Formas de Pagamento */}
                            <div>
                                <h3 className="font-semibold mb-3">Formas de Pagamento</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Banknote size={16} className="text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 mb-1">Dinheiro</p>
                                            <p className="text-lg font-semibold text-emerald-400">
                                                {formatCurrency(dados.valor_dinheiro)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Smartphone size={16} className="text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 mb-1">Pix</p>
                                            <p className="text-lg font-semibold text-purple-400">
                                                {formatCurrency(dados.valor_pix)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CreditCard size={16} className="text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 mb-1">Cartão</p>
                                            <p className="text-lg font-semibold text-blue-400">
                                                {formatCurrency(dados.valor_cartao)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText size={16} className="text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 mb-1">Duplicata</p>
                                            <p className="text-lg font-semibold text-amber-400">
                                                {formatCurrency(dados.valor_duplicata)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3 col-span-2 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Landmark size={16} className="text-pink-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 mb-1">Cheque</p>
                                            <p className="text-lg font-semibold text-pink-400">
                                                {formatCurrency(dados.valor_cheque)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Informações Adicionais */}
                            <div className="bg-gray-700/30 rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-sm">Informações Adicionais</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-400">Ticket Médio</p>
                                        <p className="font-semibold">
                                            {formatCurrency(metrics.ticketMedio)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Peças por Pedido</p>
                                        <p className="font-semibold">
                                            {metrics.pecasPorPedido.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Valor por Peça</p>
                                        <p className="font-semibold">
                                            {formatCurrency(metrics.valorPorPeca)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Status</p>
                                        <p className="font-semibold text-emerald-400">
                                            {dados.dia_operacional ? 'Operacional' : 'Não Operacional'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X size={32} className="text-red-400" />
                            </div>
                            <p className="text-lg font-semibold mb-2">Sem dados para este dia</p>
                            <p className="text-sm text-gray-400">
                                Não há vendas cadastradas para {dataFormatada}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
        </div>
    );
}