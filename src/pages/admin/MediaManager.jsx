import { useEffect, useState, useRef } from 'react';
import { getBranches, getMedia, uploadMedia, deleteMedia } from '../../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const AUDIENCE_OPTIONS = [
    { value: 'public',            label: 'Public',                 icon: '🌐' },
    { value: 'visitor',           label: 'Visiteurs',              icon: '👤' },
    { value: 'sympathizer',       label: 'Sympathisants',          icon: '🤝' },
    { value: 'volunteer',         label: 'Bénévoles',              icon: '🙋' },
    { value: 'member',            label: 'Membres',                icon: '✅' },
    { value: 'local_official',    label: 'Responsables locaux',    icon: '🏘️' },
    { value: 'regional_official', label: 'Responsables régionaux', icon: '🏛️' },
    { value: 'central_admin',     label: 'Admin Central',          icon: '⚙️' },
    { value: 'super_admin',       label: 'Superviseur',            icon: '⭐' },
];

function currentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}

function currentRole() {
    const user = currentUser();
    return user?.role?.name || user?.role || 'visitor';
}

function isBranchOfficial(role = currentRole()) {
    return ['local_official', 'regional_official'].includes(role);
}

function allowedAudienceOptions() {
    const role = currentRole();
    if (isBranchOfficial(role)) {
        return AUDIENCE_OPTIONS.filter(opt => opt.value === 'member');
    }
    return AUDIENCE_OPTIONS;
}

