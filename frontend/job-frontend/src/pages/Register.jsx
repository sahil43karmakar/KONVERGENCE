import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') === 'admin' ? 'admin' : 'student';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const isRecruiter = role === 'admin';
    const roleParam = `?role=${role}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) return toast.error('Fill in all required fields');
        if (password.length < 6) return toast.error('Password must be at least 6 characters');

        setLoading(true);
        try {
            await register({ name, email, password, role, skills: [] });
            toast.success('Account created!');
            navigate(isRecruiter ? '/admin' : '/jobs');
        } catch {
            toast.error('Registration failed');
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
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>skill</span>
                    <span style={{ color: 'var(--text-primary)' }}>Sync</span>
                </h1>
                <p style={{
                    fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8,
                }}>
                    Opportunity Intelligence
                </p>
            </div>

            {/* Card */}
            <div style={{
                width: '100%', maxWidth: 420, padding: '36px 32px',
                background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>
                    Create Account
                </h2>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 28 }}>
                    {isRecruiter ? 'Start building your talent pipeline' : 'Start your journey to success'}
                </p>

                {/* Google Button */}
                <button style={{
                    width: '100%', padding: '13px', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 10, fontFamily: 'var(--font-sans)',
                    transition: 'all 150ms',
                }}>
                    <svg width={18} height={18} viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0',
                }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                    <span style={{
                        fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
                    }}>Or University Email</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <AuthField label="Full Name" type="text" value={name} onChange={setName} placeholder="John Doe" />
                    <AuthField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="name@university.edu" />
                    <AuthField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

                    <button type="submit" disabled={loading} className="btn-primary" style={{
                        width: '100%', justifyContent: 'center', padding: '14px',
                        fontSize: '0.95rem', fontWeight: 700, borderRadius: 'var(--radius-md)',
                        marginTop: 4, opacity: loading ? 0.7 : 1,
                    }}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 24 }}>
                    Already have an account?{' '}
                    <Link to={`/login${roleParam}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 700 }}>
                        Sign In
                    </Link>
                </p>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 48, textAlign: 'center' }}>
                <p style={{
                    fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8,
                }}>
                    Data Driven Success
                </p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    2024 SkillSync - Intelligent Hub for Higher Ed
                </p>
            </div>
        </div>
    );
}

const labelStyle = {
    fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: 8, display: 'block',
};

const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
    color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none',
    fontFamily: 'var(--font-sans)', transition: 'border-color 150ms',
};

function AuthField({ label, type, value, onChange, placeholder }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder} style={inputStyle}
            />
        </div>
    );
}
