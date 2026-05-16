import { useEffect, useState } from 'react';
import { getStaticPages, getStorageUrl, updateStaticPage } from '../../services/api';

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
    const [editImages, setEditImages] = useState({});
    const [newImages, setNewImages] = useState({});
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
            const page = pages.find(item => item.slug === slug);
            const currentImages = editImages[slug] ?? page.images ?? [];
            const uploads = newImages[slug] ?? [];
            const form = new FormData();
            form.append('title', page.title);
            form.append('content', editContent[slug] ?? page.content);
            if (page.meta_title) form.append('meta_title', page.meta_title);
            if (page.meta_description) form.append('meta_description', page.meta_description);
            currentImages.forEach((image, index) => {
                form.append(`images[${index}][path]`, image.path);
                form.append(`images[${index}][caption]`, image.caption || '');
                form.append(`images[${index}][layout]`, image.layout || 'list');
            });
            uploads.forEach((image, index) => {
                form.append(`new_images[${index}]`, image.file);
                form.append(`new_image_captions[${index}]`, image.caption || '');
                form.append(`new_image_layouts[${index}]`, image.layout || 'list');
            });
            const res = await updateStaticPage(slug, form);
            setPages(prev => prev.map(item => (
                item.slug === slug ? res.data : item
            )));
            setEditContent(prev => {
                const next = { ...prev };
                delete next[slug];
                return next;
            });
            setEditImages(prev => {
                const next = { ...prev };
                delete next[slug];
                return next;
            });
            setNewImages(prev => {
                const next = { ...prev };
                delete next[slug];
                return next;
            });
            setSaved(prev => ({ ...prev, [slug]: true }));
            setTimeout(() => setSaved(prev => ({ ...prev, [slug]: false })), 2500);
        } finally {
            setSaving(null);
        }
    };

    const pageImages = (page) => editImages[page.slug] ?? page.images ?? [];

    const setImageField = (slug, index, field, value) => {
        const page = pages.find(item => item.slug === slug);
        const images = [...(editImages[slug] ?? page?.images ?? [])];
        images[index] = { ...images[index], [field]: value };
        setEditImages(prev => ({ ...prev, [slug]: images }));
    };

    const removeImage = (page, index) => {
        setEditImages(prev => ({
            ...prev,
            [page.slug]: pageImages(page).filter((_, imageIndex) => imageIndex !== index),
        }));
    };

    const addUploads = (slug, files) => {
        const added = Array.from(files || []).map(file => ({ file, caption: '', layout: 'list' }));
        if (!added.length) return;
        setNewImages(prev => ({ ...prev, [slug]: [...(prev[slug] ?? []), ...added] }));
    };

    const setUploadField = (slug, index, field, value) => {
        const uploads = [...(newImages[slug] ?? [])];
        uploads[index] = { ...uploads[index], [field]: value };
        setNewImages(prev => ({ ...prev, [slug]: uploads }));
    };

    const removeUpload = (slug, index) => {
        setNewImages(prev => ({ ...prev, [slug]: (prev[slug] ?? []).filter((_, uploadIndex) => uploadIndex !== index) }));
    };

    const isDirty = (page) =>
        (editContent[page.slug] !== undefined && editContent[page.slug] !== page.content)
        || editImages[page.slug] !== undefined
        || (newImages[page.slug] ?? []).length > 0;

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

                        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Images</p>
                                    <p className="mt-1 text-xs text-slate-400">Ajoutez une image seule, un duo ou une liste selon la page.</p>
                                </div>
                                <label className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-700">
                                    Ajouter
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={e => { addUploads(page.slug, e.target.files); e.target.value = ''; }}
                                    />
                                </label>
                            </div>

                            {pageImages(page).map((image, index) => (
                                <div key={`${image.path}-${index}`} className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 md:grid-cols-[96px_1fr_auto] md:items-center">
                                    <img src={getStorageUrl(image.path)} alt={image.caption || page.title} className="h-20 w-24 rounded-md object-cover" />
                                    <div className="grid gap-2 md:grid-cols-2">
                                        <input
                                            value={image.caption || ''}
                                            onChange={e => setImageField(page.slug, index, 'caption', e.target.value)}
                                            placeholder="Légende"
                                            className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                                        />
                                        <select
                                            value={image.layout || 'list'}
                                            onChange={e => setImageField(page.slug, index, 'layout', e.target.value)}
                                            className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                                        >
                                            <option value="single">Image seule</option>
                                            <option value="two">Duo / grille 2</option>
                                            <option value="list">Liste</option>
                                        </select>
                                    </div>
                                    <button type="button" onClick={() => removeImage(page, index)} className="rounded-md border border-red-100 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50">
                                        Retirer
                                    </button>
                                </div>
                            ))}

                            {(newImages[page.slug] ?? []).map((image, index) => (
                                <div key={`${image.file.name}-${index}`} className="grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3 md:grid-cols-[1fr_auto] md:items-center">
                                    <div className="grid gap-2 md:grid-cols-[1fr_180px]">
                                        <input
                                            value={image.caption}
                                            onChange={e => setUploadField(page.slug, index, 'caption', e.target.value)}
                                            placeholder={`Légende pour ${image.file.name}`}
                                            className="rounded-md border border-emerald-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                                        />
                                        <select
                                            value={image.layout}
                                            onChange={e => setUploadField(page.slug, index, 'layout', e.target.value)}
                                            className="rounded-md border border-emerald-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                                        >
                                            <option value="single">Image seule</option>
                                            <option value="two">Duo / grille 2</option>
                                            <option value="list">Liste</option>
                                        </select>
                                    </div>
                                    <button type="button" onClick={() => removeUpload(page.slug, index)} className="rounded-md border border-red-100 bg-white px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50">
                                        Annuler
                                    </button>
                                </div>
                            ))}

                            {!pageImages(page).length && !(newImages[page.slug] ?? []).length && (
                                <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs font-bold text-slate-400">
                                    Aucune image pour cette page.
                                </p>
                            )}
                        </div>

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
