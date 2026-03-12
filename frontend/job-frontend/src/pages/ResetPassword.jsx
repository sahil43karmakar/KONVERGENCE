import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) return toast.error('Fill in all fields');
        if (password.length < 6) return toast.error('Password must be at least 6 characters');
        if (password !== confirmPassword) return toast.error('Passwords do not match');

        setLoading(true);
        try {
            const { data } = await api.post('/auth/reset-password', { token, password });
            toast.success(data.message || 'Password reset successfully!');
            navigate('/login');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)', padding: '40px 24px',
        }}>
            {/* Logo Section */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{
                    width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
                    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(59,130,246,0.2)',
                }}>
                    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
                        <path d="M4 12c0-4 3.5-7 8-7s8 3 8 7-3.5 7-8 7-8-3-8-7z" />
                        <path d="M8 12c0 2.5 1.8 4.5 4 4.5s4-2 4-4.5-1.8-4.5-4-4.5-4 2-4 4.5z" />
                    </svg>
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
                    <span style={{ color: 'var(--accent-primary)' }}>skill</span>
                    <span style={{ color: 'var(--text-primary)' }}>Sync</span>
                </h1>
            </div>

            {/* Card */}
            <div style={{
                width: '100%', maxWidth: 420, padding: '36px 32px',
                background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>
                    Set New Password
                </h2>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 28 }}>
                    Please enter your new password below.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={labelStyle}>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{
                        width: '100%', justifyContent: 'center', padding: '14px',
                        fontSize: '0.95rem', fontWeight: 700, borderRadius: 'var(--radius-md)',
                        marginTop: 4, opacity: loading ? 0.7 : 1,
                    }}>
                        {loading ? 'Saving...' : 'Reset Password'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 24 }}>
                    <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 700 }}>
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

const labelStyle = {
    fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, display: 'block'
};

const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
    color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none',
    fontFamily: 'var(--font-sans)', transition: 'border-color 150ms',
};
