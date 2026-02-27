import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    BarChart3,
    BookOpen,
    ShieldAlert,
    Handshake,
    Menu,
    X,
    LogOut,
    Languages,
    Home as HomeIcon,
    ChevronRight,
    User,
    Rocket,
    Landmark
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const toggleLanguage = () => {
        const langs = ['en', 'hi', 'mr', 'ta'];
        const currentIndex = langs.indexOf(i18n.language);
        const nextIndex = (currentIndex + 1) % langs.length;
        i18n.changeLanguage(langs[nextIndex]);
    };

    const navItems = [
        { name: t('dashboard'), path: '/dashboard', icon: BarChart3 },
        { name: t('profile'), path: '/profile', icon: User },
        { name: t('learn'), path: '/learn', icon: BookOpen },
        { name: t('startups'), path: '/startups', icon: Rocket },
        { name: t('alerts'), path: '/alerts', icon: ShieldAlert },
        { name: t('schemes'), path: '/schemes', icon: Handshake },
        { name: t('loans'), path: '/loans', icon: Landmark },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
                            FS
                        </div>
                        <span className="text-xl font-display font-bold text-gray-900 tracking-tight">FinSaathi</span>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        <Link
                            to="/"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <HomeIcon size={20} />
                            <span className="font-medium">Home</span>
                        </Link>

                        <div className="pt-4 pb-2 px-4 uppercase text-[10px] font-bold tracking-widest text-gray-400">
                            Services
                        </div>

                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                <ChevronRight size={16} className={`transition-transform ${location.pathname === item.path ? 'translate-x-0' : 'opacity-0 group-hover:opacity-100 -translate-x-1'}`} />
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={toggleLanguage}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            <Languages size={20} />
                            <span className="font-medium">{t('language_change')}</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-gray-100 sticky top-0 z-30">
                    <button
                        className="p-2 lg:hidden text-gray-600"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 lg:flex-none">
                        <h2 className="text-sm font-medium text-gray-500 hidden lg:block">Welcome, <span className="text-gray-900 font-bold">{user?.name || 'Friend'}</span></h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-gray-900">{user?.name || 'Scholar'}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Rural Leader</p>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
