import { Link } from 'react-router-dom';

export default function CallToAction() {
    return (
        <section className="bg-white px-4 sm:px-6 py-16">
            <div className="max-w-7xl mx-auto bg-slate-950 text-white rounded-lg overflow-hidden grid md:grid-cols-2 items-stretch">
                <div className="p-8 md:p-12">
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3">Participation | المشاركة</p>
                    <h2 className="text-3xl md:text-4xl font-black">شاركوا وانضموا إلى تأسيس حزب مبتكر</h2>
                    <p className="text-slate-300 mt-4 leading-relaxed">
                        Ne laissez pas votre volonté à quelqu’un d’autre. Participez à la politique de votre pays, contribuez à changer votre avenir et l’avenir du Maroc.
                    </p>
                    <p className="text-slate-300 mt-3 leading-relaxed" dir="rtl">
                        لا تترك إرادتك لغيرك وساهم في سياسة بلدك. إنخرط وساهم في تغيير مستقبلك ومستقبل وطنك.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
                <div className="min-h-80 bg-slate-900">
                    <img src="/imgs/img5.webp" alt="Appel à rejoindre le Parti Maroc Émergent" className="w-full h-full object-cover" />
                </div>
            </div>
        </section>
    );
}
