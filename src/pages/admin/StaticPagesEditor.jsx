// src/pages/admin/StaticPagesEditor.jsx
import { useEffect, useState } from 'react';
import { getStaticPages, updateStaticPage } from '../../services/api';

export default function StaticPagesEditor() {
    const [pages, setPages] = useState([]);
    const [editContent, setEditContent] = useState({});
    useEffect(() => { getStaticPages().then(res => setPages(res.data)); }, []);
    const handleUpdate = async (slug) => {
        await updateStaticPage(slug, { content: editContent[slug] });
        alert('Page updated');
    };
    return (
        <div>
            <h3>Edit Static Pages</h3>
            {pages.map(page => (
                <div key={page.slug} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                    <h4>{page.title}</h4>
                    <textarea rows="6" style={{ width: '100%' }} value={editContent[page.slug] ?? page.content} onChange={e => setEditContent({...editContent, [page.slug]: e.target.value})} />
                    <button onClick={() => handleUpdate(page.slug)}>Save</button>
                </div>
            ))}
        </div>
    );
}