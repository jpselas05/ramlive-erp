import { useState } from 'react';
import { Target } from 'lucide-react';
import { UNIDADES, MESES_COMPLETOS } from '../../../utils/constants';
import { definirMeta, getMeta } from '../../../api/endpoints';

export default function MetasForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        unidadeId: '',
        ano: new Date().getFullYear(),
        mes: new Date().getMonth() + 1,
        valorMeta: ''
    });

    const [loading, setLoading] = useState(false);
    const [metaAtual, setMetaAtual] = useState(null);
    const [buscando, setBuscando] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpar meta atual ao mudar unidade/ano/mes
        if (['unidadeId', 'ano', 'mes'].includes(field)) {
            setMetaAtual(null);
        }
    };

    const buscarMetaAtual = async () => {
        if (!formData.unidadeId || !formData.ano || !formData.mes) {
            return;
        }

        setBuscando(true);
        try {
            const response = await getMeta(formData.unidadeId, formData.ano, formData.mes);
            setMetaAtual(response.data);

            if (response.data?.valorMeta != null) {
                setFormData(prev => ({
                    ...prev,
                    valorMeta: response.data.valorMeta
                }));
            }

        } catch (error) {
            setMetaAtual(null);
        } finally {
            setBuscando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await definirMeta(
                parseInt(formData.unidadeId),
                parseInt(formData.ano),
                parseInt(formData.mes),
                parseFloat(formData.valorMeta)
            );

            onSuccess?.({
                unidade: UNIDADES.find(u => u.id === parseInt(formData.unidadeId))?.nome,
                ano: formData.ano,
                mes: formData.mes,
                valor: formData.valorMeta
            });

            // Limpar formulário
            setFormData({
                unidadeId: '',
                ano: new Date().getFullYear(),
                mes: new Date().getMonth() + 1,
                valorMeta: ''
            });
            setMetaAtual(null);

        } catch (error) {
            console.error('Erro ao definir meta:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    const podeConsultar = formData.unidadeId && formData.ano && formData.mes;

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <Target className="text-emerald-400" size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Definir Meta de Vendas</h3>
                    <p className="text-sm text-gray-400">Configure a meta mensal para uma unidade</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Unidade */}
                <div>
                    <label className="block text-sm font-medium mb-2">Unidade *</label>
                    <select
                        value={formData.unidadeId}
                        onChange={(e) => handleChange('unidadeId', e.target.value)}
                        required
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
                        value={formData.ano}
                        onChange={(e) => handleChange('ano', e.target.value)}
                        required
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
                        value={formData.mes}
                        onChange={(e) => handleChange('mes', e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    >
                        {MESES_COMPLETOS.map((nome, index) => (
                            <option key={index + 1} value={index + 1}>
                                {nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Valor da Meta */}
                <div>
                    <label className="block text-sm font-medium mb-2">Valor da Meta (R$) *</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.valorMeta}
                        onChange={(e) => handleChange('valorMeta', e.target.value)}
                        required
                        placeholder="0.00"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                    />
                </div>
            </div>

            {/* Consultar Meta Atual */}
            <div className="mb-6">
                <button
                    type="button"
                    onClick={buscarMetaAtual}
                    disabled={!podeConsultar || buscando}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${podeConsultar && !buscando
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {buscando ? 'Consultando...' : 'Consultar Meta Atual'}
                </button>

                {metaAtual && metaAtual.valorMeta != null && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm">
                        <p className="text-blue-400">
                            ℹ️ Meta atual: <strong>
                                R$ {parseFloat(metaAtual.valorMeta).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </strong>
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Atualizar a meta substituirá este valor
                        </p>
                    </div>
                )}

                {metaAtual && metaAtual.valorMeta == null && (
                    <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
                        <p className="text-yellow-400">
                            ⚠️ Nenhuma meta definida para este período.
                        </p>
                    </div>
                )}

            </div>

            {/* Botão Submit */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${loading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
            >
                <Target size={20} />
                {loading ? 'Salvando...' : metaAtual ? 'Atualizar Meta' : 'Definir Meta'}
            </button>
        </form>
    );
}