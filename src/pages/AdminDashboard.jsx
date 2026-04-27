import { useEffect, useState } from 'react';
import { getPendingRequests, approveRequest, rejectRequest } from '../services/api';
import CreatePoll from './admin/CreatePoll';
import AdminPollList from './admin/AdminPollList';

export default function AdminDashboard({ user }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [refreshPolls, setRefreshPolls] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await getPendingRequests();
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveRequest(id);
            setMessage('Request approved!');
            fetchRequests();
        } catch (err) {
            setMessage('Error approving request');
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectRequest(id);
            setMessage('Request rejected');
            fetchRequests();
        } catch (err) {
            setMessage('Error rejecting request');
        }
    };

    const handlePollCreated = () => {
        setRefreshPolls(prev => !prev);
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {user.name}</p>
            {message && <p>{message}</p>}

            <section>
                <h3>Pending Membership Requests</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : requests.length === 0 ? (
                    <p>No pending requests.</p>
                ) : (
                    requests.map(req => (
                        <div key={req.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                            <p><strong>{req.user.name}</strong> ({req.user.email})</p>
                            <p>Motivation: {req.motivation || 'None'}</p>
                            <p>Submitted: {new Date(req.created_at).toLocaleString()}</p>
                            <button onClick={() => handleApprove(req.id)}>Approve</button>
                            <button onClick={() => handleReject(req.id)}>Reject</button>
                        </div>
                    ))
                )}
            </section>

            <hr />

            <section>
                <CreatePoll onPollCreated={handlePollCreated} />
            </section>

            <hr />

            <section>
                <AdminPollList key={refreshPolls ? 'refresh' : 'initial'} />
            </section>
        </div>
    );
}