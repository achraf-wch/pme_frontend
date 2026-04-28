import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../services/api';

export default function ProfileEditor() {
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ password: '', password_confirmation: '' });
    const [message, setMessage] = useState('');
    useEffect(() => {
        getProfile().then(res => setProfile(res.data));
    }, []);
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ name: profile.name, email: profile.email });
            setMessage('Profile updated');
        } catch (err) { setMessage('Error updating profile'); }
    };
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ password: passwordData.password, password_confirmation: passwordData.password_confirmation });
            setMessage('Password updated');
            setPasswordData({ password: '', password_confirmation: '' });
        } catch (err) { setMessage('Error updating password'); }
    };
    return (
        <div>
            <h3>My Profile</h3>
            {message && <p>{message}</p>}
            <form onSubmit={handleProfileUpdate}>
                <label>Name:</label>
                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
                <label>Email:</label>
                <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} required />
                <button type="submit">Update Profile</button>
            </form>
            <h4>Change Password</h4>
            <form onSubmit={handlePasswordUpdate}>
                <input type="password" placeholder="New Password" value={passwordData.password} onChange={e => setPasswordData({...passwordData, password: e.target.value})} required />
                <input type="password" placeholder="Confirm Password" value={passwordData.password_confirmation} onChange={e => setPasswordData({...passwordData, password_confirmation: e.target.value})} required />
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
}