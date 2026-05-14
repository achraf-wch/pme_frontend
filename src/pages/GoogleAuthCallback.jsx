import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithGoogleCode } from '../services/api';

export default function GoogleAuthCallback() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Connexion avec Google...');
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            setMessage('Connexion Google annulée ou refusée.');
            return;
        }

        if (!code) {
            setMessage('Code Google manquant.');
            return;
        }

        const expectedState = sessionStorage.getItem('google_oauth_state');
        const state = searchParams.get('state');
        sessionStorage.removeItem('google_oauth_state');

        if (!expectedState || expectedState !== state) {
            setMessage('Session Google invalide. Veuillez réessayer.');
            return;
        }

        loginWithGoogleCode(code)
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.dispatchEvent(new Event('pme-auth-changed'));
                navigate('/dashboard', { replace: true });
            })
            .catch((err) => {
                setMessage(err.response?.data?.message || 'Connexion Google impossible.');
            });
    }, [navigate, searchParams]);

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
            <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-xl">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-sm font-black text-white">
                    PME
                </div>
                <h1 className="text-2xl font-black text-slate-900">Authentification</h1>
                <p className="mt-3 text-sm font-bold text-slate-500">{message}</p>
                {message !== 'Connexion avec Google...' && (
                    <Link to="/login" className="mt-6 inline-flex rounded-md bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-700">
                        Retour à la connexion
                    </Link>
                )}
            </div>
        </div>
    );
}
