import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
};

export default function UpcomingEvents() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        API.get('/events')
            .then(res => {
                const upcoming = res.data.filter(ev => new Date(ev.end_time) > new Date());
                setEvents(upcoming.slice(0, 3));
            })
            .catch(err => console.error(err));
    }, []);

    const cardStyle = { border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' };
    return (
        <div style={{ marginBottom: '2rem' }}>
            <h2>Upcoming Events</h2>
            {events.length === 0 ? (
                <p>No upcoming events at the moment.</p>
            ) : (
                events.map(ev => (
                    <div key={ev.id} style={cardStyle}>
                        {ev.attachment_path && (
                            <img 
                                src={getImageUrl(ev.attachment_path)} 
                                alt={ev.title}
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                            />
                        )}
                        <h3>{ev.title}</h3>
                        <p><strong>When:</strong> {new Date(ev.start_time).toLocaleString()}</p>
                        <p><strong>Where:</strong> {ev.location}</p>
                        <p>{ev.description?.substring(0, 100)}...</p>
                    </div>
                ))
            )}
            <Link to="/events">Browse all events →</Link>
        </div>
    );
}