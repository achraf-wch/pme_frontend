import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const ASSET_BASE_URL = process.env.REACT_APP_ASSET_URL || API_BASE_URL.replace(/\/api\/?$/, '');

const API = axios.create({
    baseURL: API_BASE_URL,
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

export const getStorageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;
    return `${ASSET_BASE_URL}/storage/${path}`;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a FormData object from a plain data object.
 * Arrays are appended with the `key[]` notation that Laravel expects.
 */
function toFormData(data) {
    const fd = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val === null || val === undefined) return;
        if (Array.isArray(val)) {
            val.forEach((item) => fd.append(`${key}[]`, item));
        } else {
            fd.append(key, val);
        }
    });
    return fd;
}

// ── Authentication ────────────────────────────────────────────────────────────

export const register = (name, email, password, passwordConfirmation) =>
    API.post('/register', { name, email, password, password_confirmation: passwordConfirmation });

export const login = (email, password) =>
    API.post('/login', { email, password });

export const loginWithGoogleCode = (code) =>
    API.post('/auth/google/callback', { code });

export const logout = () =>
    API.post('/logout');

export const getMe = () =>
    API.get('/me');

// ── Notifications ────────────────────────────────────────────────────────────

export const getNotifications = () => API.get('/notifications');
export const getNotificationSummary = () => API.get('/notifications/summary');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');

// ── Membership request ────────────────────────────────────────────────────────

export const submitMembershipRequest = (data) =>
    API.post('/membership-request', data);
export const getMembershipRequest = () => API.get('/membership-request');
export const getMySympathizerRequest = () => API.get('/my-sympathizer-request');
export const getMyVolunteerRequest = () => API.get('/my-volunteer-request');

// ── Admin endpoints ───────────────────────────────────────────────────────────

export const getPendingRequests = () => API.get('/admin/membership-requests');
export const approveRequest = (id) => API.put(`/admin/membership-requests/${id}/approve`);
export const rejectRequest  = (id) => API.put(`/admin/membership-requests/${id}/reject`);

// ── Polls ─────────────────────────────────────────────────────────────────────

export const getPolls       = ()               => API.get('/polls');
export const createPoll     = (pollData)       => API.post('/polls', pollData);
export const getActivePolls = ()               => API.get('/polls/active');
export const getPublicPolls = ()               => API.get('/polls/feed');
export const submitVote     = (pollId, optionId) => API.post('/vote', { poll_id: pollId, option_id: optionId });
export const getPollResults = (pollId)         => API.get(`/polls/${pollId}/results`);

// ── Donations ─────────────────────────────────────────────────────────────────

export const getDonations          = ()           => API.get('/donations');
export const updateDonationStatus  = (id, status) => API.put(`/donations/${id}`, { status });

// ── News ──────────────────────────────────────────────────────────────────────

export const getNews       = () => API.get('/admin/news');
export const getPublicNews = () => API.get('/news/feed');
export const getMyNews = () => API.get('/my-news');
export const getNewsItem = (id) => API.get(localStorage.getItem('token') ? `/my-news/${id}` : `/news/${id}`);

