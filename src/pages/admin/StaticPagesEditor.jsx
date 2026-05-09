import { useEffect, useState } from 'react';
import { getStaticPages, updateStaticPage } from '../../services/api';

function ConfirmDialog({ message, detail, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-slate-100">
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-2xl">💾</div>
                    <h4 className="text-lg font-black text-slate-900">{message}</h4>
                    {detail && <p className="text-slate-500 text-sm">{detail}</p>}
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors">
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function StaticPagesEditor() {
    const [pages, setPages]           = useState([]);
    const [editContent, setEditContent] = useState({});
    const [saving, setSaving]         = useState(null);
    const [confirm, setConfirm]       = useState(null); // slug pending save
    const [saved, setSaved]           = useState({});

    useEffect(() => {
        getStaticPages().then(res => setPages(res.data));
    }, []);

    const handleSave = async (slug) => {
        setSaving(slug);
        setConfirm(null);
        try {
            await updateStaticPage(slug, { content: editContent[slug] });
            setSaved(prev => ({ ...prev, [slug]: true }));
            setTimeout(() => setSaved(prev => ({ ...prev, [slug]: false })), 2500);
        } finally {
            setSaving(null);
        }
    };

    const isDirty = (page) =>
        editContent[page.slug] !== undefined && editContent[page.slug] !== page.content;

    return (
        <div className="space-y-6">
            {confirm && (
                <ConfirmDialog
                    message="Sauvegarder les modifications ?"
                    detail="Le contenu de cette page sera mis à jour publiquement."
                    onConfirm={() => handleSave(confirm)}
                    onCancel={() => setConfirm(null)}
                />
            )}

            <div className="border-b border-slate-100 pb-4">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Contenu</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">Éditeur de pages</h3>
            </div>

            <div className="space-y-6">
                {pages.map(page => (
                    <div key={page.slug} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-black text-slate-800">{page.title}</h4>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">/{page.slug}</p>
                            </div>
                            {isDirty(page) && (
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                                    Modifié
                                </span>
                            )}
                            {saved[page.slug] && !isDirty(page) && (
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                                    ✓ Sauvegardé
                                </span>
                            )}
                        </div>

                        <textarea
                            rows={6}
                            value={editContent[page.slug] ?? page.content}
                            onChange={e => setEditContent(prev => ({ ...prev, [page.slug]: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-y"
                        />

                        <div className="flex justify-end">
                            <button
                                onClick={() => setConfirm(page.slug)}
                                disabled={!isDirty(page) || saving === page.slug}
                                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                                    isDirty(page) && saving !== page.slug
                                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {saving === page.slug ? 'Sauvegarde...' : 'Sauvegarder'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}