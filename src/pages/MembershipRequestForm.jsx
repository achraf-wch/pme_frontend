import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBranches, getMembershipRequest, submitMembershipRequest } from '../services/api';

const STATUS_LABELS = {
    pending: 'En attente',
    approved: 'Approuvée',
    rejected: 'Refusée',
};

const STAGE_LABELS = {
    pending: 'Envoyée',
    central_approved: 'Validée par l’administration centrale, en attente du superviseur',
    completed: 'Terminée',
    rejected: 'Refusée',
};

export default function MembershipRequest() {
    const [form, setForm] = useState({
        country: 'Maroc',
        regional_branch_id: '',
        local_branch_id: '',
        age: '',
        sex: '',
        motivation: '',
    });
    const [branches, setBranches] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [existingRequest, setExistingRequest] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getMembershipRequest()
            .then(res => setExistingRequest(res.data))
            .catch(() => setExistingRequest(null));
        getBranches()
            .then(res => setBranches(res.data))
            .catch(() => setBranches([]));
    }, []);

    const regionalBranches = branches.filter(branch => branch.type === 'regional');
    const localBranches = branches.filter(branch => branch.type === 'local' && String(branch.parent_id) === String(form.regional_branch_id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await submitMembershipRequest(form);
            setMessage(res.data.message);
            setExistingRequest(res.data.request);
            // Redirection automatique après 2 secondes[cite: 24]
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la soumission');
        }
    };

    const canSubmit = !existingRequest || existingRequest.status === 'rejected';

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 text-left">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 italic">
                    Devenir Membre | طلب adhésion
                </h2>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Rejoignez officiellement notre mouvement pour obtenir le droit de vote et influencer nos décisions futures.
                </p>

                {existingRequest && (
                    <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Ma demande</p>
                        <p className="mt-2 text-sm font-black text-slate-900">
                            {STATUS_LABELS[existingRequest.status] || existingRequest.status}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-600">
                            {STAGE_LABELS[existingRequest.review_stage] || existingRequest.review_stage || 'Envoyée'}
                        </p>
                        <div className="mt-3 grid gap-2 text-xs font-bold text-slate-500 sm:grid-cols-2">
                            {existingRequest.regional_branch && <span>Région: {existingRequest.regional_branch.name}</span>}
                            {existingRequest.local_branch && <span>Local: {existingRequest.local_branch.name}</span>}
                            {existingRequest.age && <span>Âge: {existingRequest.age}</span>}
                            {existingRequest.country && <span>Pays: {existingRequest.country}</span>}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Pays
                            </label>
                            <input
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                                required
                                className="w-full p-4 rounded-[1.25rem] bg-slate-50 border-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Âge
                            </label>
                            <input
                                type="number"
                                min="16"
                                max="120"
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: e.target.value })}
                                required
                                className="w-full p-4 rounded-[1.25rem] bg-slate-50 border-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Région
                            </label>
                            <select
                                value={form.regional_branch_id}
                                onChange={(e) => setForm({ ...form, regional_branch_id: e.target.value, local_branch_id: '' })}
                                required
                                className="w-full p-4 rounded-[1.25rem] bg-slate-50 border-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                            >
                                <option value="">Choisir une région</option>
                                {regionalBranches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Section locale
                            </label>
                            <select
                                value={form.local_branch_id}
                                onChange={(e) => setForm({ ...form, local_branch_id: e.target.value })}
                                required
                                disabled={!form.regional_branch_id}
                                className="w-full p-4 rounded-[1.25rem] bg-slate-50 border-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium disabled:opacity-50"
                            >
                                <option value="">Choisir une section locale</option>
                                {localBranches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                            Sexe
                        </label>
                        <select
                            value={form.sex}
                            onChange={(e) => setForm({ ...form, sex: e.target.value })}
                            required
                            className="w-full p-4 rounded-[1.25rem] bg-slate-50 border-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                        >
                            <option value="">Choisir</option>
                            <option value="female">Femme</option>
                            <option value="male">Homme</option>
                            <option value="other">Autre</option>
                            <option value="prefer_not_to_say">Préfère ne pas répondre</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                            Votre Motivation (Optionnel)
                        </label>
                        <textarea
                            value={form.motivation}
                            onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                            placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
                            rows="5"
                            className="w-full p-6 rounded-[1.5rem] bg-slate-50 border-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={!canSubmit}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {canSubmit ? 'Envoyer ma demande' : 'Demande déjà envoyée'}
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-emerald-100 animate-bounce">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-red-100">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
