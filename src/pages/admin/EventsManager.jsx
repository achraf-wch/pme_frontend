import { useEffect, useState } from 'react';
import { getBranches, getEvents, createEvent, updateEvent, deleteEvent, getEventRegistrations, getStorageUrl, createEventRecap } from '../../services/api';

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
    title: '', description: '', location: '',
    start_time: '', end_time: '', max_attendees: '',
    audience: ['public'], party_branch_id: '',
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

function scopedEventForm(base = emptyForm) {
    const user = currentUser();
    return isBranchOfficial()
        ? { ...base, party_branch_id: user?.party_branch_id || '' }
        : { ...base };
}

function allowedAudienceOptions() {
    const role = currentRole();
    if (role === 'local_official') {
        return AUDIENCE_OPTIONS.filter(opt => !['regional_official', 'central_admin', 'super_admin'].includes(opt.value));
    }
    if (role === 'regional_official') {
        return AUDIENCE_OPTIONS.filter(opt => !['central_admin', 'super_admin'].includes(opt.value));
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

const Label = ({ children }) => (
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{children}</label>
);
const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm text-slate-900 bg-slate-50 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-colors";

function RecapModal({ event, onSave, onCancel, saving }) {
    const [title, setTitle] = useState(`Récap - ${event.title}`);
    const [content, setContent] = useState('');
    const [photos, setPhotos] = useState([]);

    const submit = (e) => {
        e.preventDefault();
        onSave(event.id, { title, content, photos });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
            <form onSubmit={submit} className="relative mx-4 w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-7 shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Après activité</p>
                <h4 className="mt-1 text-xl font-black text-slate-900">Ajouter un récap</h4>
                <p className="mt-2 text-sm text-slate-500">{event.title}</p>

                <div className="mt-6 space-y-4">
                    <div>
                        <Label>Titre du récap</Label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required className={inputCls} />
                    </div>
                    <div>
                        <Label>Résumé</Label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className={`${inputCls} resize-y`} placeholder="Ce qui s'est passé, moments forts, décisions..." />
                    </div>
                    <div>
                        <Label>Photos</Label>
                        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 px-4 py-4 text-center text-xs font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600">
                            {photos.length ? `${photos.length} photo(s) sélectionnée(s)` : 'Choisir des photos'}
                            <input type="file" accept="image/*" multiple className="hidden" onChange={e => setPhotos(Array.from(e.target.files || []))} />
                        </label>
                    </div>
                </div>

                <div className="mt-7 flex gap-3">
                    <button type="button" onClick={onCancel} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                        Annuler
                    </button>
                    <button disabled={saving} className="flex-1 rounded-2xl bg-slate-900 py-3 text-sm font-black text-white hover:bg-slate-700 disabled:opacity-50">
                        {saving ? 'Publication...' : 'Publier le récap'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ ev, onEdit, onDelete, onShowRegistrations, onAddRecap, isRegOpen, registrations }) {
    const [deleteModal, setDeleteModal] = useState(false);

    const fmt = (dt) => new Date(dt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const day = new Date(ev.start_time).getDate();
    const month = new Date(ev.start_time).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();

    const now = new Date();
    const isPast = new Date(ev.end_time) < now;
    const isLive = new Date(ev.start_time) <= now && !isPast;

    return (
        <>
            {deleteModal && (
                <ConfirmModal
                    icon={{ bg: 'bg-red-50', emoji: '🗑️' }}
                    title="Supprimer cet événement ?"
                    message={`"${ev.title}" sera supprimé définitivement avec toutes ses inscriptions.`}
                    confirmLabel="Supprimer"
                    confirmCls="bg-red-600 hover:bg-red-700"
                    onConfirm={() => { setDeleteModal(false); onDelete(ev.id); }}
                    onCancel={() => setDeleteModal(false)}
                />
            )}

            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-md transition-all">
                <div className="flex gap-0">
                    {/* Date sidebar */}
                    <div className="w-20 shrink-0 bg-slate-900 flex flex-col items-center justify-center py-5 gap-1 relative">
                        {ev.attachment_path && (
                            <img src={getStorageUrl(ev.attachment_path)} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                        )}
                        <span className="text-3xl font-black text-amber-400 leading-none relative z-10">{day}</span>
                        <span className="text-[10px] font-black text-slate-400 tracking-widest relative z-10">{month}</span>
                        {isLive && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-5 min-w-0">
                        {/* Meta row */}
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${isPast ? 'bg-slate-100 text-slate-400 border-slate-200' : isLive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                {isPast ? 'Terminé' : isLive ? '● En cours' : 'À venir'}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">📍 {ev.location}</span>
                            <span className="text-xs text-slate-400">{fmt(ev.start_time)} – {fmt(ev.end_time)}</span>
                            {ev.max_attendees && <span className="text-xs text-slate-400">👥 max {ev.max_attendees}</span>}
                            {ev.party_branch && <span className="text-xs text-slate-400">🏢 {ev.party_branch.name}</span>}
                        </div>

                        <h4 className="font-black text-slate-900 text-base leading-snug mb-1">{ev.title}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">{ev.description}</p>

                        {/* Audience tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                            {(ev.audience || []).map(a => (
                                <span key={a} className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-900 text-white">
                                    {AUDIENCE_OPTIONS.find(o => o.value === a)?.label || a}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 items-center flex-wrap">
                            <button onClick={() => onShowRegistrations(ev.id)}
                                className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all">
                                {isRegOpen ? 'Masquer' : 'Inscriptions'}
                                {registrations && <span className="ml-1.5 bg-slate-900 text-white px-1.5 py-0.5 rounded-full text-[9px]">{registrations.length}</span>}
                            </button>
                            <button onClick={() => onEdit(ev)} className="text-xs font-black text-slate-700 hover:text-slate-900 underline underline-offset-2">
                                Modifier
                            </button>
                            {isPast && (
                                <button onClick={() => onAddRecap(ev)} className="text-xs font-black text-emerald-700 hover:text-emerald-900 underline underline-offset-2">
                                    Ajouter récap
                                    {ev.recaps_count > 0 && <span className="ml-1 text-slate-400">({ev.recaps_count})</span>}
                                </button>
                            )}
                            <button onClick={() => setDeleteModal(true)} className="text-xs font-black text-red-400 hover:text-red-600 underline underline-offset-2">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Registrations panel */}
                {isRegOpen && registrations && (
                    <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            {registrations.length} participant{registrations.length !== 1 ? 's' : ''} inscrit{registrations.length !== 1 ? 's' : ''}
                        </p>
                        {registrations.length === 0
                            ? <p className="text-slate-400 text-sm italic">Aucune inscription pour le moment.</p>
                            : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {registrations.map(r => (
                                        <div key={r.user.id} className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl">
                                            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
                                                {r.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-800 text-sm truncate">{r.user.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{r.user.email}</p>
                                                {r.user.party_branch && <p className="text-[10px] text-slate-400 truncate">{r.user.party_branch.name}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EventsManager() {
    const [events, setEvents]           = useState([]);
    const [form, setForm]               = useState(() => scopedEventForm());
    const [editingId, setEditingId]     = useState(null);
    const [attachFile, setAttachFile]   = useState(null);
    const [attachPreview, setAttachPreview] = useState(null);
    const [registrations, setRegistrations] = useState({});
    const [openRegs, setOpenRegs]       = useState(null);
    const [saving, setSaving]           = useState(false);
    const [branches, setBranches]       = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [validationMsg, setValidationMsg] = useState(null);
    const [recapEvent, setRecapEvent] = useState(null);
    const [recapSaving, setRecapSaving] = useState(false);

    useEffect(() => {
        fetchEvents();
        getBranches().then(res => setBranches(res.data)).catch(() => setBranches([]));
    }, []);

    const fetchEvents = async () => {
        const res = await getEvents();
        setEvents(res.data);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0] ?? null;
        setAttachFile(file);
        setAttachPreview(file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
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

    const handleSubmitAttempt = (e) => {
        e.preventDefault();
        if (form.audience.length === 0) return setValidationMsg('Veuillez sélectionner au moins une audience.');
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        setConfirmOpen(false);
        setSaving(true);
        const payload = { ...form };
        if (attachFile) payload.attachment = attachFile;
        if (editingId) await updateEvent(editingId, payload);
        else await createEvent(payload);
        setSaving(false);
        setEditingId(null);
        setForm(scopedEventForm());
        setAttachFile(null);
        setAttachPreview(null);
        fetchEvents();
    };

    const editItem = (ev) => {
        setEditingId(ev.id);
        setForm({
            title: ev.title, description: ev.description, location: ev.location,
            start_time: ev.start_time.substring(0, 16), end_time: ev.end_time.substring(0, 16),
            max_attendees: ev.max_attendees || '', audience: ev.audience || ['public'],
            party_branch_id: branchScoped ? assignedBranchId : (ev.party_branch_id || ''),
        });
        setAttachPreview(getStorageUrl(ev.attachment_path));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteItem = async (id) => {
        await deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const showRegistrations = async (id) => {
        if (openRegs === id) { setOpenRegs(null); return; }
        if (!registrations[id]) {
            const res = await getEventRegistrations(id);
            setRegistrations(prev => ({ ...prev, [id]: res.data }));
        }
        setOpenRegs(id);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(scopedEventForm());
        setAttachPreview(null);
        setAttachFile(null);
    };

    const saveRecap = async (eventId, data) => {
        setRecapSaving(true);
        try {
            await createEventRecap(eventId, data);
            setRecapEvent(null);
            fetchEvents();
        } catch (err) {
            setValidationMsg(err.response?.data?.message || 'Impossible de publier le récap.');
        } finally {
            setRecapSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            {/* Modals */}
            {confirmOpen && (
                <ConfirmModal
                    icon={{ bg: 'bg-slate-900', emoji: '📅' }}
                    title={editingId ? "Mettre à jour l'événement ?" : 'Créer cet événement ?'}
                    message={`"${form.title}" sera ${editingId ? 'mis à jour' : 'créé'} et rendu visible à l'audience sélectionnée.`}
                    confirmLabel={editingId ? 'Mettre à jour' : 'Créer l\'événement'}
                    confirmCls="bg-slate-900 hover:bg-slate-700"
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
            {validationMsg && <ValidationModal message={validationMsg} onClose={() => setValidationMsg(null)} />}
            {recapEvent && <RecapModal event={recapEvent} onSave={saveRecap} onCancel={() => setRecapEvent(null)} saving={recapSaving} />}

            {/* ── Form ──────────────────────────────────────────────────────── */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 px-8 py-6 border-b-4 border-amber-400">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">
                        {editingId ? 'Modifier' : 'Créer'}
                    </p>
                    <h2 className="text-xl font-black text-white">
                        {editingId ? "Modifier l'événement" : 'Nouvel Événement | حدث جديد'}
                    </h2>
                </div>

                <form onSubmit={handleSubmitAttempt} className="p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <Label>Titre de l'événement</Label>
                        <input type="text" placeholder="Nom de l'événement..." value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required className={inputCls} />
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <textarea placeholder="Décrivez l'événement..." value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            rows={4} required className={`${inputCls} resize-none`} />
                    </div>

                    {/* Location + Branch */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Lieu</Label>
                            <input type="text" placeholder="Adresse / Lieu" value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                required className={inputCls} />
                        </div>
                        <div>
                            <Label>Section du parti</Label>
                            <select value={form.party_branch_id}
                                onChange={e => setForm({ ...form, party_branch_id: e.target.value })}
                                disabled={branchScoped}
                                className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-70`}>
                                {!branchScoped && <option value="">Public national</option>}
                                {branchScoped && assignedBranchId && !assignedBranch && (
                                    <option value={assignedBranchId}>Votre région / section</option>
                                )}
                                {branchOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Début</Label>
                            <input type="datetime-local" value={form.start_time}
                                onChange={e => setForm({ ...form, start_time: e.target.value })}
                                required className={inputCls} />
                        </div>
                        <div>
                            <Label>Fin</Label>
                            <input type="datetime-local" value={form.end_time}
                                onChange={e => setForm({ ...form, end_time: e.target.value })}
                                required className={inputCls} />
                        </div>
                    </div>

                    {/* Max attendees */}
                    <div className="sm:w-1/2">
                        <Label>Participants max (optionnel)</Label>
                        <input type="number" min="1" placeholder="Illimité si vide" value={form.max_attendees}
                            onChange={e => setForm({ ...form, max_attendees: e.target.value })}
                            className={inputCls} />
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

                    {/* Attachment */}
                    <div>
                        <Label>Image / Affiche</Label>
                        <div className="flex items-center gap-4">
                            {attachPreview && (
                                <div className="relative shrink-0">
                                    <img src={attachPreview} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" alt="" />
                                    <button type="button" onClick={() => { setAttachPreview(null); setAttachFile(null); }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black hover:bg-red-600 transition-colors">
                                        ✕
                                    </button>
                                </div>
                            )}
                            <label className="flex-1 cursor-pointer">
                                <div className="py-2.5 px-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors text-center">
                                    {attachPreview ? 'Changer l\'image…' : 'Choisir une image'}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={saving}
                            className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-colors disabled:opacity-50">
                            {saving ? 'Enregistrement…' : editingId ? "Mettre à jour" : "Créer l'événement"}
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
                    <h3 className="text-lg font-black text-slate-900">Événements</h3>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-black">
                        {events.length} événement{events.length !== 1 ? 's' : ''}
                    </span>
                </div>
                {events.length === 0
                    ? <div className="text-center py-16 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-3xl">Aucun événement créé pour l'instant.</div>
                    : (
                        <div className="space-y-3">
                            {events.map(ev => (
                                <EventCard
                                    key={ev.id} ev={ev}
                                    onEdit={editItem} onDelete={deleteItem}
                                    onAddRecap={setRecapEvent}
                                    onShowRegistrations={showRegistrations}
                                    isRegOpen={openRegs === ev.id}
                                    registrations={registrations[ev.id]}
                                />
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}
