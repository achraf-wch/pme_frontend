import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DashboardFeed from './member/DashboardFeed';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, roleNameOf } from '../utils/roles';
import NotificationBar from '../components/NotificationBar';

export default function SympathizerDashboard({ user }) {
    const [profile, setProfile] = useState(null);
    const role = roleNameOf(user);

    useEffect(() => {
        API.get('/profile').then(res => setProfile(res.data)).catch(() => setProfile(null));
    }, []);

    const steps = [
        { title: 'Compléter le profil', text: 'Gardez vos informations personnelles à jour.', to: '/member/profile' },
        { title: 'Demander l’adhésion', text: 'Déposez une demande pour devenir membre actif.', to: '/membership-request' },
        { title: 'Suivre les activités', text: 'Consultez les événements publics et internes ouverts.', to: '/events' },
        { title: 'Contribuer', text: 'Soutenez les actions du parti avec une contribution suivie.', to: '/donate' },
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Espace participation</p>
                        <h1 className="text-3xl font-black text-slate-900 mt-1">Bienvenue, {user?.name}</h1>
                        <p className="text-slate-500 mt-2">{ROLE_LABELS[role] || 'Participant'} · parcours citoyen</p>
                        <p className="text-slate-500 mt-2" dir="rtl">{ROLE_DESCRIPTIONS[role]}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <NotificationBar />
                        <Link to="/" className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50">
                            Retour au site
                        </Link>
                        <Link to="/membership-request" className="px-4 py-2 rounded-md bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-600">
                            Demander l’adhésion
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-12 gap-6">
                <aside className="lg:col-span-4">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div className="h-28 bg-slate-900" />
                        <div className="p-6">
                            <div className="w-20 h-20 bg-white rounded-lg shadow-lg -mt-16 mb-5 flex items-center justify-center text-3xl border-4 border-white font-black text-emerald-700">
                                {user?.name?.charAt(0)}
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Rôle actuel</p>
                                    <span className="inline-flex mt-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md text-xs font-black border border-emerald-100">
                                        {ROLE_LABELS[role] || role}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Identifiant</p>
                                    <p className="text-slate-800 font-black truncate mt-1">{profile?.email || user?.email}</p>
                                </div>
                                <div className="pt-5 border-t border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inscrit depuis</p>
                                    <p className="text-slate-800 font-bold mt-1">
                                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'Compte actif'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-8 space-y-6">
                    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6">
                        <DashboardFeed />
                    </section>

                    <section className="bg-slate-900 rounded-lg p-8 text-white">
                        <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Prochaine étape</p>
                        <h2 className="text-3xl font-black mt-3">Transformez votre participation en engagement officiel</h2>
                        <p className="text-slate-300 mt-4 leading-relaxed max-w-2xl">
                            L’adhésion officielle ouvre l’accès au suivi membre, aux votes internes selon éligibilité et aux espaces de contribution organisationnelle.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-4">
                        {steps.map(step => (
                            <Link key={step.title} to={step.to} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all">
                                <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{step.text}</p>
                            </Link>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
}
