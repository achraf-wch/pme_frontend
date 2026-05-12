import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyNews, getStorageUrl } from '../../services/api';

const imageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return getStorageUrl(path);
};

export default function MyNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyNews()
            .then(res => setNews(res.data))
            .catch(() => setNews([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-slate-400 font-bold">Chargement des actualités...</div>;
    }

    return (
        <div className="space-y-5 text-left">
            <div className="border-b border-slate-100 pb-4">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Actualités</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">Publications pour votre audience</h3>
            </div>

            {news.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                    Aucune actualité visible pour votre rôle.
                </p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {news.map(item => (
                        <Link key={item.id} to={`/news/${item.id}`} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                            {item.image_path && (
                                <img src={imageUrl(item.image_path)} alt={item.title} className="mb-4 aspect-video w-full rounded-md object-cover bg-slate-100" />
                            )}
                            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>{item.type || 'news'}</span>
                                {item.party_branch && <span>{item.party_branch.name}</span>}
                            </div>
                            <p className="mt-2 text-base font-black text-slate-900">{item.title}</p>
                            <p className="mt-2 line-clamp-3 text-sm text-slate-500">{item.content}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
