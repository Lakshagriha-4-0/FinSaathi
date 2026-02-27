import React, { useState, useContext, useRef, useEffect } from 'react';
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
    Landmark,
    Bell
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        // Reset both the container and window scroll positions instantly
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
            scrollContainerRef.current.scrollTop = 0;
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

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
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
                <div className="flex flex-col h-full bg-gray-50/30">
                    <div className="p-6 mb-2 flex items-center gap-4 border-b border-gray-100/50">
                        <div className="h-11 w-11 bg-gradient-to-tr from-primary to-accent rounded-[14px] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20">
                            FS
                        </div>
                        <span className="text-2xl font-display font-black text-gray-900 tracking-tight">FinSaathi</span>
                    </div>

                    <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto">
                        <Link
                            to="/"
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold ${location.pathname === '/' ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/30' : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <HomeIcon size={20} className={location.pathname === '/' ? 'text-white' : 'text-gray-400'} />
                            <span>Home</span>
                        </Link>

                        <div className="pt-6 pb-2 px-4 uppercase text-[10px] font-black tracking-widest text-gray-400">
                            Services
                        </div>

                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group font-bold ${isActive ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/30' : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} />
                                        <span>{item.name}</span>
                                    </div>
                                    {!isActive && <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-300" />}
                                </Link>
                            )
                        })}
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
                <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2.5 lg:hidden bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden lg:block">
                            <h2 className="text-2xl font-display font-black text-gray-900 tracking-tight">
                                {t('welcome_back') || 'Welcome back'}, <span className="text-primary">{user?.name?.split(' ')[0] || 'Friend'}</span> <span className="inline-block animate-wiggle">👋</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <button className="relative p-2.5 text-gray-400 hover:text-primary transition-colors bg-gray-50 hover:bg-primary/5 rounded-full active:scale-95">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

                        <Link to="/profile" className="flex items-center gap-3 group cursor-pointer transition-transform active:scale-95">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{user?.name || 'Scholar'}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{user?.familyCondition?.isRulerArea ? 'Rural Leader' : 'Achiever'}</p>
                            </div>
                            <div className="h-11 w-11 bg-gradient-to-tr from-primary to-accent rounded-[16px] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20 ring-4 ring-white group-hover:-translate-y-1 transition-all">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
