import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'skillsync-auth';

const defaultStudentUser = {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@university.edu',
    role: 'student',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'CSS', 'Git'],
    resumeUrl: '',
    createdAt: '2025-09-01'
};

const defaultAdminUser = {
    id: 'admin1',
    name: 'Admin',
    email: 'admin@skillsync.com',
    role: 'admin',
    skills: [],
    resumeUrl: '',
    createdAt: '2025-01-01'
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored).user : null;
    });

    const [token, setToken] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored).token : null;
    });

    useEffect(() => {
        if (user && token) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user, token]);

    const login = (email, password, role = 'student') => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = role === 'admin' ? defaultAdminUser : { ...defaultStudentUser, email };
                const mockToken = 'mock-jwt-token-' + Date.now();
                setUser(mockUser);
                setToken(mockToken);
                resolve({ user: mockUser, token: mockToken });
            }, 500);
        });
    };

    const register = (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: 'u' + Date.now(),
                    name: data.name,
                    email: data.email,
                    role: 'student',
                    skills: data.skills || [],
                    resumeUrl: '',
                    createdAt: new Date().toISOString()
                };
                const mockToken = 'mock-jwt-token-' + Date.now();
                setUser(newUser);
                setToken(mockToken);
                resolve({ user: newUser, token: mockToken });
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const updateProfile = (updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
