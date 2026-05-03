export default function Faq() {
    const items = [
        ['Comment demander l’adhésion ?', 'Créez un compte, puis déposez votre demande depuis l’espace privé.'],
        ['Qui peut voter ?', 'Chaque scrutin définit une audience autorisée. Le système bloque le vote multiple.'],
        ['Comment les contributions sont-elles suivies ?', 'Chaque contribution reçoit une référence et un statut consultable par l’administration.'],
        ['La plateforme est-elle bilingue ?', 'L’interface est pensée pour le français et l’arabe avec prise en charge RTL.'],
    ];

    return (
        <main className="bg-white px-4 sm:px-6 py-14">
            <div className="max-w-4xl mx-auto">
                <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">FAQ | أسئلة شائعة</p>
                <h1 className="text-4xl font-black text-slate-900 mt-3">Questions fréquentes</h1>
                <div className="mt-8 divide-y divide-slate-200 border border-slate-200 rounded-lg bg-slate-50">
                    {items.map(([q, a]) => (
                        <section key={q} className="p-6">
                            <h2 className="font-black text-slate-900">{q}</h2>
                            <p className="text-slate-600 mt-2">{a}</p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
