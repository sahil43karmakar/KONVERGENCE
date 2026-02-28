import { useNavigate } from 'react-router-dom';
import { HiOutlineUserGroup, HiOutlineBuildingOffice2, HiChevronRight } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import ChatBot from '../components/ChatBot';

const reviews = [
    { name: 'Sarah J.', role: 'Computer Science Graduate', text: 'SkillSync helped me land my dream job in weeks! The AI-matching is incredibly accurate.', stars: 5 },
    { name: 'Rahul M.', role: 'Full Stack Developer', text: 'The skill gap analysis showed me exactly what to learn. Got placed at a top startup!', stars: 5 },
    { name: 'Priya K.', role: 'Data Science Intern', text: 'I love the opportunity tracker. Keeping track of applications has never been this easy.', stars: 4 },
    { name: 'Alex T.', role: 'UI/UX Designer', text: 'The personalized recommendations are spot on. Found roles I never would have discovered.', stars: 5 },
    { name: 'Neha S.', role: 'HR Manager, TechCorp', text: 'As a recruiter, the talent pipeline features save me hours every week. Highly recommend.', stars: 5 },
    { name: 'James L.', role: 'Backend Developer', text: 'The readiness score motivated me to upskill. Went from 40% to 85% match in a month!', stars: 5 },
];

export default function Landing() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div style={{ minHeight: '100vh', background: isDark ? '#000' : '#F8FAFC', overflow: 'hidden', position: 'relative' }}>


            <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes floatDown {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(12px); }
                    100% { transform: translateY(0px); }
                }
                .float-card { animation: floatUp 4s ease-in-out infinite; }
                .float-card:nth-child(2n) { animation: floatDown 5s ease-in-out infinite; }
                .float-card:nth-child(3n) { animation-duration: 6s; }
                .float-card:hover { animation-play-state: paused; transform: scale(1.03); }
                .path-card {
                    transition: all 200ms ease;
                    cursor: pointer;
                }
                .path-card:hover {
                    border-color: var(--accent-primary) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(59,130,246,0.12);
                }
                @keyframes chatBounce {
                    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
                    60% { transform: scale(1.15) rotate(0deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes pulseRing {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                .chatbot-fab { animation: chatBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both; }
                .chatbot-fab:hover { transform: scale(1.1) !important; }
                .pulse-ring {
                    position: absolute; inset: 0; border-radius: 50%;
                    background: rgba(59,130,246,0.3);
                    animation: pulseRing 2s ease-out infinite;
                }
                .theme-toggle {
                    transition: all 200ms ease;
                }
                .theme-toggle:hover {
                    transform: scale(1.1);
                    border-color: var(--accent-primary) !important;
                }
            `}</style>

            {/* ── THEME TOGGLE (top-right) ── */}
            <button onClick={toggleTheme} className="theme-toggle" style={{
                position: 'fixed', top: 24, right: 24, zIndex: 99999,
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-primary)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}>
                {isDark ? (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx={12} cy={12} r={5} />
                        <line x1={12} y1={1} x2={12} y2={3} /><line x1={12} y1={21} x2={12} y2={23} />
                        <line x1={4.22} y1={4.22} x2={5.64} y2={5.64} /><line x1={18.36} y1={18.36} x2={19.78} y2={19.78} />
                        <line x1={1} y1={12} x2={3} y2={12} /><line x1={21} y1={12} x2={23} y2={12} />
                        <line x1={4.22} y1={19.78} x2={5.64} y2={18.36} /><line x1={18.36} y1={5.64} x2={19.78} y2={4.22} />
                    </svg>
                ) : (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                )}
            </button>

            {/* ── HERO SECTION ── */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', padding: '80px 24px 60px',
            }}>
                {/* Logo */}
                <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 28, boxShadow: '0 0 40px rgba(59,130,246,0.25)',
                }}>
                    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
                        <path d="M4 12c0-4 3.5-7 8-7s8 3 8 7-3.5 7-8 7-8-3-8-7z" />
                        <path d="M8 12c0 2.5 1.8 4.5 4 4.5s4-2 4-4.5-1.8-4.5-4-4.5-4 2-4 4.5z" />
                    </svg>
                </div>

                <h1 style={{
                    fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em',
                    lineHeight: 1.1, maxWidth: 600,
                }}>
                    <span style={{ color: 'var(--accent-primary)' }}>skill</span>
                    <span style={{ color: 'var(--text-primary)' }}>Sync</span>
                </h1>
                <p style={{
                    color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6,
                    marginTop: 16, maxWidth: 440,
                }}>
                    The Opportunity Intelligence Platform for the next generation.
                </p>
            </div>

            {/* ── PATH SELECTION ── */}
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
                <div style={{
                    fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20,
                }}>
                    Select Your Path
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 64 }}>
                    {/* Career Seeker */}
                    <div className="path-card" onClick={() => navigate('/login?role=student')} style={{
                        display: 'flex', alignItems: 'center', gap: 20,
                        padding: '22px 28px',
                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-default)',
                    }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 14,
                            background: 'var(--accent-glow)', border: '1px solid var(--border-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent-primary)', flexShrink: 0,
                        }}>
                            <HiOutlineUserGroup size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Career Seeker</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Find tailored opportunities.</div>
                        </div>
                        <HiChevronRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </div>

                    {/* Recruiter */}
                    <div className="path-card" onClick={() => navigate('/login?role=admin')} style={{
                        display: 'flex', alignItems: 'center', gap: 20,
                        padding: '22px 28px',
                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-default)',
                    }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 14,
                            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--success)', flexShrink: 0,
                        }}>
                            <HiOutlineBuildingOffice2 size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Recruiter</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Manage talent pipelines.</div>
                        </div>
                        <HiChevronRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </div>
                </div>
            </div>

            {/* ── SUCCESS STORIES ── */}
            <div style={{ padding: '0 24px 80px' }}>
                <div style={{ maxWidth: 640, margin: '0 auto 40px' }}>
                    <div style={{
                        fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                        Success Stories
                    </div>
                </div>

                {/* Floating review cards — 3-column grid on desktop, stacked on mobile */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
                    maxWidth: 1000, margin: '0 auto',
                }}>
                    {reviews.map((review, i) => (
                        <div key={i} className="float-card" style={{
                            padding: '28px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                            animationDelay: `${i * 0.5}s`,
                            transition: 'transform 200ms ease',
                        }}>
                            {/* Stars */}
                            <div style={{ marginBottom: 16 }}>
                                {Array.from({ length: review.stars }).map((_, j) => (
                                    <span key={j} style={{ color: '#FBBF24', fontSize: '0.9rem', marginRight: 2 }}>&#9733;</span>
                                ))}
                            </div>

                            {/* Quote */}
                            <p style={{
                                fontSize: '0.88rem', color: 'var(--text-secondary)',
                                lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20,
                            }}>
                                "{review.text}"
                            </p>

                            {/* Author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)',
                                }}>
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{review.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{review.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FOOTER ── */}
            <div style={{
                textAlign: 'center', padding: '24px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.72rem', color: 'var(--text-muted)',
            }}>
                By continuing, you agree to our <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Terms</span> and <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Privacy Policy</span>.
            </div>

            {/* ── CHATBOT (bottom-right) ── */}
            <ChatBot />
        </div>
    );
}
