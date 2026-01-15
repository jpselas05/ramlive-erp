import { useState } from 'react';
import { Home, Upload, FileText, UserCog, Settings, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatRoleLabel, formatUserName } from '../../utils/formatters';

export default function Sidebar({ menuOpen, unidades }) {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Estado para controlar quais menus estão expandidos
    const [expandedMenus, setExpandedMenus] = useState({});

    const menuItems = [
        {
            id: 'dashboard',
            path: '/',
            icon: Home,
            label: 'Dashboard',
            roles: ['user', 'gerente', 'admin']
        },
        {
            id: 'importacao',
            path: '/importacao?tipo=vendas',
            icon: Upload,
            label: 'Importação',
            roles: ['gerente', 'admin'],
            subItems: [
                {
                    id: 'importacao-vendas',
                    path: '/importacao?tipo=vendas',
                    label: 'Vendas'
                },
                {
                    id: 'importacao-duplicatas',
                    path: '/importacao?tipo=duplicatas',
                    label: 'Duplicatas'
                },
                {
                    id: 'importacao-visualizar',
                    path: '/importacao?tipo=visualizar',
                    label: 'Visualizar Mês'
                },
                {
                    id: 'importacao-metas',
                    path: '/importacao?tipo=metas',
                    label: 'Metas'
                }
            ]
        },
        {
            id: 'relatorios',
            path: '/relatorios',
            icon: FileText,
            label: 'Relatórios',
            roles: ['admin']
        },
        {
            id: 'users',
            path: '/usuarios',
            icon: UserCog,
            label: 'Usuários',
            roles: ['admin']
        },
        {
            id: 'config',
            path: '/configuracoes',
            icon: Settings,
            label: 'Configurações',
            roles: ['admin']
        },
    ];

    const allowedMenuItems = menuItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(user?.user_role);
    });

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            alert('Erro ao sair: ' + error.message);
        }
    };

    const isActive = (path) => {
        // Remove query params para comparação
        const currentPath = location.pathname;
        const itemPath = path.split('?')[0];
        return currentPath === itemPath;
    };

    const isSubItemActive = (path) => {
        return location.pathname + location.search === path;
    };

    // Verifica se algum sub-item está ativo
    const hasActiveSubItem = (item) => {
        if (!item.subItems) return false;
        return item.subItems.some(sub => isSubItemActive(sub.path));
    };

    // Toggle do menu
    const toggleMenu = (itemId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // Auto-expandir se estiver na rota ou se tiver sub-item ativo
    const isMenuExpanded = (item) => {
        if (!item.subItems) return false;
        return expandedMenus[item.id] || isActive(item.path) || hasActiveSubItem(item);
    };

    const handleMenuClick = (item, e) => {
        // Se tem sub-items, apenas toggle (não navega)
        if (item.subItems) {
            e.preventDefault();
            toggleMenu(item.id);

            // Se não estava expandido, navega para a rota principal
            if (!isMenuExpanded(item)) {
                navigate(item.path);
            }
        }
    };

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
            <nav className="flex-1 p-3 overflow-y-auto">
                {allowedMenuItems.map(item => (
                    <div key={item.id} className="mb-1">
                        {/* Item Principal */}
                        <Link
                            to={item.path}
                            onClick={(e) => handleMenuClick(item, e)}
                            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${isActive(item.path) || hasActiveSubItem(item)
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} />
                                {menuOpen && <span>{item.label}</span>}
                            </div>

                            {/* Seta de expandir (apenas se tiver sub-items e menu aberto) */}
                            {menuOpen && item.subItems && (
                                <div className="transition-transform duration-200">
                                    {isMenuExpanded(item) ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </div>
                            )}
                        </Link>

                        {/* Sub-Items */}
                        {menuOpen && item.subItems && isMenuExpanded(item) && (
                            <div className="ml-6 mt-1 space-y-1">
                                {item.subItems.map(subItem => (
                                    <Link
                                        key={subItem.id}
                                        to={subItem.path}
                                        className={`block px-3 py-2 rounded-lg text-sm transition-all ${isSubItemActive(subItem.path)
                                            ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        {subItem.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
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