export const createNews = (data) =>
    API.post('/news', toFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updateNews = (id, data) => {
    const fd = toFormData(data);
    fd.append('_method', 'PUT');
    return API.post(`/news/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteNews = (id) => API.delete(`/news/${id}`);

// ── Contacts ──────────────────────────────────────────────────────────────────

export const getContacts    = ()   => API.get('/contacts');
export const deleteContact  = (id) => API.delete(`/contacts/${id}`);

// ── Events ────────────────────────────────────────────────────────────────────

export const getEvents             = ()        => API.get('/admin/events');
export const getPublicEvents       = ()        => API.get('/events/feed');
export const getPublicEvent        = (id)      => API.get(`/events/${id}`);
export const getMyEvents           = ()        => API.get('/my-events');
export const getEventRegistrations = (id)      => API.get(`/events/${id}/registrations`);
export const registerForEvent      = (eventId) => API.post(`/events/${eventId}/register`);
export const deleteEvent           = (id)      => API.delete(`/events/${id}`);

export const createEvent = (data) =>
    API.post('/events', toFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updateEvent = (id, data) => {
    const fd = toFormData(data);
    fd.append('_method', 'PUT');
    return API.post(`/events/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// ── Static Pages ──────────────────────────────────────────────────────────────

export const getStaticPages  = ()           => API.get('/static-pages');
export const updateStaticPage = (slug, data) => {
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        return API.post(`/static-pages/${slug}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    return API.put(`/static-pages/${slug}`, data);
};
export const searchContent = (query) => API.get('/search', { params: { q: query } });

// ── Media ─────────────────────────────────────────────────────────────────────

export const getMedia    = (params = {}) => API.get('/media', { params });
export const deleteMedia = (id)   => API.delete(`/media/${id}`);

export const uploadMedia = (file, audience = ['public'], partyBranchId = null) => {
    const fd = new FormData();
    fd.append('file', file);
    audience.forEach(role => fd.append('audience[]', role));
    if (partyBranchId) fd.append('party_branch_id', partyBranchId);
    return API.post('/media', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const createEventRecap = (eventId, data) =>
    API.post(`/events/${eventId}/recaps`, toFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

// ── Profile ───────────────────────────────────────────────────────────────────

export const getProfile    = ()     => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);

// ── Member-specific ───────────────────────────────────────────────────────────

export const getMyDonations = () => API.get('/my-donations');

// ── Members (admin) ───────────────────────────────────────────────────────────

export const getMembers    = ()           => API.get('/admin/members');
export const updateMember  = (id, data)   => API.put(`/admin/members/${id}`, data);
export const deleteMember  = (id)         => API.delete(`/admin/members/${id}`);

// ── Sympathizers ──────────────────────────────────────────────────────────────

export const submitSympathizerRequest = (data) => API.post('/sympathizer-request', data);
export const getSympathizers          = ()      => API.get('/admin/sympathizers');
export const updateSympathizerStatus  = (id, status) => API.put(`/admin/sympathizers/${id}/status`, { status });
export const deleteSympathizer        = (id)    => API.delete(`/admin/sympathizers/${id}`);

// ── Volunteers ────────────────────────────────────────────────────────────────

export const submitVolunteerRequest = (data) => API.post('/volunteer-request', data);
export const getVolunteers          = ()      => API.get('/admin/volunteers');
export const updateVolunteerStatus  = (id, status) => API.put(`/admin/volunteers/${id}/status`, { status });
export const deleteVolunteer        = (id)    => API.delete(`/admin/volunteers/${id}`);

// ── Newsletter ────────────────────────────────────────────────────────────────

export const subscribeNewsletter        = (email) => API.post('/newsletter/subscribe', { email });
export const getNewsletterSubscribers   = ()       => API.get('/admin/newsletter');
export const deleteNewsletterSubscriber = (id)     => API.delete(`/admin/newsletter/${id}`);
export const sendNewsletter             = (data)   => API.post('/admin/newsletter/send', data);

// ── Stats ─────────────────────────────────────────────────────────────────────

export const getStats = () => API.get('/admin/stats');
export const getBranches = () => API.get('/branches');
export const getAuditLogs = (params = {}) => API.get('/admin/audit-logs', { params });

// ── Reports ──────────────────────────────────────────────────────────────────

export const getSentReports = () => API.get('/admin/reports/sent');
export const getReceivedReports = () => API.get('/admin/reports/received');
export const createReport = (data) => API.post('/admin/reports', data);
export const sendReport = (id) => API.put(`/admin/reports/${id}/send`);
export const downloadReport = (id) => API.get(`/admin/reports/${id}/download`, { responseType: 'blob' });

export default API;
