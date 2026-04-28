import { useState } from 'react';
import API from '../services/api';

export default function PublicDonation() {
    const [form, setForm] = useState({ donor_name: '', donor_email: '', amount: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/donations', form);
            setMessage('Thank you for your donation! It will be processed soon.');
            setForm({ donor_name: '', donor_email: '', amount: '' });
            setError('');
        } catch (err) {
            setError('Error submitting donation. Please try again.');
            setMessage('');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Support Our Cause</h2>
            <p>Your donation helps us build a better future.</p>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Full Name</label>
                    <input type="text" value={form.donor_name} onChange={e => setForm({...form, donor_name: e.target.value})} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input type="email" value={form.donor_email} onChange={e => setForm({...form, donor_email: e.target.value})} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Amount (€)</label>
                    <input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required style={{ width: '100%' }} />
                </div>
                <button type="submit">Donate Now</button>
            </form>
        </div>
    );
}