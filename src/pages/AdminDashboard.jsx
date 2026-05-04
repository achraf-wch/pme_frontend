import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPendingRequests, approveRequest, rejectRequest } from '../services/api';
import CreatePoll from './admin/CreatePoll';
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
import { ROLE_DESCRIPTIONS, ROLE_LABELS, roleNameOf } from '../utils/roles';

function PendingMembershipRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = () => getPendingRequests().then(res => setRequests(res.data));

    useEffect(() => {
        refresh().finally(() => setLoading(false));
    }, []);

    const approve = (id) => approveRequest(id).then(refresh);
    const reject = (id) => rejectRequest(id).then(refresh);

    if (loading) return <div className="p-10 text-center text-slate-400">Chargement des demandes...</div>;

    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Adhésion</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Demandes en attente</h3>
            </div>
            {requests.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center text-slate-500">
                    Aucune demande en attente.
                </div>
            ) : (
                requests.map(req => (
                    <article key={req.id} className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div>
                            <p className="font-black text-slate-900 text-lg">{req.user.name}</p>
                            <p className="text-emerald-700 text-sm font-semibold">{req.user.email}</p>
                            <p className="text-slate-500 text-sm mt-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                                {req.motivation || 'Aucune motivation fournie.'}
                            </p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <button onClick={() => approve(req.id)} className="px-5 py-2 bg-emerald-700 text-white rounded-md font-bold text-sm">Approuver</button>
                            <button onClick={() => reject(req.id)} className="px-5 py-2 bg-white text-red-600 border border-red-200 rounded-md font-bold text-sm">Rejeter</button>
                        </div>
                    </article>
                ))
            )}
        </div>
    );
}

const TAB_DEFINITIONS = [
    { id: 'stats', label: 'Vue générale', scope: ['local_official', 'regional_official', 'central_admin', 'admin', 'super_admin'], component: <StatsPanel /> },
    { id: 'membership', label: 'Adhésions', scope: ['central_admin', 'admin', 'super_admin'], component: <PendingMembershipRequests /> },
    { id: 'members', label: 'Membres', scope: ['central_admin', 'admin', 'super_admin'], component: <MembersManager /> },
    { id: 'sympathizers', label: 'Sympathisants', scope: ['central_admin', 'admin', 'super_admin'], component: <SympathizersManager /> },
    { id: 'volunteers', label: 'Bénévoles', scope: ['central_admin', 'admin', 'super_admin'], component: <VolunteersManager /> },
    { id: 'polls', label: 'Votes internes', scope: ['central_admin', 'admin', 'super_admin'], component: <CreatePoll /> },
    { id: 'donations', label: 'Contributions', scope: ['central_admin', 'admin', 'super_admin'], component: <DonationsList /> },
    { id: 'news', label: 'Actualités', scope: ['central_admin', 'admin', 'super_admin'], component: <NewsManager /> },
    { id: 'events', label: 'Activités', scope: ['local_official', 'regional_official', 'central_admin', 'admin', 'super_admin'], component: <EventsManager /> },
    { id: 'contacts', label: 'Messages', scope: ['central_admin', 'admin', 'super_admin'], component: <ContactsList /> },
    { id: 'newsletter', label: 'Newsletter', scope: ['central_admin', 'admin', 'super_admin'], component: <NewsletterManager /> },
    { id: 'static', label: 'Pages', scope: ['central_admin', 'admin', 'super_admin'], component: <StaticPagesEditor /> },
    { id: 'media', label: 'Médias', scope: ['local_official', 'regional_official', 'central_admin', 'admin', 'super_admin'], component: <MediaManager /> },
];

export default function AdminDashboard({ user }) {
    const role = roleNameOf(user);
    const [activeTab, setActiveTab] = useState('stats');

    const tabs = useMemo(() => (
        TAB_DEFINITIONS.filter(tab => role === 'super_admin' || tab.scope.includes(role))
    ), [role]);

    useEffect(() => {
        if (!tabs.some(tab => tab.id === activeTab)) {
            setActiveTab(tabs[0]?.id || 'stats');
        }
    }, [activeTab, tabs]);

    const active = tabs.find(tab => tab.id === activeTab) || tabs[0];

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Console administrative</p>
                        <h1 className="text-3xl font-black text-slate-900 mt-1">Tableau de bord</h1>
                        <p className="text-slate-500 mt-2">
                            {user?.name} · {ROLE_LABELS[role] || role}
                        </p>
                        <p className="text-slate-500 mt-2 max-w-2xl" dir="rtl">
                            {ROLE_DESCRIPTIONS[role]}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/" className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50">
                            Retour au site
                        </Link>
                        <Link to="/dashboard" className="px-4 py-2 rounded-md bg-slate-900 text-white font-bold text-sm hover:bg-slate-700">
                            Actualiser l'espace
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-12 gap-6">
                <aside className="lg:col-span-3">
                    <div className="bg-white border border-slate-200 rounded-lg p-3 sticky top-24">
                        <nav className="grid gap-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-4 py-3 rounded-md font-bold text-sm transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-emerald-700 text-white'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="lg:col-span-9">
                    <div className="bg-white rounded-lg p-5 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
                        {active?.component}
                    </div>
                </main>
            </div>
        </div>
    );
}
