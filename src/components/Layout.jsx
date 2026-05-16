import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../i18n/LanguageContext';

export default function Layout() {
    const { direction, language } = useLanguage();
    const layoutStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    };
    const mainStyle = {
        flex: 1,
        backgroundColor: '#f8fafc',
    };

    return (
        <div style={layoutStyle} dir={direction} lang={language}>
            <Navbar />
            <main style={mainStyle}>
                <Outlet />  {/* This renders the nested route component */}
            </main>
            <Footer />
        </div>
    );
}
