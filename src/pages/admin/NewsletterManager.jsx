import { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function NewsletterManager() {
    const [subscribers, setSubscribers] = useState([]);
    const [form, setForm] = useState({ subject: '', body: '' });
    const [message, setMessage] = useState(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [removing, setRemoving] = useState(null);

    useEffect(() => { fetchSubscribers(); }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/admin/newsletter');
            setSubscribers(res.data);
        } catch {
            setMessage({ type: 'error', text: 'Impossible de charger les abonnés.' });
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscribers = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return subscribers;
        return subscribers.filter(item => item.email.toLowerCase().includes(term));
    }, [query, subscribers]);

    const remove = async () => {
        if (!removing) return;
        const id = removing.id;
        setRemoving(null);
        try {
            await API.delete(`/admin/newsletter/${id}`);
            setSubscribers(prev => prev.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Abonné retiré de la liste.' });
        } catch {
            setMessage({ type: 'error', text: 'Suppression impossible pour le moment.' });
        }
    };

    const sendNewsletter = async (e) => {
        e.preventDefault();
        setSending(true);
        setMessage(null);
        try {
            const res = await API.post('/admin/newsletter/send', form);
            setMessage({ type: 'success', text: res.data.message || 'Newsletter envoyée.' });
            setForm({ subject: '', body: '' });
        } catch {
            setMessage({ type: 'error', text: 'Impossible d’envoyer la newsletter.' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={Boolean(removing)}
                title="Retirer cet abonné ?"
                message={removing ? `${removing.email} ne recevra plus les prochaines newsletters.` : ''}
                confirmLabel="Retirer"
                tone="danger"
                onConfirm={remove}
                onCancel={() => setRemoving(null)}
            />

            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Communication</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">Newsletter</h3>
                    <p className="mt-2 text-sm text-slate-500">Préparez un message et contrôlez la liste des abonnés depuis un seul espace.</p>
                </div>
                <div className="rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">
                    {subscribers.length} abonné{subscribers.length !== 1 ? 's' : ''}
                </div>
            </div>

            {message && (
                <div className={`rounded-md border px-4 py-3 text-sm font-bold ${message.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={sendNewsletter} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Sujet</label>
                    <input
                        type="text"
                        placeholder="Sujet de la newsletter"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        required
                        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-emerald-100"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Message</label>
                    <textarea
                        placeholder="Rédigez le contenu à envoyer aux abonnés..."
                        value={form.body}
                        onChange={e => setForm({ ...form, body: e.target.value })}
                        required
                        rows="6"
                        className="w-full resize-y rounded-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-100"
                    />
                </div>
                <button
                    type="submit"
                    disabled={sending || subscribers.length === 0}
                    className="rounded-md bg-slate-900 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {sending ? 'Envoi...' : 'Envoyer à tous les abonnés'}
                </button>
            </form>

            <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-lg font-black text-slate-900">Abonnés</h4>
                    <input
                        type="search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Rechercher un email"
                        className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 sm:max-w-xs"
                    />
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200">
                    {loading ? (
                        <div className="p-8 text-center text-sm font-bold text-slate-400">Chargement...</div>
                    ) : filteredSubscribers.length === 0 ? (
                        <div className="p-8 text-center text-sm font-bold text-slate-400">Aucun abonné trouvé.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Inscription</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredSubscribers.map(item => (
                                        <tr key={item.id} className="bg-white">
                                            <td className="px-4 py-3 font-bold text-slate-900">{item.email}</td>
                                            <td className="px-4 py-3 text-slate-500">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setRemoving(item)}
                                                    className="rounded-md border border-red-100 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                                                >
                                                    Retirer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
