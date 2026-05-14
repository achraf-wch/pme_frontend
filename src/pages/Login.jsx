import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const GOOGLE_CLIENT_ID = '960223834066-us8s5rj2sbu3rnm0nedcr3c6rm12hc68.apps.googleusercontent.com';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID;
    const googleRedirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('pme-auth-changed'));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleLogin = () => {
        if (!googleClientId) {
            setError('Google login is not configured.');
            return;
        }

        const state = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
        sessionStorage.setItem('google_oauth_state', state);

        const params = new URLSearchParams({
            client_id: googleClientId,
            redirect_uri: googleRedirectUri,
            response_type: 'code',
            scope: 'openid email profile',
            prompt: 'select_account',
            state,
        });

        window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-center px-6 py-12 md:py-20 bg-slate-50/50 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 transform transition-all">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2c3e50] text-white rounded-2xl font-black text-lg mb-4 shadow-lg">PME</div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Connexion</h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Espace Membre</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                            required 
                        />
                    </div>

                    <div>
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                            required 
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 text-center uppercase tracking-wider">
                            {error}
                        </p>
                    )}

                    <button 
                        type="submit" 
                        className="w-full py-4 bg-[#2c3e50] hover:bg-slate-800 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest text-sm mt-2"
                    >
                        Se connecter
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-slate-100" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ou</span>
                    <span className="h-px flex-1 bg-slate-100" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition-all hover:bg-slate-50"
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-xs font-black text-blue-600">G</span>
                    Continuer avec Google
                </button>

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Pas encore membre ?{' '}
                        <Link to="/register" className="text-blue-600 font-extrabold hover:text-blue-700 transition-colors">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
