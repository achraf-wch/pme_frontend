import { useState, useEffect } from 'react';
import API from '../services/api';

export default function SympathizerDashboard({ user }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        API.get('/profile').then(res => setProfile(res.data));
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.name}</p>

            <h3>Your Status</h3>
            {profile ? (
                <table border="1" cellPadding="6">
                    <tbody>
                        <tr><td>Name</td><td>{profile.name}</td></tr>
                        <tr><td>Email</td><td>{profile.email}</td></tr>
                        <tr><td>Role</td><td>{profile.role}</td></tr>
                        <tr><td>Member since</td><td>{new Date(profile.created_at).toLocaleDateString()}</td></tr>
                    </tbody>
                </table>
            ) : (
                <p>Loading profile...</p>
            )}

            <h3>What's next?</h3>
            <p>You can submit a membership request to become a full member.</p>
            <a href="/membership-request">
                <button>Submit Membership Request</button>
            </a>
        </div>
    );
}