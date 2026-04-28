import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function VolunteersManager() {
    const [list, setList] = useState([]);

    useEffect(() => { fetchList(); }, []);

    const fetchList = async () => {
        const res = await API.get('/admin/volunteers');
        setList(res.data);
    };

    const remove = async (id) => {
        if (!window.confirm('Delete?')) return;
        await API.delete(`/admin/volunteers/${id}`);
        fetchList();
    };

    return (
        <div>
            <h3>Volunteers</h3>
            <table border="1" cellPadding="6" width="100%">
                <thead>
                    <tr>
                        <th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Skills</th><th>Motivation</th><th>Date</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(v => (
                        <tr key={v.id}>
                            <td>{v.name}</td>
                            <td>{v.email}</td>
                            <td>{v.phone}</td>
                            <td>{v.city}</td>
                            <td>{v.skills}</td>
                            <td>{v.motivation}</td>
                            <td>{new Date(v.created_at).toLocaleDateString()}</td>
                            <td><button onClick={() => remove(v.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}