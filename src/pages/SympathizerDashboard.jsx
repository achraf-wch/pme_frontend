import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function SympathizerDashboard({ user }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Récupération des données de profil au montage[cite: 25]
        API.get('/profile').then(res => setProfile(res.data));
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header d'accueil avec typographie forte[cite: 25] */}
            <div className="mb-12 text-center md:text-left">
                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">
                    Bienvenue, {user?.name} 👋
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Heureux de vous revoir parmi nous dans cette aventure citoyenne.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Carte de Profil (Gauche)[cite: 25] */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative sticky top-8">
                        <div className="h-32 bg-gradient-to-br from-[#1a1a2e] to-blue-900"></div>
                        <div className="px-8 pb-8">
                            <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl -mt-12 mb-6 flex items-center justify-center text-4xl border-4 border-white font-black text-blue-600 italic">
                                {user?.name?.charAt(0)}
                            </div>
                            
                            {profile ? (
                                <div className="space-y-6 text-left">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Rôle Actuel</p>
                                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border border-blue-100">
                                            {profile.role?.name}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identifiant</p>
                                        <p className="text-slate-700 font-black truncate">{profile.email}</p>
                                    </div>
                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Engagé(e) depuis le</p>
                                        <p className="text-slate-800 font-bold">
                                            {new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-10 text-center animate-pulse space-y-4">
                                    <div className="h-4 bg-slate-100 rounded-full w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-slate-100 rounded-full w-1/2 mx-auto"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions & Next Steps (Droite)[cite: 25] */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Appel à l'action vers l'adhésion[cite: 25] */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 text-[15rem] opacity-10 font-black group-hover:rotate-12 transition-transform duration-700">PME</div>
                        <div className="relative z-10 text-left">
                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Passez à l'étape supérieure !</h3>
                            <p className="text-blue-100 font-medium leading-relaxed mb-8 max-w-lg">
                                En devenant membre officiel du PME, vous pourrez participer aux votes internes, intégrer nos comités de réflexion et influencer directement nos projets.
                            </p>
                            <Link to="/membership-request">
                                <button className="px-10 py-5 bg-white text-blue-700 font-black rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs">
                                    Demander l'adhésion officielle
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Prochaines Actions[cite: 25] */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200/50 text-left">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 ml-2">Parcours Citoyen</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link to="/dashboard/polls" className="flex items-center gap-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🗳️</span>
                                <div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Sondages</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Donnez votre avis</p>
                                </div>
                            </Link>
                            <div className="flex items-center gap-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 opacity-60 cursor-not-allowed">
                                <span className="text-3xl grayscale">📅</span>
                                <div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Événements</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Disponible bientôt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}