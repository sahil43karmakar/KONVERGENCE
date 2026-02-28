import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApplications, fetchBookmarks, fetchPersonalizedFeed, mockJobs } from '../api/mockApi';
import { calcReadinessScore, calcStrategyMetrics, getMissedOpportunities, calcTrendIndicator, calcSkillMatch } from '../utils/intelligence';
import { useNavigate } from 'react-router-dom';
import SkillMatchBadge from '../components/SkillMatchBadge';
import { HiArrowTrendingUp, HiArrowTrendingDown, HiOutlineSparkles, HiOutlineExclamationTriangle, HiOutlineChartBar, HiOutlineLightBulb } from 'react-icons/hi2';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [topOpps, setTopOpps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchApplications(),
            fetchBookmarks(),
            fetchPersonalizedFeed(user?.skills || [])
        ]).then(([apps, bk, top]) => {
            setApplications(apps);
            setBookmarks(bk);
            setTopOpps(top);
            setLoading(false);
        });
    }, [user]);

    const readiness = useMemo(() => calcReadinessScore(user, applications, bookmarks), [user, applications, bookmarks]);
    const mockPreviousScore = Math.max(0, readiness - 8);
    const trend = calcTrendIndicator(readiness, mockPreviousScore);

    const strategy = useMemo(() => calcStrategyMetrics(
        applications.map(a => ({ jobId: a.job?.id || a.jobId })),
        user?.skills || [],
        mockJobs
    ), [applications, user]);

    const missed = useMemo(() => getMissedOpportunities(mockJobs, applications.map(a => ({ jobId: a.job?.id || a.jobId })), user?.skills || []), [applications, user]);

    const noSkills = !user?.skills || user.skills.length === 0;

    if (loading) return <div className="flex items-center justify-center py-16"><div className="spinner" /></div>;

    return (
        <div>
            <span className="section-label">Intelligence Hub</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '8px', marginBottom: '12px' }}>
                Your Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '40px' }}>
                Real-time insights to optimize your job search strategy.
            </p>

            {noSkills && (
                <div className="glass-card-static flex items-center gap-3" style={{
                    padding: '16px 24px', borderLeft: '3px solid var(--accent-primary)', marginBottom: '32px',
                }}>
                    <HiOutlineSparkles size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Add skills in your profile</strong> to unlock intelligence features.
                    </p>
                </div>
            )}

            {/* 2-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                {/* Placement Readiness */}
                <DashCard title="Placement Readiness" icon={<HiOutlineChartBar size={18} />} tag="Live Score">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 28 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx={60} cy={60} r={52} fill="none" stroke="var(--border-default)" strokeWidth={8} />
                                <circle cx={60} cy={60} r={52} fill="none"
                                    stroke={readiness >= 70 ? 'var(--success)' : readiness >= 40 ? 'var(--warning)' : 'var(--danger)'}
                                    strokeWidth={8} strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 52}
                                    strokeDashoffset={2 * Math.PI * 52 - (readiness / 100) * 2 * Math.PI * 52}
                                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                                />
                            </svg>
                            <div style={{
                                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{readiness}</span>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/ 100</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                                {trend.direction === 'up' ? <HiArrowTrendingUp size={16} style={{ color: trend.color }} /> : <HiArrowTrendingDown size={16} style={{ color: trend.color }} />}
                                <span style={{ color: trend.color, fontWeight: 600 }}>{trend.value} this week</span>
                            </div>
                            <MetricRow label="Avg Match" value={`${bookmarks.length > 0 ? Math.round(bookmarks.reduce((s, j) => s + calcSkillMatch(user?.skills || [], j.skillsRequired).matchPercentage, 0) / bookmarks.length) : 0}%`} />
                            <MetricRow label="Applications" value={applications.length} />
                            <MetricRow label="Interviews" value={applications.filter(a => a.status === 'interview' || a.status === 'selected').length} />
                            <MetricRow label="Resume" value={user?.resumeUrl ? 'Uploaded' : 'Missing'} highlight={!user?.resumeUrl} />
                        </div>
                    </div>
                    {/* Suggestions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {!user?.resumeUrl && <Suggestion text="Upload your resume to boost readiness by +10%" type="warning" />}
                        {applications.length < 5 && <Suggestion text="Apply to more opportunities to increase your score" type="info" />}
                        {readiness >= 70 && <Suggestion text="You're placement-ready! Focus on interview prep" type="success" />}
                    </div>
                </DashCard>

                {/* Application Strategy */}
                <DashCard title="Application Strategy" icon={<HiOutlineLightBulb size={18} />} tag="AI Analysis">
                    {strategy.total === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Start applying to track strategy.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                                <StatBlock label="Total Apps" value={strategy.total} />
                                <StatBlock label="High Match" value={strategy.highMatch} color="var(--success)" />
                                <StatBlock label="Low Match" value={strategy.lowMatch} color="var(--danger)" />
                            </div>
                            {/* Progress bar */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    <span>Quality ratio</span>
                                    <span style={{ fontWeight: 600, color: strategy.highMatchPercent >= 60 ? 'var(--success)' : 'var(--warning)' }}>{strategy.highMatchPercent}%</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', width: `${strategy.highMatchPercent}%`,
                                        background: `linear-gradient(90deg, ${strategy.highMatchPercent >= 60 ? 'var(--success)' : 'var(--warning)'}, var(--accent-primary))`,
                                        borderRadius: 3, transition: 'width 0.8s ease',
                                    }} />
                                </div>
                            </div>
                            <div style={{
                                padding: '16px 20px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                            }}>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {strategy.suggestion}
                                </p>
                            </div>
                        </>
                    )}
                </DashCard>

                {/* Missed Opportunities */}
                <DashCard title="Missed Opportunities" icon={<HiOutlineExclamationTriangle size={18} />} count={missed.length}>
                    {missed.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 500 }}>No missed opportunities!</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>You're on top of high-match roles.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 280, overflowY: 'auto' }}>
                            {missed.map(job => (
                                <div key={job.id} className="hover-lift cursor-pointer"
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-subtle)',
                                    }}>
                                    <span style={{
                                        fontSize: '0.82rem', fontWeight: 700, width: 44, textAlign: 'center',
                                        color: job.matchPercentage >= 70 ? 'var(--success)' : 'var(--warning)',
                                    }}>{job.matchPercentage}%</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.role}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                            {job.company} · <span style={{ color: 'var(--danger)' }}>Expired</span>
                                        </div>
                                    </div>
                                    <span className="intel-tag intel-tag--fire" style={{ fontSize: '0.6rem', flexShrink: 0 }}>Missed</span>
                                </div>
                            ))}
                        </div>
                    )}
                </DashCard>

                {/* Top Opportunities */}
                <DashCard title="Top Opportunities" icon={<HiArrowTrendingUp size={18} />} tag="For You">
                    {topOpps.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add skills to see recommendations.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {topOpps.slice(0, 5).map((job, i) => (
                                <div key={job.id} className="cursor-pointer hover-lift"
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-subtle)',
                                    }}>
                                    <span style={{
                                        fontWeight: 800, fontSize: '0.8rem', width: 28,
                                        color: i === 0 ? 'var(--success)' : i === 1 ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    }}>#{i + 1}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.role}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{job.company}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                        <span style={{
                                            fontSize: '0.78rem', fontWeight: 700,
                                            color: job.matchPercentage >= 70 ? 'var(--success)' : job.matchPercentage >= 40 ? 'var(--warning)' : 'var(--danger)',
                                        }}>{job.matchPercentage}%</span>
                                        {job.matchPercentage >= 70 && <span className="intel-tag intel-tag--trending" style={{ fontSize: '0.6rem' }}>High</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DashCard>
            </div>
        </div>
    );
}

