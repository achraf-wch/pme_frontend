export default function Program() {
    const pillars = [
        ['Formation et qualification', 'تأهيل الشباب في التكنولوجيا واللغات والمهن والذكاء الاصطناعي.'],
        ['Industrie et emploi', 'خلق المقاولات والمواكبة الميدانية في التصنيع والخدمات والتصدير.'],
        ['Tourisme, agriculture et alimentation', 'حلول واقعية للجهات وفرص محلية قابلة للتوسيع.'],
        ['Recherche scientifique et innovation', 'مختبرات أفكار وبرامج تنموية قائمة على الذكاء الجماعي.'],
        ['Citoyenneté et valeurs', 'تخليق الحياة الاجتماعية والسياسية وتجديد العمل السياسي.'],
        ['Communication sociale automatisee', 'ربط المنشورات الرسمية بمواقع التواصل الاجتماعي بشكل أوتوماتيكي.'],
        ['Assistant intelligent du site', 'ربط المجيب الذكي بالموقع لتوجيه الزوار والمنخرطين بسرعة.'],
    ];

    return (
        <main className="bg-[#f7fbf8] px-4 sm:px-6 py-14">
            <div className="max-w-6xl mx-auto">
                <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Programme | البرنامج</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">Un programme réaliste pour un Maroc émergent</h1>
                <p className="text-slate-600 mt-5 max-w-3xl leading-relaxed">
                    Le PME part de la réalité vécue et propose des mécanismes populaires et sociaux innovants : formation, emploi, création d’entreprises, intelligence collective et projets numériques comme Mon École Digitale.
                </p>
                <div className="mt-10 grid md:grid-cols-3 gap-5">
                    {[
                        ['/imgs/img2.webp', 'Il est temps de créer l’alternative'],
                        ['/imgs/img3.webp', 'Intelligence artificielle et innovation'],
                        ['/imgs/img4.webp', 'Projet Mon École Digitale'],
                    ].map(([src, alt]) => (
                        <img key={src} src={src} alt={alt} className="w-full h-72 object-cover rounded-lg border border-slate-200 bg-slate-50" />
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-5 mt-10">
                    {pillars.map(([fr, ar]) => (
                        <section key={fr} className="border border-emerald-100 rounded-lg p-6 bg-white shadow-sm">
                            <h2 className="font-black text-xl text-slate-900">{fr}</h2>
                            <p className="text-slate-600 mt-3 leading-relaxed" dir="rtl">{ar}</p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
