import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe, logout } from '../services/api';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
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
    }, []);

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const closeMenu = () => {
        setIsOpen(false);
        setIsMenuOpen(false);
    };
    const navItems = [
        { to: '/', label: 'Accueil' },
        { to: '/about', label: 'Parti' },
        { to: '/pages/vision-mission', label: 'Vision' },
        { to: '/pages/leadership-structures', label: 'Structures' },
        { to: '/program', label: 'Programme' },
        { to: '/news', label: 'Actualités' },
        { to: '/events', label: 'Activités' },
        { to: '/media', label: 'Médiathèque' },
        { to: '/search', label: 'Recherche' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-md text-slate-900 sticky top-0 z-50 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
                
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-200 overflow-hidden">
                        <img src="/imgs/logo.webp" alt="PME" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-lg tracking-tight leading-none">Parti Maroc Émergent</span>
                        <span className="text-[11px] text-slate-500 font-bold" dir="rtl">منصة رقمية حزبية متكاملة</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-2">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(open => !open)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 transition-all text-sm font-bold"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                        >
                            Menu
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
                    <Link to="/donate" className="px-3 py-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-sm font-extrabold">Contribuer</Link>
                    
                    <div className="w-px h-6 bg-slate-200 mx-2"></div>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/dashboard" className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-all">Tableau de bord</Link>
                            <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 px-3 py-2 rounded-md hover:bg-red-50 transition-all">Sortir</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 pl-2">
                            <Link to="/login" className="text-sm font-semibold hover:text-emerald-700 transition-colors">Connexion</Link>
                            <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-md font-bold text-sm hover:bg-slate-700 transition-all">Adhérer</Link>
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
                    {navItems.map(item => (
                        <Link key={item.to} to={item.to} className="block text-base font-semibold py-2" onClick={closeMenu}>{item.label}</Link>
                    ))}
                    <Link to="/donate" className="block text-base font-extrabold text-emerald-700 py-2" onClick={closeMenu}>Contribuer</Link>
                    <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                        {user ? (
                            <Link to="/dashboard" className="w-full text-center py-3 bg-slate-900 text-white rounded-md font-bold" onClick={closeMenu}>Tableau de bord</Link>
                        ) : (
                            <Link to="/register" className="w-full text-center py-3 bg-slate-900 text-white rounded-md font-bold" onClick={closeMenu}>Demander l'adhésion</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
