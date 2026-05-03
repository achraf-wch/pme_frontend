import { useEffect, useState } from 'react';
import API from '../services/api';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
};

export default function NewsList() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔁 Use the feed endpoint (filters by audience)
        API.get('/news/feed')
            .then(res => setNews(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                <h2 className="text-4xl font-black text-[#2c3e50] uppercase tracking-tighter">Dernières Actualités</h2>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Chargement des actualités...</p>
                </div>
            ) : news.length === 0 ? (
                <p className="text-center text-slate-400 py-20 italic">Aucune actualité publique pour le moment.</p>
            ) : (
                <div className="space-y-16">
                    {news.map(article => (
                        <article key={article.id} className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-5 relative">
                                <div className="overflow-hidden rounded-[2rem] shadow-xl">
                                    {article.image_path ? (
                                        <img 
                                            src={getImageUrl(article.image_path)} 
                                            alt={article.title}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-slate-100 flex items-center justify-center font-bold text-slate-300">Image PME</div>
                                    )}
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                                    PME INFO
                                </div>
                            </div>

                            <div className="md:col-span-7 pt-2">
                                <div className="flex items-center gap-3 mb-4 text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">
                                    <span>Communiqué</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-slate-400 font-medium">
                                        {new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <h3 className="text-2xl font-extrabold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                
                                <p className="text-slate-600 leading-relaxed mb-6 font-light">
                                    {article.content}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <button className="flex items-center gap-2 text-sm font-black text-slate-900 border-b-2 border-transparent hover:border-blue-500 transition-all pb-1 uppercase tracking-widest">
                                        Lire l'article complet
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        <span className="p-2 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">🔗</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}