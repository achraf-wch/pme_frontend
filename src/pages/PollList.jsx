import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // adjust to your auth hook
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function PollList() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voting, setVoting] = useState({});
    const [message, setMessage] = useState(null);
    const [pendingVote, setPendingVote] = useState(null);
    const { user } = useAuth(); // get current user (null if guest)

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        setLoading(true);
        try {
            const res = await API.get('/polls/feed');
            setPolls(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = (poll, option) => {
        if (!user) {
            setMessage({ type: 'error', text: 'Vous devez vous connecter pour voter.' });
            return;
        }
        setPendingVote({ pollId: poll.id, optionId: option.id, pollTitle: poll.title, optionText: option.option_text });
    };

    const confirmVote = async () => {
        if (!pendingVote) return;
        const { pollId, optionId } = pendingVote;
        setPendingVote(null);
        setVoting(prev => ({ ...prev, [pollId]: true }));
        try {
            await API.post('/vote', { poll_id: pollId, option_id: optionId });
            // Refresh polls to update has_voted and results
            await fetchPolls();
            setMessage({ type: 'success', text: 'Vote enregistré !' });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Erreur lors du vote.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setVoting(prev => ({ ...prev, [pollId]: false }));
        }
    };

    if (loading) return <div className="text-center py-12">Chargement des sondages...</div>;

    if (polls.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-16 text-center">
                <p className="text-slate-400 italic">Aucun sondage public actuellement.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <ConfirmDialog
                open={Boolean(pendingVote)}
                title="Confirmer votre vote ?"
                message={pendingVote ? `Votre choix "${pendingVote.optionText}" sera enregistré pour "${pendingVote.pollTitle}".` : ''}
                confirmLabel="Valider mon vote"
                tone="success"
                onConfirm={confirmVote}
                onCancel={() => setPendingVote(null)}
            />
            <div className="flex items-center gap-4 mb-12">
                <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                <h2 className="text-4xl font-black text-[#2c3e50] uppercase tracking-tighter">Sondages & Opinions</h2>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-10">
                {polls.map(poll => (
                    <div key={poll.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{poll.title}</h3>
                            {poll.description && (
                                <p className="text-slate-500 mb-6 leading-relaxed">{poll.description}</p>
                            )}
                            <div className="text-xs text-slate-400 mb-6">
                                {new Date(poll.start_date).toLocaleDateString()} → {new Date(poll.end_date).toLocaleDateString()}
                            </div>

                            {poll.has_voted ? (
                                // Show results
                                <div className="space-y-4">
                                    <div className="text-sm font-semibold text-slate-600 mb-2">Résultats :</div>
                                    {poll.options?.map(opt => {
                                        const votes = opt.votes_count || 0;
                                        const total = poll.total_votes || 0;
                                        const percent = total > 0 ? Math.round((votes / total) * 100) : 0;
                                        return (
                                            <div key={opt.id} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>{opt.option_text}</span>
                                                    <span className="font-medium">{percent}% ({votes} voix)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : poll.can_vote ? (
                                // Voting options
                                <div className="space-y-4">
                                    <div className="text-sm text-slate-500">Votre choix :</div>
                                    <div className="flex flex-wrap gap-4">
                                        {poll.options?.map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleVote(poll, opt)}
                                                disabled={voting[poll.id]}
                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-full transition shadow-md"
                                            >
                                                {voting[poll.id] ? 'Envoi...' : opt.option_text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-slate-400 italic">
                                    Vous n'êtes pas autorisé à voter pour ce sondage.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
