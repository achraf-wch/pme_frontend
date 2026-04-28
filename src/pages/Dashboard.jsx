// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../services/api';
import MemberDashboard from './MemberDashboard';
import AdminDashboard from './AdminDashboard';
import VisitorDashboard from './.SympathizerDashboard';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.data);
            } catch (err) {
                console.error(err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    // Now user is guaranteed to exist (not null)
    if (!user) return <div>No user data</div>;

    if (user.role.name === 'admin') {
        return <AdminDashboard user={user} />;
    } else if (user.role.name === 'member') {
        return <MemberDashboard user={user} />;
    } else {
        return <VisitorDashboard user={user} />;
    }
}