import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitMembershipRequest } from '../services/api';

export default function MembershipRequest() {
    const [motivation, setMotivation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await submitMembershipRequest(motivation);
            setMessage(res.data.message);
            // Redirection automatique après 2 secondes[cite: 24]
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la soumission');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 text-left">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 italic">
                    Devenir Membre | طلب adhésion
                </h2>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Rejoignez officiellement notre mouvement pour obtenir le droit de vote et influencer nos décisions futures.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                            Votre Motivation (Optionnel)
                        </label>
                        <textarea
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
                            rows="5"
                            className="w-full p-6 rounded-[1.5rem] bg-slate-50 border-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                    >
                        Envoyer ma demande
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-emerald-100 animate-bounce">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-red-100">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}