import { createContext, useContext, useState, useEffect } from 'react';
import api, { setTokens, clearTokens, getTokens, getStoredUser } from '../api/api';

const AuthContext = createContext();

/* ── Map backend user object → frontend shape ── */
function normaliseUser(u) {
    if (!u) return null;
    return {
        id: u._id || u.id,
        name: u.name,
        email: u.email,
        role: u.role === 'jobseeker' ? 'student' : u.role,   // backend "jobseeker" → frontend "student"
        skills: u.skills || [],
        resumeUrl: u.resumeUrl || '',
        photoUrl: u.photoUrl || u.avatar || '',
        location: u.location || '',
        bio: u.bio || '',
        expectedSalary: u.expectedSalary || '',
        companyName: u.companyName || '',
        position: u.position || '',
        companyWebsite: u.companyWebsite || '',
        hiringFor: u.hiringFor || [],
        createdAt: u.createdAt,
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => normaliseUser(getStoredUser()));
    const [token, setToken] = useState(() => getTokens().accessToken || null);

    /* ── Keep localStorage in sync ── */
    useEffect(() => {
        if (user && token) {
            const { refreshToken } = getTokens();
            setTokens(token, refreshToken, user);
        }
    }, [user, token]);

    /* ── Handle Google OAuth callback ── */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const at = params.get('accessToken');
        const rt = params.get('refreshToken');
        if (at && rt) {
            setTokens(at, rt, null);
            setToken(at);
            // Fetch user profile
            api.get('/auth/me').then(({ data }) => {
                const u = normaliseUser(data.data);
                setUser(u);
                setTokens(at, rt, u);
                window.history.replaceState({}, '', window.location.pathname);
            });
        }
    }, []);

    /* ── Login ── */
    const login = async (email, password, role = 'student') => {
        const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/login';
        const { data } = await api.post(endpoint, { email, password });
        if (!data.success) throw new Error(data.message || 'Login failed');

        const u = normaliseUser(data.data);
        setTokens(data.accessToken, data.refreshToken, u);
        setUser(u);
        setToken(data.accessToken);
        return { user: u, token: data.accessToken };
    };

    /* ── Register ── */
    const register = async ({ name, email, password, role = 'student', skills = [] }) => {
        const backendRole = role === 'student' ? 'jobseeker' : role;
        const { data } = await api.post('/auth/register', { name, email, password, role: backendRole });
        if (!data.success) throw new Error(data.message || 'Registration failed');

        const u = normaliseUser(data.data);
        setTokens(data.accessToken, data.refreshToken, u);
        setUser(u);
        setToken(data.accessToken);

        // Save skills if provided
        if (skills.length > 0) {
            try { await api.put('/users/profile', { skills }); } catch { /* ok */ }
        }
        return { user: u, token: data.accessToken };
    };

    /* ── Google OAuth ── */
    const loginWithGoogle = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    /* ── Logout ── */
    const logout = async () => {
        try { await api.post('/auth/logout'); } catch { /* ok */ }
        setUser(null);
        setToken(null);
        clearTokens();
    };

    /* ── Update profile ── */
    const updateProfile = async (updates) => {
        const { data } = await api.put('/users/profile', updates);
        if (data.success) {
            const u = normaliseUser(data.data);
            setUser(u);
        }
        return data;
    };

    return (
        <AuthContext.Provider value={{
            user, token, login, register, logout, loginWithGoogle,
            updateProfile, isAuthenticated: !!token,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
