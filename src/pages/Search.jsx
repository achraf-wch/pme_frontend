import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchContent } from '../services/api';

const TYPE_LABELS = {
    page: 'Page',
    news: 'Actualité',
    event: 'Activité',
};

export default function Search() {
    const [params, setParams] = useSearchParams();
    const initialQuery = params.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    const runSearch = async (e) => {
        e?.preventDefault();
        const clean = query.trim();
        if (clean.length < 2) return;

        setLoading(true);
        setError('');
        setParams({ q: clean });

        try {
            const res = await searchContent(clean);
            setResults(res.data.results || []);
            setSearched(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Recherche impossible pour le moment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-16 min-h-[60vh]">
            <div className="mb-10">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Recherche interne</p>
                <h1 className="text-4xl font-black text-slate-900 mt-2">Pages, actualités et activités</h1>
            </div>

            <form onSubmit={runSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher dans le contenu public..."
                    className="flex-1 px-5 py-4 rounded-lg border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none"
                />
                <button type="submit" className="px-6 py-4 bg-slate-900 text-white rounded-lg font-black">
                    Rechercher
                </button>
            </form>

            {error && <p className="text-red-600 font-bold bg-red-50 border border-red-100 rounded-lg p-4">{error}</p>}

            {loading ? (
                <p className="text-slate-500 font-bold">Recherche en cours...</p>
            ) : searched && results.length === 0 ? (
                <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-slate-500">
                    Aucun résultat trouvé.
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((item, index) => (
                        <Link key={`${item.type}-${index}`} to={item.url} className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">{TYPE_LABELS[item.type] || item.type}</span>
                            <h2 className="text-xl font-black text-slate-900 mt-2">{item.title}</h2>
                            {item.excerpt && <p className="text-slate-500 mt-2 leading-relaxed">{item.excerpt}</p>}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
