import { useEffect, useState } from 'react';
import { getAuditLogs } from '../../services/api';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs()
            .then(res => setLogs(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-12 text-center text-slate-400 font-bold">Chargement du journal...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Sécurité</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Journal d'audit sensible</h3>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Action</th>
                            <th className="text-left p-3">Utilisateur</th>
                            <th className="text-left p-3">Objet</th>
                            <th className="text-left p-3">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map(log => (
                            <tr key={log.id} className="align-top">
                                <td className="p-3 text-slate-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                                <td className="p-3 font-black text-slate-900">{log.action}</td>
                                <td className="p-3 text-slate-600">{log.user?.name || 'Système'}</td>
                                <td className="p-3 text-slate-500">{log.subject_type || '-'} {log.subject_id ? `#${log.subject_id}` : ''}</td>
                                <td className="p-3 text-slate-500">{log.ip_address || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
