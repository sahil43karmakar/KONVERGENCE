import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchBookmarks, toggleBookmark } from '../api/mockApi';
import { calcSkillMatch } from '../utils/intelligence';
import JobCard from '../components/JobCard';
import { HiOutlineBookmark } from 'react-icons/hi2';

export default function SavedJobs() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [bookmarkIds, setBookmarkIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const saved = await fetchBookmarks();
        setJobs(saved);
        setBookmarkIds(saved.map(j => j.id));
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleToggle = async (jobId) => {
        const updated = await toggleBookmark(jobId);
        setBookmarkIds(updated);
        setJobs(prev => prev.filter(j => updated.includes(j.id)));
    };

    return (
        <div>
            <span className="section-label">Bookmarks</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '4px', marginBottom: '4px' }}>
                Saved Jobs
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Jobs you've bookmarked for later.
            </p>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div style={{ width: 40, height: 40, border: '3px solid var(--border-default)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <HiOutlineBookmark size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No saved jobs yet</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Bookmark jobs to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job}
                            matchData={user?.skills?.length ? calcSkillMatch(user.skills, job.skillsRequired) : null}
                            isBookmarked={true} onToggleBookmark={handleToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
