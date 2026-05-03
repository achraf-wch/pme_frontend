import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../services/api';

export default function ProfileEditor() {
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ password: '', password_confirmation: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        getProfile().then(res => setProfile(res.data));
    }, []);

    const handleUpdate = async (e, type) => {
        e.preventDefault();
        try {
            const data = type === 'info' ? { name: profile.name, email: profile.email } : passwordData;
            await updateProfile(data);
            setMessage(type === 'info' ? 'Profil mis à jour !' : 'Mot de passe modifié !');
            if (type === 'pass') setPasswordData({ password: '', password_confirmation: '' });
        } catch (err) { setMessage('Erreur lors de la mise à jour.'); }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 text-left">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-4 italic">Mon Compte | حسابي</h3>
            
            {message && (
                <div className="bg-blue-600 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center shadow-lg shadow-blue-600/20">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Infos */}
                <form onSubmit={(e) => handleUpdate(e, 'info')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informations Personnelles</p>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-300 ml-4 uppercase">Nom complet</label>
                        <input type="text" className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-300 ml-4 uppercase">Adresse Email</label>
                        <input type="email" className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} required />
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">Sauvegarder</button>
                </form>

                {/* Password */}
                <form onSubmit={(e) => handleUpdate(e, 'pass')} className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Sécurité du Compte</p>
                    <input type="password" placeholder="Nouveau mot de passe" className="w-full p-4 rounded-2xl bg-slate-800 border-none font-bold text-white text-sm" value={passwordData.password} onChange={e => setPasswordData({...passwordData, password: e.target.value})} required />
                    <input type="password" placeholder="Confirmer mot de passe" className="w-full p-4 rounded-2xl bg-slate-800 border-none font-bold text-white text-sm" value={passwordData.password_confirmation} onChange={e => setPasswordData({...passwordData, password_confirmation: e.target.value})} required />
                    <button type="submit" className="w-full py-4 bg-[#c9a84c] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">Changer le mot de passe</button>
                </form>
            </div>
        </div>
    );
}