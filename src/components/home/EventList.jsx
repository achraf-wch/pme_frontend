import { useEffect, useState } from 'react';
import API from '../services/api';

// Helper to get full image URL
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
};

export default function EventList() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        API.get('/events')
            .then(res => setEvents(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>All Events</h2>
            {events.length === 0 && <p>No events found.</p>}
            {events.map(ev => (
                <div key={ev.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '2rem', paddingBottom: '1rem' }}>
                    {ev.attachment_path && (
                        <img 
                            src={getImageUrl(ev.attachment_path)} 
                            alt={ev.title}
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                        />
                    )}
                    <h3>{ev.title}</h3>
                    <p><strong>When:</strong> {new Date(ev.start_time).toLocaleString()} - {new Date(ev.end_time).toLocaleString()}</p>
                    <p><strong>Where:</strong> {ev.location}</p>
                    <p>{ev.description}</p>
                    {ev.max_attendees && <p><strong>Max attendees:</strong> {ev.max_attendees}</p>}
                </div>
            ))}
        </div>
    );
}