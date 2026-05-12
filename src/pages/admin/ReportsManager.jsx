import { useEffect, useState } from 'react';
import { createReport, downloadReport, getReceivedReports, getSentReports, sendReport } from '../../services/api';
import { ROLE_LABELS, roleNameOf } from '../../utils/roles';

const PERIODS = [
    { value: 'last_24_hours', label: '24 dernières heures' },
    { value: 'last_week', label: 'Dernière semaine' },
    { value: 'last_month', label: 'Dernier mois' },
    { value: 'last_year', label: 'Dernière année' },
];

const recipientFor = (role) => {
    if (role === 'local_official') return 'Responsable régional';
    if (role === 'regional_official') return 'Administration centrale';
    if (role === 'central_admin') return 'Superviseur';
    return null;
};

function ReportCard({ report, onDownload, onSend, canSendDraft }) {
    const summary = report.summary || {};

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>{report.status === 'sent' ? 'Envoyé' : 'Brouillon'}</span>
                        <span>{ROLE_LABELS[report.recipient_role] || report.recipient_role}</span>
                        {report.recipient_branch && <span>{report.recipient_branch.name}</span>}
                    </div>
                    <h4 className="mt-2 text-lg font-black text-slate-900">{report.title}</h4>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                        {new Date(report.period_start).toLocaleString('fr-FR')} - {new Date(report.period_end).toLocaleString('fr-FR')}
                    </p>
                    {report.sender && (
                        <p className="mt-2 text-xs font-bold text-emerald-700">
                            Par {report.sender.name}{report.sender_branch ? ` · ${report.sender_branch.name}` : ''}
                        </p>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {canSendDraft && report.status !== 'sent' && (
                        <button onClick={() => onSend(report.id)} className="rounded-md bg-emerald-700 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-800">
                            Envoyer
                        </button>
                    )}
                    <button onClick={() => onDownload(report)} className="rounded-md bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-700">
                        PDF
                    </button>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Membres" value={summary.users?.members ?? 0} />
                <Metric label="Événements" value={summary.events?.created ?? 0} />
                <Metric label="Réservations" value={summary.events?.registrations ?? 0} />
                <Metric label="Votes" value={summary.votes?.votes_cast ?? 0} />
            </div>

            {report.author_note && (
                <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                    {report.author_note}
                </p>
            )}
        </article>
    );
}

function Metric({ label, value }) {
    return (
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
        </div>
    );
}

export default function ReportsManager() {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const role = roleNameOf(currentUser);
    const recipient = recipientFor(role);
    const canGenerate = Boolean(recipient);

    const [activeView, setActiveView] = useState(canGenerate ? 'generate' : 'received');
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        period_key: 'last_month',
        title: '',
        author_note: '',
        send: false,
    });

    const refresh = async () => {
        setLoading(true);
        const [sentRes, receivedRes] = await Promise.allSettled([getSentReports(), getReceivedReports()]);
        setSent(sentRes.status === 'fulfilled' ? sentRes.value.data : []);
        setReceived(receivedRes.status === 'fulfilled' ? receivedRes.value.data : []);
        setLoading(false);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleCreate = async (sendNow) => {
        setMessage('');
        try {
            const res = await createReport({ ...form, send: sendNow });
            setMessage(sendNow ? 'Rapport généré et envoyé.' : 'Rapport généré en brouillon.');
            setForm({ period_key: form.period_key, title: '', author_note: '', send: false });
            await refresh();
            await handleDownload(res.data);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Impossible de générer le rapport.');
        }
    };

    const handleSend = async (id) => {
        await sendReport(id);
        setMessage('Rapport envoyé.');
        refresh();
    };

    const handleDownload = async (report) => {
        const res = await downloadReport(report.id);
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport-${report.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const views = [
        canGenerate && ['generate', 'Générer un rapport'],
        ['sent', 'Mes rapports'],
        ['received', 'Rapports reçus'],
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Rapports</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">Suivi organisationnel</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-400">
                        {recipient ? `Vos rapports seront envoyés à : ${recipient}.` : 'Vous recevez les rapports de l’administration centrale.'}
                    </p>
                </div>
                <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500">
                    {ROLE_LABELS[role] || role}
                </span>
            </div>

            <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2">
                {views.map(([id, label]) => (
                    <button
                        key={id}
                        onClick={() => setActiveView(id)}
                        className={`rounded-md px-4 py-2 text-sm font-black transition-all ${
                            activeView === id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {message && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                    {message}
                </div>
            )}

            {activeView === 'generate' && canGenerate && (
                <section className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Période</label>
                            <select
                                value={form.period_key}
                                onChange={e => setForm({ ...form, period_key: e.target.value })}
                                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
                            >
                                {PERIODS.map(period => <option key={period.value} value={period.value}>{period.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre</label>
                            <input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Laisser vide pour un titre automatique"
                                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Point de vue / suggestions</label>
                        <textarea
                            value={form.author_note}
                            onChange={e => setForm({ ...form, author_note: e.target.value })}
                            rows="7"
                            placeholder="Ajoutez vos constats, priorités, suggestions pour la prochaine période..."
                            className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                        />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button onClick={() => handleCreate(false)} className="rounded-md border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50">
                            Générer le PDF
                        </button>
                        <button onClick={() => handleCreate(true)} className="rounded-md bg-emerald-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-800">
                            Générer et envoyer
                        </button>
                    </div>
                </section>
            )}

            {loading ? (
                <div className="p-10 text-center text-slate-400 font-bold">Chargement des rapports...</div>
            ) : activeView === 'sent' ? (
                <ReportList reports={sent} empty="Aucun rapport généré." onDownload={handleDownload} onSend={handleSend} canSendDraft />
            ) : activeView === 'received' ? (
                <ReportList reports={received} empty="Aucun rapport reçu." onDownload={handleDownload} onSend={handleSend} />
            ) : null}
        </div>
    );
}

function ReportList({ reports, empty, onDownload, onSend, canSendDraft = false }) {
    if (reports.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm font-bold text-slate-400">
                {empty}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map(report => (
                <ReportCard
                    key={report.id}
                    report={report}
                    onDownload={onDownload}
                    onSend={onSend}
                    canSendDraft={canSendDraft}
                />
            ))}
        </div>
    );
}
