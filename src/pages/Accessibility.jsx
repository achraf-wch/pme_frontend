export default function Accessibility() {
    return (
        <main className="bg-white px-4 sm:px-6 py-14">
            <div className="max-w-4xl mx-auto">
                <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Accessibilité | الولوجية</p>
                <h1 className="text-4xl font-black text-slate-900 mt-3">Engagement d’accessibilité</h1>
                <div className="prose prose-slate max-w-none mt-6">
                    <p>
                        La plateforme privilégie une structure HTML claire, des contrastes lisibles, une navigation clavier, des libellés explicites et une expérience mobile first.
                    </p>
                    <p dir="rtl">
                        تعتمد المنصة على وضوح الألوان، عناصر دلالية، دعم التنقل بلوحة المفاتيح، ورسائل خطأ مفهومة.
                    </p>
                </div>
            </div>
        </main>
    );
}
