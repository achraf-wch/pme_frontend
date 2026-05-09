import { useState, useEffect } from 'react';
import { createPoll, getPolls, getPollResults } from '../../services/api';

const AUDIENCE_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Tout le monde', icon: '🌐' },
  { value: 'visitor', label: 'Visiteurs', desc: 'Inscrits non-membres', icon: '👤' },
  { value: 'sympathizer', label: 'Sympathisants', desc: 'Sympathisants', icon: '🤝' },
  { value: 'volunteer', label: 'Bénévoles', desc: 'Bénévoles inscrits', icon: '✓' },
  { value: 'member', label: 'Membres', desc: 'Membres actifs', icon: '✓' },
  { value: 'local_official', label: 'Élus Locaux', desc: 'Responsables locaux', icon: '🏛' },
  { value: 'regional_official', label: 'Élus Régionaux', desc: 'Responsables régionaux', icon: '🏛' },
  { value: 'central_admin', label: 'Admin Central', desc: 'Administration centrale', icon: '⚙' },
  { value: 'super_admin', label: 'Superviseur', desc: 'Accès complet', icon: '★' },
];

const emptyForm = {
  title: '', description: '',
  startDate: '', endDate: '',
  audience: ['member'],
  options: ['', ''],
};

export default function CreatePoll() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [polls, setPolls] = useState([]);
  const [results, setResults] = useState({});
  const [openResults, setOpenResults] = useState(null);

  useEffect(() => { fetchPolls(); }, []);

  const fetchPolls = async () => {
    try {
      const res = await getPolls();
      setPolls(res.data);
    } catch (e) {}
  };

  const toggleAudience = (val) => {
    setForm(f => {
      const has = f.audience.includes(val);
      if (has) return { ...f, audience: f.audience.filter(a => a !== val) };
      return { ...f, audience: [...f.audience, val] };
    });
  };

  const addOption = () => setForm(f => ({ ...f, options: [...f.options, ''] }));
  const updateOption = (idx, val) => setForm(f => {
    const options = [...f.options];
    options[idx] = val;
    return { ...f, options };
  });
  const removeOption = (idx) => {
    if (form.options.length <= 2) return;
    setForm(f => ({ ...f, options: f.options.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.audience.length === 0) return alert('Sélectionnez au moins une audience.');
    const validOpts = form.options.filter(o => o.trim() !== '');
    if (validOpts.length < 2) return alert('Au moins 2 options sont requises.');
    if (!window.confirm('Confirmer et publier ce vote pour l’audience sélectionnée ?')) return;
    setSaving(true);
    setMessage(null);
    try {
      await createPoll({
        title: form.title,
        description: form.description,
        start_date: form.startDate,
        end_date: form.endDate,
        target_audience: form.audience,
        options: validOpts,
      });
      setMessage({ type: 'success', text: 'Sondage créé avec succès !' });
      setForm(emptyForm);
      fetchPolls();
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la création du sondage.' });
    }
    setSaving(false);
  };

  const viewResults = async (id) => {
    if (openResults === id) { setOpenResults(null); return; }
    if (!results[id]) {
      const res = await getPollResults(id);
      setResults(prev => ({ ...prev, [id]: res.data }));
    }
    setOpenResults(id);
  };

  const isActive = (poll) => {
    const now = new Date();
    return new Date(poll.start_date) <= now && new Date(poll.end_date) >= now;
  };

  const isPast = (poll) => new Date(poll.end_date) < new Date();

  const getMaxVotes = (data) => Math.max(...(data?.results?.map(r => r.votes) || [0]), 1);

  return (
    <div style={s.root}>
      {/* CREATE FORM */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardLabel}>Nouveau</div>
          <h2 style={s.cardTitle}>Créer un sondage</h2>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Titre du sondage</label>
            <input style={s.input} type="text" placeholder="Ex: Position sur le budget 2026" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Description / Contexte</label>
            <textarea style={{ ...s.input, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Contexte du vote, enjeux..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Ouverture du vote</label>
              <input style={s.input} type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Clôture du vote</label>
              <input style={s.input} type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Qui peut voter ?</label>
            <div style={s.audienceGrid}>
              {AUDIENCE_OPTIONS.map(opt => {
                const active = form.audience.includes(opt.value);
                return (
                  <button type="button" key={opt.value} onClick={() => toggleAudience(opt.value)}
                    style={{ ...s.audienceChip, ...(active ? s.audienceChipActive : {}) }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{opt.icon}</span>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={s.chipLabel}>{opt.label}</div>
                      <div style={s.chipDesc}>{opt.desc}</div>
                    </div>
                    <div style={{ ...s.checkCircle, ...(active ? s.checkCircleActive : {}) }}>
                      {active && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Options de vote</label>
            <div style={s.optionsList}>
              {form.options.map((opt, idx) => (
                <div key={idx} style={s.optionRow}>
                  <div style={s.optionNum}>{idx + 1}</div>
                  <input
                    style={{ ...s.input, flex: 1 }}
                    type="text"
                    placeholder={`Option ${idx + 1}...`}
                    value={opt}
                    onChange={e => updateOption(idx, e.target.value)}
                    required
                  />
                  {form.options.length > 2 && (
                    <button type="button" onClick={() => removeOption(idx)} style={s.removeOptBtn}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addOption} style={s.addOptBtn}>
                + Ajouter une option
              </button>
            </div>
          </div>

          <div style={s.formActions}>
            <button type="submit" style={s.btnPrimary} disabled={saving}>
              {saving ? 'Publication...' : 'Publier le sondage'}
            </button>
          </div>

          {message && (
            <div style={{ ...s.message, ...(message.type === 'success' ? s.msgSuccess : s.msgError) }}>
              {message.text}
            </div>
          )}
        </form>
      </div>

      {/* POLLS LIST */}
      <div style={s.listHeader}>
        <h3 style={s.listTitle}>Sondages</h3>
        <span style={s.listCount}>{polls.length} sondage{polls.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={s.pollsList}>
        {polls.map(poll => {
          const active = isActive(poll);
          const past = isPast(poll);
          const data = results[poll.id];
          const maxV = getMaxVotes(data);

          return (
            <div key={poll.id} style={s.pollCard}>
              <div style={s.pollCardTop}>
                <div style={s.pollCardLeft}>
                  <div style={s.pollStatusRow}>
                    <span style={{ ...s.statusDot, background: active ? '#2d6a4f' : past ? '#888' : '#c9a84c' }} />
                    <span style={{ ...s.statusLabel, color: active ? '#2d6a4f' : past ? '#888' : '#c9a84c' }}>
                      {active ? 'En cours' : past ? 'Terminé' : 'À venir'}
                    </span>
                    {(poll.target_audience || []).map(a => (
                      <span key={a} style={s.audBadge}>
                        {AUDIENCE_OPTIONS.find(o => o.value === a)?.label || a}
                      </span>
                    ))}
                  </div>
                  <h4 style={s.pollTitle}>{poll.title}</h4>
                  {poll.description && <p style={s.pollDesc}>{poll.description}</p>}
                  <div style={s.pollDates}>
                    {new Date(poll.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {' → '}
                    {new Date(poll.end_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => viewResults(poll.id)} style={s.resultsBtn}>
                  {openResults === poll.id ? 'Masquer' : 'Résultats'}
                </button>
              </div>

              {openResults === poll.id && data && (
                <div style={s.resultsPanel}>
                  <div style={s.resultsMeta}>
                    {data.total_votes} vote{data.total_votes !== 1 ? 's' : ''} au total
                  </div>
                  <div style={s.resultsBars}>
                    {data.results.map(r => {
                      const pct = data.total_votes > 0 ? Math.round((r.votes / data.total_votes) * 100) : 0;
                      const isWinner = r.votes === maxV && r.votes > 0;
                      return (
                        <div key={r.option_id} style={s.barRow}>
                          <div style={s.barLabel}>
                            <span style={s.barText}>{r.option_text}</span>
                            <span style={s.barPct}>{pct}%</span>
                          </div>
                          <div style={s.barTrack}>
                            <div style={{ ...s.barFill, width: `${pct}%`, background: isWinner ? '#1a1a2e' : '#c9a84c' }} />
                          </div>
                          <span style={s.barVotes}>{r.votes} vote{r.votes !== 1 ? 's' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {polls.length === 0 && <div style={s.emptyState}>Aucun sondage créé pour l'instant.</div>}
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
  form: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b7a' },
  input: { fontFamily: "'Georgia', serif", fontSize: 14, padding: '12px 16px', border: '1px solid #ddd8cf', borderRadius: 8, outline: 'none', color: '#1a1a2e', background: '#faf9f7', width: '100%', boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  audienceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 },
  audienceChip: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid #e0dbd0', borderRadius: 10, cursor: 'pointer', background: '#faf9f7', transition: 'all 0.15s' },
  audienceChipActive: { border: '1.5px solid #1a1a2e', background: '#f0ede5' },
  chipLabel: { fontSize: 12, fontWeight: 700, fontFamily: 'sans-serif', color: '#1a1a2e' },
  chipDesc: { fontSize: 10, color: '#888', marginTop: 1 },
  checkCircle: { width: 18, height: 18, borderRadius: '50%', border: '1.5px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'transparent', flexShrink: 0 },
  checkCircleActive: { background: '#1a1a2e', border: '1.5px solid #1a1a2e', color: '#c9a84c' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  optionRow: { display: 'flex', alignItems: 'center', gap: 8 },
  optionNum: { width: 28, height: 28, borderRadius: '50%', background: '#1a1a2e', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: 'sans-serif' },
  removeOptBtn: { background: '#fce8e8', border: 'none', borderRadius: 6, color: '#c0392b', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 },
  addOptBtn: { padding: '10px', border: '1.5px dashed #ccc', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 12, fontFamily: 'sans-serif', color: '#888', fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.15s' },
  formActions: { paddingTop: 8 },
  btnPrimary: { padding: '14px 32px', background: '#1a1a2e', color: '#c9a84c', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', width: '100%' },
  message: { padding: '12px 16px', borderRadius: 8, fontSize: 12, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'center' },
  msgSuccess: { background: '#e6f4ea', color: '#2d6a4f' },
  msgError: { background: '#fce8e8', color: '#c0392b' },
  listHeader: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: '1rem' },
  listTitle: { margin: 0, fontSize: 16, fontWeight: 400, fontStyle: 'italic', color: '#1a1a2e' },
  listCount: { fontSize: 12, color: '#999', fontFamily: 'sans-serif' },
  pollsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  pollCard: { background: '#fff', border: '1px solid #e8e4dc', borderRadius: 12, overflow: 'hidden' },
  pollCardTop: { display: 'flex', gap: 16, alignItems: 'flex-start', padding: '1.25rem' },
  pollCardLeft: { flex: 1 },
  pollStatusRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  statusDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  statusLabel: { fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
  audBadge: { fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#1a1a2e', color: '#c9a84c', fontFamily: 'sans-serif', fontWeight: 700 },
  pollTitle: { margin: '0 0 4px', fontSize: 16, fontWeight: 400, color: '#1a1a2e' },
  pollDesc: { margin: '0 0 8px', fontSize: 13, color: '#888', lineHeight: 1.5 },
  pollDates: { fontSize: 11, fontFamily: 'sans-serif', color: '#aaa', letterSpacing: '0.05em' },
  resultsBtn: { padding: '8px 16px', background: '#1a1a2e', color: '#c9a84c', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, alignSelf: 'flex-start' },
  resultsPanel: { borderTop: '1px solid #e8e4dc', padding: '1.25rem', background: '#faf9f7' },
  resultsMeta: { fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 },
  resultsBars: { display: 'flex', flexDirection: 'column', gap: 12 },
  barRow: { display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '6px 12px' },
  barLabel: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gridColumn: '1', marginBottom: 4 },
  barText: { fontSize: 13, color: '#1a1a2e', fontWeight: 400 },
  barPct: { fontSize: 12, fontFamily: 'sans-serif', fontWeight: 700, color: '#1a1a2e' },
  barTrack: { gridColumn: '1', height: 8, background: '#e8e4dc', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, transition: 'width 0.4s ease' },
  barVotes: { gridColumn: '2', gridRow: '1 / 3', fontSize: 12, fontFamily: 'sans-serif', color: '#888', whiteSpace: 'nowrap', alignSelf: 'center' },
  emptyState: { textAlign: 'center', padding: '3rem', color: '#aaa', fontStyle: 'italic', fontSize: 14 },
};
