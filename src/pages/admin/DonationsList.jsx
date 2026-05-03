import { useEffect, useState } from 'react';
import { getDonations, updateDonationStatus } from '../../services/api';

export default function DonationsList() {
    const [donations, setDonations] = useState([]);
    useEffect(() => { fetchDonations(); }, []);

    const fetchDonations = async () => {
        const res = await getDonations();
        setDonations(res.data);
    };

    const updateStatus = async (id, status) => {
        await updateDonationStatus(id, status);
        fetchDonations();
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Donations | المساهمات</h3>
                <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-bold">{donations.length} total</span>
            </div>

            <div className="grid gap-4">
                {donations.map(d => (
                    <div key={d.id} className="bg-white border border-slate-100 p-5 rounded-[1.5rem] flex flex-wrap items-center justify-between hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl">💰</div>
                            <div>
                                <p className="font-bold text-slate-800">{d.name} <span className="text-blue-500 font-black ml-2">{d.amount} €</span></p>
                                <p className="text-xs text-slate-400 font-medium tracking-wide">{d.email} • {new Date(d.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(d.status)}`}>
                                {d.status}
                            </span>
                            <div className="flex gap-2">
                                {d.status !== 'confirmed' && (
                                    <button onClick={() => updateStatus(d.id, 'confirmed')} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold">Confirmer</button>
                                )}
                                {d.status !== 'failed' && (
                                    <button onClick={() => updateStatus(d.id, 'failed')} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs font-bold">Échoué</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}