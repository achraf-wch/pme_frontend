import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyNews, getPublicNews, getStorageUrl } from '../services/api';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;
    return getStorageUrl(path);
};

const staticNews = [
    {
        id: 'constitution',
        title: 'بيان تأسيس حزب المغرب الصاعد',
        content: 'Declaration of the Constitution of the Emerging Morocco Party. Déclaration de Constitution du parti du Maroc Emergent. Join our movement now: كن اليوم من السباقين لغد أفضل.',
        image_path: '/imgs/pmeCreation.webp',
        published_at: '2024-07-05',
    },
    {
        id: 'founder-cv',
        title: 'CV du fondateur السيرة الذاتية للمؤسس',
        content: 'Ali Amzine est directeur de l’Académie internationale pour la formation et la qualification en technologie, langues et métiers. Écrivain économique, ingénieur informaticien, formateur en intelligence collective et intégrateur en intelligence artificielle.',
        image_path: '/imgs/AliAmzineCv.webp',
        published_at: '2024-07-05',
    },
    {
        id: 'collective-intelligence',
        title: 'حزب المغرب الصاعد والعمل بالذكاء الجماعي Brainstorming',
        content: 'Les comités de laboratoires spécialisés du PME produisent, innovent et étudient des idées et programmes de développement selon une méthode de brainstorming collectif, au service de solutions créatives et réalistes.',
        image_path: '/imgs/img.webp',
        published_at: '2024-07-05',
    },
    {
        id: 'innovative-vision',
        title: 'NOTRE VISION INNOVANTE',
        content: 'ANTI POPULISTES, PRO EMERGENCE, PRO FORMATION. Le PME propose une alternative réaliste fondée sur la formation, l’emploi, l’innovation, la citoyenneté et la modernisation de l’action politique.',
        image_path: '/imgs/PRO_EMERGENCE.webp',
        published_at: '2024-07-05',
    },
    {
        id: 'digital-school',
        title: 'مدرستي الرقمية Mon École Digitale',
        content: 'Projet Mon École Digitale du PME: une vision de développement scientifique et numérique pour soutenir la formation, l’égalité d’accès au savoir et l’innovation éducative.',
        image_path: '/imgs/img4.webp',
        published_at: '2024-07-05',
    },
];

export default function NewsList() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loader = localStorage.getItem('token') ? getMyNews : getPublicNews;
        loader()
            .then(res => setNews(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const visibleNews = news.length > 0 || localStorage.getItem('token') ? news : staticNews;

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
            ) : (
                <div className="space-y-16">
                    {visibleNews.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-400">
                            Aucune actualité visible pour votre rôle.
                        </div>
                    ) : visibleNews.map(article => (
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
                                
                                <div className="flex items-center justify-between">
                                    <Link to={`/news/${article.id}`} className="flex items-center gap-2 text-sm font-black text-slate-900 border-b-2 border-transparent hover:border-blue-500 transition-all pb-1 uppercase tracking-widest">
                                        Parcourir
                                    </Link>
                                    
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
