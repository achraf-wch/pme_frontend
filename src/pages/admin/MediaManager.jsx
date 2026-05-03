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

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-6 rounded-[2rem]">
                <h3 className="text-xl font-black text-slate-800 uppercase">Médiathèque | المكتبة</h3>
                <div className="flex items-center gap-3">
                    <input type="file" onChange={e => setFile(e.target.files[0])} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                    <button onClick={handleUpload} className="px-6 py-2 bg-[#2c3e50] text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all">Upload</button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {media.map(m => (
                    <div key={m.id} className="group relative aspect-square bg-slate-100 rounded-[1.5rem] overflow-hidden border border-slate-200">
                        {m.file_type.startsWith('image/') ? (
                            <img src={m.file_url} alt={m.file_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">📄</div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                            <p className="text-white text-[10px] font-bold truncate w-full text-center mb-4">{m.file_name}</p>
                            <button onClick={() => deleteMedia(m.id)} className="px-4 py-1.5 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-red-600 transition-colors">Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}