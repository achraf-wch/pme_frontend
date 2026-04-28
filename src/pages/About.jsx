import { useEffect, useState } from 'react';
import API from '../services/api';

export default function About() {
    const [content, setContent] = useState('Loading...');
    useEffect(() => {
        API.get('/static-pages')
            .then(res => {
                const about = res.data.find(page => page.slug === 'about');
                if (about) setContent(about.content);
                else setContent('About page content will appear here. (Editable by admin)');
            })
            .catch(() => setContent('About page content will appear here. (Editable by admin)'));
    }, []);
    return <div><h2>About Us</h2><div>{content}</div></div>;
}