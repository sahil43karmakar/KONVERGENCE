import { useState, useRef, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/recommend';

export default function ChatBot() {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "👋 Hi there! I'm your SkillSync assistant. Tell me your skills and I'll find the best job matches for you!" },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const query = input.trim();
        if (!query || loading) return;

        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, top_n: 5 }),
            });

            if (!res.ok) throw new Error(`Server error (${res.status})`);

            const data = await res.json();

            if (data.results && data.results.length > 0) {
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'bot',
                        text: `Found ${data.results.length} matching jobs for "${query}":`,
                        jobs: data.results,
                    },
                ]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: "Hmm, I couldn't find any matches for that query. Try different skills like \"python\", \"react\", or \"data science\"." }]);
            }
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: 'bot', text: '⚠️ Could not reach the recommendation engine. Make sure the ML service is running on port 5000.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 99999 }}>
            <div className="pulse-ring" />
            <button
                id="chatbot-fab"
                onClick={() => setChatOpen(!chatOpen)}
                className="chatbot-fab"
                style={{
                    position: 'relative', width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 6px 24px rgba(59,130,246,0.35)', color: '#fff',
                }}
            >
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

            {/* ── Chat popup ── */}
            {chatOpen && (
                <div style={{
                    position: 'absolute', bottom: 72, right: 0,
                    width: 380, maxHeight: 520, borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    animation: 'chatBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '18px 20px', borderBottom: '1px solid var(--border-default)',
                        background: 'linear-gradient(135deg, #3B82F6, #6366F1)', flexShrink: 0,
                    }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>SkillSync AI Assistant</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                            Enter your skills to get job recommendations
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        minHeight: 200, maxHeight: 360,
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '88%',
                            }}>
                                {/* Text bubble */}
                                <div style={{
                                    padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                    fontSize: '0.83rem', lineHeight: 1.55,
                                    ...(msg.role === 'user' ? {
                                        background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                                        color: '#fff',
                                    } : {
                                        background: 'var(--bg-elevated)',
                                        color: 'var(--text-secondary)',
                                    }),
                                }}>
                                    {msg.text}
                                </div>

                                {/* Job cards (if present) */}
                                {msg.jobs && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                                        {msg.jobs.map((job, j) => (
                                            <div key={j} style={{
                                                padding: '12px 14px', borderRadius: 'var(--radius-md)',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border-default)',
                                                fontSize: '0.78rem', lineHeight: 1.5,
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem' }}>
                                                        {job.title}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                                                        borderRadius: 20,
                                                        background: job.match_percent > 70
                                                            ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.1)',
                                                        color: job.match_percent > 70
                                                            ? 'var(--success, #22c55e)' : 'var(--accent-primary)',
                                                    }}>
                                                        {job.match_percent.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: 6 }}>
                                                    📍 {job.location} &nbsp;•&nbsp; 🏢 {job.category}
                                                </div>
                                                {job.matched_skills.length > 0 && (
                                                    <div style={{ marginBottom: 4 }}>
                                                        <span style={{ color: 'var(--success, #22c55e)' }}>✅ </span>
                                                        <span style={{ color: 'var(--text-muted)' }}>{job.matched_skills.join(', ')}</span>
                                                    </div>
                                                )}
                                                {job.missing_skills.length > 0 && (
                                                    <div style={{ marginBottom: 4 }}>
                                                        <span style={{ color: '#ef4444' }}>📚 </span>
                                                        <span style={{ color: 'var(--text-muted)' }}>{job.missing_skills.join(', ')}</span>
                                                    </div>
                                                )}
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 4 }}>
                                                    {job.description}...
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div style={{
                                alignSelf: 'flex-start', padding: '10px 18px',
                                borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)',
                                display: 'flex', gap: 5, alignItems: 'center',
                            }}>
                                {[0, 1, 2].map(k => (
                                    <span key={k} style={{
                                        width: 7, height: 7, borderRadius: '50%',
                                        background: 'var(--accent-primary)',
                                        opacity: 0.5,
                                        animation: `typingDot 1.2s ease-in-out ${k * 0.2}s infinite`,
                                    }} />
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input bar */}
                    <div style={{
                        padding: '12px 16px 16px', display: 'flex', gap: 8,
                        borderTop: '1px solid var(--border-default)', flexShrink: 0,
                    }}>
                        <input
                            id="chatbot-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your skills (e.g. python, react)..."
                            disabled={loading}
                            style={{
                                flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none',
                                fontFamily: 'var(--font-sans)',
                                opacity: loading ? 0.6 : 1,
                            }}
                        />
                        <button
                            id="chatbot-send"
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            style={{
                                width: 38, height: 38, borderRadius: 'var(--radius-md)',
                                background: loading || !input.trim()
                                    ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #3B82F6, #6366F1)',
                                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 200ms ease',
                            }}
                        >
                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                                stroke={loading || !input.trim() ? 'var(--text-muted)' : '#fff'}
                                strokeWidth={2.5}>
                                <line x1={22} y1={2} x2={11} y2={13} />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="none" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Typing dots animation */}
            <style>{`
                @keyframes typingDot {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
