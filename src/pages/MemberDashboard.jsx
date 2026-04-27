import { useEffect, useState } from 'react';
import { getActivePolls, submitVote } from '../services/api';

export default function MemberDashboard({ user }) {
    const [polls, setPolls] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchActivePolls();
    }, []);

    const fetchActivePolls = async () => {
        try {
            const res = await getActivePolls();
            setPolls(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVote = async (pollId, optionId) => {
        try {
            await submitVote(pollId, optionId);
            setMessage('Vote submitted!');
            fetchActivePolls(); // refresh (poll might disappear if already voted? But we hide option to vote again)
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error voting');
        }
    };

    return (
        <div>
            <h2>Member Dashboard</h2>
            <p>Welcome, {user.name}</p>
            {message && <p>{message}</p>}
            <h3>Active Polls</h3>
            {polls.length === 0 ? (
                <p>No active polls at the moment.</p>
            ) : (
                polls.map(poll => (
                    <div key={poll.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        <h4>{poll.title}</h4>
                        <p>{poll.description}</p>
                        <p>Ends: {new Date(poll.end_date).toLocaleString()}</p>
                        {poll.options.map(option => (
                            <button key={option.id} onClick={() => handleVote(poll.id, option.id)}>
                                {option.option_text}
                            </button>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}