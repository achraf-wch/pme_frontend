import { Link } from 'react-router-dom';

export default function VisitorDashboard({ user }) {
    return (
        <div>
            <h2>Welcome, {user.name}</h2>
            <p>You are currently a visitor. To become a full member and participate in voting, please apply for membership.</p>
            <Link to="/membership-request">
                <button>Apply for Membership</button>
            </Link>
        </div>
    );
}