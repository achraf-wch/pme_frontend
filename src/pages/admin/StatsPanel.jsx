import { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';

export default function StatsPanel() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/admin/stats')
            .then(res => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    const cards = useMemo(() => {
        if (!stats) return [];

        return [
            stats.users && { title: 'Utilisateurs', value: stats.users.total, subValue: `${stats.users.admins || 0} admins` },
            stats.users && { title: 'Membres', value: stats.users.members, subValue: 'Actifs' },
            stats.events && { title: 'Activités', value: stats.events.total, subValue: `${stats.events.registrations} inscriptions` },
            stats.news && { title: 'Actualités', value: stats.news.total, subValue: `${stats.news.published} publiées` },
            stats.polls && { title: 'Votes internes', value: stats.polls.total, subValue: `${stats.polls.votes} votes` },
            stats.donations && { title: 'Contributions', value: Number(stats.donations.amount || 0).toLocaleString('fr-FR'), subValue: `${stats.donations.total} opérations` },
            stats.newsletter && { title: 'Newsletter', value: stats.newsletter.subscribers, subValue: 'Abonnés' },
            stats.volunteers && { title: 'Bénévoles', value: stats.volunteers.total, subValue: 'Inscrits' },
            stats.membership_requests && { title: 'Demandes', value: stats.membership_requests.pending, subValue: 'En attente' },
            stats.sympathizers && { title: 'Sympathisants', value: stats.sympathizers.total, subValue: 'Total' },
            stats.audit && { title: 'Journal sécurité', value: stats.audit.total, subValue: 'Actions sensibles' },
        ].filter(Boolean);
    }, [stats]);

    if (loading) {
        return <div className="p-12 text-center text-slate-400 font-bold">Chargement des indicateurs...</div>;
    }

    if (!stats) {
        return <p className="text-red-500 font-bold">Erreur de chargement des statistiques.</p>;
    }

    return (
        <div className="space-y-8 text-left">
            <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Rapports</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Tableau de bord analytique</h3>
                {stats.scope && (
                    <p className="mt-2 text-sm text-slate-500">
                        Vue limitée au rôle actuel : activités et rapports partiels.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {cards.map(card => (
                    <div key={card.title} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.title}</span>
                        <h4 className="text-3xl font-black text-slate-900 mt-4">{card.value}</h4>
                        {card.subValue && <p className="text-xs font-bold text-slate-400 uppercase mt-1">{card.subValue}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
