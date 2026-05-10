import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
};

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔁 Use the feed endpoint (filters by audience automatically)
        API.get('/events/feed')
            .then(res => setEvents(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black text-[#2c3e50] mb-4 uppercase tracking-tight">Agenda du Parti</h2>
                <p className="text-slate-500 max-w-2xl mx-auto font-light">Participez à nos rencontres, conférences et ateliers pour construire ensemble le Maroc de demain.</p>
                <div className="h-1.5 w-24 bg-blue-500 mx-auto mt-6 rounded-full"></div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Chargement des événements...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <span className="text-4xl mb-4">🗓️</span>
                    <p className="text-slate-500 font-medium">Aucun événement public pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(ev => (
                        <article key={ev.id} className="group bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            {/* Image avec Overlay Date */}
                            <div className="relative h-56">
                                {ev.attachment_path ? (
                                    <img
                                        src={getImageUrl(ev.attachment_path)}
                                        alt={ev.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-[#2c3e50] flex items-center justify-center text-white/20 font-black text-4xl">PME</div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-2xl text-center shadow-lg">
                                    <span className="block text-blue-600 font-black text-xl leading-none">{new Date(ev.start_time).getDate()}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500">{new Date(ev.start_time).toLocaleString('fr-FR', { month: 'short' })}</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">{ev.title}</h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">🕒</span>
                                        <span>{new Date(ev.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">📍</span>
                                        <span className="font-medium">{ev.location}</span>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{ev.description}</p>
                                
                                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                                    {ev.max_attendees && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            Places : <span className="text-blue-500">{ev.max_attendees}</span>
                                        </span>
                                    )}
                                    <Link to={`/events/${ev.id}`} className="text-sm font-black text-[#2c3e50] group-hover:text-blue-600 flex items-center gap-2 transition-colors uppercase tracking-wider">
                                        Parcourir <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
