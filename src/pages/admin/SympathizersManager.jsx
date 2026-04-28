import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function SympathizersManager() {
    const [list, setList] = useState([]);

    useEffect(() => { fetch(); }, []);

    const fetch = async () => {
        const res = await API.get('/admin/sympathizers');
        setList(res.data);
    };

    const remove = async (id) => {
        if (!window.confirm('Delete?')) return;
        await API.delete(`/admin/sympathizers/${id}`);
        fetch();
    };

    return (
        <div>
            <h3>Sympathizers</h3>
            <table border="1" cellPadding="6" width="100%">
                <thead>
                    <tr>
                        <th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Message</th><th>Date</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(s => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.phone}</td>
                            <td>{s.city}</td>
                            <td>{s.message}</td>
                            <td>{new Date(s.created_at).toLocaleDateString()}</td>
                            <td><button onClick={() => remove(s.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}