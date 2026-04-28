import { useEffect, useState } from 'react';
import { getMyEvents, getEvents, registerForEvent } from '../../services/api';

export default function MyEvents() {
    const [myEvents, setMyEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        const [myRes, allRes] = await Promise.all([getMyEvents(), getEvents()]);
        setMyEvents(myRes.data);
        setAllEvents(allRes.data);
    };
    
    const handleRegister = async (eventId) => {
        try {
            await registerForEvent(eventId);
            setMessage('Registered successfully');
            fetchData(); // refresh lists
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error registering');
        }
    };
    
    return (
        <div>
            <h3>My Registered Events</h3>
            {myEvents.length === 0 ? (
                <p>No registrations yet</p>
            ) : (
                myEvents.map(reg => (
                    <div key={reg.id} style={{ border: '1px solid #ccc', margin: 5, padding: 5 }}>
                        <strong>{reg.event.title}</strong> - {new Date(reg.event.start_time).toLocaleString()} at {reg.event.location}
                    </div>
                ))
            )}
            
            <h3>All Events</h3>
            {allEvents.length === 0 ? (
                <p>No events found</p>
            ) : (
                allEvents.map(ev => (
                    <div key={ev.id} style={{ border: '1px solid #ccc', margin: 5, padding: 5 }}>
                        <strong>{ev.title}</strong> - {new Date(ev.start_time).toLocaleString()} - {ev.location}
                        <button onClick={() => handleRegister(ev.id)}>Register</button>
                    </div>
                ))
            )}
            {message && <p>{message}</p>}
        </div>
    );
}