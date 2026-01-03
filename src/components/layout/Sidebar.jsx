import { useState } from 'react'; // ← ADICIONAR ESTE IMPORT
import { Home, Upload, FileText, UserCog, Settings, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { formatRoleLabel, ROLES, formatUserName } from '../../utils/formatters';

export default function Sidebar({ menuOpen, unidades }) {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [dashboardExpanded, setDashboardExpanded] = useState(true);
    const menuItems = [
        { id: 'dashboard', path: '/', icon: Home, label: 'Dashboard', roles: ['user', 'gerente', 'admin'] },
        { id: 'importacao', path: '/importacao', icon: Upload, label: 'Importação', roles: ['gerente', 'admin'] },
        { id: 'relatorios', path: '/relatorios', icon: FileText, label: 'Relatórios', roles: ['admin'] },
        { id: 'users', path: '/usuarios', icon: UserCog, label: 'Usuários', roles: ['admin'] },
        { id: 'config', path: '/configuracoes', icon: Settings, label: 'Configurações', roles: ['admin'] },
    ];
    const allowedMenuItems = menuItems.filter(item => {
        if (!item.roles) return true
        return item.roles.includes(user?.user_role);
    });


    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            alert('Erro ao sair: ' + error.message);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`${menuOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
            {/* Logo */}
            <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    A
                </div>
                {menuOpen && (
                    <div>
                        <p className="font-bold">Adonel</p>
                        <p className="text-xs text-gray-400">Calçados & Modas</p>
                    </div>
                )}
            </div>

            {/* Menu */}
            <nav className="flex-1 p-3">
                {allowedMenuItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all ${isActive(item.path)
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} />
                        {menuOpen && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-3 border-t border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {menuOpen && (
                            <div>
                                <p className="text-sm font-medium">{formatUserName(user?.email) || 'Usuário'}</p>
                                <p className="text-xs text-gray-400">{formatRoleLabel(user?.user_role) || 'Usuário'}</p>
                            </div>
                        )}
                    </div>
                    {menuOpen && (
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Sair"
                        >
                            <LogOut size={18} className="text-gray-400" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}