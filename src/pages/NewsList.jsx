import { useEffect, useState } from 'react';
import API from '../services/api';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
};

export default function NewsList() {
    const [news, setNews] = useState([]);
    useEffect(() => {
        API.get('/news')
            .then(res => setNews(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>All News</h2>
            {news.length === 0 && <p>No news found.</p>}
            {news.map(article => (
                <div key={article.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '2rem', paddingBottom: '1rem' }}>
                    {article.image_path && (
                        <img 
                            src={getImageUrl(article.image_path)} 
                            alt={article.title}
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                        />
                    )}
                    <h3>{article.title}</h3>
                    <p>{article.content}</p>
                    <small>Published: {new Date(article.published_at).toLocaleDateString()}</small>
                </div>
            ))}
        </div>
    );
}