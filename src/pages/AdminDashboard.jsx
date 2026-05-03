import { useState, useEffect } from 'react';
// ON GARDE TES IMPORTS ORIGINAUX ICI
import { getPendingRequests, approveRequest, rejectRequest } from '../services/api';
import CreatePoll from './admin/CreatePoll';
import AdminPollList from './admin/AdminPollList';
import DonationsList from './admin/DonationsList';
import NewsManager from './admin/NewsManager';
import ContactsList from './admin/ContactsList';
import EventsManager from './admin/EventsManager';
import StaticPagesEditor from './admin/StaticPagesEditor';
import MediaManager from './admin/MediaManager';
import MembersManager from './admin/MembersManager';
import SympathizersManager from './admin/SympathizersManager';
import VolunteersManager from './admin/VolunteersManager';
import NewsletterManager from './admin/NewsletterManager';
import StatsPanel from './admin/StatsPanel';

function PendingMembershipRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPendingRequests().then(res => setRequests(res.data)).finally(() => setLoading(false));
    }, []);

    const approve = (id) => approveRequest(id).then(() => getPendingRequests().then(res => setRequests(res.data)));
    const reject  = (id) => rejectRequest(id).then(() => getPendingRequests().then(res => setRequests(res.data)));

    if (loading) return <div className="p-10 text-center text-slate-400">Chargement...</div>;
    
    return (
        <div className="grid gap-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-tight">Demandes d'adhésion</h3>
            {requests.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-500">
                    Aucune demande en attente.
                </div>
            ) : (
                requests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow text-left">
                        <div>
                            <p className="font-bold text-slate-800 text-lg">{req.user.name}</p>
                            <p className="text-blue-500 text-sm font-medium">{req.user.email}</p>
                            <p className="text-slate-500 text-sm mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                "{req.motivation || 'Aucune motivation'}"
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => approve(req.id)} className="px-5 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20">Approuver</button>
                            <button onClick={() => reject(req.id)} className="px-5 py-2 bg-white text-red-500 border border-red-100 rounded-xl font-bold text-sm">Rejeter</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default function AdminDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('stats');

    const tabs = [
        { id: 'stats', label: '📊 Statistics', component: <StatsPanel /> },
        { id: 'membership', label: '📩 Membership', component: <PendingMembershipRequests /> },
        { id: 'members', label: '👥 Members', component: <MembersManager /> },
        { id: 'sympathizers', label: '🤝 Sympathizers', component: <SympathizersManager /> },
        { id: 'volunteers', label: '🙋 Volunteers', component: <VolunteersManager /> },
        { id: 'polls', label: '🗳️ Polls', component: <><CreatePoll /><AdminPollList /></> },
        { id: 'donations', label: '💰 Donations', component: <DonationsList /> },
        { id: 'news', label: '📰 News', component: <NewsManager /> },
        { id: 'events', label: '📅 Events', component: <EventsManager /> },
        { id: 'contacts', label: '📞 Contacts', component: <ContactsList /> },
        { id: 'newsletter', label: '📧 Newsletter', component: <NewsletterManager /> },
        { id: 'static', label: '📄 Static Pages', component: <StaticPagesEditor /> },
        { id: 'media', label: '🖼️ Media', component: <MediaManager /> },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar avec tous les onglets */}
            <aside className="w-72 bg-[#2c3e50] text-white p-6 hidden lg:block sticky top-0 h-screen overflow-y-auto">
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center font-black text-2xl shadow-xl">A</div>
                    <h2 className="font-black uppercase tracking-widest text-sm">Administration</h2>
                    <p className="text-slate-400 text-[10px] mt-1 italic">{user?.name}</p>
                </div>
                <nav className="space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-3 ${
                                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-8 md:p-12">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 min-h-[70vh]">
                    {tabs.find(t => t.id === activeTab)?.component}
                </div>
            </main>
        </div>
    );
}