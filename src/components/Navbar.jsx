import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe, logout } from '../services/api';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <nav className="bg-[#2c3e50]/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10 shadow-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center font-black text-white shadow-lg group-hover:rotate-12 transition-transform">
                        PME
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-xl tracking-tight leading-none">Le PME</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">Maroc Émergent</span>
                    </div>
                </Link>

                {/* Desktop Menu - Avec "Accueil" et tes liens originaux */}
                <div className="hidden md:flex items-center space-x-1">
                    <Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-bold flex items-center gap-2">
                        <span className="text-lg"></span> Accueil
                    </Link>
                    <Link to="/news" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">News</Link>
                    <Link to="/events" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">Events</Link>
                    <Link to="/donate" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium text-emerald-400 font-bold">Donate</Link>
                    <Link to="/contact" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">Contact</Link>
                    <Link to="/media" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">Gallery</Link>
                    <Link to="/about" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm font-medium">About</Link>
                    
                    <div className="w-px h-6 bg-white/20 mx-3"></div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="text-sm font-bold bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">Dashboard</Link>
                            <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-red-400 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">Logout</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 pl-2">
                            <Link to="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">Login</Link>
                            <Link to="/register" className="bg-white text-[#2c3e50] px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 transition-all">Register</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-white/5 rounded-lg">
                    <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                    <div className="w-4 h-0.5 bg-white ml-2"></div>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#2c3e50] border-t border-white/5 p-6 space-y-4 animate-in slide-in-from-top duration-300">
                    <Link to="/" className="block text-lg font-bold" onClick={() => setIsOpen(false)}>🏠 Accueil</Link>
                    <Link to="/news" className="block text-lg" onClick={() => setIsOpen(false)}>News</Link>
                    <Link to="/events" className="block text-lg" onClick={() => setIsOpen(false)}>Events</Link>
                    <Link to="/donate" className="block text-lg text-emerald-400" onClick={() => setIsOpen(false)}>Donate</Link>
                    <Link to="/contact" className="block text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                        {user ? (
                            <Link to="/dashboard" className="w-full text-center py-3 bg-blue-600 rounded-xl font-bold" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        ) : (
                            <Link to="/register" className="w-full text-center py-3 bg-white text-[#2c3e50] rounded-xl font-bold" onClick={() => setIsOpen(false)}>Register Now</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}