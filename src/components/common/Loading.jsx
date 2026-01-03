import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}