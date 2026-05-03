import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Public pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import NewsList from './pages/NewsList';
import EventList from './pages/EventList';
import PublicDonation from './pages/PublicDonation';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import MediaGallery from './pages/MediaGallery';
import Program from './pages/Program';
import Faq from './pages/Faq';
import Accessibility from './pages/Accessibility';
import StaticPage from './pages/StaticPage';


// Auth & core
import Dashboard from './pages/Dashboard';
import MembershipRequestForm from './pages/MembershipRequestForm';

// Dashboards
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import SympathizerDashboard from './pages/SympathizerDashboard';

// Admin pages
import CreatePoll from './pages/admin/CreatePoll';
import AdminPollList from './pages/admin/AdminPollList';
import ContactsList from './pages/admin/ContactsList';
import StaticPagesEditor from './pages/admin/StaticPagesEditor';
import DonationsList from './pages/admin/DonationsList';
import NewsManager from './pages/admin/NewsManager';
import EventsManager from './pages/admin/EventsManager';
import MediaManager from './pages/admin/MediaManager';
import MembersManager from './pages/admin/MembersManager';
import SympathizersManager from './pages/admin/SympathizersManager';
import VolunteersManager from './pages/admin/VolunteersManager';
import NewsletterManager from './pages/admin/NewsletterManager';
import StatsPanel from './pages/admin/StatsPanel';

// Member pages
import ActivePolls from './pages/member/ActivePolls';
import MyDonations from './pages/member/MyDonations';
import MyEvents from './pages/member/MyEvents';
import ProfileEditor from './pages/member/ProfileEditor';

// Route Guard
function ProtectedRoute({ element, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return <Navigate to="/login" replace />;
    const roleName = user.role?.name ?? user.role;
    if (allowedRoles && !allowedRoles.includes(roleName)) {
        return <Navigate to="/dashboard" replace />;
    }
    return element;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes with Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/news" element={<NewsList />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/donate" element={<PublicDonation />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                    <Route path="/program" element={<Program />} />
                    <Route path="/pages/:slug" element={<StaticPage />} />
                    <Route path="/media" element={<MediaGallery />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/membership-request" element={<ProtectedRoute element={<MembershipRequestForm />} />} />

                {/* Sympathizer */}
                <Route path="/visitor/dashboard" element={<ProtectedRoute allowedRoles={['sympathizer', 'volunteer', 'admin']} element={<SympathizerDashboard />} />} />

                {/* Member */}
                <Route path="/member/dashboard" element={<ProtectedRoute allowedRoles={['member', 'admin']} element={<MemberDashboard />} />} />
                <Route path="/member/active-polls" element={<ProtectedRoute allowedRoles={['member', 'admin']} element={<ActivePolls />} />} />
                <Route path="/member/my-donations" element={<ProtectedRoute allowedRoles={['member', 'admin']} element={<MyDonations />} />} />
                <Route path="/member/my-events" element={<ProtectedRoute allowedRoles={['member', 'admin']} element={<MyEvents />} />} />
                <Route path="/member/profile" element={<ProtectedRoute allowedRoles={['member', 'admin']} element={<ProfileEditor />} />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminDashboard />} />} />
                <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={['admin']} element={<StatsPanel />} />} />
                <Route path="/admin/members" element={<ProtectedRoute allowedRoles={['admin']} element={<MembersManager />} />} />
                <Route path="/admin/sympathizers" element={<ProtectedRoute allowedRoles={['admin']} element={<SympathizersManager />} />} />
                <Route path="/admin/volunteers" element={<ProtectedRoute allowedRoles={['admin']} element={<VolunteersManager />} />} />
                <Route path="/admin/polls" element={<ProtectedRoute allowedRoles={['admin']} element={<AdminPollList />} />} />
                <Route path="/admin/create-poll" element={<ProtectedRoute allowedRoles={['admin']} element={<CreatePoll />} />} />
                <Route path="/admin/donations" element={<ProtectedRoute allowedRoles={['admin']} element={<DonationsList />} />} />
                <Route path="/admin/news" element={<ProtectedRoute allowedRoles={['admin']} element={<NewsManager />} />} />
                <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']} element={<EventsManager />} />} />
                <Route path="/admin/contacts" element={<ProtectedRoute allowedRoles={['admin']} element={<ContactsList />} />} />
                <Route path="/admin/newsletter" element={<ProtectedRoute allowedRoles={['admin']} element={<NewsletterManager />} />} />
                <Route path="/admin/static-pages" element={<ProtectedRoute allowedRoles={['admin']} element={<StaticPagesEditor />} />} />
                <Route path="/admin/media" element={<ProtectedRoute allowedRoles={['admin']} element={<MediaManager />} />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
