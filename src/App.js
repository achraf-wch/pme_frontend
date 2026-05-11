import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Public pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import NewsList from './pages/NewsList';
import EventList from './pages/EventList';
import NewsDetail from './pages/NewsDetail';
import EventDetail from './pages/EventDetail';
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
import Search from './pages/Search';


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
import MembersManager from './pages/admin/UserManager';
import SympathizersManager from './pages/admin/SympathizersManager';
import VolunteersManager from './pages/admin/VolunteersManager';
import NewsletterManager from './pages/admin/NewsletterManager';
import StatsPanel from './pages/admin/StatsPanel';
import AuditLogs from './pages/admin/AuditLogs';

// Member pages
import ActivePolls from './pages/member/ActivePolls';
import MyDonations from './pages/member/MyDonations';
import MyEvents from './pages/member/MyEvents';
import ProfileEditor from './pages/member/ProfileEditor';
import { ADMIN_ROLES, ALL_ROLES, CENTRAL_ADMIN_ROLES, LOCAL_ADMIN_ROLES, MEMBER_ROLES, SUPER_ADMIN_ROLES } from './utils/roles';

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
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/donate" element={<PublicDonation />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                    <Route path="/program" element={<Program />} />
                    <Route path="/pages/:slug" element={<StaticPage />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/media" element={<MediaGallery />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={<ProtectedRoute allowedRoles={ALL_ROLES} element={<Dashboard />} />} />
                    <Route path="/membership-request" element={<ProtectedRoute allowedRoles={ALL_ROLES} element={<MembershipRequestForm />} />} />

                    {/* Sympathizer */}
                    <Route path="/visitor/dashboard" element={<ProtectedRoute allowedRoles={ALL_ROLES} element={<SympathizerDashboard />} />} />

                    {/* Member */}
                    <Route path="/member/dashboard" element={<ProtectedRoute allowedRoles={MEMBER_ROLES} element={<MemberDashboard />} />} />
                    <Route path="/member/active-polls" element={<ProtectedRoute allowedRoles={ALL_ROLES} element={<ActivePolls />} />} />
                    <Route path="/member/my-donations" element={<ProtectedRoute allowedRoles={ALL_ROLES} element={<MyDonations />} />} />
                    <Route path="/member/my-events" element={<ProtectedRoute allowedRoles={ALL_ROLES} element={<MyEvents />} />} />
                    <Route path="/member/profile" element={<ProtectedRoute allowedRoles={ALL_ROLES} element={<ProfileEditor />} />} />

                    {/* Admin */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={ADMIN_ROLES} element={<AdminDashboard />} />} />
                    <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={ADMIN_ROLES} element={<StatsPanel />} />} />
                    <Route path="/admin/members" element={<ProtectedRoute allowedRoles={LOCAL_ADMIN_ROLES} element={<MembersManager />} />} />
                    <Route path="/admin/sympathizers" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<SympathizersManager />} />} />
                    <Route path="/admin/volunteers" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<VolunteersManager />} />} />
                    <Route path="/admin/polls" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<AdminPollList />} />} />
                    <Route path="/admin/create-poll" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<CreatePoll />} />} />
                    <Route path="/admin/donations" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<DonationsList />} />} />
                    <Route path="/admin/news" element={<ProtectedRoute allowedRoles={LOCAL_ADMIN_ROLES} element={<NewsManager />} />} />
                    <Route path="/admin/events" element={<ProtectedRoute allowedRoles={LOCAL_ADMIN_ROLES} element={<EventsManager />} />} />
                    <Route path="/admin/contacts" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<ContactsList />} />} />
                    <Route path="/admin/newsletter" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<NewsletterManager />} />} />
                    <Route path="/admin/static-pages" element={<ProtectedRoute allowedRoles={CENTRAL_ADMIN_ROLES} element={<StaticPagesEditor />} />} />
                    <Route path="/admin/media" element={<ProtectedRoute allowedRoles={LOCAL_ADMIN_ROLES} element={<MediaManager />} />} />
                    <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={SUPER_ADMIN_ROLES} element={<AuditLogs />} />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
