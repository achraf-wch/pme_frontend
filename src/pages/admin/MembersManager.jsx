import { useEffect, useState } from 'react';
import API, { getBranches } from '../../services/api';

const ROLES = [
    'visitor',
    'sympathizer',
    'volunteer',
    'member',
    'local_official',
    'regional_official',
    'central_admin',
    'admin',
    'super_admin',
];

export default function MembersManager() {
    const [members, setMembers] = useState([]);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetchMembers();
        getBranches().then(res => setBranches(res.data)).catch(() => setBranches([]));
    }, []);

    const fetchMembers = async () => {
        const res = await API.get('/admin/members');
        setMembers(res.data);
    };

    const updateMemberField = async (id, payload) => {
        await API.put(`/admin/members/${id}`, payload);
        fetchMembers();
    };

    const deleteMember = async (id) => {
        if (!window.confirm('Supprimer ce membre ?')) return;
        await API.delete(`/admin/members/${id}`);
        fetchMembers();
    };

    return (
        <div className="space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Gestion des Membres</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{members.length} Utilisateurs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map(m => (
                    <div key={m.id} className="bg-white border border-slate-100 p-5 rounded-[2rem] hover:shadow-lg transition-all flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20">
                                    {m.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{m.name}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{m.email}</p>
                                    {m.party_branch && (
                                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">{m.party_branch.name}</p>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => deleteMember(m.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <select
                                value={m.role?.name || ''}
                                onChange={e => updateMemberField(m.id, { role: e.target.value })}
                                className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                {ROLES.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <select
                                value={m.party_branch_id || ''}
                                onChange={e => updateMemberField(m.id, { party_branch_id: e.target.value || null })}
                                className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all max-w-[180px]"
                            >
                                <option value="">Sans antenne</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter italic">
                                Inscrit le {new Date(m.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
