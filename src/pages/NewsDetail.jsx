import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNewsItem, getStorageUrl } from '../services/api';

const staticNews = {
    constitution: {
        id: 'constitution',
        title: 'بيان تأسيس حزب المغرب الصاعد',
        content: 'Declaration of the Constitution of the Emerging Morocco Party. Déclaration de Constitution du parti du Maroc Emergent. Join our movement now: كن اليوم من السباقين لغد أفضل.',
        image_path: '/imgs/pmeCreation.webp',
        published_at: '2024-07-05',
        type: 'communique',
    },
    'founder-cv': {
        id: 'founder-cv',
        title: 'CV du fondateur السيرة الذاتية للمؤسس',
        content: 'Ali Amzine est directeur de l’Académie internationale pour la formation et la qualification en technologie, langues et métiers. Écrivain économique, ingénieur informaticien, formateur en intelligence collective et intégrateur en intelligence artificielle.',
        image_path: '/imgs/AliAmzineCv.webp',
        published_at: '2024-07-05',
        type: 'article',
    },
    'collective-intelligence': {
        id: 'collective-intelligence',
        title: 'حزب المغرب الصاعد والعمل بالذكاء الجماعي Brainstorming',
        content: 'Les comités de laboratoires spécialisés du PME produisent, innovent et étudient des idées et programmes de développement selon une méthode de brainstorming collectif, au service de solutions créatives et réalistes.',
        image_path: '/imgs/img.webp',
        published_at: '2024-07-05',
        type: 'article',
    },
    'innovative-vision': {
        id: 'innovative-vision',
        title: 'NOTRE VISION INNOVANTE',
        content: 'ANTI POPULISTES, PRO EMERGENCE, PRO FORMATION. Le PME propose une alternative réaliste fondée sur la formation, l’emploi, l’innovation, la citoyenneté et la modernisation de l’action politique.',
        image_path: '/imgs/PRO_EMERGENCE.webp',
        published_at: '2024-07-05',
        type: 'article',
    },
    'digital-school': {
        id: 'digital-school',
        title: 'مدرستي الرقمية Mon École Digitale',
        content: 'Projet Mon École Digitale du PME: une vision de développement scientifique et numérique pour soutenir la formation, l’égalité d’accès au savoir et l’innovation éducative.',
        image_path: '/imgs/img4.webp',
        published_at: '2024-07-05',
        type: 'article',
    },
};

export default function NewsDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(staticNews[id] || null);
    const [loading, setLoading] = useState(!staticNews[id]);

    useEffect(() => {
        if (staticNews[id]) return;
        getNewsItem(id)
            .then(res => setArticle(res.data))
            .catch(() => setArticle(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-16 text-center text-slate-400 font-bold">Chargement...</div>;
    if (!article) return <div className="p-16 text-center text-slate-500 font-bold">Article introuvable.</div>;

    return (
        <article className="bg-white">
            <header className="mx-auto max-w-5xl px-6 py-12">
                <Link to="/news" className="text-sm font-black uppercase tracking-widest text-emerald-700">Retour aux actualités</Link>
                <div className="mt-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-blue-600">
                    <span>{article.type || 'Actualité'}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-slate-400">{new Date(article.published_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">{article.title}</h1>
            </header>

            {article.image_path && (
                <div className="mx-auto max-w-6xl px-6">
                    <img src={getStorageUrl(article.image_path)} alt={article.title} className="max-h-[560px] w-full rounded-lg object-cover" />
                </div>
            )}

            <div className="mx-auto max-w-3xl px-6 py-12">
                <p className="whitespace-pre-line text-lg leading-9 text-slate-700">{article.content}</p>
                {article.attachment_path && (
                    <a href={getStorageUrl(article.attachment_path)} className="mt-8 inline-flex rounded-md bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-slate-700">
                        Télécharger le fichier joint
                    </a>
                )}
            </div>
        </article>
    );
}
