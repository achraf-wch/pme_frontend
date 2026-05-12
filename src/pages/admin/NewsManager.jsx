import { useEffect, useState } from 'react';
import { getBranches, getNews, createNews, updateNews, deleteNews, getStorageUrl } from '../../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const AUDIENCE_OPTIONS = [
    { value: 'public',            label: 'Public',          desc: 'Visible sur le site',      icon: '🌐' },
    { value: 'visitor',           label: 'Visiteurs',       desc: 'Inscrits non-membres',     icon: '👤' },
    { value: 'sympathizer',       label: 'Sympathisants',   desc: 'Sympathisants du parti',   icon: '🤝' },
    { value: 'volunteer',         label: 'Bénévoles',       desc: 'Bénévoles inscrits',       icon: '🙋' },
    { value: 'member',            label: 'Membres',         desc: 'Membres actifs',           icon: '✅' },
    { value: 'local_official',    label: 'Élus Locaux',     desc: 'Responsables locaux',      icon: '🏘️' },
    { value: 'regional_official', label: 'Élus Régionaux',  desc: 'Responsables régionaux',   icon: '🏛️' },
    { value: 'central_admin',     label: 'Admin Central',   desc: 'Administration centrale',  icon: '⚙️' },
    { value: 'super_admin',       label: 'Superviseur',     desc: 'Supervision complète',     icon: '⭐' },
];

const emptyForm = {
    title: '', type: 'news', topic: '', region: '',
    content: '', published_at: '', is_published: true, audience: ['public'], party_branch_id: '',
};

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

