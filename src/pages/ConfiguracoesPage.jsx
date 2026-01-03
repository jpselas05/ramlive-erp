import Layout from '../components/layout/Layout';
import { Settings } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <Layout title="Configurações" subtitle="Gerencie as configurações do sistema">
      <div className="flex flex-col items-center justify-center h-96">
        <Settings size={64} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-400 mb-2">
          Em Desenvolvimento
        </h2>
        <p className="text-gray-500">
          Esta funcionalidade estará disponível em breve
        </p>
      </div>
    </Layout>
  );
}