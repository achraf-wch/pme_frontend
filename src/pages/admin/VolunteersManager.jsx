import { useEffect, useState } from 'react';
import API from '../../services/api';

function ConfirmDialog({ name, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-slate-100">
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-2xl">🗑️</div>
                    <h4 className="text-lg font-black text-slate-900">Supprimer ce bénévole ?</h4>
                    <p className="text-slate-500 text-sm">
                        <span className="font-bold text-slate-700">{name}</span> sera définitivement supprimé.
                    </p>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VolunteersManager() {
    const [list, setList]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(null); // { id, name }

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

    if (loading) return <div className="py-16 text-center text-slate-400">Chargement...</div>;

    return (
        <div className="space-y-6">
            {confirm && (
                <ConfirmDialog
                    name={confirm.name}
                    onConfirm={() => remove(confirm.id)}
                    onCancel={() => setConfirm(null)}
                />
            )}

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
                                {['Nom', 'Email', 'Téléphone', 'Ville', 'Compétences', 'Motivation', 'Date', ''].map(h => (
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
                                    <td className="px-4 py-3 text-slate-500">{v.city || '—'}</td>
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