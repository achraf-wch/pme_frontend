import { useEffect, useState } from 'react';
import API, { getStorageUrl } from '../../services/api';
import { Link } from 'react-router-dom';

export default function UpcomingEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        API.get('/events/feed')
            .then(res => {
                const upcoming = res.data.filter(ev => new Date(ev.end_time) > new Date());
                setEvents(upcoming.slice(0, 3));
            })
            .catch(() => setEvents([]));
    }, []);

    return (
        <section className="bg-slate-50 py-16 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                    <div>
                        <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-2">Activités | الأنشطة</p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">Prochains événements</h2>
                        <p className="text-slate-500 mt-2" dir="rtl">تسجيل وتتبع المشاركين في الأنشطة الحزبية</p>
                    </div>
                    <Link to="/events" className="text-emerald-700 font-bold">Toutes les activités →</Link>
                </div>

                {events.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-200 rounded-lg p-10 text-center text-slate-500">
                        Aucun événement public à venir pour le moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.map(ev => (
                            <article key={ev.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                {ev.attachment_path && (
                                    <img src={getStorageUrl(ev.attachment_path)} alt={ev.title} className="w-full h-44 object-cover" />
                                )}
                                <div className="p-5">
                                    <h3 className="font-black text-lg text-slate-900">{ev.title}</h3>
                                    <p className="text-sm text-emerald-700 font-bold mt-3">{new Date(ev.start_time).toLocaleString('fr-FR')}</p>
                                    <p className="text-sm text-slate-500 mt-1">{ev.location}</p>
                                    <p className="text-sm text-slate-600 mt-4 leading-relaxed">{ev.description?.substring(0, 120)}...</p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
