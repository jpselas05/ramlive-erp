// components/importacao/vendas/VendaManualModal.jsx
import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { UNIDADES } from '../../../utils/constants';

export default function VendaManualModal({ aberto, onFechar, onSubmit }) {
  const [formData, setFormData] = useState({
    unidadeId: '',
    data: '',
    faturamentoTotal: '',
    totalPedidos: '',
    totalPecas: '',
    valorDinheiro: '',
    valorPix: '',
    valorCartao: '',
    valorDuplicata: '',
    valorCheque: ''
  });

  if (!aberto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const unidade = UNIDADES.find(u => u.id === parseInt(formData.unidadeId));
    
    const dados = {
      unidadeId: parseInt(formData.unidadeId),
      unidadeNome: unidade?.nome,
      unidadeCodigo: unidade?.codigo,
      data: formData.data,
      faturamentoTotal: parseFloat(formData.faturamentoTotal) || 0,
      totalPedidos: parseInt(formData.totalPedidos) || 0,
      totalPecas: parseInt(formData.totalPecas) || 0,
      valorDinheiro: parseFloat(formData.valorDinheiro) || 0,
      valorPix: parseFloat(formData.valorPix) || 0,
      valorCartao: parseFloat(formData.valorCartao) || 0,
      valorDuplicata: parseFloat(formData.valorDuplicata) || 0,
      valorCheque: parseFloat(formData.valorCheque) || 0,
      diaOperacional: true,
      nomeArquivo: null
    };

    onSubmit(dados);
    
    // Resetar form
    setFormData({
      unidadeId: '',
      data: '',
      faturamentoTotal: '',
      totalPedidos: '',
      totalPecas: '',
      valorDinheiro: '',
      valorPix: '',
      valorCartao: '',
      valorDuplicata: '',
      valorCheque: ''
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <h3 className="text-xl font-bold">Cadastro Manual de Venda</h3>
          <button
            onClick={onFechar}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Unidade */}
            <div>
              <label className="block text-sm font-medium mb-2">Unidade *</label>
              <select
                value={formData.unidadeId}
                onChange={(e) => handleChange('unidadeId', e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="">Selecione...</option>
                {UNIDADES.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium mb-2">Data *</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => handleChange('data', e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>

            {/* Faturamento Total */}
            <div>
              <label className="block text-sm font-medium mb-2">Faturamento Total *</label>
              <input
                type="number"
                step="0.01"
                value={formData.faturamentoTotal}
                onChange={(e) => handleChange('faturamentoTotal', e.target.value)}
                required
                placeholder="0.00"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>

            {/* Total Pedidos */}
            <div>
              <label className="block text-sm font-medium mb-2">Total Pedidos</label>
              <input
                type="number"
                value={formData.totalPedidos}
                onChange={(e) => handleChange('totalPedidos', e.target.value)}
                placeholder="0"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>

            {/* Total Peças */}
            <div>
              <label className="block text-sm font-medium mb-2">Total Peças</label>
              <input
                type="number"
                value={formData.totalPecas}
                onChange={(e) => handleChange('totalPecas', e.target.value)}
                placeholder="0"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div>
            <h4 className="font-medium mb-3 text-gray-300">Formas de Pagamento</h4>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block text-xs mb-2 text-gray-400">Dinheiro</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorDinheiro}
                  onChange={(e) => handleChange('valorDinheiro', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-2 text-gray-400">Pix</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorPix}
                  onChange={(e) => handleChange('valorPix', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-2 text-gray-400">Cartão</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorCartao}
                  onChange={(e) => handleChange('valorCartao', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-2 text-gray-400">Duplicata</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorDuplicata}
                  onChange={(e) => handleChange('valorDuplicata', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-2 text-gray-400">Cheque</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorCheque}
                  onChange={(e) => handleChange('valorCheque', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onFechar}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={18} />
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}