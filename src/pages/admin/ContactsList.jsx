import { useEffect, useState } from 'react';
import { getContacts, deleteContact } from '../../services/api';

export default function ContactsList() {
    const [contacts, setContacts] = useState([]);
    useEffect(() => { fetchContacts(); }, []);
    const fetchContacts = async () => { const res = await getContacts(); setContacts(res.data); };
    const deleteMsg = async (id) => { await deleteContact(id); fetchContacts(); };

    return (
        <div className="space-y-6 text-left">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-4">Messages | الرسائل</h3>
            <div className="space-y-4">
                {contacts.map(c => (
                    <div key={c.id} className="group bg-slate-50 hover:bg-white p-6 rounded-[2rem] border border-transparent hover:border-blue-100 hover:shadow-xl transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => deleteMsg(c.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-widest">Supprimer</button>
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{c.name.charAt(0)}</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{c.name}</h4>
                                    <p className="text-xs text-blue-500 font-medium">{c.email}</p>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm bg-white p-4 rounded-2xl border border-slate-100 italic">"{c.message}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}