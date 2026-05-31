import Icon from '../Icon';

const features = [
    {
        icon: 'share',
        title: 'Publication sociale automatique',
        ar: 'ربط المنشورات بمواقع التواصل تلقائيا',
        text: 'Selection des canaux Facebook, X, Instagram, LinkedIn et WhatsApp lors de la creation des communiques.',
    },
    {
        icon: 'bot',
        title: 'Repondeur intelligent du site',
        ar: 'ربط المجيب الذكي بالموقع',
        text: 'Assistant visible sur le site pour guider les visiteurs vers adhesion, activites, contact et contenus officiels.',
    },
    {
        icon: 'shield',
        title: 'Validation et tracabilite',
        ar: 'المصادقة والتتبع',
        text: 'Les publications restent controlees par les responsables, avec audience, region, branche et historique administratif.',
    },
];

export default function DigitalFeatures() {
    return (
        <section className="bg-[#eef7f1] px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-5">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Extension digitale</p>
                        <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
                            Reseaux sociaux et assistant intelligent integres
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600" dir="rtl">
                            إضافة إمكانية ربط المنشورات بمواقع التواصل الاجتماعي بشكل أوتوماتيكي وربط المجيب الذكي بالموقع.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 lg:col-span-7">
                        {features.map(feature => (
                            <article key={feature.title} className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-emerald-600 text-white">
                                    <Icon name={feature.icon} className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-950">{feature.title}</h3>
                                <p className="mt-1 text-sm font-bold text-emerald-700" dir="rtl">{feature.ar}</p>
                                <p className="mt-4 text-sm leading-relaxed text-slate-500">{feature.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
