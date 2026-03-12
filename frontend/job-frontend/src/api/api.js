/* ── Axios instance with JWT interceptors ──────────────────────────── */

import axios from 'axios';

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000/api' : '/api';
const STORAGE_KEY = 'skillsync-auth';

const api = axios.create({ baseURL: API_BASE });

/* ── Token helpers ── */

export function getTokens() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
}

export function setTokens(accessToken, refreshToken, user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, user }));
}

export function clearTokens() {
    localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken() {
    return getTokens().accessToken || null;
}

export function getStoredUser() {
    return getTokens().user || null;
}

/* ── Request interceptor: attach JWT ── */

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/* ── Response interceptor: auto‐refresh on 401 ── */

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
}

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalReq = error.config;

        if (error.response?.status === 401 && !originalReq._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalReq.headers.Authorization = `Bearer ${token}`;
                    return api(originalReq);
                });
            }

            originalReq._retry = true;
            isRefreshing = true;

            try {
                const { refreshToken, user } = getTokens();
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
                setTokens(data.accessToken, data.refreshToken, user);

                processQueue(null, data.accessToken);
                originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalReq);
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
