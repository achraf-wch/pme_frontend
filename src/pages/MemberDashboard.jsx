import { useState } from 'react';
import ActivePolls from './member/ActivePolls';
import MyDonations from './member/MyDonations';
import MyEvents from './member/MyEvents';
import ProfileEditor from './member/ProfileEditor';

export default function MemberDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile',   label: 'My Profile',   component: <ProfileEditor /> },
        { id: 'polls',     label: 'Active Polls',  component: <ActivePolls /> },
        { id: 'donations', label: 'My Donations',  component: <MyDonations /> },
        { id: 'events',    label: 'My Events',     component: <MyEvents /> },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Member Dashboard</h2>
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