import { useEffect, useState } from 'react';
import { getMyDonations } from '../../services/api';
import API from '../../services/api'; // for posting donation

export default function MyDonations() {
    const [donations, setDonations] = useState([]);
    const [form, setForm] = useState({ donor_name: '', donor_email: '', amount: '' });
    const [message, setMessage] = useState('');
    useEffect(() => { fetchDonations(); }, []);
    const fetchDonations = async () => { const res = await getMyDonations(); setDonations(res.data); };
    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            await API.post('/donations', { ...form, user_id: null }); // backend will associate user via auth
            setMessage('Donation recorded (pending)');
            setForm({ donor_name: '', donor_email: '', amount: '' });
            fetchDonations();
        } catch (err) { setMessage('Error'); }
    };
    return (
        <div>
            <h3>My Donations History</h3>
            <ul>{donations.map(d => <li key={d.id}>{d.amount} € - {d.status} - {new Date(d.created_at).toLocaleDateString()}</li>)}</ul>
            <h4>Make a Donation</h4>
            <form onSubmit={handleDonate}>
                <input type="text" placeholder="Full Name" value={form.donor_name} onChange={e => setForm({...form, donor_name: e.target.value})} required />
                <input type="email" placeholder="Email" value={form.donor_email} onChange={e => setForm({...form, donor_email: e.target.value})} required />
                <input type="number" step="0.01" placeholder="Amount (€)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                <button type="submit">Donate</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}