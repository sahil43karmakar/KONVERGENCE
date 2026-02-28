import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiOutlineMapPin, HiOutlineBookmark, HiBookmark } from 'react-icons/hi2';

const typeColors = {
    'full-time': { color: '#22C55E', label: 'Full-Time' },
    'internship': { color: '#F59E0B', label: 'Internship' },
    'remote': { color: '#8B5CF6', label: 'Remote' },
};

export default function JobCard({ job, matchData, isBookmarked, onToggleBookmark }) {
    const navigate = useNavigate();
    const [bookmarkAnimating, setBookmarkAnimating] = useState(false);
    const tc = typeColors[job.type] || typeColors['full-time'];

    const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft < 0;

    const handleBookmark = (e) => {
        e.stopPropagation();
        setBookmarkAnimating(true);
        setTimeout(() => setBookmarkAnimating(false), 300);
        onToggleBookmark?.(job.id);
    };

    const matchColor = matchData?.matchPercentage >= 70 ? 'var(--success)' :
        matchData?.matchPercentage >= 40 ? 'var(--warning)' : 'var(--danger)';

    return (
        <div className="glass-card hover-lift cursor-pointer"
            style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={() => navigate(`/jobs/${job.id}`)}
        >
            {/* Company + Bookmark */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: tc.color, fontWeight: 700, fontSize: '0.9rem',
                    }}>
                        {job.company.charAt(0)}
                    </div>
                    <div>
                        <div style={{ fontWeight: 500, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{job.company}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <HiOutlineMapPin size={11} /> {job.location}
                        </div>
                    </div>
                </div>
                <button onClick={handleBookmark}
                    className={`btn-ghost ${bookmarkAnimating ? 'animate-bookmark' : ''}`}
                    style={{ color: isBookmarked ? 'var(--accent-primary)' : 'var(--text-muted)', padding: 8 }}>
                    {isBookmarked ? <HiBookmark size={18} /> : <HiOutlineBookmark size={18} />}
                </button>
            </div>

            {/* Role */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                {job.role}
            </h3>

            {/* Salary */}
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                {'\u20B9'}{(job.salary / 1000).toFixed(0)}k
                <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-muted)' }}>/month</span>
            </div>

            {/* Meta: Type + Deadline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                    padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem', fontWeight: 500,
                    background: `${tc.color}15`, color: tc.color,
                    border: `1px solid ${tc.color}30`,
                }}>{tc.label}</span>
                <span style={{
                    fontSize: '0.72rem', color: isExpired ? 'var(--danger)' : 'var(--text-muted)',
                }}>
                    {isExpired ? 'Expired' : `${daysLeft} days left`}
                </span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />

            {/* Match + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {matchData ? (
                    <div className="tooltip-wrapper">
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: matchColor }}>
                            {matchData.matchPercentage}% match
                        </span>
                        <div className="tooltip-content">
                            {matchData.matchedSkills?.length > 0 && <div>Matched: {matchData.matchedSkills.join(', ')}</div>}
                            {matchData.missingSkills?.length > 0 && <div style={{ color: 'var(--danger)', marginTop: 2 }}>Missing: {matchData.missingSkills.join(', ')}</div>}
                        </div>
                    </div>
                ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add skills to match</span>
                )}
                <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.78rem' }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>
                    View details
                </button>
            </div>
        </div>
    );
}
