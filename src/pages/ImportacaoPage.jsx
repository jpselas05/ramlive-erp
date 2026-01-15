// pages/ImportacaoPage.jsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Notification from '../components/common/Notification';
import ImportarVendas from '../components/importacao/vendas/ImportarVendas';
import ImportarDuplicatas from '../components/importacao/duplicatas/ImportarDuplicatas';
import VisualizarMes from '../components/importacao/shared/VisualizarMes';
import MetasForm from '../components/importacao/shared/MetasForm';

export default function ImportacaoPage() {
  const [notification, setNotification] = useState(null);
  const [searchParams] = useSearchParams();

  // Pega o tipo da URL ou usa 'vendas' como padrão
  const tipo = searchParams.get('tipo') || 'vendas';

  const handleMetaDefinida = (info) => {
    setNotification({
      type: 'success',
      message: `✅ Meta de R$ ${parseFloat(info.valor).toLocaleString('pt-BR', { 
        minimumFractionDigits: 2 
      })} definida para ${info.unidade} (${info.mes}/${info.ano})`
    });
  };

  return (
    <Layout 
      title="Importação de Dados" 
      subtitle="Importe vendas, duplicatas ou gerencie suas metas"
    >
      {/* Notificação */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Conteúdo Dinâmico */}
      {tipo === 'vendas' && (
        <ImportarVendas onNotification={setNotification} />
      )}

      {tipo === 'duplicatas' && (
        <ImportarDuplicatas onNotification={setNotification} />
      )}

      {tipo === 'visualizar' && (
        <VisualizarMes />
      )}

      {tipo === 'metas' && (
        <MetasForm onSuccess={handleMetaDefinida} />
      )}
    </Layout>
  );
}