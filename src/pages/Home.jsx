import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Home() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await api.get('/news'); // we will create this endpoint later
                setNews(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNews();
    }, []);

    return (
        <div>
            <h1>Welcome to the Political Party Platform</h1>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            <h2>Latest News</h2>
            {news.map(article => (
                <div key={article.id}>
                    <h3>{article.title}</h3>
                    <p>{article.content.substring(0, 100)}...</p>
                </div>
            ))}
        </div>
    );
}