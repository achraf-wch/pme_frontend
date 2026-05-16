import { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function StatsPanel() {
    const { t } = useLanguage();
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
            stats.users && { title: t('users'), value: stats.users.total, subValue: `${stats.users.central_admins || 0} ${t('centralAdmins')} · ${stats.users.supervisors || 0} ${t('supervisors')}` },
            stats.users && { title: t('roleLabel_member'), value: stats.users.members, subValue: t('active') },
            stats.events && { title: t('activities'), value: stats.events.total, subValue: `${stats.events.registrations} ${t('registrations')}` },
            stats.news && { title: t('news'), value: stats.news.total, subValue: `${stats.news.published} ${t('published')}` },
            stats.polls && { title: t('internalVotes'), value: stats.polls.total, subValue: `${stats.polls.votes} ${t('votes')}` },
            stats.donations && { title: t('contributions'), value: Number(stats.donations.amount || 0).toLocaleString('fr-FR'), subValue: `${stats.donations.total} ${t('operations')}` },
            stats.newsletter && { title: t('newsletter'), value: stats.newsletter.subscribers, subValue: t('subscribers') },
            stats.volunteers && { title: t('volunteer'), value: stats.volunteers.total, subValue: t('registered') },
            stats.membership_requests && { title: t('pendingRequests'), value: stats.membership_requests.pending, subValue: t('pending') },
            stats.sympathizers && { title: t('sympathizer'), value: stats.sympathizers.total, subValue: t('total') },
            stats.audit && { title: t('securityLog'), value: stats.audit.total, subValue: t('sensitiveActions') },
        ].filter(Boolean);
    }, [stats, t]);

    if (loading) {
        return <div className="p-12 text-center text-slate-400 font-bold">{t('statsLoading')}</div>;
    }

    if (!stats) {
        return <p className="text-red-500 font-bold">{t('statsError')}</p>;
    }

    return (
        <div className="space-y-8 text-left">
            <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">{t('reports')}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{t('analyticsDashboard')}</h3>
                {stats.scope && (
                    <p className="mt-2 text-sm text-slate-500">
                        {t('limitedView')}
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
