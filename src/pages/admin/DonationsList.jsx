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

    return (
        <div>
            <h3>Donations</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Note</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map(d => (
                        <tr key={d.id}>
                            <td>{d.name}</td>
                            <td>{d.email}</td>
                            <td>{d.amount} €</td>
                            <td>{d.note || '-'}</td>
                            <td>{d.status}</td>
                            <td>{new Date(d.created_at).toLocaleDateString()}</td>
                            <td>
                                {d.status === 'pending' && (
                                    <button onClick={() => updateStatus(d.id, 'confirmed')}>
                                        Confirm
                                    </button>
                                )}
                                {d.status === 'confirmed' && (
                                    <button onClick={() => updateStatus(d.id, 'pending')}>
                                        Revert
                                    </button>
                                )}
                                {d.status !== 'failed' && (
                                    <button onClick={() => updateStatus(d.id, 'failed')} style={{ marginLeft: 4 }}>
                                        Mark Failed
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}