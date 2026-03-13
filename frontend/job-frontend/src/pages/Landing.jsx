import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserGroup, HiOutlineBuildingOffice2, HiChevronRight } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import Aurora from '../components/Aurora';
import api from '../api/api';

const reviews = [
    { name: 'Sarah J.', role: 'Computer Science Graduate', text: 'SkillSync helped me land my dream job in weeks! The AI-matching is incredibly accurate.', stars: 5 },
    { name: 'Rahul M.', role: 'Full Stack Developer', text: 'The skill gap analysis showed me exactly what to learn. Got placed at a top startup!', stars: 5 },
    { name: 'Priya K.', role: 'Data Science Intern', text: 'I love the opportunity tracker. Keeping track of applications has never been this easy.', stars: 4 },
    { name: 'Alex T.', role: 'UI/UX Designer', text: 'The personalized recommendations are spot on. Found roles I never would have discovered.', stars: 5 },
    { name: 'Neha S.', role: 'HR Manager, TechCorp', text: 'As a recruiter, the talent pipeline features save me hours every week. Highly recommend.', stars: 5 },
    { name: 'James L.', role: 'Backend Developer', text: 'The readiness score motivated me to upskill. Went from 40% to 85% match in a month!', stars: 5 },
];

/* ── Review Card Component ────────────────────── */
function ReviewCard({ review }) {
    return (
        <div style={{
            minWidth: 300, maxWidth: 300, padding: '28px', borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
            flexShrink: 0,
        }}>
            <div style={{ marginBottom: 16 }}>
                {Array.from({ length: review.stars }).map((_, j) => (
                    <span key={j} style={{ color: '#FBBF24', fontSize: '0.9rem', marginRight: 2 }}>&#9733;</span>
                ))}
            </div>
            <p style={{
                fontSize: '0.88rem', color: 'var(--text-secondary)',
                lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20,
            }}>
                "{review.text}"
            </p>
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
    );
}

export default function Landing() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "👋 Hi there! I'm your SkillSync assistant. Ask me about jobs — try \"show remote jobs\" or \"internships\"!" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const isDark = theme === 'dark';

    // Auto-scroll chat to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Duplicate reviews for seamless infinite scroll
    const marqueeReviews = [...reviews, ...reviews];

    /* ── Send chat message ──────────────────────── */
    const sendMessage = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const { data } = await api.post('/chat', { message: text });
            setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'bot', text: "😕 Sorry, I couldn't process that. Try again!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>
            {/* ── Aurora Background ── */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.4, pointerEvents: 'none' }}>
                <Aurora
                    colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={1}
                />
            </div>

            {/* CSS for animations */}
            <style>{`
                @keyframes chatBounce {
                    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
                    60% { transform: scale(1.15) rotate(0deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes pulseRing {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes typingDot {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
                    40% { transform: scale(1); opacity: 1; }
                }
                .chatbot-fab { animation: chatBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both; }
                .chatbot-fab:hover { transform: scale(1.1) !important; }
                .pulse-ring {
                    position: absolute; inset: 0; border-radius: 50%;
                    background: rgba(59,130,246,0.3);
                    animation: pulseRing 2s ease-out infinite;
                }
                .path-card {
                    transition: all 200ms ease;
                    cursor: pointer;
                }
                .path-card:hover {
                    border-color: var(--accent-primary) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(59,130,246,0.12);
                }
                .theme-toggle {
                    transition: all 200ms ease;
                }
                .theme-toggle:hover {
                    transform: scale(1.1);
                    border-color: var(--accent-primary) !important;
                }
                .marquee-track {
                    display: flex;
                    gap: 20px;
                    animation: marqueeScroll 30s linear infinite;
                    width: max-content;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
                .chat-msg-user {
                    background: linear-gradient(135deg, #3B82F6, #6366F1);
                    color: #fff;
                    border-radius: 16px 16px 4px 16px;
                    padding: 10px 14px;
                    max-width: 80%;
                    align-self: flex-end;
                    font-size: 0.82rem;
                    line-height: 1.5;
                    word-break: break-word;
                }
                .chat-msg-bot {
                    background: var(--bg-elevated);
                    color: var(--text-secondary);
                    border-radius: 16px 16px 16px 4px;
                    padding: 10px 14px;
                    max-width: 85%;
                    align-self: flex-start;
                    font-size: 0.82rem;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 10px 14px;
                    align-self: flex-start;
                }
                .typing-indicator span {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    animation: typingDot 1.4s infinite;
                }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
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
                textAlign: 'center', padding: '80px 24px 60px', position: 'relative', zIndex: 1,
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
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
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

            {/* ── SUCCESS STORIES — Continuous Marquee ── */}
            <div style={{ padding: '0 0 80px', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: 640, margin: '0 auto 40px', padding: '0 24px' }}>
                    <div style={{
                        fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                        Success Stories
                    </div>
                </div>

                {/* Marquee container — overflow hidden, continuous scroll */}
                <div style={{ overflow: 'hidden', width: '100%' }}>
                    <div className="marquee-track">
                        {marqueeReviews.map((review, i) => (
                            <ReviewCard key={i} review={review} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <div style={{
                textAlign: 'center', padding: '24px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.72rem', color: 'var(--text-muted)',
                position: 'relative', zIndex: 1,
            }}>
                By continuing, you agree to our <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Terms</span> and <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Privacy Policy</span>.
            </div>

            {/* ── CHATBOT FAB (bottom-right) ── */}
            <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 99999 }}>
                <div className="pulse-ring" />
                <button onClick={() => setChatOpen(!chatOpen)} className="chatbot-fab" style={{
                    position: 'relative', width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 6px 24px rgba(59,130,246,0.35)',
                    color: '#fff',
                }}>
                    {chatOpen ? (
                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
                            <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
                        </svg>
                    ) : (
                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            <circle cx={9} cy={10} r={1} fill="#fff" stroke="none" />
                            <circle cx={12} cy={10} r={1} fill="#fff" stroke="none" />
                            <circle cx={15} cy={10} r={1} fill="#fff" stroke="none" />
                        </svg>
                    )}
                </button>

                {/* ── Chat Popup with real messaging ── */}
                {chatOpen && (
                    <div style={{
                        position: 'absolute', bottom: 72, right: 0,
                        width: 370, borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                        overflow: 'hidden',
                        animation: 'chatBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                        display: 'flex', flexDirection: 'column',
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '18px 20px', borderBottom: '1px solid var(--border-default)',
                            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>SkillSync AI Assistant</div>
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Ask me anything about opportunities</div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            padding: '16px', overflowY: 'auto', maxHeight: 320, minHeight: 200,
                            display: 'flex', flexDirection: 'column', gap: 10,
                        }}>
                            {messages.map((msg, i) => (
                                <div key={i} className={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="typing-indicator">
                                    <span /><span /><span />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '12px 16px 16px', display: 'flex', gap: 8, borderTop: '1px solid var(--border-default)' }}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                    color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none',
                                    fontFamily: 'var(--font-sans)',
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isTyping}
                                style={{
                                    width: 38, height: 38, borderRadius: 'var(--radius-md)',
                                    background: isTyping ? '#666' : 'linear-gradient(135deg, #3B82F6, #6366F1)',
                                    border: 'none', cursor: isTyping ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 200ms ease',
                                }}
                            >
                                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
                                    <line x1={22} y1={2} x2={11} y2={13} />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="none" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
