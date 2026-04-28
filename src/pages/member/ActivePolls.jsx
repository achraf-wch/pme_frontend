import { useEffect, useState } from 'react';
import { getActivePolls, submitVote } from '../../services/api';

export default function ActivePolls() {
    const [polls, setPolls] = useState([]);
    const [voted, setVoted] = useState({});
    const [message, setMessage] = useState('');
    useEffect(() => { fetchPolls(); }, []);
    const fetchPolls = async () => {
        const res = await getActivePolls();
        setPolls(res.data);
        // optionally check which polls user already voted (needs backend endpoint /my-votes)
    };
    const handleVote = async (pollId, optionId) => {
        try {
            await submitVote(pollId, optionId);
            setMessage('Vote recorded!');
            fetchPolls(); // refresh list
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error voting');
        }
    };
    return (
        <div>
            <h3>Active Polls</h3>
            {message && <p>{message}</p>}
            {polls.length === 0 ? <p>No active polls</p> : polls.map(poll => (
                <div key={poll.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                    <h4>{poll.title}</h4>
                    <p>{poll.description}</p>
                    <p>Ends: {new Date(poll.end_date).toLocaleString()}</p>
                    {poll.options.map(opt => (
                        <button key={opt.id} onClick={() => handleVote(poll.id, opt.id)} style={{ marginRight: 5 }}>
                            {opt.option_text}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}