import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
    const [videoPlaying, setVideoPlaying] = useState(false);

    return (
        <div className="bg-white pb-24">

            {/* ═══════════════════════════════════════════════
                EN-TÊTE
            ═══════════════════════════════════════════════ */}
            <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #10b981 0, #10b981 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
                />
                <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Qui sommes-nous | من نحن</p>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                    À Propos<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-400">
                        حزب المغرب الصاعد
                    </span>
                </h1>
                <p className="text-slate-300 text-xl max-w-2xl mx-auto" dir="rtl">
                    حزب سياسي مبتكر يسعى لتغيير الممارسة السياسية في المغرب
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-20 space-y-24">

                {/* ═══════════════════════════════════════════════
                    SECTION FONDATEUR
                ═══════════════════════════════════════════════ */}
                <section>
                    <div className="flex flex-col md:flex-row gap-16 items-start">

                        {/* Photo + badges */}
                        <div className="shrink-0 text-center">
                            <div className="w-72 h-96 rounded-lg overflow-hidden shadow-2xl border-4 border-white ring-4 ring-emerald-100 mx-auto bg-slate-100">
                                <img
                                    src="/imgs/AliAmzineCv.webp"
                                    alt="CV du fondateur Ali Amzine"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Tags compétences */}
                            <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-xs">
                                {["IA & Informatique", "Intelligence Collective", "Innovation", "Politique", "Formation", "Économie"].map(s => (
                                    <span key={s} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1">{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Texte bio */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">المؤسس | Le Fondateur</span>
                                <h2 className="text-4xl font-black text-slate-950 mt-2">
                                    علي امزين <span className="text-slate-400 font-bold text-2xl">| Ali Amzine</span>
                                </h2>
                            </div>

                            {/* Bio arabe */}
                            <div className="bg-emerald-50 p-8 rounded-lg border-r-4 border-emerald-600">
                                <h3 className="text-lg font-bold text-emerald-800 mb-4" dir="rtl">السيرة الذاتية</h3>
                                <p className="text-slate-700 leading-loose text-base" dir="rtl">
                                    هو مدير الأكاديمية الدولية للتكوين والتأهيل في التكنولوجيا واللغات والمهن. كاتب إقتصادي ومكون في الذكاء الجماعي والإبتكار، وفاعل سياسي واجتماعي. مصمم في صناعة المكاتب، مهندس إعلاميات وإدماج برامج الذكاء الإصطناعي، ومحلل سياسي ومكون في اللغات والتواصل.
                                </p>
                            </div>

                            {/* Bio française */}
                            <div className="bg-slate-50 p-8 rounded-lg border-l-4 border-emerald-500">
                                <h3 className="text-lg font-bold text-emerald-700 mb-4">Biographie</h3>
                                <p className="text-slate-600 leading-loose text-base italic">
                                    Directeur de l'Académie internationale pour la formation et la qualification en technologie, langues et métiers. Écrivain économique, ingénieur informatique et formateur en intelligence collective et en innovation. Acteur politique et social, designer en industrie du mobilier de bureau, analyste politique et intégrateur en intelligence artificielle.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    DÉCLARATION DE CONSTITUTION
                ═══════════════════════════════════════════════ */}
                <section>
                    <div className="relative bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] rounded-lg p-10 md:p-16 text-white overflow-hidden">
                        <img src="/imgs/pmeCreation.webp" alt="Déclaration de constitution du PME" className="absolute inset-0 w-full h-full object-cover opacity-25" />

                        <div className="relative z-10 text-center space-y-6">
                            <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">
                                Déclaration | بيان | Declaration
                            </p>
                            <h3 className="text-3xl md:text-4xl font-black">
                                بيان تأسيس حزب المغرب الصاعد
                            </h3>
                            <p className="text-slate-300 text-lg italic">
                                Déclaration de Constitution du Parti du Maroc Émergent
                            </p>
                            <p className="text-slate-300 text-base italic">
                                Declaration of the Constitution of the Emerging Morocco Party
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                <Link to="/register" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
                                    Rejoindre | انضم
                                </Link>
                                <Link to="/contact" className="px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                                    Nous contacter | تواصل
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    VISION STRATÉGIQUE
                ═══════════════════════════════════════════════ */}
                <section>
                    <div className="text-right space-y-4">
                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">رؤيتنا | Notre Vision</span>
                        <h3 className="text-3xl md:text-4xl font-black text-slate-950">NOTRE VISION INNOVANTE</h3>
                        <div className="h-1 w-16 bg-emerald-500 rounded-full ml-auto" />
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { image: "/imgs/ANTI_POPULISTES.webp", title: "ANTI POPULISTES", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
                            { image: "/imgs/PRO_EMERGENCE.webp", title: "PRO EMERGENCE", color: "bg-red-50 border-red-200 text-red-800" },
                            { image: "/imgs/PRO_FORMATION.webp", title: "PRO FORMATION", color: "bg-emerald-50 border-emerald-200 text-emerald-800" }
                        ].map((v, i) => (
                            <div key={i} className={`border rounded-lg overflow-hidden text-center ${v.color}`}>
                                <img src={v.image} alt={v.title} className="w-full h-44 object-cover bg-white" />
                                <div className="p-6">
                                <h4 className="font-black text-lg">{v.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 bg-slate-50 rounded-lg p-10 border border-slate-100">
                        <p className="text-slate-700 leading-loose text-lg" dir="rtl">
                            برنامجنا واقعي وبديل حقيقي للحظة الراهنة. وآلياته شعبية واجتماعية مبتكرة كليا، ولا يشبه أو يقلد أي حزب آخر في الداخل أو في الخارج، لأنه بكل بساطة ينطلق من الواقع المعاش ويضع الحلول الدقيقة لما يحتاجه واقع الحال، بعيدا عن الديماغوجية والطوباوية السياسية.
                        </p>
                        <p className="text-slate-500 leading-loose text-base italic mt-6">
                            Notre programme est réaliste et constitue une véritable alternative. Ses mécanismes sont entièrement innovants sur le plan populaire et social, et ne ressemble à aucun autre parti, car il part simplement de la réalité vécue.
                        </p>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    BRAINSTORMING / INTELLIGENCE COLLECTIVE
                ═══════════════════════════════════════════════ */}
                <section>
                    <div className="grid md:grid-cols-5 gap-10 items-stretch bg-gradient-to-br from-emerald-50 to-slate-50 rounded-lg p-6 md:p-10 border border-emerald-100">
                        <img src="/imgs/img.webp" alt="Intelligence collective du PME" className="md:col-span-2 w-full h-full min-h-80 object-cover rounded-lg bg-white" />
                        <div className="md:col-span-3 space-y-4">
                            <h3 className="text-2xl font-black text-slate-950">
                                العمل بالذكاء الجماعي | Brainstorming Collectif
                            </h3>
                            <p className="text-slate-600 leading-loose" dir="rtl">
                                تعتبر لجان المختبرات المختصة في حزب المغرب الصاعد ركيزة من الركائز الفكرية لهذا التنظيم، وتعنى بإنتاج وابتكار ودراسة الأفكار والبرامج التنموية في مسلسل ونسق فكري على طريقة البراينستورمينج، وتجميع المشاريع المبتكرة وإدماجها وفقاً لمنهجية العمل الحزبي.
                            </p>
                            <p className="text-slate-500 italic text-sm leading-relaxed">
                                Les comités de laboratoires spécialisés du PME constituent l'un des piliers intellectuels de cette organisation. Ils s'occupent de produire, d'innover et d'étudier des idées et des programmes de développement selon la méthode du brainstorming.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    VIDÉO — MON ÉCOLE DIGITALE
                ═══════════════════════════════════════════════ */}
                <section>
                    <div className="text-center mb-12">
                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Projet Phare | المشروع الرئيسي</span>
                        <h3 className="text-3xl md:text-4xl font-black text-slate-950 mt-2">
                            مشروع مدرستي الرقمية
                        </h3>
                        <p className="text-slate-500 italic mt-2">Mon École Digitale | Le projet PME</p>
                    </div>

                    {/* Lecteur vidéo */}
                    <div className="relative aspect-video bg-[#0d1b2a] rounded-lg shadow-2xl overflow-hidden group cursor-pointer"
                        onClick={() => setVideoPlaying(true)}>

                        {videoPlaying ? (
                            /* ⬇️ REMPLACE src PAR TON LIEN VIDÉO PROJET */
                            <video autoPlay controls className="w-full h-full object-cover">
                                <source src="/videos/mon-ecole-digitale.mp4" type="video/mp4" />
                            </video>
                        ) : (
                            <>
                                {/* Miniature — remplace par vrai img */}
                                <img
                                    src="/imgs/img4.webp"
                                    alt="Mon École Digitale"
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a] via-transparent to-[#1a3a5c]" />

                                {/* Bouton play + texte */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform">
                                        ▶️
                                    </div>
                                    <div className="text-center text-white">
                                        <p className="font-black text-2xl">مشروع مدرستي الرقمية</p>
                                        <p className="text-slate-300 text-sm mt-1">Mon École Digitale — Présentation du projet</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
}
