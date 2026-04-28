import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor to attach token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Authentication functions
export const register = (name, email, password, passwordConfirmation) => 
    API.post('/register', { name, email, password, password_confirmation: passwordConfirmation });

export const login = (email, password) => 
    API.post('/login', { email, password });

export const logout = () => 
    API.post('/logout');

export const getMe = () => 
    API.get('/me');

// Membership request
export const submitMembershipRequest = (motivation) => 
    API.post('/membership-request', { motivation });

// Admin endpoints
export const getPendingRequests = () => 
    API.get('/admin/membership-requests');

export const approveRequest = (id) => 
    API.put(`/admin/membership-requests/${id}/approve`);

export const rejectRequest = (id) => 
    API.put(`/admin/membership-requests/${id}/reject`);

// Polls
export const getPolls = () => API.get('/polls');
export const createPoll = (pollData) => API.post('/polls', pollData);
export const getActivePolls = () => API.get('/polls/active');
export const submitVote = (pollId, optionId) => API.post('/vote', { poll_id: pollId, option_id: optionId });
export const getPollResults = (pollId) => API.get(`/polls/${pollId}/results`);

// Donations
export const getDonations = () => API.get('/donations');
export const updateDonationStatus = (id, status) => API.put(`/donations/${id}`, { status });

// ===== News =====
export const getNews = () => API.get('/news');

export const createNews = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined) formData.append(key, val);
    });
    return API.post('/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const updateNews = (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined) formData.append(key, val);
    });
    formData.append('_method', 'PUT');
    return API.post(`/news/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const deleteNews = (id) => API.delete(`/news/${id}`);

// ===== Contacts =====
export const getContacts = () => API.get('/contacts');
export const deleteContact = (id) => API.delete(`/contacts/${id}`);

// ===== Events =====
export const getEvents = () => API.get('/events');

export const createEvent = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined) formData.append(key, val);
    });
    return API.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const updateEvent = (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined) formData.append(key, val);
    });
    formData.append('_method', 'PUT');
    return API.post(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const getEventRegistrations = (id) => API.get(`/events/${id}/registrations`);

// ===== Static Pages =====
export const getStaticPages = () => API.get('/static-pages');
export const updateStaticPage = (slug, data) => API.put(`/static-pages/${slug}`, data);

// ===== Media =====
export const getMedia = () => API.get('/media');
export const uploadMedia = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteMedia = (id) => API.delete(`/media/${id}`);

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);

// Member-specific
export const getMyDonations = () => API.get('/my-donations');
export const getMyEvents = () => API.get('/my-events');
export const registerForEvent = (eventId) => API.post(`/events/${eventId}/register`);

export default API;