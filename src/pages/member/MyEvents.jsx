import { useEffect, useState } from 'react';
import { getMyEvents, getPublicEvents, registerForEvent } from '../../services/api';

export default function MyEvents() {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [myRes, availRes] = await Promise.all([getMyEvents(), getPublicEvents()]);
            setRegisteredEvents(myRes.data);
            setAvailableEvents(availRes.data);
        } catch (err) { console.error(err); }
    };

    const handleRegister = async (event) => {
        if (!window.confirm(`Confirmer votre inscription à "${event.title}" ?`)) return;
        setLoading(true);
        try {
            await registerForEvent(event.id);
            setMessage('Inscription réussie !');
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Erreur lors de l’inscription');
        } finally { setLoading(false); }
    };

    const EventCard = ({ ev, isRegistered }) => (
        <div className={`p-6 rounded-[2rem] border transition-all ${isRegistered ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">{ev.title}</h4>
                {isRegistered && <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Inscrit</span>}
            </div>
            <div className="space-y-1 mb-6">
                <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">📍 {ev.location}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">📅 {new Date(ev.start_time).toLocaleString('fr-FR')}</p>
            </div>
            {!isRegistered && (
                <button 
                    onClick={() => handleRegister(ev)} 
                    disabled={loading}
                    className="w-full py-3 bg-[#1a1a2e] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                    {loading ? 'Traitement...' : "Réserver ma place"}
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-12 text-left">
            {message && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                    {message}
                </div>
            )}
            <section>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-6 italic">Mes Inscriptions | مشاركاتي</h3>
                {registeredEvents.length === 0 ? (
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center">Aucun événement prévu.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {registeredEvents.map(reg => <EventCard key={reg.id} ev={reg.event} isRegistered={true} />)}
                    </div>
                )}
            </section>

            <section>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-6 italic">À Découvrir | فعاليات قادمة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableEvents.map(ev => <EventCard key={ev.id} ev={ev} isRegistered={false} />)}
                </div>
            </section>
        </div>
    );
}
