import { useState } from 'react';
import API from '../services/api';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/contact', form);
            setSuccess(true);
            setError(false);
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            setError(true);
            setSuccess(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Contact Us</h2>
            {success && <p style={{ color: 'green' }}>Message sent successfully! We'll get back to you soon.</p>}
            {error && <p style={{ color: 'red' }}>Error sending message. Please try again later.</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Message</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows="5" required style={{ width: '100%' }} />
                </div>
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
}