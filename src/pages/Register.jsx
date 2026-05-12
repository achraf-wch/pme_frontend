import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(name, email, password, passwordConfirmation);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('pme-auth-changed'));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.errors?.password?.[0] || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center px-6 py-12 md:py-16 bg-slate-50/50 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Créer un compte</h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic">Accédez à votre espace personnel</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Nom complet" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                        required 
                    />
                    
                    <input 
                        type="email" 
                        placeholder="Email professionnel ou personnel" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                        required 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirmer" 
                            value={passwordConfirmation} 
                            onChange={e => setPasswordConfirmation(e.target.value)} 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                            required 
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100 uppercase tracking-widest">
                            {error}
                        </p>
                    )}

                    <button 
                        type="submit" 
                        className="w-full py-4 bg-gradient-to-r from-[#2c3e50] to-blue-900 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest text-sm mt-4"
                    >
                        Valider mon compte
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                    <p className="text-slate-500 text-sm font-medium">
                        Déjà inscrit ?{' '}
                        <Link to="/login" className="text-blue-600 font-extrabold hover:text-blue-700">
                            Se connecter ici
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
