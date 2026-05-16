// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../services/api';
import MemberDashboard from './MemberDashboard';
import AdminDashboard from './AdminDashboard';
import VisitorDashboard from './SympathizerDashboard';
import { isAdminRole, roleNameOf } from '../utils/roles';
import { useLanguage } from '../i18n/LanguageContext';

export default function Dashboard() {
    const { t } = useLanguage();
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

    if (loading) return <div>{t('loading')}</div>;

    // Now user is guaranteed to exist (not null)
    if (!user) return <div>{t('noUserData')}</div>;

    const role = roleNameOf(user);

    if (isAdminRole(role)) {
        return <AdminDashboard user={user} />;
    } else if (role === 'member') {
        return <MemberDashboard user={user} />;
    } else {
        return <VisitorDashboard user={user} />;
    }
}
