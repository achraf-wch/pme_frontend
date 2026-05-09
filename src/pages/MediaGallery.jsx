import { useEffect, useState } from 'react';
import API from '../services/api';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/imgs/')) return url;
    return `http://localhost:8000${url}`;
};

export default function MediaGallery() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const staticMedia = [
        ['pmeCreation.webp', 'بيان تأسيس حزب المغرب الصاعد'],
        ['AliAmzineCv.webp', 'CV du fondateur Ali Amzine'],
        ['ANTI_POPULISTES.webp', 'ANTI POPULISTES'],
        ['PRO_EMERGENCE.webp', 'PRO EMERGENCE'],
        ['PRO_FORMATION.webp', 'PRO FORMATION'],
        ['img.webp', 'وطننا خزان غني للفرص وميدان واسع للإبتكار'],
        ['img2.webp', 'Il est temps de créer l’alternative'],
        ['img3.webp', 'الذكاء الاصطناعي'],
        ['img4.webp', 'Mon École Digitale'],
        ['img5.webp', 'شاركوا وانضموا إلى تأسيس حزب مبتكر'],
        ['logo.webp', 'Logo Le PME'],
    ].map(([file, title], index) => ({
        id: `static-${index}`,
        file_name: title,
        file_type: 'image/webp',
        file_url: `/imgs/${file}`,
    }));

    useEffect(() => {
        API.get('/media')
            .then(res => setMedia(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    const visibleMedia = media.length > 0 ? media : staticMedia;

    return (
        <main className="bg-white px-4 sm:px-6 py-14">
            <div className="max-w-7xl mx-auto">
                <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Médiathèque | Photo Gallery</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">Images officielles du PME</h1>
                <p className="text-slate-600 mt-4 max-w-3xl">
                    Galerie publique avec les visuels officiels, complétée automatiquement par les médias publiés depuis l’administration.
                </p>

                {loading ? (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
                        {[0, 1, 2, 3].map(item => <div key={item} className="h-64 bg-slate-100 animate-pulse rounded-lg" />)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
                        {visibleMedia.map(item => (
                            <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        {item.file_type.startsWith('image/') ? (
                                    <img src={getImageUrl(item.file_url)} alt={item.file_name} className="w-full h-64 object-cover bg-slate-50" />
                        ) : (
                                    <p className="p-5">File: {item.file_name}</p>
                        )}
                                <p className="text-sm font-bold text-slate-700 p-4">{item.file_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
