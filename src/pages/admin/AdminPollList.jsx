import { useEffect, useState } from 'react';
import { getPolls, getPollResults } from '../../services/api';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-slate-100">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
                    <span className="text-2xl">🗳️</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Confirmer l'action</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ poll }) {
    const now = new Date();
    const start = new Date(poll.start_date);
    const end = new Date(poll.end_date);

    if (now < start) return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200">
            À venir
        </span>
    );
    if (now > end) return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
            Terminé
        </span>
    );
    return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            En cours
        </span>
    );
}

// ─── Result Bar ───────────────────────────────────────────────────────────────
function ResultBar({ label, votes, total }) {
    const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="font-black text-slate-900">{votes} <span className="text-slate-400 font-normal">({pct}%)</span></span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-slate-800 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ─── Poll Card ────────────────────────────────────────────────────────────────
function PollCard({ poll, onViewResults, result }) {
    const [expanded, setExpanded] = useState(false);
    const [modal, setModal] = useState(false);

    const handleShowResults = () => {
        if (result) {
            setExpanded(e => !e);
        } else {
            setModal(true);
        }
    };

    const confirm = () => {
        setModal(false);
        onViewResults(poll.id);
        setExpanded(true);
    };

    return (
        <>
            {modal && (
                <ConfirmModal
                    message={`Charger et afficher les résultats du sondage "${poll.title}" ?`}
                    onConfirm={confirm}
                    onCancel={() => setModal(false)}
                />
            )}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <StatusBadge poll={poll} />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#{poll.id}</span>
                            </div>
                            <h4 className="text-base font-black text-slate-900 leading-snug">{poll.title}</h4>
                        </div>
                        <button
                            onClick={handleShowResults}
                            className="shrink-0 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
                        >
                            {expanded ? 'Masquer' : 'Résultats'}
                        </button>
                    </div>

                    {/* Dates */}
                    <div className="mt-4 flex gap-4 flex-wrap">
                        {[
                            { label: 'Début', value: poll.start_date },
                            { label: 'Fin', value: poll.end_date },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                                <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-medium">
                                    {new Date(value).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results Panel */}
                {expanded && result && (
                    <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Résultats</p>
                            <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-full">
                                {result.total_votes} votes au total
                            </span>
                        </div>
                        <div className="space-y-4">
                            {result.results.map(r => (
                                <ResultBar
                                    key={r.option_id}
                                    label={r.option_text}
                                    votes={r.votes}
                                    total={result.total_votes}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPollList() {
    const [polls, setPolls] = useState([]);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPolls()
            .then(res => setPolls(res.data))
            .finally(() => setLoading(false));
    }, []);

    const viewResults = async (pollId) => {
        const res = await getPollResults(pollId);
        setResults(prev => ({ ...prev, [pollId]: res.data }));
    };

    if (loading) return (
        <div className="flex items-center justify-center py-24 text-slate-400 text-sm font-bold">
            Chargement des sondages…
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Administration</p>
                    <h3 className="text-2xl font-black text-slate-900">Sondages | الاستطلاعات</h3>
                </div>
                <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black">
                    {polls.length} sondage{polls.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Poll Cards */}
            {polls.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl">
                    Aucun sondage pour le moment.
                </div>
            ) : (
                <div className="space-y-4">
                    {polls.map(poll => (
                        <PollCard
                            key={poll.id}
                            poll={poll}
                            result={results[poll.id]}
                            onViewResults={viewResults}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}