import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitMembershipRequest } from '../services/api';

export default function MembershipRequest() {
    const [motivation, setMotivation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await submitMembershipRequest(motivation);
            setMessage(res.data.message);
            // Optionally redirect after 2 seconds
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting request');
        }
    };

    return (
        <div>
            <h2>Request Membership</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Why do you want to become a member? (optional)"
                    rows="4"
                    style={{ width: '100%' }}
                />
                <button type="submit">Submit Request</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}