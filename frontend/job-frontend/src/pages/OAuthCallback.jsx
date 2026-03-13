import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setTokens } from '../api/api';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const { } = useAuth();  // ensure context is available
    const [status, setStatus] = useState('Signing you in...');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (!accessToken || !refreshToken) {
            toast.error('Google login failed');
            navigate('/login', { replace: true });
            return;
        }

        // Save tokens first
        setTokens(accessToken, refreshToken, null);
        setStatus('Fetching your profile...');

        // Fetch user profile so AuthContext picks it up
        api.get('/auth/me')
            .then(({ data }) => {
                const user = data.data;
                setTokens(accessToken, refreshToken, user);

                toast.success('🎉 Login Successful!', {
                    duration: 3000,
                    style: { background: '#10B981', color: '#fff', fontWeight: 600 },
                });

                // Force a page reload to re-initialize AuthContext with the new tokens
                window.location.href = '/jobs';
            })
            .catch(() => {
                toast.error('Failed to fetch profile');
                navigate('/login', { replace: true });
            });
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)', color: 'var(--text-primary)', gap: 16,
        }}>
            {/* Spinner */}
            <div style={{
                width: 40, height: 40, border: '3px solid var(--border-default)',
                borderTop: '3px solid var(--accent-primary)', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: '0.9rem' }}>{status}</p>
        </div>
    );
}
