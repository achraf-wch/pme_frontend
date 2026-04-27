import { useState } from 'react';
import { createPoll } from '../../services/api';

export default function CreatePoll({ onPollCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [targetAudience, setTargetAudience] = useState(['member']);
    const [options, setOptions] = useState(['', '']);
    const [message, setMessage] = useState('');

    const addOption = () => setOptions([...options, '']);
    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };
    const removeOption = (index) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            description,
            start_date: startDate,
            end_date: endDate,
            target_audience: targetAudience,
            options: options.filter(opt => opt.trim() !== ''),
        };
        try {
            await createPoll(payload);
            setMessage('Poll created successfully');
            setTitle(''); setDescription(''); setStartDate(''); setEndDate('');
            setOptions(['', '']);
            if (onPollCreated) onPollCreated();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error creating poll');
        }
    };

    const roleOptions = ['visitor', 'sympathizer', 'member', 'admin', 'local_official', 'central_admin', 'super_admin'];

    return (
        <div>
            <h3>Create New Poll</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Poll Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <label>Start Date:</label>
                <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                <label>End Date:</label>
                <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required />

                <label>Who can vote?</label>
                <select multiple value={targetAudience} onChange={e => setTargetAudience([...e.target.selectedOptions].map(o => o.value))}>
                    {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <small>Hold Ctrl/Cmd to select multiple</small>

                <label>Options:</label>
                {options.map((opt, idx) => (
                    <div key={idx}>
                        <input type="text" value={opt} onChange={e => updateOption(idx, e.target.value)} required />
                        {options.length > 2 && <button type="button" onClick={() => removeOption(idx)}>Remove</button>}
                    </div>
                ))}
                <button type="button" onClick={addOption}>Add Option</button>
                <button type="submit">Create Poll</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}