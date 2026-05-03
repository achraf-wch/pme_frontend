import { useState } from 'react';
import ActivePolls from './member/ActivePolls';
import MyDonations from './member/MyDonations';
import MyEvents from './member/MyEvents';
import ProfileEditor from './member/ProfileEditor';

export default function MemberDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile',   label: 'Profil',     component: <ProfileEditor /> },
        { id: 'polls',     label: 'Sondages',   component: <ActivePolls /> },
        { id: 'donations', label: 'Donations',  component: <MyDonations /> },
        { id: 'events',    label: 'Événements',  component: <MyEvents /> },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* En-tête du Tableau de Bord */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
                <div className="text-left">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Espace Officiel</p>
                    <h2 className="text-4xl font-black text-[#1a1a2e] uppercase tracking-tighter italic">
                        Tableau de bord <span className="text-slate-400">/ Membre</span>
                    </h2>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-slate-500 font-medium">Ravi de vous revoir, <span className="text-[#1a1a2e] font-black">{user?.name}</span></p>
                </div>
            </div>

            {/* Navigation par Onglets */}
            <div className="flex flex-wrap gap-2 mb-10 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[120px] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                            ? 'bg-[#1a1a2e] text-[#c9a84c] shadow-lg shadow-blue-900/20' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Zone de Contenu Dynamique */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 min-h-[400px]">
                <div className="animate-fadeIn">
                    {tabs.find(t => t.id === activeTab)?.component}
                </div>
            </div>

            {/* Footer informatif */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
                <div className="p-6 border border-dashed border-slate-300 rounded-2xl flex items-center gap-4">
                    <span className="text-2xl">🛡️</span>
                    <p className="text-[9px] font-black uppercase tracking-widest leading-tight text-left">Accès Sécurisé <br/>Membre Vérifié</p>
                </div>
                <div className="p-6 border border-dashed border-slate-300 rounded-2xl flex items-center gap-4">
                    <span className="text-2xl">🏛️</span>
                    <p className="text-[9px] font-black uppercase tracking-widest leading-tight text-left">Influence Directe <br/>Sur les Projets</p>
                </div>
                <div className="p-6 border border-dashed border-slate-300 rounded-2xl flex items-center gap-4">
                    <span className="text-2xl">🤝</span>
                    <p className="text-[9px] font-black uppercase tracking-widest leading-tight text-left">Soutien Actif <br/>Communautaire</p>
                </div>
            </div>
        </div>
    );
}