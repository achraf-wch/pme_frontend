import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function StatsPanel() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/admin/stats')
            .then(res => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
    if (!stats) return <p className="text-red-500 font-bold">Erreur de chargement des statistiques.</p>;

    const StatCard = ({ title, value, subValue, icon, color }) => (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color}`}>
                    {icon}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
            </div>
            <div className="space-y-1">
                <h4 className="text-3xl font-black text-slate-800">{value}</h4>
                {subValue && <p className="text-xs font-bold text-slate-400 uppercase">{subValue}</p>}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 text-left">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-4">Tableau de Bord | الإحصائيات</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Utilisateurs" value={stats.users.total} subValue={`${stats.users.admins} Admins`} icon="👥" color="bg-blue-50 text-blue-600" />
                <StatCard title="Membres" value={stats.users.members} subValue="Actifs" icon="🆔" color="bg-emerald-50 text-emerald-600" />
                <StatCard title="Événements" value={stats.events.total} subValue={`${stats.events.registrations} Inscriptions`} icon="📅" color="bg-purple-50 text-purple-600" />
                <StatCard title="Sondages" value={stats.polls.total} subValue={`${stats.polls.votes} Votes`} icon="📊" color="bg-amber-50 text-amber-600" />
                <StatCard title="Newsletter" value={stats.newsletter.subscribers} subValue="Abonnés" icon="📧" color="bg-pink-50 text-pink-600" />
                <StatCard title="Bénévoles" value={stats.volunteers.total} subValue="Inscrits" icon="🤝" color="bg-indigo-50 text-indigo-600" />
                <StatCard title="Demandes PFE" value={stats.membership_requests.pending} subValue="En attente" icon="📝" color="bg-orange-50 text-orange-600" />
                <StatCard title="Sympathisants" value={stats.sympathizers.total} subValue="Total" icon="❤️" color="bg-red-50 text-red-600" />
            </div>
        </div>
    );
}