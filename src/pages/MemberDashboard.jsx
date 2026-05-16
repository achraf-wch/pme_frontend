import { useState } from 'react';
import { Link } from 'react-router-dom';
import ActivePolls from './member/ActivePolls';
import DashboardFeed from './member/DashboardFeed';
import MyDonations from './member/MyDonations';
import MyEvents from './member/MyEvents';
import MyMedia from './member/MyMedia';
import MyNews from './member/MyNews';
import ProfileEditor from './member/ProfileEditor';
import { roleNameOf } from '../utils/roles';
import NotificationBar from '../components/NotificationBar';
import { useLanguage } from '../i18n/LanguageContext';

export default function MemberDashboard({ user }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');
    const role = roleNameOf(user);

    const tabs = [
        { id: 'overview', label: t('forMe'), component: <DashboardFeed /> },
        { id: 'profile', label: t('profile'), component: <ProfileEditor /> },
        { id: 'polls', label: t('openVotes'), component: <ActivePolls /> },
        { id: 'news', label: t('news'), component: <MyNews /> },
        { id: 'media', label: t('media'), component: <MyMedia /> },
        { id: 'donations', label: t('contributions'), component: <MyDonations /> },
        { id: 'events', label: t('activities'), component: <MyEvents /> },
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">{t('memberSpace')}</p>
                        <h1 className="text-3xl font-black text-slate-900 mt-1">{t('welcome')}, {user?.name}</h1>
                        <p className="text-slate-500 mt-2">{t(`roleLabel_${role}`) || t('roleLabel_member')} · {t('secureAccess')}</p>
                        <p className="text-slate-500 mt-2">{t(`roleDesc_${role}`)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <NotificationBar />
                        <Link to="/" className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50">
                            {t('backToSite')}
                        </Link>
                        <Link to="/donate" className="px-4 py-2 rounded-md bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-600">
                            {t('contribute')}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {[
                        [t('status'), t(`roleLabel_${role}`) || role],
                        [t('internalVote'), t('accordingEligibility')],
                        [t('contributions'), t('personalHistory')],
                        [t('activities'), t('trackedRegistrations')],
                    ].map(([label, value]) => (
                        <div key={label} className="bg-white border border-slate-200 rounded-lg p-5">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className="font-black text-slate-900 mt-2">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-2 mb-6 flex flex-wrap gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[140px] px-4 py-3 rounded-md text-sm font-black transition-all ${
                                activeTab === tab.id
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-8 min-h-[420px]">
                    {tabs.find(t => t.id === activeTab)?.component}
                </section>
            </div>
        </div>
    );
}
