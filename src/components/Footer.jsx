import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-[#1a252f] text-slate-400 border-t border-slate-800 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Colonne Marque */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white p-1.5 rounded-md">
                                <img src="/imgs/logo.webp" alt="Le PME" className="w-10 h-10 object-contain" />
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
                        <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">{t('publicSite')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/news" className="hover:text-blue-400 transition-colors flex items-center gap-2">{t('news')}</Link></li>
                            <li><Link to="/events" className="hover:text-blue-400 transition-colors flex items-center gap-2">{t('events')}</Link></li>
                            <li><Link to="/media" className="hover:text-blue-400 transition-colors flex items-center gap-2">{t('media')}</Link></li>
                            <li><Link to="/program" className="hover:text-blue-400 transition-colors flex items-center gap-2">{t('program')}</Link></li>
                            <li><Link to="/pages/social-project" className="hover:text-blue-400 transition-colors flex items-center gap-2">Projet sociétal</Link></li>
                            <li><Link to="/search" className="hover:text-blue-400 transition-colors flex items-center gap-2">{t('search')}</Link></li>
                            <li><Link to="/faq" className="hover:text-blue-400 transition-colors flex items-center gap-2">{t('faq')}</Link></li>
                        </ul>
                    </div>

                    {/* Engagement Membre */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">{t('engagement')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/register" className="hover:text-blue-400 transition-colors">Demande d'Adhésion</Link></li>
                            <li><Link to="/donate" className="hover:text-blue-400 transition-colors">Don et Contribution</Link></li>
                            <li><Link to="/register" className="hover:text-blue-400 transition-colors">Devenir Bénévole</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Nous Contacter</Link></li>
                        </ul>
                    </div>

                    {/* Mentions Légales */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">{t('legal')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors italic">{t('dataProtection')} (CNDP)</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-400 transition-colors">{t('terms')}</Link></li>
                            <li><Link to="/accessibility" className="hover:text-blue-400 transition-colors">{t('accessibility')}</Link></li>
                            <li><Link to="/pages/leadership-structures" className="hover:text-blue-400 transition-colors">Leadership et structures</Link></li>
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
