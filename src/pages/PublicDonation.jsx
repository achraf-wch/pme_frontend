import { useState } from 'react';
import API from '../services/api';

const PRESET_AMOUNTS = [10, 25, 50, 100, 200, 500];

export default function PublicDonation() {
    const [form, setForm] = useState({ name: '', email: '', amount: '', frequency: 'once', note: '' });
    const [customAmount, setCustomAmount] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const selectPreset = (amount) => {
        setCustomAmount(false);
        setForm({ ...form, amount: String(amount) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/donations', form);
            setSuccess(true);
            setError('');
            setForm({ name: '', email: '', amount: '', frequency: 'once', note: '' });
        } catch (err) {
            setError('Erreur lors de l\'envoi. Veuillez réessayer. | حدث خطأ، حاول مجدداً.');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white pb-24">

            {/* ═══════════════════════════════════════════════
                EN-TÊTE
            ═══════════════════════════════════════════════ */}
            <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] py-20 px-6 text-center relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
                />
                {/* Cercles déco */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-3">
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">
                        Soutien | دعم
                    </p>
                    <h1 className="text-5xl md:text-6xl font-black text-white">
                        Faire un Don
                    </h1>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400" dir="rtl">
                        تبرع لدعم حزب المغرب الصاعد
                    </p>
                    <p className="text-slate-300 text-lg max-w-xl mx-auto mt-4">
                        Chaque contribution renforce notre mouvement pour un Maroc émergent.
                    </p>
                    <p className="text-slate-400 text-base italic" dir="rtl">
                        تبرعك هو فرصة لتكون جزءاً من إنجاز أكبر
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">

                    {/* ═══════════════════════════════════
                        COLONNE GAUCHE — IMPACT / INFO
                    ═══════════════════════════════════ */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Pourquoi donner */}
                        <div className="space-y-3">
                            <h2 className="text-2xl font-black text-[#2c3e50]">
                                Pourquoi soutenir le PME ?
                            </h2>
                            <p className="text-slate-500 leading-relaxed">
                                Votre don finance directement nos actions sur le terrain, notre programme de formation et nos projets innovants pour la jeunesse marocaine.
                            </p>
                            <p className="text-slate-400 text-sm leading-relaxed italic" dir="rtl">
                                تمويلك يدعم برامجنا الميدانية وتكوين الشباب وابتكار مشاريع من أجل مستقبل أفضل للمغرب.
                            </p>
                        </div>

                        {/* Impact cards */}
                        {[
                            { amount: "10€", icon: "📚", label: "Finance du matériel pédagogique", labelAr: "يموّل مواد تعليمية" },
                            { amount: "50€", icon: "🎓", label: "Soutient une session de formation", labelAr: "يدعم دورة تكوينية" },
                            { amount: "100€", icon: "🚀", label: "Finance une action locale", labelAr: "يموّل نشاطاً محلياً" },
                            { amount: "500€", icon: "🇲🇦", label: "Soutient un projet régional", labelAr: "يدعم مشروعاً جهوياً" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/40 transition-all">
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-black text-emerald-700 text-base">{item.amount}</p>
                                    <p className="text-sm text-slate-600">{item.label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5" dir="rtl">{item.labelAr}</p>
                                </div>
                            </div>
                        ))}

                        {/* Sécurité paiement */}
                        <div className="flex items-start gap-3 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <span className="text-2xl shrink-0">🔒</span>
                            <div>
                                <p className="font-bold text-emerald-700 text-sm">Paiement 100% sécurisé</p>
                                <p className="text-emerald-600 text-xs mt-0.5">Via PayPal ou carte bancaire. Vos données sont protégées.</p>
                                <p className="text-emerald-600 text-xs mt-0.5" dir="rtl">دفع آمن عبر PayPal أو بطاقة بنكية</p>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        COLONNE DROITE — FORMULAIRE
                    ═══════════════════════════════════ */}
                    <div className="lg:col-span-7">

                        {success ? (
                            /* ── SUCCESS STATE ── */
                            <div className="bg-white border border-emerald-100 rounded-[2.5rem] shadow-2xl p-12 text-center space-y-6">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl mx-auto">
                                    ✅
                                </div>
                                <h3 className="text-3xl font-black text-[#2c3e50]">Merci pour votre don !</h3>
                                <p className="text-slate-500 text-lg">Votre contribution sera traitée très prochainement.</p>
                                <p className="text-slate-400 text-base" dir="rtl">شكراً جزيلاً على تبرعك. سيتم معالجته قريباً.</p>
                                <div className="pt-2">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
                                        Ensemble vers l'émergence · معاً نحو الصعود
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-4 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm"
                                >
                                    Faire un autre don | تبرع مجدداً
                                </button>
                            </div>
                        ) : (
                            /* ── FORM ── */
                            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">

                                {/* Décoration */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -mr-20 -mt-20 pointer-events-none" />

                                <h2 className="text-2xl font-black text-[#2c3e50] mb-8">
                                    Votre contribution
                                    <span className="block text-base font-bold text-slate-400 mt-1" dir="rtl">مساهمتك</span>
                                </h2>

                                {/* Alerte erreur */}
                                {error && (
                                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3">
                                        <span className="text-xl shrink-0">❌</span>
                                        <p className="text-sm font-bold">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-7 relative z-10">

                                    {/* STEP 1 — Montant */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                            Montant | المبلغ (€)
                                        </label>

                                        {/* Présets */}
                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            {PRESET_AMOUNTS.map(amt => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => selectPreset(amt)}
                                                    className={`py-3 rounded-2xl font-black text-sm transition-all border-2 ${
                                                        form.amount === String(amt) && !customAmount
                                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                                                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                                                    }`}
                                                >
                                                    {amt} €
                                                </button>
                                            ))}
                                        </div>

                                        {/* Montant libre */}
                                        <button
                                            type="button"
                                            onClick={() => { setCustomAmount(true); setForm({ ...form, amount: '' }); }}
                                            className={`w-full py-3 rounded-2xl font-bold text-sm transition-all border-2 mb-3 ${
                                                customAmount
                                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                                    : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 hover:border-emerald-300'
                                            }`}
                                        >
                                            Autre montant | مبلغ آخر ✏️
                                        </button>

                                        {customAmount && (
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">€</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    value={form.amount}
                                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                                    className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all outline-none text-slate-700 font-bold text-lg"
                                                    placeholder="0.00"
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        )}

                                        {/* Montant sélectionné affiché */}
                                        {form.amount && (
                                            <div className="mt-3 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                <span className="text-sm text-emerald-700 font-bold">Montant sélectionné</span>
                                                <span className="text-lg font-black text-emerald-700">{form.amount} €</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* STEP 2 — Identité */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Nom Complet | الاسم
                                            </label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none text-slate-700"
                                                placeholder="Votre nom complet"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Email | البريد
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none text-slate-700"
                                                placeholder="votre@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Type | النوع
                                            </label>
                                            <select
                                                value={form.frequency}
                                                onChange={e => setForm({ ...form, frequency: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none text-slate-700"
                                            >
                                                <option value="once">Contribution unique</option>
                                                <option value="monthly">Contribution mensuelle</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Note | ملاحظة
                                            </label>
                                            <input
                                                type="text"
                                                value={form.note}
                                                onChange={e => setForm({ ...form, note: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none text-slate-700"
                                                placeholder="Objet de la contribution"
                                            />
                                        </div>
                                    </div>

                                    {/* Bouton submit */}
                                    <button
                                        type="submit"
                                        disabled={loading || !form.amount}
                                        className="w-full py-5 bg-[#27ae60] hover:bg-[#219150] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                Traitement en cours...
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xl">💳</span>
                                                {form.amount ? `Donner ${form.amount} € maintenant` : 'Faire un don | تبرع'}
                                                <span>→</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Disclaimer */}
                                    <p className="text-center text-xs text-slate-400 leading-relaxed">
                                        🔒 Paiement sécurisé via PayPal · Vos données sont protégées · <br />
                                        <span dir="rtl">بياناتك محمية · دفع آمن عبر PayPal</span>
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
