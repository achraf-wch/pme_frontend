import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Privacy() {
    const [content, setContent] = useState('Loading...');
    useEffect(() => {
        API.get('/static-pages/privacy')
            .then(res => {
                setContent(res.data.content);
            })
            .catch(() => setContent('Privacy policy content will appear here. (Editable by admin)'));
    }, []);
    return <div><h2>Privacy Policy</h2><div>{content}</div></div>;
}
