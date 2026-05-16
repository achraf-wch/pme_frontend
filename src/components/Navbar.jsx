import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe, logout } from '../services/api';
import ConfirmDialog from './ui/ConfirmDialog';
import { useLanguage } from '../i18n/LanguageContext';

export default function Navbar() {
    const { language, setLanguage, t } = useLanguage();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!localStorage.getItem('token')) {
                setUser(null);
                localStorage.removeItem('user');
                return;
            }
            try {
                const res = await getMe();
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (err) {
                setUser(null);
                localStorage.removeItem('user');
            }
        };
        fetchUser();
        window.addEventListener('pme-auth-changed', fetchUser);
        window.addEventListener('storage', fetchUser);
        return () => {
            window.removeEventListener('pme-auth-changed', fetchUser);
            window.removeEventListener('storage', fetchUser);
        };
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setConfirmLogout(false);
            setLoggingOut(false);
            window.dispatchEvent(new Event('pme-auth-changed'));
            navigate('/');
        }
    };

    const closeMenu = () => {
        setIsOpen(false);
        setIsMenuOpen(false);
    };
    const navItems = [
        { to: '/', label: t('home') },
        { to: '/about', label: t('party') },
        { to: '/pages/vision-mission', label: t('vision') },
        { to: '/pages/leadership-structures', label: t('structures') },
        { to: '/program', label: t('program') },
        { to: '/news', label: t('news') },
        { to: '/events', label: t('events') },
        { to: '/media', label: t('media') },
        { to: '/search', label: t('search') },
        { to: '/contact', label: t('contact') },
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-md text-slate-900 sticky top-0 z-50 border-b border-slate-200 shadow-sm">
            <ConfirmDialog
                open={confirmLogout}
                title={t('closeSession')}
                message={t('sessionClosed')}
                confirmLabel={t('logout')}
                tone="danger"
                loading={loggingOut}
                onConfirm={handleLogout}
                onCancel={() => setConfirmLogout(false)}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
                
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-200 overflow-hidden">
                        <img src="/imgs/logo.webp" alt="PME" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-lg tracking-tight leading-none">Parti Maroc Émergent</span>
                        <span className="text-[11px] text-slate-500 font-bold">{t('platformTagline')}</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-2">
                    <div className="flex rounded-md border border-slate-200 bg-slate-50 p-1" aria-label="Langue">
                        {['fr', 'ar'].map(code => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => setLanguage(code)}
                                className={`px-2.5 py-1 rounded text-xs font-black ${language === code ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                            >
                                {code.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(open => !open)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 transition-all text-sm font-bold"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                        >
                            {t('menu')}
                            <span className={`w-2 h-2 border-r-2 border-b-2 border-slate-500 transition-transform ${isMenuOpen ? 'rotate-[-135deg] translate-y-0.5' : 'rotate-45 -translate-y-0.5'}`}></span>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-2">
                                {navItems.map(item => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-all text-sm font-semibold"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/donate" className="px-3 py-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-sm font-extrabold">{t('contribute')}</Link>
                    
                    <div className="w-px h-6 bg-slate-200 mx-2"></div>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/dashboard" className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-all">{t('dashboard')}</Link>
                            <button onClick={() => setConfirmLogout(true)} className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 px-3 py-2 rounded-md hover:bg-red-50 transition-all">{t('logout')}</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 pl-2">
                            <Link to="/login" className="text-sm font-semibold hover:text-emerald-700 transition-colors">{t('login')}</Link>
                            <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-md font-bold text-sm hover:bg-slate-700 transition-all">{t('join')}</Link>
                        </div>
                    )}
                </div>

                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-md" aria-label="Ouvrir le menu">
                    <div className="w-6 h-0.5 bg-slate-900 mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-slate-900 mb-1.5"></div>
                    <div className="w-4 h-0.5 bg-slate-900 ml-2"></div>
                </button>
            </div>

            {isOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200 p-5 space-y-3 shadow-xl">
                    <div className="flex rounded-md border border-slate-200 bg-slate-50 p-1">
                        {['fr', 'ar'].map(code => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => setLanguage(code)}
                                className={`flex-1 px-3 py-2 rounded text-xs font-black ${language === code ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                            >
                                {code.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    {navItems.map(item => (
                        <Link key={item.to} to={item.to} className="block text-base font-semibold py-2" onClick={closeMenu}>{item.label}</Link>
                    ))}
                    <Link to="/donate" className="block text-base font-extrabold text-emerald-700 py-2" onClick={closeMenu}>{t('contribute')}</Link>
                    <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link to="/" className="w-full text-center py-3 border border-slate-200 text-slate-700 rounded-md font-bold" onClick={closeMenu}>{t('home')}</Link>
                                <Link to="/dashboard" className="w-full text-center py-3 bg-slate-900 text-white rounded-md font-bold" onClick={closeMenu}>{t('dashboard')}</Link>
                                <button onClick={() => { closeMenu(); setConfirmLogout(true); }} className="w-full text-center py-3 border border-red-200 text-red-600 rounded-md font-bold">{t('logout')}</button>
                            </>
                        ) : (
                            <Link to="/register" className="w-full text-center py-3 bg-slate-900 text-white rounded-md font-bold" onClick={closeMenu}>{t('join')}</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
