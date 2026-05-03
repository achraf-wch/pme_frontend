import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#1a252f] text-slate-400 border-t border-slate-800 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Colonne Marque */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white/10 p-1.5 rounded-full">
                                <div className="w-7 h-7 bg-white rounded-full"></div>
                            </div>
                            <span className="text-white font-black text-2xl tracking-tighter">Le PME</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            Parti du Maroc Émergent : L'innovation au service du citoyen par l'intelligence collective et la technologie.
                        </p>
                        <div className="flex space-x-4">
                             {/* Icônes Sociales (Placeholders) */}
                             <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-white">FB</div>
                             <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer text-white">TW</div>
                             <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer text-white">IG</div>
                        </div>
                    </div>

                    {/* Navigation Rapide */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Plateforme</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/news" className="hover:text-blue-400 transition-colors flex items-center gap-2">Actualités & Communiqués</Link></li>
                            <li><Link to="/events" className="hover:text-blue-400 transition-colors flex items-center gap-2">Nos Événements</Link></li>
                            <li><Link to="/media" className="hover:text-blue-400 transition-colors flex items-center gap-2">Médiathèque</Link></li>
                            <li><Link to="/program" className="hover:text-blue-400 transition-colors flex items-center gap-2">Programme</Link></li>
                            <li><Link to="/faq" className="hover:text-blue-400 transition-colors flex items-center gap-2">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Engagement Membre */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Engagement</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/register" className="hover:text-blue-400 transition-colors">Demande d'Adhésion</Link></li>
                            <li><Link to="/donate" className="hover:text-blue-400 transition-colors">Don et Contribution</Link></li>
                            <li><Link to="/register" className="hover:text-blue-400 transition-colors">Devenir Bénévole</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Nous Contacter</Link></li>
                        </ul>
                    </div>

                    {/* Mentions Légales */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Cadre Légal</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors italic">Protection des données (CNDP)</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Conditions d'utilisation</Link></li>
                            <li><Link to="/accessibility" className="hover:text-blue-400 transition-colors">Accessibilité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                    <p>© {new Date().getFullYear()} Le PME - Parti du Maroc Émergent. Tous droits réservés.</p>
                    <div className="mt-4 md:mt-0 flex items-center gap-6">
                        <span>WhatsApp : +212 674 29 30 63</span>
                        <span className="text-blue-500">Version prête au déploiement</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
