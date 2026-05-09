import { useEffect, useState } from 'react';
import { getContacts, deleteContact } from '../../services/api';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({ contactName, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-slate-100">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
                    <span className="text-2xl">🗑️</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Supprimer ce message ?</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                    Vous êtes sur le point de supprimer définitivement le message de{' '}
                    <span className="font-bold text-slate-700">{contactName}</span>.
                    Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-2xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({ contact, onDelete }) {
    const [modal, setModal] = useState(false);

    const initials = contact.name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const dateStr = new Date(contact.created_at).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <>
            {modal && (
                <ConfirmModal
                    contactName={contact.name}
                    onConfirm={() => { setModal(false); onDelete(contact.id); }}
                    onCancel={() => setModal(false)}
                />
            )}

            <div className="group bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl p-6 rounded-3xl transition-all duration-300 relative overflow-hidden">
                {/* Delete button — appears on hover */}
                <button
                    onClick={() => setModal(true)}
                    className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 text-xs font-bold"
                    title="Supprimer"
                >
                    ✕
                </button>

                {/* Sender info */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-black text-slate-900 truncate">{contact.name}</h4>
                        <a
                            href={`mailto:${contact.email}`}
                            className="text-xs text-blue-500 font-semibold hover:underline truncate block"
                        >
                            {contact.email}
                        </a>
                    </div>
                    <span className="ml-auto text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                        {dateStr}
                    </span>
                </div>

                {/* Message body */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-slate-600 text-sm leading-relaxed italic">"{contact.message}"</p>
                </div>
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContactsList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchContacts(); }, []);

    const fetchContacts = async () => {
        setLoading(true);
        const res = await getContacts();
        setContacts(res.data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        await deleteContact(id);
        setContacts(prev => prev.filter(c => c.id !== id));
    };

    if (loading) return (
        <div className="flex items-center justify-center py-24 text-slate-400 text-sm font-bold">
            Chargement des messages…
        </div>
    );

    return (
        <div className="space-y-6 text-left">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Communication</p>
                    <h3 className="text-2xl font-black text-slate-900">Messages | الرسائل</h3>
                </div>
                <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-xs font-black">
                    {contacts.length} message{contacts.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Cards */}
            {contacts.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl">
                    Aucun message reçu pour le moment.
                </div>
            ) : (
                <div className="grid gap-4">
                    {contacts.map(c => (
                        <ContactCard key={c.id} contact={c} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}