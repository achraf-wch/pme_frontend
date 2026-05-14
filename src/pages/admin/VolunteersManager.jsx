import { useEffect, useState } from 'react';
import API, { updateVolunteerStatus } from '../../services/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function VolunteersManager() {
    const [list, setList]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(null); // { id, name }
    const [pendingStatus, setPendingStatus] = useState(null);

    useEffect(() => { fetchList(); }, []);

    const fetchList = async () => {
        setLoading(true);
        try {
            const res = await API.get('/admin/volunteers');
            setList(res.data);
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        await API.delete(`/admin/volunteers/${id}`);
        setConfirm(null);
        fetchList();
    };

    const requestStatus = (item, status) => {
        if ((item.status || 'pending') === status) return;
        setPendingStatus({ item, status });
    };

    const setStatus = async () => {
        if (!pendingStatus) return;
        const { item, status } = pendingStatus;
        setPendingStatus(null);
        const res = await updateVolunteerStatus(item.id, status);
        setList(prev => prev.map(row => row.id === item.id ? res.data : row));
    };

    if (loading) return <div className="py-16 text-center text-slate-400">Chargement...</div>;

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={Boolean(confirm)}
                title="Supprimer ce bénévole ?"
                message={confirm ? `${confirm.name} sera définitivement supprimé.` : ''}
                confirmLabel="Supprimer"
                tone="danger"
                onConfirm={() => remove(confirm.id)}
                onCancel={() => setConfirm(null)}
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

            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Équipe</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">Bénévoles</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{list.length} inscrits</span>
            </div>

            {list.length === 0 ? (
                <div className="p-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                    Aucun bénévole inscrit.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left">
                                {['Nom', 'Email', 'Téléphone', 'Ville / Section', 'Statut', 'Compétences', 'Motivation', 'Date', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {list.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">{v.name}</td>
                                    <td className="px-4 py-3 text-slate-500">{v.email}</td>
                                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{v.phone || '—'}</td>
                                    <td className="px-4 py-3 text-slate-500">
                                        <p>{v.city || '—'}</p>
                                        {v.party_branch && <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">{v.party_branch.name}</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={v.status || 'pending'}
                                            onChange={e => requestStatus(v, e.target.value)}
                                            disabled={v.status === 'completed'}
                                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 disabled:opacity-50"
                                        >
                                            <option value="pending">Envoyée</option>
                                            <option value="in_progress">En traitement</option>
                                            <option value="approved">Acceptée</option>
                                            <option value="rejected">Refusée</option>
                                            <option value="completed">Terminée</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate" title={v.skills}>{v.skills || '—'}</td>
                                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate" title={v.motivation}>{v.motivation || '—'}</td>
                                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                                        {new Date(v.created_at).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setConfirm({ id: v.id, name: v.name })}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                            title="Supprimer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
