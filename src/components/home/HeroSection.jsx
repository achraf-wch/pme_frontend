export default function HeroSection() {
    const heroStyle = {
        background: 'linear-gradient(135deg, #2c3e50, #3498db)',
        color: 'white',
        textAlign: 'center',
        padding: '4rem 2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
    };
    const buttonStyle = {
        backgroundColor: '#f39c12',
        border: 'none',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '1rem',
    };
    return (
        <div style={heroStyle}>
            <h1>Welcome to the Political Party Platform</h1>
            <p style={{ fontSize: '1.2rem' }}>Join us to build a better future. Participate in votes, events, and more.</p>
            <button style={buttonStyle} onClick={() => window.location.href = '/register'}>Get Involved</button>
        </div>
    );
}