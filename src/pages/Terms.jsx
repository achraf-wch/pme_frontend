import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Terms() {
    const [content, setContent] = useState('Loading...');
    useEffect(() => {
        API.get('/static-pages')
            .then(res => {
                const page = res.data.find(p => p.slug === 'terms');
                if (page) setContent(page.content);
                else setContent('Terms of service content will appear here. (Editable by admin)');
            })
            .catch(() => setContent('Terms of service content will appear here. (Editable by admin)'));
    }, []);
    return <div><h2>Terms of Service</h2><div>{content}</div></div>;
}