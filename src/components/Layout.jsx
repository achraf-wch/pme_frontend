import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
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
            <main style={mainStyle}>
                <Outlet />  {/* This renders the nested route component */}
            </main>
            <Footer />
        </div>
    );
}