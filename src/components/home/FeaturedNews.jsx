import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
};

function SkeletonCard() {
    return (
        <div className="animate-pulse bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="h-52 bg-slate-100" />
            <div className="p-6 space-y-3">
                <div className="h-3 w-24 bg-slate-100 rounded-full" />
                <div className="h-5 bg-slate-100 rounded-full" />
                <div className="h-5 w-3/4 bg-slate-100 rounded-full" />
                <div className="h-3 bg-slate-100 rounded-full" />
                <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                <div className="h-4 w-20 bg-slate-100 rounded-full mt-4" />
            </div>
        </div>
    );
}

function NewsCard({ article }) {
    const imgUrl = getImageUrl(article.image_path);

    return (
        <article className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">

            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-slate-100">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] flex items-center justify-center">
                        <span className="text-5xl opacity-30">📰</span>
                    </div>
                )}
                {/* Overlay gradient bas */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    PME Officiel
                </div>

                {/* Date flottante */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1 text-xs font-bold text-slate-600">
                    {new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
            </div>

            {/* Contenu */}
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs text-slate-400 mb-3 block uppercase tracking-wide">
                    Publié le {new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {article.content?.substring(0, 150)}...
                </p>

                {/* Lien lire la suite */}
                <Link
                    to={`/news/${article.id}`}
                    className="group/link mt-auto inline-flex items-center gap-2 text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors"
                >
                    Lire la suite
                    <span className="w-6 h-6 bg-slate-100 group-hover/link:bg-blue-100 rounded-full flex items-center justify-center text-xs transition-all group-hover/link:translate-x-1">→</span>
                </Link>
            </div>
        </article>
    );
}

export default function FeaturedNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        API.get('/news')
            .then(res => {
                setNews(res.data.slice(0, 3));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <section className="py-16 border-t border-slate-100">

            {/* En-tête */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                <div>
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">
                        Actualités | أخبار
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800">
                        Actualités & Communiqués
                    </h2>
                    <div className="h-1.5 w-20 bg-gradient-to-r from-blue-500 to-blue-300 mt-3 rounded-full" />
                </div>
                <Link
                    to="/news"
                    className="group inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors text-sm"
                >
                    Voir toutes les actualités
                    <span className="w-7 h-7 bg-blue-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1">→</span>
                </Link>
            </div>

            {/* Grille */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : error ? (
                <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <span className="text-4xl mb-4 block">⚠️</span>
                    <p className="text-slate-500 font-medium">Impossible de charger les actualités.</p>
                    <p className="text-slate-400 text-sm mt-1">تعذر تحميل الأخبار</p>
                </div>
            ) : news.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <span className="text-4xl mb-4 block">📭</span>
                    <p className="text-slate-500 font-medium">Aucune actualité disponible pour le moment.</p>
                    <p className="text-slate-400 text-sm mt-1">لا توجد أخبار متاحة في الوقت الراهن</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map(article => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </section>
    );
}