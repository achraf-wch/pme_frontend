export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    tone = 'default',
    loading = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    const toneClass = {
        default: 'bg-slate-900 hover:bg-slate-700 focus:ring-slate-300',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-200',
        success: 'bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-200',
    }[tone] || 'bg-slate-900 hover:bg-slate-700 focus:ring-slate-300';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
            <button
                type="button"
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
                aria-label="Fermer"
                onClick={onCancel}
            />
            <div className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="mb-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Confirmation</p>
                    <h3 className="mt-2 text-xl font-black text-slate-900">{title}</h3>
                    {message && <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-md px-4 py-2 text-sm font-black text-white transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
                    >
                        {loading ? 'Traitement...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
