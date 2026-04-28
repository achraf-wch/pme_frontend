import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe, logout } from '../services/api';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (err) {
                setUser(null);
                localStorage.removeItem('user');
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#2c3e50',
        color: 'white',
        flexWrap: 'wrap',
    };
    const linkStyle = { color: 'white', textDecoration: 'none', marginLeft: '1rem' };
    const brandStyle = { fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none', color: 'white' };
    const rightLinksStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };

    return (
        <nav style={navStyle}>
            <Link to="/" style={brandStyle}>Political Party</Link>
            <div style={rightLinksStyle}>
                <Link to="/news" style={linkStyle}>News</Link>
                <Link to="/events" style={linkStyle}>Events</Link>
                <Link to="/donate" style={linkStyle}>Donate</Link>
                <Link to="/contact" style={linkStyle}>Contact</Link>
                <Link to="/media" style={linkStyle}>Gallery</Link>
                <Link to="/about" style={linkStyle}>About</Link>
                {user ? (
                    <>
                        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                        <button onClick={handleLogout} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={linkStyle}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}