function scopedNewsForm(base = emptyForm) {
    const user = currentUser();
    return isBranchOfficial()
        ? { ...base, audience: ['member'], party_branch_id: user?.party_branch_id || '' }
        : { ...base };
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

// ─── Shared: Confirm Modal ────────────────────────────────────────────────────
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

// ─── Validation Modal ─────────────────────────────────────────────────────────
function ValidationModal({ message, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-amber-100">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Vérifiez le formulaire</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{message}</p>
                <button onClick={onClose} className="w-full py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors">
                    Compris
                </button>
            </div>
        </div>
    );
}

// ─── Field Label ──────────────────────────────────────────────────────────────
const Label = ({ children }) => (
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{children}</label>
);

// ─── Input / Textarea / Select shared styles ──────────────────────────────────
const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm text-slate-900 bg-slate-50 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-colors";

// ─── News Card ────────────────────────────────────────────────────────────────
function NewsCard({ item, onEdit, onDelete }) {
    const [modal, setModal] = useState(false);

    const typeColors = {
        news:       'bg-blue-50 text-blue-700 border-blue-200',
        communique: 'bg-violet-50 text-violet-700 border-violet-200',
        article:    'bg-amber-50 text-amber-700 border-amber-200',
    };

    return (
        <>
            {modal && (
                <ConfirmModal
                    icon={{ bg: 'bg-red-50', emoji: '🗑️' }}
                    title="Supprimer cet article ?"
                    message={`"${item.title}" sera supprimé définitivement. Cette action est irréversible.`}
                    confirmLabel="Supprimer"
                    confirmCls="bg-red-600 hover:bg-red-700"
                    onConfirm={() => { setModal(false); onDelete(item.id); }}
                    onCancel={() => setModal(false)}
                />
            )}
            <div className="flex gap-0 bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-md transition-all group">
                {/* Thumbnail */}
                <div className="w-24 shrink-0 bg-slate-100">
                    {item.image_path
                        ? <img src={getStorageUrl(item.image_path)} className="w-full h-full object-cover" alt="" />
                        : <div className="w-full h-full min-h-[96px] flex items-center justify-center text-2xl opacity-20">📰</div>
                    }
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col gap-2.5 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.is_published ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {item.is_published ? 'Publié' : 'Brouillon'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${typeColors[item.type] || typeColors.news}`}>
                            {item.type || 'news'}
                        </span>
                        {item.topic && <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">{item.topic}</span>}
                        {item.region && <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">📍 {item.region}</span>}
                        {item.party_branch && <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">{item.party_branch.name}</span>}
                        {(item.audience || []).map(a => (
                            <span key={a} className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-900 text-white">
                                {AUDIENCE_OPTIONS.find(o => o.value === a)?.label || a}
                            </span>
                        ))}
                    </div>

                    <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.content}</p>

                    {/* Actions */}
                    <div className="flex gap-4 mt-auto pt-1">
                        <button onClick={() => onEdit(item)} className="text-xs font-black text-slate-700 hover:text-slate-900 underline underline-offset-2 transition-colors">
                            Modifier
                        </button>
                        <button onClick={() => setModal(true)} className="text-xs font-black text-red-400 hover:text-red-600 underline underline-offset-2 transition-colors">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NewsManager() {
    const [news, setNews]                     = useState([]);
    const [form, setForm]                     = useState(() => scopedNewsForm());
    const [imageFile, setImageFile]           = useState(null);
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [preview, setPreview]               = useState(null);
    const [editingId, setEditingId]           = useState(null);
    const [saving, setSaving]                 = useState(false);
    const [confirmOpen, setConfirmOpen]       = useState(false);
    const [validationMsg, setValidationMsg]   = useState(null);
    const [branches, setBranches]             = useState([]);

    useEffect(() => {
        fetchNews();
        getBranches().then(res => setBranches(res.data)).catch(() => setBranches([]));
    }, []);

    const fetchNews = async () => {
        const res = await getNews();
        setNews(res.data);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0] ?? null;
        setImageFile(file);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const toggleAudience = (val) => setForm(f => {
        const has = f.audience.includes(val);
        return { ...f, audience: has ? f.audience.filter(a => a !== val) : [...f.audience, val] };
    });

    const audienceOptions = allowedAudienceOptions();
    const branchOptions = writableBranches(branches);
    const branchScoped = isBranchOfficial();
    const assignedBranchId = currentUser()?.party_branch_id || '';
    const assignedBranch = branchOptions.find(branch => String(branch.id) === String(assignedBranchId));

    const editItem = (item) => {
        setEditingId(item.id);
        setForm({
            title: item.title, type: item.type || 'news', topic: item.topic || '',
            region: item.region || '', content: item.content,
            published_at: item.published_at ? item.published_at.slice(0, 16) : '',
            is_published: !!item.is_published, audience: branchScoped ? ['member'] : (item.audience || ['public']),
            party_branch_id: branchScoped ? assignedBranchId : (item.party_branch_id || ''),
        });
        setPreview(getStorageUrl(item.image_path));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteItem = async (id) => {
        await deleteNews(id);
        setNews(prev => prev.filter(n => n.id !== id));
    };

    const handleSubmitAttempt = (e) => {
        e.preventDefault();
        if (form.audience.length === 0) return setValidationMsg('Veuillez sélectionner au moins une audience.');
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        setConfirmOpen(false);
        setSaving(true);
        const payload = {
            title: form.title, type: form.type, topic: form.topic, region: form.region,
            content: form.content, published_at: form.published_at,
            is_published: form.is_published ? '1' : '0', audience: form.audience,
            party_branch_id: form.party_branch_id || '',
        };
        if (imageFile) payload.image = imageFile;
        if (attachmentFile) payload.attachment = attachmentFile;
        if (editingId) await updateNews(editingId, payload);
        else await createNews(payload);
        setSaving(false);
        setEditingId(null);
        setForm(scopedNewsForm());
        setImageFile(null);
        setAttachmentFile(null);
        setPreview(null);
        fetchNews();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(scopedNewsForm());
        setPreview(null);
        setImageFile(null);
        setAttachmentFile(null);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            {/* Modals */}
            {confirmOpen && (
                <ConfirmModal
                    icon={{ bg: 'bg-slate-900', emoji: '📰' }}
                    title={editingId ? "Mettre à jour l'article ?" : "Publier cet article ?"}
                    message={`"${form.title}" sera ${editingId ? 'mis à jour' : form.is_published ? 'publié immédiatement' : 'enregistré comme brouillon'} pour l'audience sélectionnée.`}
                    confirmLabel={editingId ? 'Mettre à jour' : 'Publier'}
                    confirmCls="bg-slate-900 hover:bg-slate-700"
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
            {validationMsg && <ValidationModal message={validationMsg} onClose={() => setValidationMsg(null)} />}

            {/* ── Form ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 px-8 py-6 border-b-4 border-amber-400">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">
                        {editingId ? 'Modifier' : 'Créer'}
                    </p>
                    <h2 className="text-xl font-black text-white">
                        {editingId ? "Modifier l'article" : 'Nouvel Article | مقال جديد'}
                    </h2>
                </div>

                <form onSubmit={handleSubmitAttempt} className="p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <Label>Titre</Label>
                        <input type="text" placeholder="Titre de l'article..." value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required className={inputCls} />
                    </div>

                    {/* Type + Scheduled date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Type</Label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputCls}>
                                <option value="news">Actualité</option>
                                <option value="communique">Communiqué</option>
                                <option value="article">Article</option>
                            </select>
                        </div>
                        <div>
                            <Label>Publication planifiée</Label>
                            <input type="datetime-local" value={form.published_at}
                                onChange={e => setForm({ ...form, published_at: e.target.value })}
                                className={inputCls} />
                        </div>
                    </div>

                    {/* Topic + Region */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Sujet</Label>
                            <input type="text" placeholder="Thématique..." value={form.topic}
                                onChange={e => setForm({ ...form, topic: e.target.value })}
                                className={inputCls} />
                        </div>
                        <div>
                            <Label>Région</Label>
                            <input type="text" placeholder="Région concernée..." value={form.region}
                                onChange={e => setForm({ ...form, region: e.target.value })}
                                className={inputCls} />
                        </div>
                    </div>

                    <div>
                        <Label>Portée géographique</Label>
                        <select value={form.party_branch_id}
                            onChange={e => setForm({ ...form, party_branch_id: e.target.value })}
                            disabled={branchScoped}
                            className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-70`}>
                            {!branchScoped && <option value="">Public national</option>}
                            {branchScoped && assignedBranchId && !assignedBranch && (
                                <option value={assignedBranchId}>Votre région / section</option>
                            )}
                            {branchOptions.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Content */}
                    <div>
                        <Label>Contenu</Label>
                        <textarea placeholder="Contenu de l'article..." value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            rows={6} required className={`${inputCls} resize-y`} />
                    </div>

                    {/* Audience */}
                    <div>
                        <Label>Audience</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {audienceOptions.map(opt => {
                                const active = form.audience.includes(opt.value);
                                return (
                                    <button type="button" key={opt.value} onClick={() => toggleAudience(opt.value)}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'}`}>
                                        <span className="text-base shrink-0">{opt.icon}</span>
                                        <div className="min-w-0">
                                            <p className={`text-xs font-black truncate ${active ? 'text-white' : 'text-slate-800'}`}>{opt.label}</p>
                                            <p className={`text-[10px] truncate ${active ? 'text-slate-300' : 'text-slate-400'}`}>{opt.desc}</p>
                                        </div>
                                        {active && <span className="ml-auto text-amber-400 text-xs shrink-0">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Files */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Image</Label>
                            <div className="flex items-center gap-3">
                                {preview && (
                                    <div className="relative shrink-0">
                                        <img src={preview} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" alt="" />
                                        <button type="button" onClick={() => { setPreview(null); setImageFile(null); }}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black hover:bg-red-600 transition-colors">
                                            ✕
                                        </button>
                                    </div>
                                )}
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full py-2.5 px-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors text-center">
                                        {preview ? 'Changer…' : 'Choisir une image'}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <Label>Fichier joint</Label>
                            <label className="cursor-pointer block">
                                <div className="w-full py-2.5 px-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors text-center">
                                    {attachmentFile ? attachmentFile.name : 'Joindre un fichier'}
                                </div>
                                <input type="file" accept=".pdf,.doc,.docx,image/*"
                                    onChange={e => setAttachmentFile(e.target.files[0] ?? null)} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Publish toggle */}
                    <div>
                        <Label>Statut de publication</Label>
                        <button type="button" onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border font-bold text-sm transition-all ${form.is_published ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            <span className={`w-3 h-3 rounded-full transition-colors ${form.is_published ? 'bg-amber-400' : 'bg-slate-400'}`} />
                            {form.is_published ? 'Publié immédiatement' : 'Brouillon'}
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={saving}
                            className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-colors disabled:opacity-50">
                            {saving ? 'Enregistrement…' : editingId ? "Mettre à jour" : "Publier l'article"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={cancelEdit}
                                className="px-6 py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ── List ──────────────────────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900">Articles publiés</h3>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-black">
                        {news.length} article{news.length !== 1 ? 's' : ''}
                    </span>
                </div>
                {news.length === 0
                    ? <div className="text-center py-16 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-3xl">Aucun article créé pour l'instant.</div>
                    : <div className="space-y-3">{news.map(item => <NewsCard key={item.id} item={item} onEdit={editItem} onDelete={deleteItem} />)}</div>
                }
            </div>
        </div>
    );
}
