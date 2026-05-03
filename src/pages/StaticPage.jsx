import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

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

    return (
        <main className="bg-white px-4 sm:px-6 py-14">
            <article className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-slate-900">{page.title}</h1>
                <div className="mt-6 text-slate-700 leading-8 whitespace-pre-line">{page.content}</div>
            </article>
        </main>
    );
}
