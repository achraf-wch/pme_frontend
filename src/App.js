import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ADMIN_ROLES, ALL_ROLES, CENTRAL_ADMIN_ROLES, LOCAL_ADMIN_ROLES, MEMBER_ROLES, SUPER_ADMIN_ROLES } from './utils/roles';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const GoogleAuthCallback = lazy(() => import('./pages/GoogleAuthCallback'));
const NewsList = lazy(() => import('./pages/NewsList'));
const EventList = lazy(() => import('./pages/EventList'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const PublicDonation = lazy(() => import('./pages/PublicDonation'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const MediaGallery = lazy(() => import('./pages/MediaGallery'));
const Program = lazy(() => import('./pages/Program'));
const Faq = lazy(() => import('./pages/Faq'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const Search = lazy(() => import('./pages/Search'));


// Auth & core
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MembershipRequestForm = lazy(() => import('./pages/MembershipRequestForm'));

// Dashboards
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const SympathizerDashboard = lazy(() => import('./pages/SympathizerDashboard'));

// Admin pages
const CreatePoll = lazy(() => import('./pages/admin/CreatePoll'));
const AdminPollList = lazy(() => import('./pages/admin/AdminPollList'));
const ContactsList = lazy(() => import('./pages/admin/ContactsList'));
const StaticPagesEditor = lazy(() => import('./pages/admin/StaticPagesEditor'));
const DonationsList = lazy(() => import('./pages/admin/DonationsList'));
const NewsManager = lazy(() => import('./pages/admin/NewsManager'));
const EventsManager = lazy(() => import('./pages/admin/EventsManager'));
const MediaManager = lazy(() => import('./pages/admin/MediaManager'));
const MembersManager = lazy(() => import('./pages/admin/UserManager'));
const SympathizersManager = lazy(() => import('./pages/admin/SympathizersManager'));
const VolunteersManager = lazy(() => import('./pages/admin/VolunteersManager'));
const NewsletterManager = lazy(() => import('./pages/admin/NewsletterManager'));
const StatsPanel = lazy(() => import('./pages/admin/StatsPanel'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const ReportsManager = lazy(() => import('./pages/admin/ReportsManager'));

// Member pages
const ActivePolls = lazy(() => import('./pages/member/ActivePolls'));
const MyDonations = lazy(() => import('./pages/member/MyDonations'));
const MyEvents = lazy(() => import('./pages/member/MyEvents'));
const ProfileEditor = lazy(() => import('./pages/member/ProfileEditor'));

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

function PageLoader() {
    return (
        <div className="min-h-[55vh] flex items-center justify-center bg-white px-4">
            <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />
                <p className="text-sm font-bold text-slate-500">Chargement...</p>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
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
                        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
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
                    <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={ADMIN_ROLES} element={<ReportsManager />} />} />
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
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
