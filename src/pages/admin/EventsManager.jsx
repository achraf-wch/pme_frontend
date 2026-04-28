import { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, getEventRegistrations } from '../../services/api';

const BASE_URL = 'http://localhost:8000';
const emptyForm = { title: '', description: '', location: '', start_time: '', end_time: '', max_attendees: '' };

export default function EventsManager() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [attachFile, setAttachFile] = useState(null);
    const [attachPreview, setAttachPreview] = useState(null);
    const [registrations, setRegistrations] = useState({});

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        const res = await getEvents();
        setEvents(res.data);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0] ?? null;
        setAttachFile(file);
        setAttachPreview(file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (attachFile) payload.attachment = attachFile;

        if (editingId) await updateEvent(editingId, payload);
        else           await createEvent(payload);

        setForm(emptyForm);
        setEditingId(null);
        setAttachFile(null);
        setAttachPreview(null);
        fetchEvents();
    };

    const editItem = (ev) => {
        setForm({
            title: ev.title,
            description: ev.description ?? '',
            location: ev.location,
            start_time: ev.start_time?.slice(0, 16) ?? '',
            end_time: ev.end_time?.slice(0, 16) ?? '',
            max_attendees: ev.max_attendees ?? '',
        });
        setEditingId(ev.id);
        setAttachFile(null);
        setAttachPreview(null);
    };

    const showRegistrations = async (id) => {
        const res = await getEventRegistrations(id);
        setRegistrations(prev => ({ ...prev, [id]: res.data }));
    };

    const deleteItem = async (id) => {
        await deleteEvent(id);
        fetchEvents();
    };

    const isImage = (path) => /\.(jpg|jpeg|png|gif|webp)$/i.test(path ?? '');

    return (
        <div>
            <h3>Manage Events</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: 20, background: '#f9f9f9', padding: 10 }}>
                <input type="text" placeholder="Title" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required style={{ display: 'block', width: '100%', marginBottom: 5 }} />
                <input type="text" placeholder="Location" value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    required style={{ display: 'block', width: '100%', marginBottom: 5 }} />
                <input type="datetime-local" value={form.start_time}
                    onChange={e => setForm({ ...form, start_time: e.target.value })}
                    required style={{ display: 'block', marginBottom: 5 }} />
                <input type="datetime-local" value={form.end_time}
                    onChange={e => setForm({ ...form, end_time: e.target.value })}
                    required style={{ display: 'block', marginBottom: 5 }} />
                <input type="number" placeholder="Max attendees (optional)" value={form.max_attendees}
                    onChange={e => setForm({ ...form, max_attendees: e.target.value })}
                    style={{ display: 'block', marginBottom: 5 }} />
                <textarea placeholder="Description" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows="3" style={{ display: 'block', width: '100%', marginBottom: 5 }} />

                <div style={{ marginBottom: 5 }}>
                    <label>Attachment (image / PDF / Word — max 10MB)</label><br />
                    <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} />
                    {attachPreview && (
                        <img src={attachPreview} alt="preview"
                            style={{ marginTop: 6, maxHeight: 100, display: 'block' }} />
                    )}
                    {attachFile && !attachPreview && (
                        <p style={{ margin: '4px 0', fontSize: 13 }}>📎 {attachFile.name}</p>
                    )}
                </div>

                <button type="submit">{editingId ? 'Update' : 'Create'}</button>
                {editingId && (
                    <button type="button" style={{ marginLeft: 6 }} onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                        setAttachFile(null);
                        setAttachPreview(null);
                    }}>Cancel</button>
                )}
            </form>

            {events.map(ev => (
                <div key={ev.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                    <h4>{ev.title}</h4>
                    <p>{ev.location} | {new Date(ev.start_time).toLocaleString()} - {new Date(ev.end_time).toLocaleString()}</p>
                    <p>{ev.description}</p>
                    {ev.attachment_path && (
                        <div style={{ marginBottom: 6 }}>
                            {isImage(ev.attachment_path) ? (
                                <img src={`${BASE_URL}/storage/${ev.attachment_path}`}
                                    alt="attachment" style={{ maxHeight: 80 }} />
                            ) : (
                                <a href={`${BASE_URL}/storage/${ev.attachment_path}`}
                                    target="_blank" rel="noreferrer">📎 View attachment</a>
                            )}
                        </div>
                    )}
                    <button onClick={() => showRegistrations(ev.id)}>Registrations</button>
                    <button onClick={() => editItem(ev)} style={{ marginLeft: 6 }}>Edit</button>
                    <button onClick={() => deleteItem(ev.id)} style={{ marginLeft: 6 }}>Delete</button>
                    {registrations[ev.id] && (
                        <div>
                            <strong>Registered:</strong>
                            <ul>
                                {registrations[ev.id].map(r => (
                                    <li key={r.user.id}>{r.user.name} ({r.user.email})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}