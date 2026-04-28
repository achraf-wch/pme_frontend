import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function StatsPanel() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/admin/stats')
            .then(res => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading stats...</p>;
    if (!stats)  return <p>Failed to load stats.</p>;

    return (
        <div>
            <h3>Statistics</h3>

            <h4>Users</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Total users</td><td>{stats.users.total}</td></tr>
                    <tr><td>Members</td><td>{stats.users.members}</td></tr>
                    <tr><td>Sympathizers</td><td>{stats.users.sympathizers}</td></tr>
                    <tr><td>Volunteers</td><td>{stats.users.volunteers}</td></tr>
                    <tr><td>Admins</td><td>{stats.users.admins}</td></tr>
                </tbody>
            </table>

            <h4>Membership Requests</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Pending</td><td>{stats.membership_requests.pending}</td></tr>
                    <tr><td>Approved</td><td>{stats.membership_requests.approved}</td></tr>
                    <tr><td>Rejected</td><td>{stats.membership_requests.rejected}</td></tr>
                </tbody>
            </table>

            <h4>Donations</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Total donations</td><td>{stats.donations.total}</td></tr>
                    <tr><td>Confirmed amount</td><td>{stats.donations.amount}</td></tr>
                </tbody>
            </table>

            <h4>Events</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Total events</td><td>{stats.events.total}</td></tr>
                    <tr><td>Registrations</td><td>{stats.events.registrations}</td></tr>
                </tbody>
            </table>

            <h4>News</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Total</td><td>{stats.news.total}</td></tr>
                    <tr><td>Published</td><td>{stats.news.published}</td></tr>
                </tbody>
            </table>

            <h4>Polls</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Total polls</td><td>{stats.polls.total}</td></tr>
                    <tr><td>Total votes</td><td>{stats.polls.votes}</td></tr>
                </tbody>
            </table>

            <h4>Newsletter</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Subscribers</td><td>{stats.newsletter.subscribers}</td></tr>
                </tbody>
            </table>

            <h4>Sympathizers & Volunteers</h4>
            <table border="1" cellPadding="6">
                <tbody>
                    <tr><td>Sympathizers</td><td>{stats.sympathizers.total}</td></tr>
                    <tr><td>Volunteers</td><td>{stats.volunteers.total}</td></tr>
                </tbody>
            </table>
        </div>
    );
}