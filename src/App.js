import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth & core
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
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

// ─────────────────────────────────────────
// Route Guard
// ─────────────────────────────────────────
function ProtectedRoute({ element, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) return <Navigate to="/login" replace />;

    // role can be object {id, name} or plain string — handle both
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

                {/* ─────────────────────────────────── */}
                {/* PUBLIC                              */}
                {/* ─────────────────────────────────── */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* ─────────────────────────────────── */}
                {/* ANY AUTHENTICATED USER              */}
                {/* ─────────────────────────────────── */}
                <Route path="/dashboard" element={
                    <ProtectedRoute element={<Dashboard />} />
                } />
                <Route path="/membership-request" element={
                    <ProtectedRoute element={<MembershipRequestForm />} />
                } />

                {/* ─────────────────────────────────── */}
                {/* SYMPATHIZER / VOLUNTEER             */}
                {/* ─────────────────────────────────── */}
                <Route path="/visitor/dashboard" element={
                    <ProtectedRoute
                        allowedRoles={['sympathizer', 'volunteer', 'admin']}
                        element={<SympathizerDashboard />}
                    />
                } />

                {/* ─────────────────────────────────── */}
                {/* MEMBER                              */}
                {/* ─────────────────────────────────── */}
                <Route path="/member/dashboard" element={
                    <ProtectedRoute
                        allowedRoles={['member', 'admin']}
                        element={<MemberDashboard />}
                    />
                } />
                <Route path="/member/active-polls" element={
                    <ProtectedRoute
                        allowedRoles={['member', 'admin']}
                        element={<ActivePolls />}
                    />
                } />
                <Route path="/member/my-donations" element={
                    <ProtectedRoute
                        allowedRoles={['member', 'admin']}
                        element={<MyDonations />}
                    />
                } />
                <Route path="/member/my-events" element={
                    <ProtectedRoute
                        allowedRoles={['member', 'admin']}
                        element={<MyEvents />}
                    />
                } />
                <Route path="/member/profile" element={
                    <ProtectedRoute
                        allowedRoles={['member', 'admin']}
                        element={<ProfileEditor />}
                    />
                } />

                {/* ─────────────────────────────────── */}
                {/* ADMIN                               */}
                {/* ─────────────────────────────────── */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<AdminDashboard />}
                    />
                } />
                <Route path="/admin/stats" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<StatsPanel />}
                    />
                } />
                <Route path="/admin/members" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<MembersManager />}
                    />
                } />
                <Route path="/admin/sympathizers" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<SympathizersManager />}
                    />
                } />
                <Route path="/admin/volunteers" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<VolunteersManager />}
                    />
                } />
                <Route path="/admin/polls" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<AdminPollList />}
                    />
                } />
                <Route path="/admin/create-poll" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<CreatePoll />}
                    />
                } />
                <Route path="/admin/donations" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<DonationsList />}
                    />
                } />
                <Route path="/admin/news" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<NewsManager />}
                    />
                } />
                <Route path="/admin/events" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<EventsManager />}
                    />
                } />
                <Route path="/admin/contacts" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<ContactsList />}
                    />
                } />
                <Route path="/admin/newsletter" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<NewsletterManager />}
                    />
                } />
                <Route path="/admin/static-pages" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<StaticPagesEditor />}
                    />
                } />
                <Route path="/admin/media" element={
                    <ProtectedRoute
                        allowedRoles={['admin']}
                        element={<MediaManager />}
                    />
                } />

                {/* ─────────────────────────────────── */}
                {/* FALLBACK                            */}
                {/* ─────────────────────────────────── */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;