import { useState } from 'react';
import Icon from './Icon';

const replies = [
    {
        q: 'Adhesion',
        a: "Pour l'adhesion, creez un compte puis deposez votre demande depuis l'espace membre. L'equipe peut suivre et valider le dossier dans l'administration.",
    },
    {
        q: 'Activites',
        a: "Les activites publiques sont visibles dans la page Activites. Les membres connectes peuvent reserver et suivre leurs inscriptions.",
    },
    {
        q: 'Contact',
        a: 'Vous pouvez contacter le parti via le formulaire du site ou par WhatsApp au +212 674 29 30 63.',
    },
];

export default function SmartResponder() {
    const [open, setOpen] = useState(false);
    const [answer, setAnswer] = useState(replies[0].a);

    return (
        <div className="fixed bottom-5 right-5 z-50 print:hidden">
            {open && (
                <div className="mb-3 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-2xl">
                    <div className="bg-slate-950 px-5 py-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500 text-white">
                                <Icon name="bot" />
                            </div>
                            <div>
                                <p className="text-sm font-black">Assistant intelligent</p>
                                <p className="text-xs text-slate-300" dir="rtl">المجيب الذكي للموقع</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 p-5">
                        <p className="rounded-md bg-emerald-50 p-4 text-sm leading-relaxed text-slate-700">{answer}</p>
                        <div className="grid grid-cols-3 gap-2">
                            {replies.map(item => (
                                <button
                                    key={item.q}
                                    type="button"
                                    onClick={() => setAnswer(item.a)}
                                    className="rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                                >
                                    {item.q}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400">
                            Pret pour connexion API IA et base FAQ officielle.
                        </p>
                    </div>
                </div>
            )}
            <button
                type="button"
                onClick={() => setOpen(value => !value)}
                className="flex h-14 w-14 items-center justify-center rounded-md bg-emerald-600 text-white shadow-xl transition hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                aria-label="Ouvrir le repondeur intelligent"
            >
                <Icon name="bot" className="h-7 w-7" />
            </button>
        </div>
    );
}
