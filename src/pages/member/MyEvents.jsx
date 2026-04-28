import { useEffect, useState } from 'react';
import { getMyEvents, getEvents, registerForEvent } from '../../services/api';

export default function MyEvents() {
    const [myEvents, setMyEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [message, setMessage] = useState('');
    useEffect(() => {
        getMyEvents().then(res => setMyEvents(res.data));
        getEvents().then(res => setAllEvents(res.data));
    }, []);
    const handleRegister = async (eventId) => {
        try {
            await registerForEvent(eventId);
            setMessage('Registered successfully');
            getMyEvents().then(res => setMyEvents(res.data));
        } catch (err) { setMessage('Error registering'); }
    };
    const upcomingEvents = allEvents.filter(e => new Date(e.start_time) > new Date());
    return (
        <div>
            <h3>My Registered Events</h3>
            {myEvents.length === 0 ? <p>No registrations yet</p> : myEvents.map(reg => (
                <div key={reg.id} style={{ border: '1px solid #ccc', margin: 5, padding: 5 }}>
                    <strong>{reg.event.title}</strong> - {new Date(reg.event.start_time).toLocaleString()} at {reg.event.location}
                </div>
            ))}
            <h3>Upcoming Events (Register)</h3>
            {upcomingEvents.map(ev => (
                <div key={ev.id} style={{ border: '1px solid #ccc', margin: 5, padding: 5 }}>
                    <strong>{ev.title}</strong> - {new Date(ev.start_time).toLocaleString()} - {ev.location}
                    <button onClick={() => handleRegister(ev.id)}>Register</button>
                </div>
            ))}
            {message && <p>{message}</p>}
        </div>
    );
}