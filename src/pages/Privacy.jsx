import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Privacy() {
    const [content, setContent] = useState('Loading...');
    useEffect(() => {
        API.get('/static-pages')
            .then(res => {
                const page = res.data.find(p => p.slug === 'privacy');
                if (page) setContent(page.content);
                else setContent('Privacy policy content will appear here. (Editable by admin)');
            })
            .catch(() => setContent('Privacy policy content will appear here. (Editable by admin)'));
    }, []);
    return <div><h2>Privacy Policy</h2><div>{content}</div></div>;
}