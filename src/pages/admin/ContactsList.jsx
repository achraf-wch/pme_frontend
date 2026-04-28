// src/pages/admin/ContactsList.jsx
import { useEffect, useState } from 'react';
import { getContacts, deleteContact } from '../../services/api';

export default function ContactsList() {
    const [contacts, setContacts] = useState([]);
    useEffect(() => { fetchContacts(); }, []);
    const fetchContacts = async () => { const res = await getContacts(); setContacts(res.data); };
    const deleteMsg = async (id) => { await deleteContact(id); fetchContacts(); };
    return (
        <div>
            <h3>Contact Messages</h3>
            {contacts.map(c => (
                <div key={c.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                    <strong>{c.name}</strong> ({c.email})<br />
                    {c.message}<br />
                    <small>{new Date(c.created_at).toLocaleString()}</small>
                    <button onClick={() => deleteMsg(c.id)} style={{ marginLeft: 10 }}>Delete</button>
                </div>
            ))}
        </div>
    );
}