function DashCard({ title, icon, children, tag, count }) {
    return (
        <div className="glass-card-static" style={{ padding: '28px 28px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--accent-primary)' }}>{icon}</span>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</h3>
                    {count !== undefined && count > 0 && (
                        <span style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: 'var(--danger)', color: '#fff',
                            fontSize: '0.62rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{count}</span>
                    )}
                </div>
                {tag && <span className="intel-tag intel-tag--match" style={{ fontSize: '0.6rem' }}>{tag}</span>}
            </div>
            {children}
        </div>
    );
}

function MetricRow({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontWeight: 600, color: highlight ? 'var(--warning)' : 'var(--text-primary)' }}>{value}</span>
        </div>
    );
}

function StatBlock({ label, value, color }) {
    return (
        <div style={{
            flex: 1, textAlign: 'center',
            padding: '18px 14px', background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: color || 'var(--text-primary)' }}>{value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
        </div>
    );
}

function Suggestion({ text, type }) {
    const colors = { warning: 'var(--warning)', info: 'var(--accent-primary)', success: 'var(--success)' };
    return (
        <div style={{
            display: 'flex', alignItems: 'start', gap: 10,
            padding: '12px 16px', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5,
        }}>
            <span style={{ color: colors[type], marginTop: '1px', flexShrink: 0 }}>-</span>
            <span>{text}</span>
        </div>
    );
}
