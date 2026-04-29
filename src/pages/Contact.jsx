import { useState } from 'react';
import API from '../services/api';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/contact', form);
            setSuccess(true);
            setError(false);
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setError(true);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: "📍",
            title: "Adresse | العنوان",
            value: "Sefrou, Fez-Meknès, Maroc",
            sub: "سفرو، فاس مكناس، المغرب"
        },
        {
            icon: "📱",
            title: "WhatsApp | واتساب",
            value: "212 6 74 29 30 63",
            sub: "Disponible 9h–18h"
        },
        {
            icon: "📧",
            title: "Email | البريد",
            value: "contact@pme-parti.ma",
            sub: "Réponse sous 48h"
        }
    ];

    return (
        <div className="bg-white">

            {/* ═══════════════════════════════════════════════
                EN-TÊTE
            ═══════════════════════════════════════════════ */}
            <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] py-20 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
                />
                <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4 relative z-10">
                    Contact | اتصل بنا
                </p>
                <h1 className="text-5xl md:text-6xl font-black text-white relative z-10">
                    Contactez-nous
                </h1>
                <p className="text-slate-300 text-xl mt-4 relative z-10" dir="rtl">
                    فريقنا في خدمتكم لبناء المستقبل معاً
                </p>
                <p className="text-slate-400 italic mt-2 relative z-10">
                    Notre équipe est à votre écoute pour construire l'avenir ensemble.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">

                    {/* ═══════════════════════════════════
                        COLONNE GAUCHE — INFOS
                    ═══════════════════════════════════ */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Cartes info contact */}
                        <div className="space-y-4">
                            {contactInfo.map((info, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                                        {info.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{info.title}</p>
                                        <p className="text-base font-bold text-slate-700 mt-0.5">{info.value}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{info.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Carte Map placeholder */}
                        <div className="bg-slate-100 rounded-[2rem] overflow-hidden shadow-md border border-slate-200">
                            <div className="relative h-52 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                {/* Carte iframe — remplace par Google Maps embed si besoin */}
                                <div className="text-center text-slate-500 space-y-2">
                                    <div className="text-4xl">📍</div>
                                    <p className="font-bold text-sm">Sefrou, Fez-Meknès</p>
                                    <p className="text-xs">Maroc | المغرب</p>
                                </div>
                                {/*
                                    ⬇️ Pour une vraie carte Google Maps, remplace le div ci-dessus par :
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=VOTRE_EMBED_KEY"
                                        width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"
                                    />
                                */}
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
                        <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] rounded-[2rem] p-8 text-white">
                            <h3 className="font-black text-lg mb-4">Suivez-nous | تابعونا</h3>
                            <div className="flex gap-3 flex-wrap">
                                {[
                                    { label: "Facebook", icon: "📘" },
                                    { label: "YouTube", icon: "▶️" },
                                    { label: "WhatsApp", icon: "💬" }
                                ].map(s => (
                                    <button
                                        key={s.label}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-bold"
                                    >
                                        <span>{s.icon}</span> {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════
                        COLONNE DROITE — FORMULAIRE
                    ═══════════════════════════════════ */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">

                        {/* Décoration */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full -mr-20 -mt-20 pointer-events-none" />

                        <h2 className="text-2xl font-black text-[#2c3e50] mb-8">
                            Envoyez-nous un message
                            <span className="block text-base font-bold text-slate-400 mt-1" dir="rtl">أرسل لنا رسالة</span>
                        </h2>

                        {/* Alertes */}
                        {success && (
                            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3">
                                <span className="text-xl shrink-0">✅</span>
                                <div>
                                    <p className="text-sm font-bold">Message envoyé avec succès !</p>
                                    <p className="text-xs mt-0.5 opacity-80">تم إرسال رسالتك بنجاح. سنرد عليك قريباً.</p>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3">
                                <span className="text-xl shrink-0">❌</span>
                                <div>
                                    <p className="text-sm font-bold">Erreur lors de l'envoi.</p>
                                    <p className="text-xs mt-0.5 opacity-80">حدث خطأ. يرجى المحاولة مرة أخرى.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {/* Nom + Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nom Complet | الاسم</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none text-slate-700"
                                        placeholder="Votre nom"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email | البريد</label>
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

                            {/* Sujet */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sujet | الموضوع</label>
                                <input
                                    type="text"
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none text-slate-700"
                                    placeholder="Objet de votre message"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Votre Message | رسالتك</label>
                                <textarea
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    rows="5"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none text-slate-700 resize-none"
                                    placeholder="Comment pouvons-nous vous aider ? | كيف يمكننا مساعدتك؟"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#2c3e50] hover:bg-slate-700 disabled:opacity-60 text-white font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <span>✉️</span>
                                        Envoyer le message | إرسال
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}