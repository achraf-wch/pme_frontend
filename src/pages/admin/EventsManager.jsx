import { useEffect, useState } from 'react';
import { getBranches, getEvents, createEvent, updateEvent, deleteEvent, getEventRegistrations, getStorageUrl } from '../../services/api';

const AUDIENCE_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Visible sur le site', icon: '🌐' },
  { value: 'visitor', label: 'Visiteurs', desc: 'Inscrits non-membres', icon: '👤' },
  { value: 'sympathizer', label: 'Sympathisants', desc: 'Sympathisants du parti', icon: '🤝' },
  { value: 'member', label: 'Membres', desc: 'Membres actifs', icon: '✓' },
  { value: 'local_official', label: 'Élus Locaux', desc: 'Responsables locaux', icon: '🏛' },
  { value: 'central_admin', label: 'Admin Central', desc: 'Administration centrale', icon: '⚙' },
];

const emptyForm = {
  title: '', description: '', location: '',
  start_time: '', end_time: '', max_attendees: '',
  audience: ['public'],
  party_branch_id: '',
};

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [attachFile, setAttachFile] = useState(null);
  const [attachPreview, setAttachPreview] = useState(null);
  const [registrations, setRegistrations] = useState({});
  const [openRegs, setOpenRegs] = useState(null);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);

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

  const toggleAudience = (val) => {
    setForm(f => {
      const has = f.audience.includes(val);
      if (has) return { ...f, audience: f.audience.filter(a => a !== val) };
      return { ...f, audience: [...f.audience, val] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.audience.length === 0) return alert('Sélectionnez au moins une audience.');
    setSaving(true);
    const payload = { ...form };
    if (attachFile) payload.attachment = attachFile;
    if (editingId) await updateEvent(editingId, payload);
    else await createEvent(payload);
    setSaving(false);
    setEditingId(null);
    setForm(emptyForm);
    setAttachFile(null);
    setAttachPreview(null);
    fetchEvents();
  };

  const editItem = (ev) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description,
      location: ev.location,
      start_time: ev.start_time.substring(0, 16),
      end_time: ev.end_time.substring(0, 16),
      max_attendees: ev.max_attendees || '',
      audience: ev.audience || ['public'],
      party_branch_id: ev.party_branch_id || '',
    });
    setAttachPreview(getStorageUrl(ev.attachment_path));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    await deleteEvent(id);
    fetchEvents();
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
    setForm(emptyForm);
    setAttachPreview(null);
    setAttachFile(null);
  };

  const formatTime = (dt) => new Date(dt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={s.root}>
      {/* FORM */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardLabel}>{editingId ? 'Modifier' : 'Créer'}</div>
          <h2 style={s.cardTitle}>{editingId ? "Modifier l'événement" : 'Nouvel Événement'}</h2>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Titre de l'événement</label>
            <input style={s.input} type="text" placeholder="Nom de l'événement..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Description</label>
            <textarea style={{ ...s.input, minHeight: 100, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Décrivez l'événement..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Lieu</label>
              <input style={s.input} type="text" placeholder="Adresse / Lieu" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Max. participants</label>
              <input style={s.input} type="number" placeholder="Illimité si vide" value={form.max_attendees} onChange={e => setForm({ ...form, max_attendees: e.target.value })} min="1" />
            </div>
          </div>

          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Date de début</label>
              <input style={s.input} type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Date de fin</label>
              <input style={s.input} type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required />
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Antenne / périmètre</label>
            <select
              style={s.input}
              value={form.party_branch_id}
              onChange={e => setForm({ ...form, party_branch_id: e.target.value })}
            >
              <option value="">Automatique selon mon rôle</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} · {branch.type}
                </option>
              ))}
            </select>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Audience cible</label>
            <div style={s.audienceGrid}>
              {AUDIENCE_OPTIONS.map(opt => {
                const active = form.audience.includes(opt.value);
                return (
                  <button type="button" key={opt.value} onClick={() => toggleAudience(opt.value)}
                    style={{ ...s.audienceChip, ...(active ? s.audienceChipActive : {}) }}>
                    <span style={{ fontSize: 16 }}>{opt.icon}</span>
                    <div>
                      <div style={s.chipLabel}>{opt.label}</div>
                      <div style={s.chipDesc}>{opt.desc}</div>
                    </div>
                    {active && <span style={s.checkmark}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Pièce jointe / Image</label>
            <input type="file" onChange={handleFileChange} style={{ fontSize: 12, color: '#666' }} />
            {attachPreview && (
              <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
                <img src={attachPreview} style={s.previewImg} alt="Preview" />
                <button type="button" onClick={() => { setAttachPreview(null); setAttachFile(null); }} style={s.removeBtn}>✕</button>
              </div>
            )}
          </div>

          <div style={s.formActions}>
            <button type="submit" style={s.btnPrimary} disabled={saving}>
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer l\'événement'}
            </button>
            {editingId && <button type="button" onClick={cancelEdit} style={s.btnSecondary}>Annuler</button>}
          </div>
        </form>
      </div>

      {/* LIST */}
      <div style={s.listHeader}>
        <h3 style={s.listTitle}>Événements</h3>
        <span style={s.listCount}>{events.length} événement{events.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={s.list}>
        {events.map(ev => (
          <div key={ev.id} style={s.eventCard}>
            <div style={s.eventSidebar}>
              {ev.attachment_path
                ? <img src={getStorageUrl(ev.attachment_path)} style={s.eventImg} alt="" />
                : <div style={s.eventImgEmpty}><span style={{ fontSize: 28, opacity: 0.25 }}>📅</span></div>
              }
              <div style={s.eventDate}>
                <div style={s.eventDay}>{new Date(ev.start_time).getDate()}</div>
                <div style={s.eventMonth}>{new Date(ev.start_time).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</div>
              </div>
            </div>

            <div style={s.eventBody}>
              <div style={s.eventMeta}>
                <span style={s.eventLocation}>📍 {ev.location}</span>
                <span style={s.eventTime}>{formatTime(ev.start_time)} – {formatTime(ev.end_time)}</span>
                {ev.max_attendees && <span style={s.eventCap}>👥 max {ev.max_attendees}</span>}
                {ev.party_branch && <span style={s.eventCap}>🏢 {ev.party_branch.name}</span>}
              </div>
              <h4 style={s.eventTitle}>{ev.title}</h4>
              <p style={s.eventDesc}>{ev.description}</p>

              <div style={s.audienceTags}>
                {(ev.audience || []).map(a => (
                  <span key={a} style={s.audienceBadge}>
                    {AUDIENCE_OPTIONS.find(o => o.value === a)?.label || a}
                  </span>
                ))}
              </div>

              <div style={s.eventActions}>
                <button onClick={() => showRegistrations(ev.id)} style={s.actionOutline}>
                  {openRegs === ev.id ? 'Masquer' : 'Inscriptions'} {registrations[ev.id] ? `(${registrations[ev.id].length})` : ''}
                </button>
                <button onClick={() => editItem(ev)} style={s.actionBtn}>Modifier</button>
                <button onClick={() => deleteItem(ev.id)} style={s.actionBtnDanger}>Supprimer</button>
              </div>

              {openRegs === ev.id && registrations[ev.id] && (
                <div style={s.regsPanel}>
                  <div style={s.regsHeader}>{registrations[ev.id].length} participant{registrations[ev.id].length !== 1 ? 's' : ''} inscrit{registrations[ev.id].length !== 1 ? 's' : ''}</div>
                  <div style={s.regsList}>
                    {registrations[ev.id].map(r => (
                      <div key={r.user.id} style={s.regItem}>
                        <div style={s.regAvatar}>{r.user.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={s.regName}>{r.user.name}</div>
                          <div style={s.regEmail}>{r.user.email}</div>
                          {r.user.party_branch && <div style={s.regEmail}>{r.user.party_branch.name}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {events.length === 0 && <div style={s.emptyState}>Aucun événement créé pour l'instant.</div>}
      </div>
    </div>
  );
}

const s = {
  root: { fontFamily: "'Georgia', 'Times New Roman', serif", maxWidth: 860, margin: '0 auto', padding: '2rem 1rem', color: '#1a1a2e' },
  card: { background: '#fff', border: '1px solid #e8e4dc', borderRadius: 16, marginBottom: '2.5rem', overflow: 'hidden' },
  cardHeader: { background: '#1a1a2e', padding: '1.5rem 2rem', borderBottom: '3px solid #c9a84c' },
  cardLabel: { fontSize: 10, letterSpacing: '0.2em', color: '#c9a84c', fontFamily: 'sans-serif', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { margin: 0, fontSize: 20, fontWeight: 400, color: '#f5f0e8', fontStyle: 'italic' },
  form: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b7a' },
  input: { fontFamily: "'Georgia', serif", fontSize: 14, padding: '12px 16px', border: '1px solid #ddd8cf', borderRadius: 8, outline: 'none', color: '#1a1a2e', background: '#faf9f7', width: '100%', boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  audienceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 },
  audienceChip: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid #e0dbd0', borderRadius: 10, cursor: 'pointer', background: '#faf9f7', textAlign: 'left', position: 'relative' },
  audienceChipActive: { border: '1.5px solid #1a1a2e', background: '#f0ede5' },
  chipLabel: { fontSize: 12, fontWeight: 700, fontFamily: 'sans-serif', color: '#1a1a2e' },
  chipDesc: { fontSize: 10, color: '#888', marginTop: 1 },
  checkmark: { position: 'absolute', top: 5, right: 8, fontSize: 11, color: '#1a1a2e', fontWeight: 700 },
  previewImg: { width: 80, height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' },
  removeBtn: { position: 'absolute', top: -6, right: -6, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 10 },
  formActions: { display: 'flex', gap: 12, paddingTop: 8 },
  btnPrimary: { padding: '12px 28px', background: '#1a1a2e', color: '#c9a84c', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' },
  btnSecondary: { padding: '12px 24px', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontFamily: 'sans-serif', fontSize: 12 },
  listHeader: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: '1rem' },
  listTitle: { margin: 0, fontSize: 16, fontWeight: 400, fontStyle: 'italic', color: '#1a1a2e' },
  listCount: { fontSize: 12, color: '#999', fontFamily: 'sans-serif' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  eventCard: { display: 'flex', background: '#fff', border: '1px solid #e8e4dc', borderRadius: 12, overflow: 'hidden' },
  eventSidebar: { width: 90, flexShrink: 0, background: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '1rem 0.5rem' },
  eventImg: { width: '100%', height: 70, objectFit: 'cover', display: 'block' },
  eventImgEmpty: { width: 60, height: 60, background: '#2d2d4a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  eventDate: { textAlign: 'center' },
  eventDay: { fontSize: 26, fontWeight: 400, color: '#c9a84c', lineHeight: 1 },
  eventMonth: { fontSize: 10, color: '#888', letterSpacing: '0.15em', fontFamily: 'sans-serif' },
  eventBody: { flex: 1, padding: '1.25rem' },
  eventMeta: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 },
  eventLocation: { fontSize: 12, color: '#c9a84c', fontFamily: 'sans-serif', fontWeight: 600 },
  eventTime: { fontSize: 12, color: '#888', fontFamily: 'sans-serif' },
  eventCap: { fontSize: 12, color: '#888', fontFamily: 'sans-serif' },
  eventTitle: { margin: '0 0 6px', fontSize: 17, fontWeight: 400, color: '#1a1a2e' },
  eventDesc: { margin: '0 0 10px', fontSize: 13, color: '#777', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  audienceTags: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  audienceBadge: { fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#1a1a2e', color: '#c9a84c', fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.05em' },
  eventActions: { display: 'flex', gap: 12, alignItems: 'center' },
  actionOutline: { background: 'none', border: '1px solid #1a1a2e', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.1em', color: '#1a1a2e' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 700, color: '#1a1a2e', textDecoration: 'underline' },
  actionBtnDanger: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 700, color: '#c0392b', textDecoration: 'underline' },
  regsPanel: { marginTop: 12, background: '#f5f2eb', borderRadius: 8, padding: '1rem', border: '1px solid #e0dbd0' },
  regsHeader: { fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 10 },
  regsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 },
  regItem: { display: 'flex', gap: 10, alignItems: 'center', background: '#fff', borderRadius: 8, padding: '8px 12px', border: '1px solid #e8e4dc' },
  regAvatar: { width: 32, height: 32, borderRadius: '50%', background: '#1a1a2e', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  regName: { fontSize: 13, fontWeight: 400, color: '#1a1a2e' },
  regEmail: { fontSize: 11, color: '#aaa', fontFamily: 'sans-serif' },
  emptyState: { textAlign: 'center', padding: '3rem', color: '#aaa', fontStyle: 'italic', fontSize: 14 },
};
