import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPublicEvent, getStorageUrl, registerForEvent } from '../services/api';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useLanguage } from '../i18n/LanguageContext';

export default function EventDetail() {
    const { t } = useLanguage();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [confirmReserve, setConfirmReserve] = useState(false);
    const [reserving, setReserving] = useState(false);

    useEffect(() => {
        getPublicEvent(id)
            .then(res => setEvent(res.data))
            .catch(() => setEvent(null))
            .finally(() => setLoading(false));
    }, [id]);

    const reserve = async () => {
        if (!localStorage.getItem('token')) {
            setMessage(t('guestReserveText'));
            return;
        }

        setReserving(true);
        try {
            const res = await registerForEvent(id);
            setMessage(res.data?.message || t('registrationConfirmed'));
            setEvent(prev => prev ? { ...prev, has_registered: true, can_register: false } : prev);
        } catch (err) {
            if (err.response?.status === 401) {
                setMessage(t('guestReserveText'));
            } else {
                setMessage(err.response?.data?.message || t('registrationImpossible'));
            }
        } finally {
            setConfirmReserve(false);
            setReserving(false);
        }
    };

    if (loading) return <div className="p-16 text-center text-slate-400 font-bold">{t('loading')}</div>;
    if (!event) return <div className="p-16 text-center text-slate-500 font-bold">Activité introuvable.</div>;

    const isPast = new Date(event.end_time) < new Date();
    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const hasRegistered = Boolean(event.has_registered);

    return (
        <div className="bg-white">
            <ConfirmDialog
                open={confirmReserve}
                title={t('confirmRegistration')}
                message={event ? `Vous allez réserver une place pour "${event.title}".` : ''}
                confirmLabel={t('reserve')}
                tone="success"
                loading={reserving}
                onConfirm={reserve}
                onCancel={() => setConfirmReserve(false)}
            />
            <section className="relative min-h-[520px] overflow-hidden bg-slate-900 text-white">
                {event.attachment_path && (
                    <img src={getStorageUrl(event.attachment_path)} alt={event.title} className="absolute inset-0 h-full w-full object-cover opacity-45" />
                )}
                <div className="absolute inset-0 bg-slate-950/45" />
                <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-end px-6 py-12">
                    <Link to="/events" className="mb-8 text-sm font-black uppercase tracking-widest text-emerald-300">{t('backToActivities')}</Link>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">{isPast ? t('eventFinished') : t('eventUpcoming')}</p>
                    <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">{event.title}</h1>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-slate-100">
                        <span className="rounded-md bg-white/10 px-3 py-2">{new Date(event.start_time).toLocaleString('fr-FR')}</span>
                        <span className="rounded-md bg-white/10 px-3 py-2">{event.location}</span>
                    </div>
                </div>
            </section>

            <main className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-12">
                <article className="lg:col-span-8">
                    {message && <div className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}
                    <h2 className="text-2xl font-black text-slate-900">Détails</h2>
                    <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">{event.description}</p>

                    <section className="mt-12">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-2xl font-black text-slate-900">Récaps</h2>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{event.recaps?.length || 0} publication(s)</span>
                        </div>
                        {!event.recaps?.length ? (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-400">
                                Aucun récap publié pour cette activité.
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {event.recaps.map(recap => (
                                    <article key={recap.id} className="rounded-lg border border-slate-200 bg-white p-5">
                                        <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                                            {new Date(recap.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                        <h3 className="mt-2 text-xl font-black text-slate-900">{recap.title}</h3>
                                        {recap.content && <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{recap.content}</p>}
                                        {recap.photos?.length > 0 && (
                                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                {recap.photos.map(photo => (
                                                    <img key={photo} src={getStorageUrl(photo)} alt={recap.title} className="aspect-[4/3] w-full rounded-lg object-cover" />
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </article>

                <aside className="lg:col-span-4">
                    <div className="sticky top-28 rounded-lg border border-slate-200 bg-slate-50 p-6">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('participation')}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {isPast
                                ? t('finishedEventText')
                                : hasRegistered
                                    ? t('alreadyReservedText')
                                    : isLoggedIn
                                        ? t('memberReserveText')
                                        : t('guestReserveText')}
                        </p>
                        {!isPast && hasRegistered && (
                            <button disabled className="mt-5 w-full rounded-md bg-emerald-100 px-4 py-3 text-sm font-black uppercase tracking-widest text-emerald-700">
                                {t('alreadyReserved')}
                            </button>
                        )}
                        {!isPast && !hasRegistered && isLoggedIn && (
                            <button onClick={() => setConfirmReserve(true)} disabled={reserving} className="mt-5 w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-slate-700 disabled:opacity-50">
                                {reserving ? t('processingAction') : t('reserve')}
                            </button>
                        )}
                        {!isPast && !hasRegistered && !isLoggedIn && (
                            <Link to="/login" className="mt-5 block w-full rounded-md bg-slate-900 px-4 py-3 text-center text-sm font-black uppercase tracking-widest text-white hover:bg-slate-700">
                                {t('loginToReserve')}
                            </Link>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
}
