import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API, { getStorageUrl } from '../services/api';

export default function StaticPage() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        API.get(`/static-pages/${slug}`)
            .then(res => setPage(res.data))
            .catch(() => setError(true));
    }, [slug]);

    if (error) {
        return <main className="px-4 sm:px-6 py-14 bg-white"><div className="max-w-4xl mx-auto text-slate-600">Page introuvable.</div></main>;
    }

    if (!page) {
        return <main className="px-4 sm:px-6 py-14 bg-white"><div className="max-w-4xl mx-auto text-slate-500">Chargement...</div></main>;
    }

    const images = page.images || [];
    const singleImages = images.filter(image => (image.layout || 'list') === 'single');
    const twoImages = images.filter(image => image.layout === 'two');
    const listImages = images.filter(image => (image.layout || 'list') === 'list');

    const ImageFigure = ({ image, className = '' }) => (
        <figure className={className}>
            <img src={getStorageUrl(image.path)} alt={image.caption || page.title} className="w-full rounded-lg object-cover" />
            {image.caption && <figcaption className="mt-2 text-sm font-medium text-slate-500">{image.caption}</figcaption>}
        </figure>
    );

    return (
        <main className="bg-white px-4 sm:px-6 py-14">
            <article className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-slate-900">{page.title}</h1>
                <div className="mt-6 text-slate-700 leading-8 whitespace-pre-line">{page.content}</div>

                {singleImages.length > 0 && (
                    <div className="mt-10 space-y-8">
                        {singleImages.map((image, index) => (
                            <ImageFigure key={`${image.path}-${index}`} image={image} />
                        ))}
                    </div>
                )}

                {twoImages.length > 0 && (
                    <div className="mt-10 grid gap-5 sm:grid-cols-2">
                        {twoImages.map((image, index) => (
                            <ImageFigure key={`${image.path}-${index}`} image={image} />
                        ))}
                    </div>
                )}

                {listImages.length > 0 && (
                    <div className="mt-10 space-y-4">
                        {listImages.map((image, index) => (
                            <div key={`${image.path}-${index}`} className="grid gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[180px_1fr] sm:items-center">
                                <img src={getStorageUrl(image.path)} alt={image.caption || page.title} className="h-36 w-full rounded-md object-cover sm:w-44" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{image.caption || page.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </main>
    );
}
