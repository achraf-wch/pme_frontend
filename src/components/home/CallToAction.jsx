import { Link } from 'react-router-dom';

export default function CallToAction() {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 my-16 text-center relative overflow-hidden group">
            {/* Cercles décoratifs */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-500/5 rounded-full group-hover:scale-110 transition-transform"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Soutenez notre vision innovante</h2>
                <p className="text-slate-600 mb-10 text-lg">
                    Chaque contribution, qu'elle soit financière ou humaine, renforce notre mouvement pour un avenir politique différent au Maroc.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/donate" 
                        className="px-10 py-4 bg-[#27ae60] hover:bg-[#219150] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">💳</span> Faire un don sécurisé
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-10 py-4 bg-[#2980b9] hover:bg-[#2471a3] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">🤝</span> Rejoindre le parti
                    </Link>
                </div>
                
                <p className="mt-8 text-xs text-slate-400 uppercase tracking-[0.2em] font-medium">
                    Ensemble vers l'émergence
                </p>
            </div>
        </div>
    );
}