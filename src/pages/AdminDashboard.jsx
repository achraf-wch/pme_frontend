import { useState, useEffect } from 'react';
import { getPendingRequests, approveRequest, rejectRequest } from '../services/api';
import CreatePoll from './admin/CreatePoll';
import AdminPollList from './admin/AdminPollList';
import DonationsList from './admin/DonationsList';
import NewsManager from './admin/NewsManager';
import ContactsList from './admin/ContactsList';
import EventsManager from './admin/EventsManager';
import StaticPagesEditor from './admin/StaticPagesEditor';
import MediaManager from './admin/MediaManager';
import MembersManager from './admin/MembersManager';
import SympathizersManager from './admin/SympathizersManager';
import VolunteersManager from './admin/VolunteersManager';
import NewsletterManager from './admin/NewsletterManager';
import StatsPanel from './admin/StatsPanel';

function PendingMembershipRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        getPendingRequests().then(res => setRequests(res.data)).finally(() => setLoading(false));
    }, []);

    const approve = (id) => approveRequest(id).then(() => getPendingRequests().then(res => setRequests(res.data)));
    const reject  = (id) => rejectRequest(id).then(()  => getPendingRequests().then(res => setRequests(res.data)));

    if (loading) return <p>Loading...</p>;
    if (!requests.length) return <p>No pending requests.</p>;

    return (
        <div>
            {requests.map(req => (
                <div key={req.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                    <p><strong>{req.user.name}</strong> ({req.user.email})</p>
                    <p>Motivation: {req.motivation || 'None'}</p>
                    <button onClick={() => approve(req.id)}>Approve</button>
                    <button onClick={() => reject(req.id)} style={{ marginLeft: 6 }}>Reject</button>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('stats');

    const tabs = [
        { id: 'stats',      label: 'Statistics',    component: <StatsPanel /> },
        { id: 'membership', label: 'Membership',     component: <PendingMembershipRequests /> },
        { id: 'members',    label: 'Members',        component: <MembersManager /> },
        { id: 'sympathizers', label: 'Sympathizers', component: <SympathizersManager /> },
        { id: 'volunteers', label: 'Volunteers',     component: <VolunteersManager /> },
        { id: 'polls',      label: 'Polls',          component: <><CreatePoll /><AdminPollList /></> },
        { id: 'donations',  label: 'Donations',      component: <DonationsList /> },
        { id: 'news',       label: 'News',           component: <NewsManager /> },
        { id: 'events',     label: 'Events',         component: <EventsManager /> },
        { id: 'contacts',   label: 'Contacts',       component: <ContactsList /> },
        { id: 'newsletter', label: 'Newsletter',     component: <NewsletterManager /> },
        { id: 'static',     label: 'Static Pages',   component: <StaticPagesEditor /> },
        { id: 'media',      label: 'Media',          component: <MediaManager /> },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {user?.name}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #ccc', marginBottom: 20 }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '6px 12px',
                            background: activeTab === tab.id ? '#007bff' : '#f0f0f0',
                            color: activeTab === tab.id ? 'white' : 'black',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{tabs.find(t => t.id === activeTab)?.component}</div>
        </div>
    );
}