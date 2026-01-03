import { Menu, Bell, Search } from 'lucide-react';

export default function Header({ menuOpen, setMenuOpen, title, subtitle }) {
  return (
    <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-64" 
          />
        </div> */}

        <button className="p-2 hover:bg-gray-700 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}