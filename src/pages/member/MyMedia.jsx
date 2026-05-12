import { useEffect, useState } from 'react';
import { getMedia } from '../../services/api';

export default function MyMedia() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMedia({ audience: 'mine' })
            .then(res => setMedia(res.data))
            .catch(() => setMedia([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-slate-400 font-bold">Chargement des médias...</div>;
    }

    return (
        <div className="space-y-5 text-left">
            <div className="border-b border-slate-100 pb-4">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Médias</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">Documents et images pour votre audience</h3>
            </div>

            {media.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                    Aucun média visible pour votre rôle.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {media.map(item => (
                        <a key={item.id} href={item.file_url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 bg-white p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                            {item.file_type?.startsWith('image/') ? (
                                <img src={item.file_url} alt={item.file_name} className="aspect-video w-full rounded-md object-cover bg-slate-100" />
                            ) : (
                                <div className="aspect-video w-full rounded-md bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400">
                                    DOCUMENT
                                </div>
                            )}
                            <p className="mt-3 truncate text-sm font-black text-slate-900">{item.file_name}</p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {item.party_branch?.name || 'Général'}
                            </p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
