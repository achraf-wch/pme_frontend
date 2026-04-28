// src/pages/admin/DonationsList.jsx
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
                <thead><tr><td>Name</td><td>Email</td><td>Amount</td><td>Status</td><td>Action</td></tr></thead>
                <tbody>
                    {donations.map(d => (
                        <tr key={d.id}>
                            <td>{d.donor_name}</td><td>{d.donor_email}</td><td>{d.amount} €</td><td>{d.status}</td>
                            <td>
                                {d.status === 'pending' && <button onClick={() => updateStatus(d.id, 'completed')}>Mark Completed</button>}
                                {d.status === 'completed' && <button onClick={() => updateStatus(d.id, 'pending')}>Revert</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}