import { Link } from 'react-router-dom';

const modules = [
    { title: 'Site officiel', titleAr: 'الموقع الرسمي', text: 'Pages institutionnelles, communiqués, événements, médiathèque et référencement.' },
    { title: 'Espace membres', titleAr: 'فضاء الأعضاء', text: 'Profil, adhésion, notifications, contributions, inscriptions et suivi personnel.' },
    { title: 'Contributions', titleAr: 'المساهمات', text: 'Montants libres ou prédéfinis, référence de paiement, statut et reçus numériques.' },
    { title: 'Vote interne', titleAr: 'التصويت الداخلي', text: 'Scrutins ciblés, contrôle d’éligibilité, vote unique et journalisation sensible.' },
    { title: 'Administration', titleAr: 'لوحة الإدارة', text: 'Gestion du contenu, membres, demandes, médias, rôles, messages et paramètres.' },
    { title: 'Analytique', titleAr: 'التحليلات', text: 'Indicateurs de visites, adhésions, dons, événements, votes et exports.' },
];

export default function HeroSection() {
    return (
        <div className="bg-white">
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1800&q=80"
                        alt="Assemblée citoyenne"
                        className="w-full h-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-emerald-950/70" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-24 grid lg:grid-cols-12 gap-10 items-center min-h-[calc(100vh-5rem)]">
                    <div className="lg:col-span-7">
                        <p className="inline-flex bg-white/10 border border-white/20 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-widest mb-6">
                            Plateforme numérique officielle | منصة رقمية رسمية
                        </p>
                        <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl">
                            Parti Maroc Émergent
                            <span className="block mt-3 text-3xl md:text-5xl" dir="rtl">حزب المغرب الصاعد</span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl">
                            Une plateforme institutionnelle complète pour publier, organiser les adhésions, gérer les contributions, conduire les consultations internes et piloter l’activité du parti.
                        </p>
                        <p className="mt-4 text-lg text-slate-300 leading-relaxed max-w-3xl" dir="rtl">
                            منصة متكاملة للتواصل المؤسساتي، تدبير الأعضاء، المساهمات، التصويت الداخلي، والتحليلات الإدارية.
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
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-4">Périmètre livré</p>
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
                        ['Bilingue', 'العربية والفرنسية'],
                        ['Mobile first', 'تجربة متجاوبة'],
                        ['Sécurité', 'سجلات تدقيق وصلاحيات'],
                        ['SEO & rapports', 'أرشفة وتحليلات'],
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
