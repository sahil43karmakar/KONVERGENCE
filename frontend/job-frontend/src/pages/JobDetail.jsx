import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchJobById, toggleBookmark, isBookmarked as checkBookmark, applyToJob, hasApplied } from '../api/mockApi';
import { calcSkillMatch } from '../utils/intelligence';
import SkillMatchBadge from '../components/SkillMatchBadge';
import { HiOutlineMapPin, HiOutlineCurrencyRupee, HiOutlineClock, HiOutlineBookmark, HiBookmark, HiArrowLeft, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        fetchJobById(id).then(j => { setJob(j); setLoading(false); });
        checkBookmark(id).then(setBookmarked);
        setApplied(hasApplied(id));
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center py-16"><div className="spinner" /></div>
    );
    if (!job) return (
        <div className="flex flex-col items-center py-20">

            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Job not found</p>
        </div>
    );

    const matchData = user?.skills?.length > 0 ? calcSkillMatch(user.skills, job.skillsRequired) : null;
    const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft < 0;
    const isUrgent = daysLeft >= 0 && daysLeft <= 3;

    const handleBookmark = async () => {
        await toggleBookmark(job.id);
        setBookmarked(!bookmarked);
        toast.success(bookmarked ? 'Removed from saved' : 'Saved!');
    };

    const handleApply = async () => {
        try {
            await applyToJob(job.id);
            setApplied(true);
            toast.success('Applied successfully! Check your Tracker.');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="animate-fade-in-up">
            {/* Back */}
            <button onClick={() => navigate(-1)} className="btn-ghost" style={{ marginBottom: '24px', fontSize: '0.85rem', gap: '4px' }}>
                <HiArrowLeft size={16} /> Go back
            </button>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Left */}
                <div className="flex-1 min-w-0">
                    {/* Intelligence tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {isUrgent && !isExpired && <span className="intel-tag intel-tag--fire">{daysLeft} days left to apply</span>}
                        {matchData?.matchPercentage >= 70 && <span className="intel-tag intel-tag--trending">Trending in your skills</span>}
                        {matchData?.matchPercentage >= 50 && matchData?.matchPercentage < 70 && <span className="intel-tag intel-tag--match">Good match for you</span>}
                        {job.type === 'remote' && <span className="intel-tag intel-tag--match">Remote friendly</span>}
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {job.role}
                    </h1>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'capitalize' }}>
                        {job.type} · {job.company}
                    </p>

                    {/* Description */}
                    <div style={{ marginTop: '40px' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>About the role</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                            {job.description}
                        </p>
                    </div>

                    {/* Skills */}
                    <div style={{ marginTop: '36px' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>Required Skills</h2>
                        {job.skillsRequired.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No specific skills required</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {job.skillsRequired.map(skill => {
                                    const isMatched = matchData?.matchedSkills?.includes(skill);
                                    const isMissing = matchData?.missingSkills?.includes(skill);
                                    return (
                                        <span key={skill} style={{
                                            padding: '6px 16px', borderRadius: 'var(--radius-full)',
                                            fontSize: '0.82rem', fontWeight: 500,
                                            background: isMatched ? 'var(--success-muted)' : isMissing ? 'var(--danger-muted)' : 'var(--bg-elevated)',
                                            color: isMatched ? 'var(--success)' : isMissing ? 'var(--danger)' : 'var(--text-secondary)',
                                            border: `1px solid ${isMatched ? 'rgba(34,197,94,0.25)' : isMissing ? 'rgba(239,68,68,0.25)' : 'var(--border-default)'}`,
                                        }}>
                                            {isMatched && '✓ '}{isMissing && '✗ '}{skill}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                        {matchData && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                                {matchData.matchedSkills.length} of {job.skillsRequired.length} skills matched
                            </p>
                        )}
                    </div>

                    {/* Skill Gap Analyzer */}
                    {matchData && matchData.missingSkills.length > 0 && (
                        <div className="glass-card-static" style={{
                            marginTop: '28px', padding: '20px',
                            borderLeft: '3px solid var(--warning)',
                        }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="intel-tag intel-tag--gap">Skill Gap Alert</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                                Learn <strong style={{ color: 'var(--warning)' }}>{matchData.missingSkills.join(', ')}</strong> to reach{' '}
                                <strong style={{ color: 'var(--success)' }}>100% match</strong> for this role.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Sticky Apply Card */}
                <div className="lg:w-[340px] flex-shrink-0">
                    <div className="glass-card-static lg:sticky lg:top-24" style={{ padding: '28px' }}>
                        {/* Company */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex items-center justify-center" style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                background: 'var(--accent-glow)', border: '1px solid var(--border-accent)',
                                color: 'var(--accent-primary)', fontWeight: 800, fontSize: '1.2rem',
                            }}>
                                {job.company.charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{job.company}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{job.role}</div>
                            </div>
                        </div>

                        <div style={{ height: 1, background: 'var(--border-default)', margin: '0 0 18px' }} />

                        {/* Meta */}
                        <div className="flex flex-col gap-3 mb-5">
                            <DetailRow icon={<HiOutlineMapPin size={16} />} label="Location" value={job.location} />
                            <DetailRow icon={<HiOutlineCurrencyRupee size={16} />} label="Salary" value={`₹${(job.salary / 1000).toFixed(0)}k/month`} bold />
                            <DetailRow icon={<HiOutlineClock size={16} />} label="Deadline"
                                value={isExpired ? 'Expired' : `${daysLeft} days left`}
                                color={isExpired ? 'var(--danger)' : isUrgent ? 'var(--warning)' : undefined} />
                        </div>

                        {/* Match */}
                        {matchData && (
                            <div className="flex items-center gap-3 mb-5 p-3" style={{
                                background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-subtle)',
                            }}>
                                <SkillMatchBadge percentage={matchData.matchPercentage} size="md" />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                        {matchData.matchPercentage >= 70 ? 'Strong Match' : matchData.matchPercentage >= 40 ? 'Moderate Match' : 'Low Match'}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                        {matchData.matchedSkills.length}/{job.skillsRequired.length} skills · {matchData.matchPercentage}%
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <button onClick={handleApply} disabled={applied}
                            className="btn-primary w-full justify-center"
                            style={{
                                padding: '13px', marginBottom: '10px',
                                ...(applied ? { background: 'var(--success)', opacity: 0.8, cursor: 'default' } : {})
                            }}>
                            {applied ? 'Applied' : <>Apply now <HiOutlineArrowTopRightOnSquare size={16} /></>}
                        </button>
                        <button onClick={handleBookmark} className="btn-secondary w-full justify-center" style={{ padding: '13px' }}>
                            {bookmarked ? <><HiBookmark size={16} /> Saved</> : <><HiOutlineBookmark size={16} /> Save Job</>}
                        </button>

                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                            Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value, bold, color }) {
    return (
        <div className="flex items-center justify-between" style={{ fontSize: '0.85rem' }}>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                {icon} {label}
            </div>
            <span style={{ fontWeight: bold ? 700 : 500, color: color || 'var(--text-primary)' }}>{value}</span>
        </div>
    );
}
