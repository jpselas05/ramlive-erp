import { Upload } from 'lucide-react';
import { useState } from 'react';

export default function UploadZone({ onFilesSelected, disabled, loading }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
        dragActive 
          ? 'border-emerald-500 bg-emerald-500/10' 
          : 'border-gray-600 hover:border-gray-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className={`p-4 rounded-full ${dragActive ? 'bg-emerald-500/20' : 'bg-gray-700'}`}>
          <Upload size={40} className={dragActive ? 'text-emerald-400' : 'text-gray-400'} />
        </div>
        
        <div>
          <p className="text-lg font-medium mb-2">
            {loading ? 'Processando arquivos...' : 'Arraste arquivos TXT aqui'}
          </p>
          <p className="text-gray-400 text-sm mb-4">ou</p>
          
          <label className={`inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}>
            Selecionar Arquivos
            <input
              type="file"
              accept=".txt"
              multiple
              onChange={handleChange}
              disabled={disabled}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>✓ Suporta múltiplos arquivos</p>
          <p>✓ Formato: Relatórios RAMLIVE (.txt)</p>
          <p>✓ Detecção automática de unidade e data</p>
        </div>
      </div>
    </div>
  );
}