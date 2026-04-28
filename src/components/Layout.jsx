import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
    const layoutStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    };
    const mainStyle = {
        flex: 1,
        padding: '2rem',
        backgroundColor: '#f5f5f5',
    };

    return (
        <div style={layoutStyle}>
            <Navbar />
            <main style={mainStyle}>{children}</main>
            <Footer />
        </div>
    );
}