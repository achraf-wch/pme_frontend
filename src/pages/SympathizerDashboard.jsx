import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DashboardFeed from './member/DashboardFeed';
import { roleNameOf } from '../utils/roles';
import NotificationBar from '../components/NotificationBar';
import { getMembershipRequest, getMySympathizerRequest, getMyVolunteerRequest } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

export default function SympathizerDashboard({ user }) {
    const { t } = useLanguage();
    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState({});
    const role = roleNameOf(user);
    const requestLabel = {
        pending: t('sent'),
        in_progress: t('processing'),
        approved: t('approved'),
        rejected: t('rejected'),
        completed: t('completed'),
    };

    useEffect(() => {
        API.get('/profile').then(res => setProfile(res.data)).catch(() => setProfile(null));
        Promise.allSettled([getMembershipRequest(), getMySympathizerRequest(), getMyVolunteerRequest()])
            .then(([membership, sympathizer, volunteer]) => {
                setRequests({
                    membership: membership.status === 'fulfilled' && membership.value.data?.id ? membership.value.data : null,
                    sympathizer: sympathizer.status === 'fulfilled' && sympathizer.value.data?.id ? sympathizer.value.data : null,
                    volunteer: volunteer.status === 'fulfilled' && volunteer.value.data?.id ? volunteer.value.data : null,
                });
            });
    }, []);

    const steps = [
        { title: t('completeProfile'), text: t('completeProfileText'), to: '/member/profile' },
        { title: t('requestMembership'), text: t('requestMembershipText'), to: '/membership-request' },
        { title: t('followActivities'), text: t('followActivitiesText'), to: '/events' },
        { title: t('contribute'), text: t('contributeText'), to: '/donate' },
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">{t('participationSpace')}</p>
                        <h1 className="text-3xl font-black text-slate-900 mt-1">{t('welcome')}, {user?.name}</h1>
                        <p className="text-slate-500 mt-2">{t(`roleLabel_${role}`)} · {t('citizenPath')}</p>
                        <p className="text-slate-500 mt-2">{t(`roleDesc_${role}`)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <NotificationBar />
                        <Link to="/" className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50">
                            {t('backToSite')}
                        </Link>
                        <Link to="/membership-request" className="px-4 py-2 rounded-md bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-600">
                            {t('requestMembership')}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-12 gap-6">
                <aside className="lg:col-span-4">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div className="h-28 bg-slate-900" />
                        <div className="p-6">
                            <div className="w-20 h-20 bg-white rounded-lg shadow-lg -mt-16 mb-5 flex items-center justify-center text-3xl border-4 border-white font-black text-emerald-700">
                                {user?.name?.charAt(0)}
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('currentRole')}</p>
                                    <span className="inline-flex mt-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md text-xs font-black border border-emerald-100">
                                        {t(`roleLabel_${role}`)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('identifier')}</p>
                                    <p className="text-slate-800 font-black truncate mt-1">{profile?.email || user?.email}</p>
                                </div>
                                <div className="pt-5 border-t border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('registeredSince')}</p>
                                    <p className="text-slate-800 font-bold mt-1">
                                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : t('activeAccount')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-8 space-y-6">
                    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6">
                        <DashboardFeed />
                    </section>

                    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-700">{t('myRequests')}</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            {[
                                [t('membership'), requests.membership, requests.membership?.review_stage],
                                [t('sympathizer'), requests.sympathizer, requests.sympathizer?.status],
                                [t('volunteer'), requests.volunteer, requests.volunteer?.status],
                            ].map(([title, req, status]) => (
                                <div key={title} className="rounded-md border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-sm font-black text-slate-900">{title}</p>
                                    <p className="mt-2 text-xs font-bold text-slate-500">
                                        {req ? (requestLabel[status] || status || t('sent')) : t('noRequest')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-900 rounded-lg p-8 text-white">
                        <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">{t('nextStep')}</p>
                        <h2 className="text-3xl font-black mt-3">{t('officialEngagementTitle')}</h2>
                        <p className="text-slate-300 mt-4 leading-relaxed max-w-2xl">
                            {t('officialEngagementText')}
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-4">
                        {steps.map(step => (
                            <Link key={step.title} to={step.to} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all">
                                <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{step.text}</p>
                            </Link>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
}
