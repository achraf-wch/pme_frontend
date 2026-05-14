import { useEffect, useMemo, useState } from 'react';
import API, { updateSympathizerStatus } from '../../services/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function SympathizersManager() {
    const [list, setList] = useState([]);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);
    const [pendingStatus, setPendingStatus] = useState(null);

    useEffect(() => { fetchSympathizers(); }, []);

    const fetchSympathizers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/admin/sympathizers');
            setList(res.data);
        } catch {
            setMessage({ type: 'error', text: 'Impossible de charger les sympathisants.' });
        } finally {
            setLoading(false);
        }
    };

    const filteredList = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return list;
        return list.filter(item => (
            [item.name, item.email, item.phone, item.city, item.message]
                .filter(Boolean)
                .some(value => value.toLowerCase().includes(term))
        ));
    }, [query, list]);

    const remove = async () => {
        if (!removing) return;
        const id = removing.id;
        setRemoving(null);
        try {
            await API.delete(`/admin/sympathizers/${id}`);
            setList(prev => prev.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Sympathisant supprimé.' });
        } catch {
            setMessage({ type: 'error', text: 'Suppression impossible pour le moment.' });
        }
    };

    const requestStatus = (item, status) => {
        if ((item.status || 'pending') === status) return;
        setPendingStatus({ item, status });
    };

    const setStatus = async () => {
        if (!pendingStatus) return;
        const { item, status } = pendingStatus;
        setPendingStatus(null);
        try {
            const res = await updateSympathizerStatus(item.id, status);
            setList(prev => prev.map(row => row.id === item.id ? res.data : row));
            setMessage({ type: 'success', text: 'Statut mis à jour.' });
        } catch {
            setMessage({ type: 'error', text: 'Mise à jour impossible.' });
        }
    };

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={Boolean(removing)}
                title="Supprimer ce sympathisant ?"
                message={removing ? `${removing.name} sera retiré de la liste des sympathisants.` : ''}
                confirmLabel="Supprimer"
                tone="danger"
                onConfirm={remove}
                onCancel={() => setRemoving(null)}
            />
            <ConfirmDialog
                open={Boolean(pendingStatus)}
                title="Changer le statut ?"
                message={pendingStatus ? `${pendingStatus.item.name} passera au statut "${pendingStatus.status}".` : ''}
                confirmLabel="Mettre à jour"
                tone="success"
                onConfirm={setStatus}
                onCancel={() => setPendingStatus(null)}
            />

            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Communauté</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">Sympathisants</h3>
                    <p className="mt-2 text-sm text-slate-500">Consultez, recherchez et nettoyez les demandes de soutien.</p>
                </div>
                <div className="rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">
                    {list.length} entrée{list.length !== 1 ? 's' : ''}
                </div>
            </div>

            {message && (
                <div className={`rounded-md border px-4 py-3 text-sm font-bold ${message.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-lg font-black text-slate-900">Liste des sympathisants</h4>
                <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Nom, email, ville..."
                    className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-100 sm:max-w-xs"
                />
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
                {loading ? (
                    <div className="p-8 text-center text-sm font-bold text-slate-400">Chargement...</div>
                ) : filteredList.length === 0 ? (
                    <div className="p-8 text-center text-sm font-bold text-slate-400">Aucun sympathisant trouvé.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Contact</th>
                                    <th className="px-4 py-3">Téléphone</th>
                                    <th className="px-4 py-3">Ville / Section</th>
                                    <th className="px-4 py-3">Statut</th>
                                    <th className="px-4 py-3">Message</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredList.map(item => (
                                    <tr key={item.id} className="bg-white align-top">
                                        <td className="px-4 py-3">
                                            <p className="font-black text-slate-900">{item.name}</p>
                                            <p className="mt-1 text-xs font-bold text-emerald-700">{item.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{item.phone || '-'}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            <p>{item.city || '-'}</p>
                                            {item.party_branch && <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">{item.party_branch.name}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={item.status || 'pending'}
                                                onChange={e => requestStatus(item, e.target.value)}
                                                disabled={item.status === 'completed'}
                                                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 disabled:opacity-50"
                                            >
                                                <option value="pending">Envoyée</option>
                                                <option value="in_progress">En traitement</option>
                                                <option value="approved">Acceptée</option>
                                                <option value="rejected">Refusée</option>
                                                <option value="completed">Terminée</option>
                                            </select>
                                        </td>
                                        <td className="max-w-sm px-4 py-3 text-slate-500">
                                            <p className="line-clamp-3">{item.message || 'Aucun message.'}</p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setRemoving(item)}
                                                className="rounded-md border border-red-100 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
