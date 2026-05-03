import { useEffect, useState } from 'react';
import { getMyDonations } from '../../services/api';
import API from '../../services/api';

export default function MyDonations() {
    const [donations, setDonations] = useState([]);
    const [form, setForm] = useState({ donor_name: '', donor_email: '', amount: '' });
    const [message, setMessage] = useState('');

    useEffect(() => { fetchDonations(); }, []);

    const fetchDonations = async () => {
        const res = await getMyDonations();
        setDonations(res.data);
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            await API.post('/donations', { ...form, user_id: null });
            setMessage('Merci ! Votre don est en attente de confirmation.');
            setForm({ donor_name: '', donor_email: '', amount: '' });
            fetchDonations();
        } catch (err) { setMessage('Une erreur est survenue.'); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Faire un Don | تبرع</h3>
                <form onSubmit={handleDonate} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                    <input type="text" placeholder="Nom Complet" className="w-full p-4 rounded-2xl border-none shadow-sm font-bold" value={form.donor_name} onChange={e => setForm({...form, donor_name: e.target.value})} required />
                    <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl border-none shadow-sm font-bold text-sm" value={form.donor_email} onChange={e => setForm({...form, donor_email: e.target.value})} required />
                    <div className="relative">
                        <input type="number" step="0.01" placeholder="Montant" className="w-full p-4 rounded-2xl border-none shadow-sm font-black text-xl text-blue-600" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                        <span className="absolute right-4 top-4 font-black text-slate-300">€</span>
                    </div>
                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">Confirmer la Donation</button>
                    {message && <p className="text-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">{message}</p>}
                </form>
            </div>

            <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Mon Historique</h3>
                <div className="space-y-3">
                    {donations.map(d => (
                        <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                            <div>
                                <p className="font-black text-slate-800 text-lg">{d.amount} €</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(d.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${d.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {d.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}