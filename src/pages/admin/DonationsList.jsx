import { useEffect, useState } from 'react';
import { getDonations, updateDonationStatus } from '../../services/api';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({ donor, targetStatus, onConfirm, onCancel }) {
    const isConfirm = targetStatus === 'completed';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-slate-100">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${isConfirm ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <span className="text-2xl">{isConfirm ? '✅' : '❌'}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">
                    {isConfirm ? 'Confirmer la contribution ?' : 'Marquer comme échouée ?'}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                    La contribution de{' '}
                    <span className="font-bold text-slate-700">{donor.name}</span>
                    {' '}({donor.amount} €) sera marquée comme{' '}
                    <span className={`font-bold ${isConfirm ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isConfirm ? 'confirmée' : 'échouée'}
                    </span>.
                    <span className="block mt-3 text-xs text-slate-400">
                        RIB a verifier: <span className="font-black text-slate-700">{donor.rib || 'Non renseigne'}</span>
                    </span>
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-2xl text-white text-sm font-bold transition-colors ${
                            isConfirm
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isConfirm ? 'Confirmer' : 'Marquer échouée'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    completed: { label: 'Confirmée', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    confirmed: { label: 'Confirmée', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    failed:    { label: 'Échouée',   cls: 'bg-red-50 text-red-700 border-red-200' },
    pending:   { label: 'En attente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

function StatusBadge({ status }) {
    const { label, cls } = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>
            {label}
        </span>
    );
}

// ─── Donation Card ────────────────────────────────────────────────────────────
function DonationCard({ donation, onUpdateStatus }) {
    const [modal, setModal] = useState(null); // 'completed' | 'failed' | null

    const dateStr = new Date(donation.created_at).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    const initials = donation.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <>
            {modal && (
                <ConfirmModal
                    donor={donation}
                    targetStatus={modal}
                    onConfirm={() => { onUpdateStatus(donation.id, modal); setModal(null); }}
                    onCancel={() => setModal(null)}
                />
            )}

            <div className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md p-5 rounded-3xl transition-all duration-200">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-black text-slate-900">{donation.name}</p>
                                <span className="text-emerald-600 font-black text-sm">{donation.amount} €</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                {donation.email} · {dateStr}
                            </p>
                            <div className="mt-2 inline-flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
                                <span className="font-black uppercase tracking-widest">RIB</span>
                                <span className="font-mono font-bold break-all">{donation.rib || 'Non renseigne'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <StatusBadge status={donation.status} />

                        <div className="flex gap-2">
                            {donation.status !== 'completed' && donation.status !== 'confirmed' && (
                                <button
                                    onClick={() => setModal('completed')}
                                    className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all border border-emerald-200"
                                >
                                    Confirmer
                                </button>
                            )}
                            {donation.status !== 'failed' && (
                                <button
                                    onClick={() => setModal('failed')}
                                    className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition-all border border-red-200"
                                >
                                    Échoué
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DonationsList() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        getDonations()
            .then(res => setDonations(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdateStatus = async (id, status) => {
        await updateDonationStatus(id, status);
        setDonations(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    };

    const filtered = filter === 'all'
        ? donations
        : donations.filter(d => filter === 'completed'
            ? d.status === 'completed' || d.status === 'confirmed'
            : d.status === filter
        );

    const total = donations
        .filter(d => d.status === 'completed' || d.status === 'confirmed')
        .reduce((sum, d) => sum + Number(d.amount), 0);

    if (loading) return (
        <div className="flex items-center justify-center py-24 text-slate-400 text-sm font-bold">
            Chargement des contributions…
        </div>
    );

    return (
        <div className="space-y-6 text-left">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Finance</p>
                    <h3 className="text-2xl font-black text-slate-900">Donations | المساهمات</h3>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total confirmé</p>
                        <p className="text-lg font-black text-emerald-600">{total.toFixed(2)} €</p>
                    </div>
                    <span className="w-px h-10 bg-slate-200" />
                    <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-xs font-black">
                        {donations.length} total
                    </span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { key: 'all', label: 'Tous' },
                    { key: 'pending', label: 'En attente' },
                    { key: 'completed', label: 'Confirmées' },
                    { key: 'failed', label: 'Échouées' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                            filter === key
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        {label}
                        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
                            filter === key ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                        }`}>
                            {key === 'all'
                                ? donations.length
                                : donations.filter(d => key === 'completed'
                                    ? d.status === 'completed' || d.status === 'confirmed'
                                    : d.status === key
                                ).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl">
                    Aucune contribution dans cette catégorie.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(d => (
                        <DonationCard key={d.id} donation={d} onUpdateStatus={handleUpdateStatus} />
                    ))}
                </div>
            )}
        </div>
    );
}
