import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import VisitorDashboard from './pages/.SympathizerDashboard';
import MembershipRequestForm from './pages/MembershipRequestForm';
import CreatePoll from './pages/admin/CreatePoll';
import AdminPollList from './pages/admin/AdminPollList';
import ContactsList from './pages/admin/ContactsList';
import StaticPagesEditor from './pages/admin/StaticPagesEditor';
import DonationsList from './pages/admin/DonationsList';
import NewsManager from './pages/admin/NewsManager';
import EventsManager from './pages/admin/EventsManager';
import MediaManager from './pages/admin/MediaManager';
import ActivePolls from './pages/member/ActivePolls';
import MyDonations from './pages/member/MyDonations';
import MyEvents from './pages/member/MyEvents';
import ProfileEditor from './pages/member/ProfileEditor';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/member/dashboard" element={<MemberDashboard />} />
                <Route path="/visitor/dashboard" element={<VisitorDashboard />} />
                <Route path="/membership-request" element={<MembershipRequestForm />} />
                <Route path="/admin/create-poll" element={<CreatePoll />} />
                <Route path="/admin/polls" element={<AdminPollList />} />
                <Route path="/admin/contacts" element={<ContactsList />} />
                <Route path="/admin/static-pages" element={<StaticPagesEditor />} />
                <Route path="/admin/donations" element={<DonationsList />} />
                <Route path="/admin/news" element={<NewsManager />} />
                <Route path="/admin/events" element={<EventsManager />} />
                <Route path="/admin/media" element={<MediaManager />} />
                <Route path="/member/active-polls" element={<ActivePolls />} />
                <Route path="/member/my-donations" element={<MyDonations />} />
                <Route path="/member/my-events" element={<MyEvents />} />
                <Route path="/member/profile" element={<ProfileEditor />} />    
            </Routes>
        </BrowserRouter>
    );
}

export default App;