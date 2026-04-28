// src/pages/admin/MediaManager.jsx
import { useEffect, useState } from 'react';
import { getMedia, uploadMedia, deleteMedia } from '../../services/api';

export default function MediaManager() {
    const [media, setMedia] = useState([]);
    const [file, setFile] = useState(null);
    useEffect(() => { fetchMedia(); }, []);
    const fetchMedia = async () => { const res = await getMedia(); setMedia(res.data); };
    const handleUpload = async () => {
        if (!file) return;
        await uploadMedia(file);
        setFile(null);
        fetchMedia();
    };
    const handleDelete = async (id) => { await deleteMedia(id); fetchMedia(); };
    return (
        <div>
            <h3>Media Library</h3>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
                {media.map(m => (
                    <div key={m.id} style={{ margin: 10, border: '1px solid #ccc', padding: 5, width: 150 }}>
                        {m.file_type.startsWith('image/') && <img src={m.file_url} alt={m.file_name} style={{ width: '100%' }} />}
                        <p style={{ fontSize: 12 }}>{m.file_name}</p>
                        <button onClick={() => handleDelete(m.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}