import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getNotificationSummary,
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from '../services/api';

const CATEGORY_LABELS = {
    content: 'Actualité',
    event: 'Activité',
    poll: 'Vote',
    media: 'Média',
    donation: 'Don',
    membership: 'Adhésion',
    message: 'Message',
    registration: 'Inscription',
    request: 'Demande',
    system: 'Système',
};

function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function NotificationBar() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const panelRef = useRef(null);

    useEffect(() => {
        refreshSummary();
    }, []);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const refreshSummary = async () => {
        try {
            const res = await getNotificationSummary();
            setUnreadCount(res.data.unread_count || 0);
            setNotifications(res.data.latest || []);
        } catch (err) {
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    };

    const loadAll = async () => {
        setOpen((current) => !current);
        if (!open) {
            const res = await getNotifications();
            setNotifications(res.data);
        }
    };

    const readOne = async (notification) => {
        if (notification.read_at) return;
        await markNotificationRead(notification.id);
        setNotifications((items) => items.map((item) => (
            item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item
        )));
        setUnreadCount((count) => Math.max(0, count - 1));
    };

    const readAll = async () => {
        await markAllNotificationsRead();
        setUnreadCount(0);
        setNotifications((items) => items.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={loadAll}
                className="relative inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
                aria-expanded={open}
                aria-label="Ouvrir les notifications"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] leading-none">!</span>
                <span>Notifications</span>
                {unreadCount > 0 && (
                    <span className="min-w-[1.25rem] rounded-full bg-emerald-700 px-1.5 py-0.5 text-center text-[11px] font-black text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-40 mt-3 w-[min(92vw,420px)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Centre</p>
                            <h3 className="text-base font-black text-slate-900">Notifications</h3>
                        </div>
                        <button
                            type="button"
                            onClick={readAll}
                            disabled={unreadCount === 0}
                            className="rounded-md px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                            Tout lu
                        </button>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                        {loading ? (
                            <div className="p-6 text-center text-sm font-bold text-slate-400">Chargement...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-black text-slate-700">Aucune notification</p>
                                <p className="mt-2 text-xs text-slate-400">Les nouvelles actions importantes apparaîtront ici.</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const data = notification.data || {};
                                const unread = !notification.read_at;
                                return (
                                    <Link
                                        key={notification.id}
                                        to={data.action_url || '/dashboard'}
                                        onClick={() => {
                                            readOne(notification);
                                            setOpen(false);
                                        }}
                                        className={`block border-b border-slate-100 px-4 py-4 transition-colors hover:bg-slate-50 ${unread ? 'bg-emerald-50/50' : 'bg-white'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${unread ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                        {CATEGORY_LABELS[data.category] || data.category || 'Info'}
                                                    </span>
                                                    <span className="shrink-0 text-[11px] font-bold text-slate-400">{formatDate(notification.created_at)}</span>
                                                </div>
                                                <p className="mt-2 text-sm font-black text-slate-900">{data.title}</p>
                                                {data.body && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{data.body}</p>}
                                                <p className="mt-3 text-xs font-black uppercase tracking-widest text-emerald-700">
                                                    {data.action_label || 'Ouvrir'}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
