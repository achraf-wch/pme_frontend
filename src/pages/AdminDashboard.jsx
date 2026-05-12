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
import UsersManager from './admin/UserManager';
import NewsletterManager from './admin/NewsletterManager';
import StatsPanel from './admin/StatsPanel';
import AuditLogs from './admin/AuditLogs';
import ReportsManager from './admin/ReportsManager';
import DashboardFeed from './member/DashboardFeed';
import NotificationBar from '../components/NotificationBar';

// ─── Role config ────────────────────────────────────────────────────────────

export const ROLES = [
    'visitor',
    'sympathizer',
    'member',
    'local_official',
    'regional_official',
    'central_admin',
    'super_admin',
];

export const ROLE_LABELS = {
    visitor:           'Visiteur',
    sympathizer:       'Soutien',
    member:            'Membre',
    local_official:    'Admin Local',
    regional_official: 'Admin Régional',
    central_admin:     'Administration Centrale',
    super_admin:       'Superviseur Général',
};

export const ROLE_DESCRIPTIONS = {
    visitor:           'Navigation générale, inscription, demandes d\'adhésion, inscription aux événements et dons.',
    sympathizer:       'Création de profils, suivi des demandes et réception des notifications.',
    member:            'Accès à leur espace personnel, mise à jour des informations, suivi de leur statut et vote en cas d\'éligibilité.',
    local_official:    'Accès aux données autorisées et gestion de certaines activités et de rapports partiels.',
    regional_official: 'Accès aux données autorisées et gestion de certaines activités et de rapports partiels.',
    central_admin:     'Gestion du contenu, des adhésions, des dons, des votes et génération de rapports.',
    super_admin:       'Autorité totale sur le système, les paramètres et la sécurité.',
};

export function roleNameOf(user) {
    return user?.role?.name || user?.role || 'visitor';
}

// ─── Pending Membership Requests ────────────────────────────────────────────

function PendingMembershipRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmId, setConfirmId] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const currentRole = roleNameOf(currentUser);

    const refresh = () => getPendingRequests().then(res => setRequests(res.data));

    useEffect(() => {
        refresh().finally(() => setLoading(false));
    }, []);

    const handleConfirm = (id, action) => {
        setConfirmId(id);
        setConfirmAction(action);
    };

    const executeAction = () => {
        const fn = confirmAction === 'approve' ? approveRequest : rejectRequest;
        fn(confirmId).then(() => {
            refresh();
            setConfirmId(null);
            setConfirmAction(null);
        });
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Chargement des demandes...</div>;

    return (
        <div className="space-y-4">
            {/* Confirm Modal */}
            {confirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-slate-100">
                        <div className="text-center space-y-3">
                            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl ${confirmAction === 'approve' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                {confirmAction === 'approve' ? '✅' : '🚫'}
                            </div>
                            <h4 className="text-lg font-black text-slate-900">
                                {confirmAction === 'approve' ? 'Approuver la demande ?' : 'Rejeter la demande ?'}
                            </h4>
                            <p className="text-slate-500 text-sm">Cette action ne peut pas être annulée.</p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setConfirmId(null); setConfirmAction(null); }} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold text-sm hover:bg-slate-50">
                                Annuler
                            </button>
                            <button onClick={executeAction} className={`flex-1 px-4 py-2 rounded-lg text-white font-bold text-sm ${confirmAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'}`}>
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Adhésion</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Demandes en attente</h3>
            </div>

            {requests.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center text-slate-500">
                    Aucune demande en attente.
                </div>
            ) : (
                requests.map(req => {
                    const completed = req.status !== 'pending' || req.review_stage === 'completed';
                    const canApprove = req.status === 'pending';
                    return (
                    <article key={req.id} className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div>
                            <p className="font-black text-slate-900 text-lg">{req.user.name}</p>
                            <p className="text-emerald-700 text-sm font-semibold">{req.user.email}</p>
                            {req.user.party_branch && (
                                <p className="text-xs font-bold text-slate-400 mt-1">{req.user.party_branch.name}</p>
                            )}
                            <div className="mt-3 grid gap-2 text-xs font-bold text-slate-500 sm:grid-cols-2">
                                {req.country && <span>Pays: {req.country}</span>}
                                {req.regional_branch && <span>Région: {req.regional_branch.name}</span>}
                                {req.local_branch && <span>Local: {req.local_branch.name}</span>}
                                {req.age && <span>Âge: {req.age}</span>}
                                {req.sex && <span>Sexe: {req.sex}</span>}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    {req.status}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                    {req.review_stage || 'pending'}
                                </span>
                            </div>
                            {req.central_reviewer && (
                                <p className="mt-2 text-xs font-bold text-slate-500">
                                    Validée par {req.central_reviewer.name}
                                </p>
                            )}
                            {req.super_reviewer && (
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    Finalisée par {req.super_reviewer.name}
                                </p>
                            )}
                            <p className="text-slate-500 text-sm mt-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                                {req.motivation || 'Aucune motivation fournie.'}
                            </p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <button disabled={!canApprove} onClick={() => handleConfirm(req.id, 'approve')} className="px-5 py-2 bg-emerald-700 text-white rounded-md font-bold text-sm hover:bg-emerald-800 transition-colors disabled:opacity-50">
                                {currentRole === 'super_admin' ? 'Valider final' : 'Valider'}
                            </button>
                            <button disabled={completed} onClick={() => handleConfirm(req.id, 'reject')} className="px-5 py-2 bg-white text-red-600 border border-red-200 rounded-md font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50">
                                Rejeter
                            </button>
                        </div>
                    </article>
                );})
            )}
        </div>
    );
}

