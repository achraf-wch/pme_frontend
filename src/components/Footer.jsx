import { Link } from 'react-router-dom';

export default function Footer() {
    const footerStyle = {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        marginTop: 'auto',
    };
    const linkStyle = { color: 'white', textDecoration: 'none', margin: '0 0.5rem' };

    return (
        <footer style={footerStyle}>
            <div>
                <Link to="/about" style={linkStyle}>About</Link>
                <Link to="/privacy" style={linkStyle}>Privacy</Link>
                <Link to="/terms" style={linkStyle}>Terms</Link>
                <Link to="/contact" style={linkStyle}>Contact</Link>
                <Link to="/media" style={linkStyle}>Gallery</Link>
                <Link to="/news" style={linkStyle}>News</Link>
                <Link to="/events" style={linkStyle}>Events</Link>
                <Link to="/donate" style={linkStyle}>Donate</Link>
            </div>
            <p style={{ marginTop: '0.5rem' }}>&copy; {new Date().getFullYear()} Political Party. All rights reserved.</p>
        </footer>
    );
}