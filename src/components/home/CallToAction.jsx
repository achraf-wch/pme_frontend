import { Link } from 'react-router-dom';

export default function CallToAction() {
    return (
        <section className="bg-white px-4 sm:px-6 py-16">
            <div className="max-w-7xl mx-auto bg-slate-950 text-white rounded-lg p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3">Participation | المشاركة</p>
                    <h2 className="text-3xl md:text-4xl font-black">Un parcours clair pour chaque citoyen</h2>
                    <p className="text-slate-300 mt-4 leading-relaxed">
                        Inscription, demande d’adhésion, bénévolat, contribution financière et contact sont accessibles depuis des formulaires dédiés, avec suivi administratif depuis la console.
                    </p>
                    <p className="text-slate-300 mt-3 leading-relaxed" dir="rtl">
                        مسارات واضحة للانخراط، التطوع، المساهمة، والتواصل، مع تتبع إداري من لوحة التحكم.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row md:justify-end gap-3">
                    <Link to="/register" className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-md text-center transition-colors">
                        Rejoindre
                    </Link>
                    <Link to="/donate" className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-md text-center transition-colors">
                        Contribuer
                    </Link>
                    <Link to="/contact" className="px-6 py-4 border border-white/30 hover:bg-white/10 text-white font-black rounded-md text-center transition-colors">
                        Contacter
                    </Link>
                </div>
            </div>
        </section>
    );
}
