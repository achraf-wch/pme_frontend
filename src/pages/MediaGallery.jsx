import { useEffect, useState } from 'react';
import API from '../services/api';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8000${url}`;
};

export default function MediaGallery() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        API.get('/media')
            .then(res => setMedia(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    if (loading) return <p>Loading images...</p>;
    return (
        <div>
            <h2>Media Gallery</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {media.length === 0 && <p>No media uploaded yet.</p>}
                {media.map(item => (
                    <div key={item.id} style={{ width: '200px', border: '1px solid #ccc', padding: '0.5rem', borderRadius: '8px' }}>
                        {item.file_type.startsWith('image/') ? (
                            <img src={getImageUrl(item.file_url)} alt={item.file_name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        ) : (
                            <p>File: {item.file_name}</p>
                        )}
                        <p style={{ fontSize: '12px', marginTop: '0.5rem' }}>{item.file_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}