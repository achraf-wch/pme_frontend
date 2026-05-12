import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActivePolls, getMedia, getPublicEvents, getMyEvents, getMyNews, registerForEvent } from '../../services/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function DashboardFeed() {
    const [polls, setPolls] = useState([]);
    const [events, setEvents] = useState([]);
    const [news, setNews] = useState([]);
    const [media, setMedia] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [pendingEvent, setPendingEvent] = useState(null);
    const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        setLoading(true);
        const [pollRes, eventRes, registeredRes, newsRes, mediaRes] = await Promise.allSettled([
            getActivePolls(),
            getPublicEvents(),
            getMyEvents(),
            getMyNews(),
            getMedia({ audience: 'mine' }),
        ]);

        setPolls(pollRes.status === 'fulfilled' ? pollRes.value.data : []);
        setEvents(eventRes.status === 'fulfilled' ? eventRes.value.data : []);
        setRegisteredEventIds(new Set(
            registeredRes.status === 'fulfilled'
                ? registeredRes.value.data.map(reg => reg.event_id || reg.event?.id).filter(Boolean)
                : []
        ));
        setNews(newsRes.status === 'fulfilled' ? newsRes.value.data : []);
        setMedia(mediaRes.status === 'fulfilled' ? mediaRes.value.data : []);
        setLoading(false);
    };

    const reserve = (event) => setPendingEvent(event);

    const confirmReserve = async () => {
        if (!pendingEvent) return;
        const event = pendingEvent;
        setPendingEvent(null);
        try {
            await registerForEvent(event.id);
            setMessage('Inscription confirmée.');
            fetchFeed();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Inscription impossible.');
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-400 font-bold">Chargement de votre espace...</div>;
    }

    return (
        <div className="space-y-8 text-left">
            <ConfirmDialog
                open={Boolean(pendingEvent)}
                title="Réserver cette activité ?"
                message={pendingEvent ? `Vous allez confirmer votre inscription à "${pendingEvent.title}".` : ''}
                confirmLabel="Réserver"
                tone="success"
                onConfirm={confirmReserve}
                onCancel={() => setPendingEvent(null)}
            />

            {message && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                    {message}
                </div>
            )}

            <section>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-xl font-black text-slate-900">Votes ouverts</h3>
                    <Link to="/member/active-polls" className="text-xs font-black text-emerald-700 uppercase tracking-widest">Voir tout</Link>
                </div>
                {polls.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Aucun vote ouvert pour votre rôle.</p>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                        {polls.slice(0, 4).map(poll => (
                            <Link key={poll.id} to="/member/active-polls" className="rounded-lg border border-slate-200 bg-white p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                                <p className="text-sm font-black text-slate-900">{poll.title}</p>
                                <p className="mt-2 text-xs font-bold text-slate-400">Fin le {new Date(poll.end_date).toLocaleDateString('fr-FR')}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-xl font-black text-slate-900">Activités pour vous</h3>
                    <Link to="/member/my-events" className="text-xs font-black text-emerald-700 uppercase tracking-widest">Gérer</Link>
                </div>
                {events.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Aucune activité visible pour votre rôle.</p>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                        {events.slice(0, 4).map(event => {
                            const alreadyReserved = registeredEventIds.has(event.id);
                            return (
                            <article key={event.id} className="rounded-lg border border-slate-200 bg-white p-4">
                                <p className="text-sm font-black text-slate-900">{event.title}</p>
                                <p className="mt-2 text-xs font-bold text-slate-500">{event.location}</p>
                                <p className="mt-1 text-xs text-slate-400">{new Date(event.start_time).toLocaleString('fr-FR')}</p>
                                <button
                                    onClick={() => reserve(event)}
                                    disabled={alreadyReserved}
                                    className="mt-4 w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-700 disabled:bg-emerald-100 disabled:text-emerald-700 disabled:hover:bg-emerald-100"
                                >
                                    {alreadyReserved ? 'Déjà réservé' : 'Réserver'}
                                </button>
                            </article>
                        );})}
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-xl font-black text-slate-900">Actualités ciblées</h3>
                    <Link to="/news" className="text-xs font-black text-emerald-700 uppercase tracking-widest">Lire</Link>
                </div>
                {news.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Aucune actualité visible pour votre rôle.</p>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                        {news.slice(0, 4).map(item => (
                            <Link key={item.id} to={`/news/${item.id}`} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                                <p className="text-sm font-black text-slate-900">{item.title}</p>
                                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{item.content}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-xl font-black text-slate-900">Médias pour vous</h3>
                    <Link to="/media" className="text-xs font-black text-emerald-700 uppercase tracking-widest">Ouvrir</Link>
                </div>
                {media.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Aucun média visible pour votre rôle.</p>
                ) : (
                    <div className="grid gap-3 md:grid-cols-4">
                        {media.slice(0, 4).map(item => (
                            <Link key={item.id} to="/media" className="rounded-lg border border-slate-200 bg-white p-3 hover:border-emerald-200 hover:shadow-sm transition-all">
                                {item.file_type?.startsWith('image/') ? (
                                    <img src={item.file_url} alt={item.file_name} className="aspect-square w-full rounded-md object-cover" />
                                ) : (
                                    <div className="aspect-square w-full rounded-md bg-slate-100 flex items-center justify-center text-slate-400 font-black">DOC</div>
                                )}
                                <p className="mt-2 truncate text-xs font-black text-slate-700">{item.file_name}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
