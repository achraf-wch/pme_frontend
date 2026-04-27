import { useEffect, useState } from 'react';
import { getPolls, getPollResults } from '../../services/api';

export default function AdminPollList() {
    const [polls, setPolls] = useState([]);
    const [results, setResults] = useState({});

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        const res = await getPolls();
        setPolls(res.data);
    };

    const viewResults = async (pollId) => {
        const res = await getPollResults(pollId);
        setResults(prev => ({ ...prev, [pollId]: res.data }));
    };

    return (
        <div>
            <h3>All Polls</h3>
            {polls.map(poll => (
                <div key={poll.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h4>{poll.title}</h4>
                    <p>From: {new Date(poll.start_date).toLocaleString()} to {new Date(poll.end_date).toLocaleString()}</p>
                    <button onClick={() => viewResults(poll.id)}>Show Results</button>
                    {results[poll.id] && (
                        <div>
                            <h5>Results:</h5>
                            {results[poll.id].results.map(r => (
                                <p key={r.option_id}>{r.option_text}: {r.votes} votes</p>
                            ))}
                            <p>Total votes: {results[poll.id].total_votes}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}