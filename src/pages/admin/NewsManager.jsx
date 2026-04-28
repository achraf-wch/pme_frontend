import { useEffect, useState } from 'react';
import { getNews, createNews, updateNews, deleteNews } from '../../services/api';

const BASE_URL = 'http://localhost:8000';

export default function NewsManager() {
    const [news, setNews] = useState([]);
    const [form, setForm] = useState({ title: '', content: '', is_published: true });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: form.title,
            content: form.content,
            is_published: form.is_published ? '1' : '0',  // send as string 1/0
        };
        if (imageFile) payload.image = imageFile;

        if (editingId) await updateNews(editingId, payload);
        else           await createNews(payload);

        setForm({ title: '', content: '', is_published: true });
        setImageFile(null);
        setPreview(null);
        setEditingId(null);
        fetchNews();
    };

    const editItem = (item) => {
        setForm({ title: item.title, content: item.content, is_published: !!item.is_published });
        setEditingId(item.id);
        setImageFile(null);
        setPreview(item.image_path ? `${BASE_URL}/storage/${item.image_path}` : null);
    };

    const deleteItem = async (id) => {
        await deleteNews(id);
        fetchNews();
    };

    return (
        <div>
            <h3>Manage News</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: 20, background: '#f9f9f9', padding: 10 }}>
                <input
                    type="text" placeholder="Title" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required style={{ display: 'block', width: '100%', marginBottom: 5 }}
                />
                <textarea
                    placeholder="Content" value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    required rows="4" style={{ display: 'block', width: '100%', marginBottom: 5 }}
                />
                <div style={{ marginBottom: 5 }}>
                    <label>Image (jpg, png, gif, webp — max 5MB)</label><br />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {preview && (
                        <img src={preview} alt="preview"
                            style={{ marginTop: 6, maxHeight: 120, display: 'block' }} />
                    )}
                </div>
                <label style={{ display: 'block', marginBottom: 5 }}>
                    <input
                        type="checkbox" checked={form.is_published}
                        onChange={e => setForm({ ...form, is_published: e.target.checked })}
                    /> Published
                </label>
                <button type="submit">{editingId ? 'Update' : 'Create'}</button>
                {editingId && (
                    <button type="button" style={{ marginLeft: 6 }} onClick={() => {
                        setEditingId(null);
                        setForm({ title: '', content: '', is_published: true });
                        setImageFile(null);
                        setPreview(null);
                    }}>Cancel</button>
                )}
            </form>

            {news.map(item => (
                <div key={item.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                    {item.image_path && (
                        <img
                            src={`${BASE_URL}/storage/${item.image_path}`}
                            alt={item.title}
                            style={{ maxHeight: 80, marginBottom: 6, display: 'block' }}
                        />
                    )}
                    <h4>{item.title}</h4>
                    <p>{item.content.substring(0, 100)}…</p>
                    <small>{item.is_published ? '✅ Published' : '⏸ Draft'}</small>
                    <br />
                    <button onClick={() => editItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item.id)} style={{ marginLeft: 6 }}>Delete</button>
                </div>
            ))}
        </div>
    );
}