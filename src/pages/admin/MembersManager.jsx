import { useEffect, useState } from 'react';
import API from '../../services/api';

// Map role names to IDs based on your roles table
const ROLES = [
    { id: 1, name: 'visitor' },
    { id: 2, name: 'member' },
    { id: 3, name: 'admin' },
    // add sympathizer, volunteer if you add them to roles table
];

export default function MembersManager() {
    const [members, setMembers] = useState([]);

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        const res = await API.get('/admin/members');
        setMembers(res.data);
    };

    const updateRole = async (id, role_id) => {
        await API.put(`/admin/members/${id}`, { role_id });
        fetchMembers();
    };

    const deleteMember = async (id) => {
        if (!window.confirm('Delete this member?')) return;
        await API.delete(`/admin/members/${id}`);
        fetchMembers();
    };

    return (
        <div>
            <h3>Members</h3>
            <table border="1" cellPadding="6" width="100%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(m => (
                        <tr key={m.id}>
                            <td>{m.name}</td>
                            <td>{m.email}</td>
                            <td>
                                <select
                                    value={m.role_id}
                                    onChange={e => updateRole(m.id, e.target.value)}
                                >
                                    {ROLES.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td>{new Date(m.created_at).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => deleteMember(m.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}