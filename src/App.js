import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import VisitorDashboard from './pages/VisitorDashboard';
import MembershipRequestForm from './pages/MembershipRequestForm';
import CreatePoll from './pages/admin/CreatePoll';
import AdminPollList from './pages/admin/AdminPollList';

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;