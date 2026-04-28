import { Link } from 'react-router-dom';

export default function CallToAction() {
    const ctaStyle = {
        backgroundColor: '#ecf0f1',
        textAlign: 'center',
        padding: '2rem',
        borderRadius: '8px',
        marginTop: '2rem',
    };
    const buttonGroupStyle = { display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' };
    const buttonStyle = { padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' };
    const donateBtn = { ...buttonStyle, backgroundColor: '#27ae60', color: 'white' };
    const memberBtn = { ...buttonStyle, backgroundColor: '#2980b9', color: 'white' };
    return (
        <div style={ctaStyle}>
            <h2>Support Our Mission</h2>
            <p>Become a member, donate, or volunteer to help us grow.</p>
            <div style={buttonGroupStyle}>
                <Link to="/donate" style={donateBtn}>Donate Now</Link>
                <Link to="/register" style={memberBtn}>Become a Member</Link>
            </div>
        </div>
    );
}