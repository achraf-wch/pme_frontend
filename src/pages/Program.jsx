export default function Program() {
    const pillars = [
        ['Communication institutionnelle', 'نشر الأخبار والبلاغات والفعاليات والمكتبة الإعلامية.'],
        ['Organisation interne', 'تدبير العضوية، المتعاطفين، المتطوعين، والمسؤوليات.'],
        ['Participation numérique', 'استشارات وتصويت داخلي مضبوط حسب الفئات المخولة.'],
        ['Financement transparent', 'تتبع المساهمات والمراجع والحالات والتقارير المالية.'],
        ['Pilotage et qualité', 'إحصائيات، سجلات تدقيق، صلاحيات، وتحسين مستمر.'],
    ];

    return (
        <main className="bg-white px-4 sm:px-6 py-14">
            <div className="max-w-6xl mx-auto">
                <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Programme | البرنامج</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">Projet numérique du parti</h1>
                <p className="text-slate-600 mt-5 max-w-3xl leading-relaxed">
                    Cette plateforme concrétise le cahier des charges du 23 avril 2026 : site officiel, espace membres, contributions, vote interne, administration et rapports.
                </p>
                <div className="grid md:grid-cols-2 gap-5 mt-10">
                    {pillars.map(([fr, ar]) => (
                        <section key={fr} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                            <h2 className="font-black text-xl text-slate-900">{fr}</h2>
                            <p className="text-slate-600 mt-3 leading-relaxed" dir="rtl">{ar}</p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
