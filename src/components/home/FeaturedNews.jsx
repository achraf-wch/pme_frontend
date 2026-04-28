import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
};

export default function FeaturedNews() {
    const [news, setNews] = useState([]);
    useEffect(() => {
        API.get('/news')
            .then(res => setNews(res.data.slice(0, 3)))
            .catch(err => console.error(err));
    }, []);

    const sectionStyle = { marginBottom: '2rem' };
    const cardStyle = { border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' };

    return (
        <div style={sectionStyle}>
            <h2>Latest News</h2>
            {news.length === 0 ? (
                <p>Loading news...</p>
            ) : (
                news.map(article => (
                    <div key={article.id} style={cardStyle}>
                        {article.image_path && (
                            <img 
                                src={getImageUrl(article.image_path)} 
                                alt={article.title}
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                            />
                        )}
                        <h3>{article.title}</h3>
                        <p>{article.content.substring(0, 120)}...</p>
                        <small>Published: {new Date(article.published_at).toLocaleDateString()}</small>
                    </div>
                ))
            )}
            <Link to="/news">View all news →</Link>
        </div>
    );
}