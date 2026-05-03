import { useEffect, useState } from 'react';
import { getNews, createNews, updateNews, deleteNews, getStorageUrl } from '../../services/api';

const AUDIENCE_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Visible on homepage', icon: '🌐' },
  { value: 'visitor', label: 'Visiteurs', desc: 'Inscrits non-membres', icon: '👤' },
  { value: 'sympathizer', label: 'Sympathisants', desc: 'Sympathisants du parti', icon: '🤝' },
  { value: 'member', label: 'Membres', desc: 'Membres actifs', icon: '✓' },
  { value: 'local_official', label: 'Élus Locaux', desc: 'Responsables locaux', icon: '🏛' },
  { value: 'central_admin', label: 'Admin Central', desc: 'Administration centrale', icon: '⚙' },
];

const emptyForm = { title: '', content: '', is_published: true, audience: ['public'] };

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    const res = await getNews();
    setNews(res.data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0] ?? null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const toggleAudience = (val) => {
    setForm(f => {
      const has = f.audience.includes(val);
      if (has) return { ...f, audience: f.audience.filter(a => a !== val) };
      return { ...f, audience: [...f.audience, val] };
    });
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      is_published: !!item.is_published,
      audience: item.audience || ['public'],
    });
    setPreview(getStorageUrl(item.image_path));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    await deleteNews(id);
    fetchNews();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.audience.length === 0) return alert('Sélectionnez au moins une audience.');
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content,
      is_published: form.is_published ? '1' : '0',
      audience: form.audience,
    };
    if (imageFile) payload.image = imageFile;
    if (editingId) await updateNews(editingId, payload);
    else await createNews(payload);
    setSaving(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreview(null);
    fetchNews();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview(null);
    setImageFile(null);
  };

  return (
    <div style={styles.root}>
      {/* FORM */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardLabel}>{editingId ? 'Modifier' : 'Créer'}</div>
          <h2 style={styles.cardTitle}>{editingId ? "Modifier l'article" : 'Nouvel Article'}</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Titre</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Titre de l'article..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contenu</label>
            <textarea
              style={{ ...styles.input, minHeight: 120, resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Rédigez votre article..."
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Audience cible</label>
            <div style={styles.audienceGrid}>
              {AUDIENCE_OPTIONS.map(opt => {
                const active = form.audience.includes(opt.value);
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => toggleAudience(opt.value)}
                    style={{ ...styles.audienceChip, ...(active ? styles.audienceChipActive : {}) }}
                  >
                    <span style={styles.audienceIcon}>{opt.icon}</span>
                    <div>
                      <div style={styles.audienceChipLabel}>{opt.label}</div>
                      <div style={styles.audienceChipDesc}>{opt.desc}</div>
                    </div>
                    {active && <span style={styles.checkmark}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
              {preview && (
                <div style={styles.previewWrap}>
                  <img src={preview} style={styles.previewImg} alt="Preview" />
                  <button type="button" onClick={() => { setPreview(null); setImageFile(null); }} style={styles.removeImg}>✕</button>
                </div>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Publication</label>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                style={{ ...styles.toggleBtn, ...(form.is_published ? styles.toggleActive : styles.toggleInactive) }}
              >
                <span style={styles.toggleDot(form.is_published)} />
                {form.is_published ? 'Publié immédiatement' : 'Brouillon'}
              </button>
            </div>
          </div>

          <div style={styles.formActions}>
            <button type="submit" style={styles.btnPrimary} disabled={saving}>
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : "Publier l'article"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={styles.btnSecondary}>Annuler</button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      <div style={styles.listHeader}>
        <h3 style={styles.listTitle}>Articles publiés</h3>
        <span style={styles.listCount}>{news.length} article{news.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={styles.list}>
        {news.map(item => (
          <div key={item.id} style={styles.newsCard}>
            <div style={styles.newsThumb}>
              {item.image_path
                ? <img src={getStorageUrl(item.image_path)} style={styles.newsThumbImg} alt="" />
                : <div style={styles.newsThumbEmpty}><span style={{ fontSize: 24, opacity: 0.3 }}>📰</span></div>
              }
            </div>
            <div style={styles.newsContent}>
              <div style={styles.newsMeta}>
                <span style={{ ...styles.badge, ...(item.is_published ? styles.badgeGreen : styles.badgeGray) }}>
                  {item.is_published ? 'Publié' : 'Brouillon'}
                </span>
                {(item.audience || []).map(a => (
                  <span key={a} style={styles.audienceBadge}>{AUDIENCE_OPTIONS.find(o => o.value === a)?.label || a}</span>
                ))}
              </div>
              <h4 style={styles.newsTitle}>{item.title}</h4>
              <p style={styles.newsExcerpt}>{item.content}</p>
              <div style={styles.newsActions}>
                <button onClick={() => editItem(item)} style={styles.actionBtn}>Modifier</button>
                <button onClick={() => deleteItem(item.id)} style={styles.actionBtnDanger}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
        {news.length === 0 && <div style={styles.emptyState}>Aucun article créé pour l'instant.</div>}
      </div>
    </div>
  );
}

const styles = {
  root: { fontFamily: "'Georgia', 'Times New Roman', serif", maxWidth: 860, margin: '0 auto', padding: '2rem 1rem', color: '#1a1a2e' },
  card: { background: '#fff', border: '1px solid #e8e4dc', borderRadius: 16, marginBottom: '2.5rem', overflow: 'hidden' },
  cardHeader: { background: '#1a1a2e', padding: '1.5rem 2rem', borderBottom: '3px solid #c9a84c' },
  cardLabel: { fontSize: 10, letterSpacing: '0.2em', color: '#c9a84c', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { margin: 0, fontSize: 20, fontWeight: 400, color: '#f5f0e8', fontStyle: 'italic' },
  form: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 11, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b7a' },
  input: { fontFamily: "'Georgia', serif", fontSize: 15, padding: '12px 16px', border: '1px solid #ddd8cf', borderRadius: 8, outline: 'none', color: '#1a1a2e', background: '#faf9f7', width: '100%', boxSizing: 'border-box' },
  audienceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 },
  audienceChip: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid #e0dbd0', borderRadius: 10, cursor: 'pointer', background: '#faf9f7', textAlign: 'left', position: 'relative', transition: 'all 0.15s' },
  audienceChipActive: { border: '1.5px solid #1a1a2e', background: '#f0ede5' },
  audienceIcon: { fontSize: 18, flexShrink: 0 },
  audienceChipLabel: { fontSize: 12, fontWeight: 700, fontFamily: 'sans-serif', color: '#1a1a2e' },
  audienceChipDesc: { fontSize: 10, color: '#888', marginTop: 1 },
  checkmark: { position: 'absolute', top: 6, right: 8, fontSize: 11, color: '#1a1a2e', fontWeight: 700 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  fileInput: { fontSize: 12, color: '#666' },
  previewWrap: { marginTop: 8, position: 'relative', display: 'inline-block' },
  previewImg: { width: 72, height: 72, objectFit: 'cover', borderRadius: 8, display: 'block' },
  removeImg: { position: 'absolute', top: -6, right: -6, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  toggleBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: 'sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.2s' },
  toggleActive: { background: '#1a1a2e', color: '#c9a84c' },
  toggleInactive: { background: '#e8e4dc', color: '#888' },
  toggleDot: (active) => ({ width: 12, height: 12, borderRadius: '50%', background: active ? '#c9a84c' : '#bbb', transition: 'all 0.2s' }),
  formActions: { display: 'flex', gap: 12, paddingTop: 8 },
  btnPrimary: { padding: '12px 28px', background: '#1a1a2e', color: '#c9a84c', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' },
  btnSecondary: { padding: '12px 24px', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontFamily: 'sans-serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' },
  listHeader: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: '1rem' },
  listTitle: { margin: 0, fontSize: 16, fontWeight: 400, fontStyle: 'italic', color: '#1a1a2e' },
  listCount: { fontSize: 12, color: '#999', fontFamily: 'sans-serif' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  newsCard: { display: 'flex', gap: 16, background: '#fff', border: '1px solid #e8e4dc', borderRadius: 12, overflow: 'hidden', transition: 'box-shadow 0.2s' },
  newsThumb: { width: 100, flexShrink: 0 },
  newsThumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  newsThumbEmpty: { width: '100%', height: '100%', minHeight: 100, background: '#f5f2eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  newsContent: { flex: 1, padding: '1rem 1rem 1rem 0', display: 'flex', flexDirection: 'column', gap: 6 },
  newsMeta: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  badge: { fontSize: 10, padding: '2px 8px', borderRadius: 20, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' },
  badgeGreen: { background: '#e6f4ea', color: '#2d6a4f' },
  badgeGray: { background: '#f0ede5', color: '#888' },
  audienceBadge: { fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#1a1a2e', color: '#c9a84c', fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.05em' },
  newsTitle: { margin: 0, fontSize: 15, fontWeight: 400, color: '#1a1a2e' },
  newsExcerpt: { margin: 0, fontSize: 13, color: '#777', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  newsActions: { display: 'flex', gap: 12, marginTop: 4 },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.1em', color: '#1a1a2e', textDecoration: 'underline', padding: 0 },
  actionBtnDanger: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.1em', color: '#c0392b', textDecoration: 'underline', padding: 0 },
  emptyState: { textAlign: 'center', padding: '3rem', color: '#aaa', fontStyle: 'italic', fontSize: 14 },
};
