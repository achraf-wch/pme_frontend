import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function NewsletterManager() {
    const [subscribers, setSubscribers] = useState([]);
    const [form, setForm] = useState({ subject: '', body: '' });
    const [message, setMessage] = useState('');

    useEffect(() => { fetchSubscribers(); }, []);

    const fetchSubscribers = async () => {
        const res = await API.get('/admin/newsletter');
        setSubscribers(res.data);
    };

    const remove = async (id) => {
        if (!window.confirm('Remove subscriber?')) return;
        await API.delete(`/admin/newsletter/${id}`);
        fetchSubscribers();
    };

    const sendNewsletter = async (e) => {
        e.preventDefault();
        const res = await API.post('/admin/newsletter/send', form);
        setMessage(res.data.message);
        setForm({ subject: '', body: '' });
    };

    return (
        <div>
            <h3>Newsletter</h3>

            <h4>Send Newsletter</h4>
            <form onSubmit={sendNewsletter}>
                <input
                    type="text" placeholder="Subject" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    required style={{ display: 'block', width: '100%', marginBottom: 5 }}
                />
                <textarea
                    placeholder="Body" value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                    required rows="5" style={{ display: 'block', width: '100%', marginBottom: 5 }}
                />
                <button type="submit">Send to all subscribers</button>
            </form>
            {message && <p>{message}</p>}

            <h4>Subscribers ({subscribers.length})</h4>
            <table border="1" cellPadding="6" width="100%">
                <thead>
                    <tr><th>Email</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {subscribers.map(s => (
                        <tr key={s.id}>
                            <td>{s.email}</td>
                            <td>{new Date(s.created_at).toLocaleDateString()}</td>
                            <td><button onClick={() => remove(s.id)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}