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
export const getPolls = () => API.get('/polls');
export const createPoll = (pollData) => API.post('/polls', pollData);
export const getActivePolls = () => API.get('/polls/active');
export const submitVote = (pollId, optionId) => API.post('/vote', { poll_id: pollId, option_id: optionId });
export const getPollResults = (pollId) => API.get(`/polls/${pollId}/results`);
export default API;
