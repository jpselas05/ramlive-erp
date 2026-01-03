import { Check, X, AlertCircle } from 'lucide-react';

export default function Notification({ message, type = 'info', onClose }) {
  const icons = {
    success: <Check size={20} />,
    error: <X size={20} />,
    info: <AlertCircle size={20} />
  };

  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${colors[type]} animate-slide-in`}>
      {icons[type]}
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <X size={16} />
        </button>
      )}
    </div>
  );
}