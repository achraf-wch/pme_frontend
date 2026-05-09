import { useEffect, useState } from 'react';
import API, { getBranches } from '../../services/api';
import { ROLES, ROLE_LABELS } from '../AdminDashboard';

const ROLE_COLORS = {
    visitor:           'bg-slate-100 text-slate-600',
    sympathizer:       'bg-blue-100 text-blue-700',
    member:            'bg-emerald-100 text-emerald-700',
    local_official:    'bg-amber-100 text-amber-700',
    regional_official: 'bg-orange-100 text-orange-700',
    central_admin:     'bg-purple-100 text-purple-700',
    super_admin:       'bg-red-100 text-red-700',
};

const AVATAR_COLORS = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
];

function avatarColor(id) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────

function ConfirmDialog({ message, detail, confirmLabel, confirmClass, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-slate-100">
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-2xl">⚠️</div>
                    <h4 className="text-lg font-black text-slate-900">{message}</h4>
                    {detail && <p className="text-slate-500 text-sm">{detail}</p>}
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className={`flex-1 px-4 py-2 rounded-lg text-white font-bold text-sm transition-colors ${confirmClass || 'bg-red-500 hover:bg-red-600'}`}>
                        {confirmLabel || 'Confirmer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── User Card ───────────────────────────────────────────────────────────────

function UserCard({ user, branches, onUpdate, onDelete }) {
    const [confirm, setConfirm] = useState(false);
    const roleName = user.role?.name || user.role || 'visitor';

    return (
        <>
            {confirm && (
                <ConfirmDialog
                    message="Supprimer cet utilisateur ?"
                    detail={`${user.name} sera définitivement supprimé. Cette action est irréversible.`}
                    confirmLabel="Supprimer"
                    confirmClass="bg-red-500 hover:bg-red-600"
                    onConfirm={() => { setConfirm(false); onDelete(user.id); }}
                    onCancel={() => setConfirm(false)}
                />
            )}

            <div className="bg-white border border-slate-100 p-5 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between gap-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 ${avatarColor(user.id)} text-white rounded-xl flex items-center justify-center font-black text-lg shadow`}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                            {user.party_branch && (
                                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">
                                    {user.party_branch.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setConfirm(true)}
                        title="Supprimer"
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                {/* Role badge */}
                <div>
                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${ROLE_COLORS[roleName] || 'bg-slate-100 text-slate-600'}`}>
                        {ROLE_LABELS[roleName] || roleName}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-50 flex-wrap">
                    <select
                        value={roleName}
                        onChange={e => onUpdate(user.id, { role: e.target.value })}
                        className="flex-1 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-2 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                        {ROLES.map(r => (
                            <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                        ))}
                    </select>

                    <select
                        value={user.party_branch_id || ''}
                        onChange={e => onUpdate(user.id, { party_branch_id: e.target.value || null })}
                        className="flex-1 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-0"
                    >
                        <option value="">Sans antenne</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>

                <p className="text-[10px] text-slate-300 font-medium">
                    Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </p>
            </div>
        </>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UsersManager() {
    const [users, setUsers]       = useState([]);
    const [branches, setBranches] = useState([]);
    const [search, setSearch]     = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        fetchUsers();
        getBranches().then(res => setBranches(res.data)).catch(() => setBranches([]));
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/admin/members');
            setUsers(res.data);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id, payload) => {
        await API.put(`/admin/members/${id}`, payload);
        fetchUsers();
    };

    const deleteUser = async (id) => {
        await API.delete(`/admin/members/${id}`);
        fetchUsers();
    };

    const filtered = users.filter(u => {
        const matchSearch = search === '' ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || (u.role?.name || u.role) === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Administration</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">Utilisateurs</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {filtered.length} / {users.length} utilisateurs
                </span>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                    <option value="all">Tous les rôles</option>
                    {ROLES.map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                    ))}
                </select>
            </div>

            {/* Role summary pills */}
            <div className="flex flex-wrap gap-2">
                {ROLES.map(r => {
                    const count = users.filter(u => (u.role?.name || u.role) === r).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                                roleFilter === r
                                    ? (ROLE_COLORS[r] || 'bg-slate-100 text-slate-600') + ' border-transparent shadow'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                        >
                            {ROLE_LABELS[r]} · {count}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-16 text-slate-400">Chargement...</div>
            ) : filtered.length === 0 ? (
                <div className="p-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                    Aucun utilisateur trouvé.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(u => (
                        <UserCard
                            key={u.id}
                            user={u}
                            branches={branches}
                            onUpdate={updateUser}
                            onDelete={deleteUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