function writableBranches(branches) {
    const role = currentRole();
    const user = currentUser();
    if (isBranchOfficial(role)) {
        return branches.filter(branch => String(branch.id) === String(user?.party_branch_id));
    }
    return branches;
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ icon, title, message, confirmLabel, confirmCls, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-slate-100">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${icon.bg}`}>
                    <span className="text-2xl">{icon.emoji}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className={`flex-1 py-3 rounded-2xl text-white text-sm font-bold transition-colors ${confirmCls}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Media Tile ───────────────────────────────────────────────────────────────
function MediaTile({ item, onDelete }) {
    const [modal, setModal] = useState(false);
    const isImage = item.file_type?.startsWith('image/');

    return (
        <>
            {modal && (
                <ConfirmModal
                    icon={{ bg: 'bg-red-50', emoji: '🗑️' }}
                    title="Supprimer ce fichier ?"
                    message={`"${item.file_name}" sera supprimé définitivement de la médiathèque.`}
                    confirmLabel="Supprimer"
                    confirmCls="bg-red-600 hover:bg-red-700"
                    onConfirm={() => { setModal(false); onDelete(item); }}
                    onCancel={() => setModal(false)}
                />
            )}
            <div className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all">
                {isImage
                    ? <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">📄</div>
                }
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2">
                    <p className="text-white text-[10px] font-bold truncate w-full text-center">{item.file_name}</p>
                    {(item.audience || []).length > 0 && (
                        <p className="text-slate-300 text-[9px] truncate w-full text-center">
                            {(item.audience || ['public']).join(', ')}
                        </p>
                    )}
                    <button onClick={() => setModal(true)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                        Supprimer
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MediaManager() {
    const [media, setMedia]         = useState([]);
    const [file, setFile]           = useState(null);
    const [audience, setAudience]   = useState(() => isBranchOfficial() ? ['member'] : ['public']);
    const [partyBranchId, setPartyBranchId] = useState(() => isBranchOfficial() ? currentUser()?.party_branch_id || '' : '');
    const [branches, setBranches]   = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const [validationMsg, setValidationMsg] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchMedia();
        getBranches().then(res => setBranches(res.data)).catch(() => setBranches([]));
    }, []);

    const fetchMedia = async () => {
        const res = await getMedia();
        setMedia(res.data);
    };

    const toggleAudience = (role) => {
        setAudience(curr => {
            const next = curr.includes(role) ? curr.filter(r => r !== role) : [...curr, role];
            return next.length > 0 ? next : curr;
        });
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) setFile(selected);
    };

    const handleUploadAttempt = () => {
        if (!file) return setValidationMsg('Veuillez sélectionner un fichier avant de continuer.');
        setUploadModal(true);
    };

    const handleUploadConfirm = async () => {
        setUploadModal(false);
        setUploading(true);
        await uploadMedia(file, audience, partyBranchId || null);
        setFile(null);
        setAudience(isBranchOfficial() ? ['member'] : ['public']);
        setPartyBranchId(isBranchOfficial() ? currentUser()?.party_branch_id || '' : '');
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchMedia();
        setUploading(false);
    };

    const handleDelete = async (item) => {
        await deleteMedia(item.id);
        setMedia(prev => prev.filter(m => m.id !== item.id));
    };

    const audienceOptions = allowedAudienceOptions();
    const branchOptions = writableBranches(branches);
    const branchScoped = isBranchOfficial();
    const assignedBranchId = currentUser()?.party_branch_id || '';
    const assignedBranch = branchOptions.find(branch => String(branch.id) === String(assignedBranchId));

    return (
        <div className="space-y-8 text-left">
            {/* Modals */}
            {uploadModal && (
                <ConfirmModal
                    icon={{ bg: 'bg-emerald-50', emoji: '📤' }}
                    title="Confirmer l'upload ?"
                    message={`"${file?.name}" sera ajouté à la médiathèque et accessible à l'audience sélectionnée.`}
                    confirmLabel="Uploader"
                    confirmCls="bg-slate-900 hover:bg-slate-700"
                    onConfirm={handleUploadConfirm}
                    onCancel={() => setUploadModal(false)}
                />
            )}
            {validationMsg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setValidationMsg(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-amber-100">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">Action requise</h4>
                        <p className="text-slate-500 text-sm mb-6">{validationMsg}</p>
                        <button onClick={() => setValidationMsg(null)} className="w-full py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors">Compris</button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div>
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Contenu</p>
                <h3 className="text-2xl font-black text-slate-900">Médiathèque | المكتبة</h3>
            </div>

            {/* Upload panel */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ajouter un fichier</p>

                {/* File picker */}
                <div className="flex items-center gap-4 flex-wrap">
                    <label className="cursor-pointer">
                        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-dashed font-bold text-sm transition-all ${file ? 'border-slate-900 bg-slate-50 text-slate-800' : 'border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'}`}>
                            <span>{file ? '📎' : '+'}</span>
                            <span className="max-w-[200px] truncate">{file ? file.name : 'Choisir un fichier…'}</span>
                        </div>
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                    {file && (
                        <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="text-xs text-slate-400 hover:text-red-500 font-bold transition-colors">
                            ✕ Retirer
                        </button>
                    )}
                </div>

                {/* Audience */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Audience du fichier</p>
                    <div className="flex flex-wrap gap-2">
                        {audienceOptions.map(opt => (
                            <button key={opt.value} type="button" onClick={() => toggleAudience(opt.value)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${
                                    audience.includes(opt.value)
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                                }`}>
                                <span className="text-sm">{opt.icon}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Portée territoriale</p>
                    <select
                        value={partyBranchId}
                        onChange={e => setPartyBranchId(e.target.value)}
                        disabled={branchScoped}
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {!branchScoped && <option value="">Public national</option>}
                        {branchScoped && assignedBranchId && !assignedBranch && (
                            <option value={assignedBranchId}>Votre région / section</option>
                        )}
                        {branchOptions.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>

                {/* Upload button */}
                <button onClick={handleUploadAttempt} disabled={uploading}
                    className="px-7 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-colors disabled:opacity-50">
                    {uploading ? 'Upload en cours…' : 'Uploader le fichier'}
                </button>
            </div>

            {/* Media grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {media.length} fichier{media.length !== 1 ? 's' : ''} dans la médiathèque
                    </p>
                </div>
                {media.length === 0
                    ? <div className="text-center py-20 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-3xl">Aucun fichier dans la médiathèque.</div>
                    : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {media.map(m => <MediaTile key={m.id} item={m} onDelete={handleDelete} />)}
                        </div>
                    )
                }
            </div>
        </div>
    );
}
