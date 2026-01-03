import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <p className="text-red-400 text-xl mb-4">❌ {message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );
}