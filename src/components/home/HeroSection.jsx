import { Link } from 'react-router-dom';

const modules = [
    { title: 'Anti-populistes', titleAr: 'ضد الشعبوية', text: 'Une parole politique réaliste, mesurable et utile au citoyen.' },
    { title: 'Pro émergence', titleAr: 'مع مغرب صاعد', text: 'Industrie, tourisme, agriculture, export, recherche et innovation.' },
    { title: 'Pro formation', titleAr: 'مع التأهيل', text: 'Qualification des jeunes, langues, métiers, technologies et IA.' },
    { title: 'Intelligence collective', titleAr: 'الذكاء الجماعي', text: 'Laboratoires d’idées, brainstorming, comités spécialisés et régions.' },
    { title: 'Mon école digitale', titleAr: 'مدرستي الرقمية', text: 'Un projet éducatif numérique au service du savoir et de l’égalité.' },
    { title: 'Participation', titleAr: 'المشاركة', text: 'Adhésion, bénévolat, contributions, dialogue militant et proximité.' },
];

export default function HeroSection() {
    return (
        <div className="bg-white">
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0">
                    <img
                        src="/imgs/pmeCreation.webp"
                        alt="Présentation de la création du Parti Maroc Émergent"
                        className="w-full h-full object-cover opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-emerald-950/70" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-16 md:pt-24 md:pb-20 grid lg:grid-cols-12 gap-10 items-center min-h-[calc(100vh-5rem)]">
                    <div className="lg:col-span-7">
                        <img src="/imgs/logo.webp" alt="Logo حزب المغرب الصاعد" className="w-28 h-28 object-contain mb-6 bg-white/90 rounded-lg p-2" />
                        <p className="inline-flex bg-white/10 border border-white/20 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-widest mb-6">
                            حزب المغرب الصاعد | Le PME
                        </p>
                        <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl">
                            Parti Maroc Émergent
                            <span className="block mt-3 text-3xl md:text-5xl" dir="rtl">حزب المغرب الصاعد</span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl">
                            Join our movement now. Un parti d’innovation et d’avenir pour une politique différente, fondée sur la formation, l’intelligence collective et l’émergence du Maroc.
                        </p>
                        <p className="mt-4 text-lg text-slate-300 leading-relaxed max-w-3xl" dir="rtl">
                            انضموا إلى حركتنا الآن. كن اليوم من السباقين لغد أفضل، من أجل خدمة الوطن والمجتمع.
                        </p>
                        <div className="mt-9 flex flex-col sm:flex-row gap-3">
                            <Link to="/register" className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-md font-black text-center transition-colors">
                                Demander l’adhésion
                            </Link>
                            <Link to="/donate" className="px-6 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-md font-black text-center transition-colors">
                                Contribuer maintenant
                            </Link>
                            <Link to="/dashboard" className="px-6 py-4 border border-white/30 hover:bg-white/10 rounded-md font-black text-center transition-colors">
                                Espace privé
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-white/95 text-slate-900 rounded-lg p-6 md:p-8 shadow-2xl">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-4">Notre vision innovante</p>
                        <div className="grid grid-cols-2 gap-3">
                            {modules.map(module => (
                                <div key={module.title} className="border border-slate-200 rounded-md p-4">
                                    <h3 className="font-black text-sm">{module.title}</h3>
                                    <p className="text-xs text-emerald-700 font-bold mt-1" dir="rtl">{module.titleAr}</p>
                                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{module.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 py-14 bg-white">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-4">
                    {[
                        ['Tel. WhatsApp', '+212 674 29 30 63'],
                        ['La Politique Autrement', 'من أجل سياسة مختلفة'],
                        ['Serving the Country', 'من أجل خدمة الوطن والمجتمع'],
                        ['United by a Goal', 'متحدون بهدف مشترك'],
                    ].map(([fr, ar]) => (
                        <div key={fr} className="border border-slate-200 rounded-lg p-5 bg-slate-50">
                            <p className="font-black text-slate-900">{fr}</p>
                            <p className="text-sm text-slate-500 mt-1" dir="rtl">{ar}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
