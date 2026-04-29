import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function HeroSection() {
    const [videoError, setVideoError] = useState(false);

    const visionCards = [
        {
            icon: "⚖️",
            titleFr: "Anti-Populistes",
            titleAr: "ضد الشعبوية",
            desc: "سياسة واقعية بعيدة عن الديماغوجية والطوباوية",
            descFr: "Une politique réaliste, loin de la démagogie",
            color: "from-blue-600 to-blue-800",
            accent: "#3b82f6"
        },
        {
            icon: "🇲🇦",
            titleFr: "Pro-Émergence",
            titleAr: "من أجل التقدم",
            desc: "من أجل مغرب صاعد وقوي ومتقدم",
            descFr: "Pour un Maroc émergent et puissant",
            color: "from-red-600 to-green-700",
            accent: "#c53030"
        },
        {
            icon: "🎓",
            titleFr: "Pro-Formation",
            titleAr: "التأهيل أولوية",
            desc: "التأهيل والتشغيل وخلق المقاولات كأولوية قصوى",
            descFr: "La formation et l'emploi comme priorité absolue",
            color: "from-emerald-500 to-emerald-700",
            accent: "#10b981"
        }
    ];

    return (
        <div className="space-y-0 pb-20">

            {/* ═══════════════════════════════════════════════
                SECTION 1 — HERO VIDÉO PRINCIPAL
            ═══════════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d1b2a]">

                {/* VIDEO DE FOND — remplace le src par ton lien vidéo */}
                <div className="absolute inset-0 z-0">
                    {!videoError ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            onError={() => setVideoError(true)}
                            className="w-full h-full object-cover opacity-30"
                        >
                            {/* ⬇️ REMPLACE CE LIEN PAR TA VIDÉO HERO */}
                            <source src="/videos/hero-background.mp4" type="video/mp4" />
                        </video>
                    ) : (
                        // Fallback si pas de vidéo — dégradé animé
                        <div className="w-full h-full bg-gradient-to-br from-[#0d1b2a] via-[#1a2e4a] to-[#0d1b2a] animate-pulse opacity-80" />
                    )}
                    {/* Overlay gradient sombre en bas */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a]/40 via-transparent to-[#0d1b2a]" />
                    {/* Grain overlay décoratif */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }}
                    />
                </div>

                {/* Éléments décoratifs géométriques */}
                <div className="absolute top-20 left-10 w-40 h-40 border border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute bottom-40 right-10 w-24 h-24 border border-emerald-500/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />

                {/* CONTENU HERO */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    {/* Badge parti */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">Le PME · حزب المغرب الصاعد</span>
                    </div>

                    {/* Titre principal bilingue */}
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight" dir="rtl">
                        انضموا إلى حركتنا الآن
                    </h1>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-emerald-400">
                            Rejoignez notre mouvement
                        </span>
                    </h2>

                    <p className="text-xl text-slate-300 mb-3 font-light" dir="rtl">
                        كن اليوم من السباقين لغد أفضل
                    </p>
                    <p className="text-lg text-slate-400 mb-12 font-light italic">
                        Soyez les pionniers d'un avenir meilleur pour le Maroc
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/register"
                            className="group px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 transition-all uppercase tracking-widest text-sm flex items-center gap-3"
                        >
                            <span>🤝</span>
                            <span>انخرط الآن | S'inscrire</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link
                            to="/donate"
                            className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-black rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest text-sm flex items-center gap-3"
                        >
                            <span>💳</span>
                            <span>ساهم | Faire un don</span>
                        </Link>
                    </div>

                    {/* Stats rapides */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8">
                        {[
                            { num: "2024", label: "Fondé en | تأسس" },
                            { num: "PME", label: "Parti | حزب" },
                            { num: "🇲🇦", label: "Maroc | المغرب" }
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-black text-white">{s.num}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Flèche scroll */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
                        <div className="w-1 h-3 bg-white/60 rounded-full" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                SECTION 2 — FONDATEUR (BIO COURTE)
            ═══════════════════════════════════════════════ */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative bg-gradient-to-br from-[#f8fafc] to-[#eff6ff] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-12 items-center overflow-hidden">

                        {/* Décoration fond */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full -ml-24 -mb-24 pointer-events-none" />

                        {/* PHOTO DU FONDATEUR */}
                        <div className="relative shrink-0">
                            <div className="w-52 h-52 md:w-72 md:h-72 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white rotate-2 bg-slate-200">
                                {/* ⬇️ REMPLACE LE src PAR LA VRAIE PHOTO DE ALI AMZINE */}
                                <img
                                    src="/images/ali-amzine.jpg"
                                    alt="Ali Amzine - Fondateur du PME"
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `
                                            <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e3a5f,#2980b9);color:white;text-align:center;padding:1rem;">
                                                <div style="font-size:3rem">👤</div>
                                                <div style="font-size:0.75rem;margin-top:0.5rem;opacity:0.8">Photo du fondateur</div>
                                            </div>`;
                                    }}
                                />
                            </div>
                            {/* Badge flottant */}
                            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white rounded-2xl px-4 py-2 shadow-lg">
                                <div className="text-xs font-bold uppercase tracking-widest">Fondateur</div>
                                <div className="text-xs opacity-80">المؤسس</div>
                            </div>
                        </div>

                        {/* BIO TEXTE */}
                        <div className="flex-1 space-y-5">
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Le Fondateur | المؤسس</span>
                            <h2 className="text-4xl md:text-5xl font-black text-[#2c3e50]">
                                علي امزين
                                <span className="block text-2xl md:text-3xl font-bold text-slate-500 mt-1">Ali Amzine</span>
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {["Ingénieur Informatique", "Expert en IA", "Formateur", "Acteur Politique"].map(tag => (
                                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 font-semibold">{tag}</span>
                                ))}
                            </div>
                            <p className="text-slate-600 text-lg leading-relaxed" dir="rtl">
                                مدير الأكاديمية الدولية للتكوين والتأهيل في التكنولوجيا واللغات والمهن. كاتب إقتصادي ومكون في الذكاء الجماعي والإبتكار. مهندس إعلاميات وإدماج برامج الذكاء الإصطناعي.
                            </p>
                            <p className="text-slate-500 text-base leading-relaxed italic">
                                Directeur de l'Académie internationale pour la formation et la qualification en technologie, langues et métiers. Écrivain économique et formateur en intelligence collective.
                            </p>
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 font-bold text-blue-600 border-b-2 border-blue-500 pb-1 hover:text-blue-800 transition-colors"
                            >
                                Lire la biographie complète <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                SECTION 3 — VISION (3 CARTES)
            ═══════════════════════════════════════════════ */}
            <section className="bg-[#f1f5f9] py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Notre Vision | رؤيتنا</p>
                        <h2 className="text-4xl md:text-5xl font-black text-[#2c3e50]">NOTRE VISION INNOVANTE</h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {visionCards.map((item, i) => (
                            <div
                                key={i}
                                className="group relative bg-white rounded-[2.5rem] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100 overflow-hidden cursor-default"
                            >
                                {/* Fond déco au hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                <span className="text-5xl mb-6 block group-hover:scale-125 transition-transform duration-300">{item.icon}</span>

                                <h3 className="text-2xl font-black text-[#2c3e50] mb-1">{item.titleFr}</h3>
                                <p className="text-base font-bold mb-4" style={{ color: item.accent }} dir="rtl">{item.titleAr}</p>

                                <p className="text-slate-500 text-sm leading-relaxed mb-3" dir="rtl">{item.desc}</p>
                                <p className="text-slate-400 text-sm leading-relaxed italic">{item.descFr}</p>

                                {/* Ligne déco */}
                                <div className="mt-6 h-0.5 w-12 rounded-full transition-all duration-500 group-hover:w-24" style={{ backgroundColor: item.accent }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}