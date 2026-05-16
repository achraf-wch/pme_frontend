import { useEffect, useState } from 'react';
import { getActivePolls, submitVote } from '../../services/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ActivePolls() {
    const { t } = useLanguage();
    const [polls, setPolls] = useState([]);
    const [voting, setVoting] = useState({});
    const [message, setMessage] = useState('');
    const [pendingVote, setPendingVote] = useState(null);

    useEffect(() => { fetchPolls(); }, []);

    const fetchPolls = async () => {
        try {
            const res = await getActivePolls();
            setPolls(res.data);
        } catch (err) { console.error(err); }
    };

    const handleVote = (pollId, optionId) => {
        const poll = polls.find(item => item.id === pollId);
        if (poll && new Date(poll.start_date) > new Date()) {
            setMessage(t('voteNotOpenYet'));
            return;
        }
        const option = poll?.options?.find(item => item.id === optionId);
        setPendingVote({ pollId, optionId, pollTitle: poll?.title, optionText: option?.option_text });
    };

    const confirmVote = async () => {
        if (!pendingVote) return;
        const { pollId, optionId } = pendingVote;
        setPendingVote(null);
        setVoting(prev => ({ ...prev, [pollId]: true }));
        try {
            await submitVote(pollId, optionId);
            setMessage(t('voteRecorded'));
            fetchPolls();
        } catch (err) {
            setMessage(err.response?.data?.message || t('voteError'));
        } finally {
            setVoting(prev => ({ ...prev, [pollId]: false }));
        }
    };

    return (
        <div className="space-y-8 text-left">
            <ConfirmDialog
                open={Boolean(pendingVote)}
                title={t('confirmVote')}
                message={pendingVote ? `Votre choix "${pendingVote.optionText}" sera enregistré pour "${pendingVote.pollTitle}". Cette action ne pourra pas être répétée.` : ''}
                confirmLabel={t('validateVote')}
                tone="success"
                loading={pendingVote ? Boolean(voting[pendingVote.pollId]) : false}
                onConfirm={confirmVote}
                onCancel={() => setPendingVote(null)}
            />

            <h3 className="text-2xl font-black text-[#1a1a2e] uppercase tracking-tight border-b border-slate-100 pb-4">
                {t('activePollsTitle')}
            </h3>
            
            {message && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100 text-sm font-bold animate-pulse">
                    {message}
                </div>
            )}

            {polls.length === 0 ? (
                <div className="bg-slate-50 p-10 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('noActivePoll')}</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {polls.map(poll => (
                        <div key={poll.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                            <h4 className="text-xl font-black text-[#1a1a2e] mb-2 uppercase italic">{poll.title}</h4>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">{poll.description}</p>
                            
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {t('endsOn')} : {new Date(poll.end_date).toLocaleDateString('fr-FR')}
                                </p>
                            </div>

                            {new Date(poll.start_date) > new Date() ? (
                                <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] text-center">
                                    {t('opensOn')} {new Date(poll.start_date).toLocaleString('fr-FR')}
                                </div>
                            ) : poll.has_voted ? (
                                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] text-center">
                                    {t('participationRecorded')}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {poll.options.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleVote(poll.id, opt.id)}
                                            disabled={voting[poll.id]}
                                            className="px-6 py-3 bg-[#1a1a2e] text-[#c9a84c] rounded-xl hover:bg-black transition-all disabled:opacity-50 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200"
                                        >
                                            {voting[poll.id] ? '...' : opt.option_text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
