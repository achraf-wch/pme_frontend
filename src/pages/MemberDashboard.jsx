// src/pages/MemberDashboard.jsx
import { useState } from 'react';
import ProfileEditor from './member/ProfileEditor';
import ActivePolls from './member/ActivePolls';
import MyDonations from './member/MyDonations';
import MyEvents from './member/MyEvents';

export default function MemberDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('profile');
    const tabs = [
        { id: 'profile', label: 'My Profile', component: <ProfileEditor /> },
        { id: 'polls', label: 'Vote', component: <ActivePolls /> },
        { id: 'donations', label: 'Donations', component: <MyDonations /> },
        { id: 'events', label: 'Events', component: <MyEvents /> },
    ];
    return (
        <div style={{ padding: 20 }}>
            <h2>Member Dashboard</h2>
            <p>Welcome, {user.name} (Member since {new Date(user.created_at).toLocaleDateString()})</p>
            <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid #ccc', marginBottom: 20, flexWrap: 'wrap' }}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: 8, background: activeTab === tab.id ? '#28a745' : '#f0f0f0', color: activeTab === tab.id ? 'white' : 'black', border: 'none', cursor: 'pointer' }}>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{tabs.find(t => t.id === activeTab).component}</div>
        </div>
    );
}