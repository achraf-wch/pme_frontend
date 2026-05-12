import { useState } from 'react';
import { Link } from 'react-router-dom';
import ActivePolls from './member/ActivePolls';
import DashboardFeed from './member/DashboardFeed';
import MyDonations from './member/MyDonations';
import MyEvents from './member/MyEvents';
import MyMedia from './member/MyMedia';
import MyNews from './member/MyNews';
import ProfileEditor from './member/ProfileEditor';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, roleNameOf } from '../utils/roles';
import NotificationBar from '../components/NotificationBar';

export default function MemberDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('overview');
    const role = roleNameOf(user);

    const tabs = [
        { id: 'overview', label: 'Pour moi', component: <DashboardFeed /> },
        { id: 'profile', label: 'Profil', component: <ProfileEditor /> },
        { id: 'polls', label: 'Votes ouverts', component: <ActivePolls /> },
        { id: 'news', label: 'Actualités', component: <MyNews /> },
        { id: 'media', label: 'Médias', component: <MyMedia /> },
        { id: 'donations', label: 'Contributions', component: <MyDonations /> },
        { id: 'events', label: 'Activités', component: <MyEvents /> },
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Espace membre</p>
                        <h1 className="text-3xl font-black text-slate-900 mt-1">Bienvenue, {user?.name}</h1>
                        <p className="text-slate-500 mt-2">{ROLE_LABELS[role] || 'Membre'} · accès sécurisé</p>
                        <p className="text-slate-500 mt-2" dir="rtl">{ROLE_DESCRIPTIONS[role]}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <NotificationBar />
                        <Link to="/" className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50">
                            Retour au site
                        </Link>
                        <Link to="/donate" className="px-4 py-2 rounded-md bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-600">
                            Contribuer
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {[
                        ['Statut', ROLE_LABELS[role] || role],
                        ['Vote interne', 'Selon votre éligibilité'],
                        ['Contributions', 'Historique personnel'],
                        ['Activités', 'Inscriptions suivies'],
                    ].map(([label, value]) => (
                        <div key={label} className="bg-white border border-slate-200 rounded-lg p-5">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className="font-black text-slate-900 mt-2">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-2 mb-6 flex flex-wrap gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[140px] px-4 py-3 rounded-md text-sm font-black transition-all ${
                                activeTab === tab.id
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-8 min-h-[420px]">
                    {tabs.find(t => t.id === activeTab)?.component}
                </section>
            </div>
        </div>
    );
}