// ─── Tab Definitions ─────────────────────────────────────────────────────────

const TAB_DEFINITIONS = [
    { id: 'overview',   label: 'Pour moi',        scope: ['local_official', 'regional_official', 'central_admin', 'super_admin'], component: <DashboardFeed /> },
    { id: 'stats',      label: 'Vue générale',    scope: ['local_official', 'regional_official', 'central_admin', 'super_admin'], component: <StatsPanel /> },
    { id: 'reports',    label: 'Rapports',         scope: ['local_official', 'regional_official', 'central_admin', 'super_admin'], component: <ReportsManager /> },
    { id: 'membership', label: 'Adhésions',        scope: ['central_admin', 'super_admin'], component: <PendingMembershipRequests /> },
    { id: 'users',      label: 'Utilisateurs',     scope: ['local_official', 'regional_official', 'central_admin', 'super_admin'], component: <UsersManager /> },
    { id: 'polls',      label: 'Votes internes',   scope: ['central_admin', 'super_admin'], component: <CreatePoll /> },
    { id: 'donations',  label: 'Contributions',    scope: ['central_admin', 'super_admin'], component: <DonationsList /> },
    { id: 'news',       label: 'Actualités',       scope: ['local_official', 'regional_official', 'central_admin', 'super_admin'], component: <NewsManager /> },
    { id: 'events',     label: 'Activités',        scope: ['local_official', 'regional_official', 'central_admin', 'super_admin'], component: <EventsManager /> },
    { id: 'contacts',   label: 'Messages',         scope: ['central_admin', 'super_admin'], component: <ContactsList /> },
    { id: 'newsletter', label: 'Newsletter',       scope: ['central_admin', 'super_admin'], component: <NewsletterManager /> },
    { id: 'static',     label: 'Pages',            scope: ['central_admin', 'super_admin'], component: <StaticPagesEditor /> },
    { id: 'media',      label: 'Médias',           scope: ['local_official', 'regional_official', 'central_admin', 'super_admin'], component: <MediaManager /> },
    { id: 'audit',      label: 'Journal audit',    scope: ['super_admin'], component: <AuditLogs /> },
];

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function AdminDashboard({ user }) {
    const effectiveUser = user || JSON.parse(localStorage.getItem('user') || 'null');
    const role = roleNameOf(effectiveUser);
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = useMemo(() => (
        TAB_DEFINITIONS.filter(tab => {
            if (role === 'super_admin' && tab.id === 'overview') {
                return false;
            }

            return role === 'super_admin' || tab.scope.includes(role);
        })
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
                            {effectiveUser?.name} · <span className="font-semibold text-slate-700">{ROLE_LABELS[role] || role}</span>
                        </p>
                        <p className="text-slate-400 text-sm mt-1 max-w-2xl" dir="rtl">
                            {ROLE_DESCRIPTIONS[role]}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <NotificationBar />
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
