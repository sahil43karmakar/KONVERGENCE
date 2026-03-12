import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../api/api';
import toast from 'react-hot-toast';

export default function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            setTokens(accessToken, refreshToken, null);
            toast.success('🎉 Login Successful!', {
                duration: 3000,
                style: { background: '#10B981', color: '#fff', fontWeight: 600 },
            });
            // Navigate to jobs — AuthContext will pick up tokens and fetch user
            navigate('/jobs', { replace: true });
        } else {
            toast.error('Google login failed');
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)', color: 'var(--text-primary)',
        }}>
            <p>Signing you in...</p>
        </div>
    );
}
