import { useEffect, useState } from 'react';
import API, { getStorageUrl } from '../../services/api';
import { Link } from 'react-router-dom';

const staticArticles = [
    {
        id: 'static-constitution',
        title: 'بيان تأسيس حزب المغرب الصاعد',
        content: 'Declaration of the Constitution of the Emerging Morocco Party. Déclaration de Constitution du parti du Maroc Emergent.',
        image_path: '/imgs/pmeCreation.webp',
        published_at: '2024-07-05',
    },
    {
        id: 'static-ai',
        title: 'تعرف على حزب المغرب الصاعد بالذكاء الاصطناعي',
        content: 'Le PME porte une vision politique qui relie intelligence artificielle, innovation, formation et intelligence collective.',
        image_path: '/imgs/img3.webp',
        published_at: '2024-07-05',
    },
    {
        id: 'static-brainstorming',
        title: 'حزب المغرب الصاعد والعمل بالذكاء الجماعي',
        content: 'Les comités de laboratoires spécialisés produisent et étudient des programmes de développement par brainstorming collectif.',
        image_path: '/imgs/img.webp',
        published_at: '2024-07-05',
    },
];

function NewsCard({ article }) {
    const imgUrl = getStorageUrl(article.image_path);

    return (
        <article className="group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
            <div className="relative h-52 overflow-hidden bg-slate-100">
                {imgUrl ? (
                    <img src={imgUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-400 font-black">PME</span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-emerald-700 text-white text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg">
                    Communiqué
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-md px-3 py-1 text-xs font-bold text-slate-600">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'PME'}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs text-slate-400 mb-3 block uppercase tracking-wide">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Publication officielle'}
                </span>
                <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {article.content?.substring(0, 150)}...
                </p>
                <Link to="/news" className="mt-auto inline-flex items-center gap-2 text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                    Lire la suite
                    <span className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center text-xs transition-all group-hover:translate-x-1">→</span>
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
        API.get('/news/feed')
            .then(res => {
                setNews(res.data.slice(0, 3));
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                    <div>
                        <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-2">
                            Actualités | أخبار
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            Actualités et communiqués
                        </h2>
                        <p className="text-slate-500 mt-2" dir="rtl">مستجدات وبلاغات الحزب الرسمية</p>
                    </div>
                    <Link to="/news" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-900 transition-colors text-sm">
                        Voir toutes les actualités →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[0, 1, 2].map(item => (
                            <div key={item} className="animate-pulse bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                                <div className="h-52 bg-slate-100" />
                                <div className="p-6 space-y-3">
                                    <div className="h-3 w-24 bg-slate-100 rounded-full" />
                                    <div className="h-5 bg-slate-100 rounded-full" />
                                    <div className="h-5 w-3/4 bg-slate-100 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">Impossible de charger les actualités.</p>
                        <p className="text-slate-400 text-sm mt-1" dir="rtl">تعذر تحميل الأخبار</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {staticArticles.map(article => <NewsCard key={article.id} article={article} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {news.map(article => <NewsCard key={article.id} article={article} />)}
                    </div>
                )}
            </div>
        </section>
    );
}
