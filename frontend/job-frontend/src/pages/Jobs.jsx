import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchJobs, toggleBookmark, getBookmarkIds, fetchPersonalizedFeed } from '../api/mockApi';
import { calcSkillMatch } from '../utils/intelligence';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import { HiMagnifyingGlass, HiOutlineSparkles } from 'react-icons/hi2';

function SkeletonCard() {
    return (
        <div className="glass-card-static" style={{ padding: '24px' }}>
            <div className="skeleton" style={{ width: '40%', height: 12, marginBottom: 16 }} />
            <div className="skeleton" style={{ width: '90%', height: 18, marginBottom: 10 }} />
            <div className="skeleton" style={{ width: '50%', height: 16, marginBottom: 16 }} />
            <div className="flex gap-2 mb-16">
                <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 'var(--radius-full)' }} />
                <div className="skeleton" style={{ width: 80, height: 22 }} />
            </div>
            <div className="skeleton" style={{ width: '100%', height: 1, marginBottom: 14 }} />
            <div className="flex justify-between">
                <div className="skeleton" style={{ width: 60, height: 16 }} />
                <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 'var(--radius-sm)' }} />
            </div>
        </div>
    );
}

export default function Jobs() {
    const { user } = useAuth();
    const [filters, setFilters] = useState({ search: '', page: 1, limit: 6, sortBy: 'newest' });
    const [result, setResult] = useState({ jobs: [], total: 0, totalPages: 1, currentPage: 1 });
    const [bookmarkIds, setBookmarkIds] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [topOpps, setTopOpps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchJobs(filters).then(r => { setResult(r); setLoading(false); });
    }, [filters]);

    useEffect(() => { setBookmarkIds(getBookmarkIds()); }, []);

    useEffect(() => {
        if (user?.skills?.length > 0) {
            fetchPersonalizedFeed(user.skills).then(setTopOpps);
        }
    }, [user?.skills]);

    const jobsWithMatch = useMemo(() => {
        if (!user?.skills?.length) return result.jobs.map(j => ({ job: j, matchData: null }));
        return result.jobs.map(job => ({
            job,
            matchData: calcSkillMatch(user.skills, job.skillsRequired),
        }));
    }, [result.jobs, user?.skills]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    };

    const handleToggleBookmark = async (jobId) => {
        const updated = await toggleBookmark(jobId);
        setBookmarkIds(updated);
    };

    const noSkills = !user?.skills || user.skills.length === 0;
    const activeFilterCount = [filters.type, filters.location, filters.salaryMin, filters.salaryMax, ...(filters.skills || [])].filter(Boolean).length;

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Hero — DOMINANT */}
                <div style={{ marginBottom: '40px' }}>
                    <span className="section-label">Opportunities</span>
                    <h1 style={{
                        fontSize: '2.8rem', fontWeight: 800,
                        letterSpacing: '-0.04em', lineHeight: 1.05,
                        marginTop: '8px', marginBottom: '10px',
                    }}>
                        Find your next<br />
                        <span style={{ color: 'var(--accent-primary)' }}>opportunity.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', lineHeight: 1.5 }}>
                        Discover roles matched to your skills. Apply smarter, not harder.
                    </p>
                </div>

                {/* No skills banner */}
                {noSkills && (
                    <div className="glass-card-static flex items-center gap-3" style={{
                        padding: '14px 20px', marginBottom: '24px',
                        borderColor: 'var(--border-accent)',
                        borderLeft: '3px solid var(--accent-primary)',
                    }}>
                        <HiOutlineSparkles size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>Add skills in your profile</strong> to see personalized match scores and intelligent recommendations.
                        </p>
                    </div>
                )}

                {/* Search + Sort — INLINE */}
                <div className="flex gap-3 items-center" style={{ marginBottom: '24px' }}>
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="flex" style={{
                            borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                            border: '1px solid var(--border-default)', background: 'var(--bg-card)',
                        }}>
                            <span className="flex items-center pl-3" style={{ color: 'var(--text-muted)' }}>
                                <HiMagnifyingGlass size={18} />
                            </span>
                            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by company or role..."
                                style={{
                                    flex: 1, padding: '11px 12px', background: 'transparent',
                                    border: 'none', color: 'var(--text-primary)', fontSize: '0.875rem',
                                    outline: 'none', fontFamily: 'var(--font-sans)',
                                }}
                            />
                        </div>
                    </form>
                    <select value={filters.sortBy} onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }))}
                        style={{
                            padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                            color: 'var(--text-primary)', fontSize: '0.82rem',
                            outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}>
                        <option value="newest">Newest first</option>
                        <option value="salary">Highest salary</option>
                        <option value="deadline">Deadline soon</option>
                    </select>
                    {/* Mobile filter toggle with count badge */}
                    <button className="btn-secondary mobile-only" onClick={() => setShowFilters(true)} style={{ position: 'relative', padding: '10px 16px' }}>
                        Filters
                        {activeFilterCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -6, right: -6,
                                width: 18, height: 18, borderRadius: '50%',
                                background: 'var(--accent-primary)', color: '#fff',
                                fontSize: '0.6rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{activeFilterCount}</span>
                        )}
                    </button>
                </div>

                {/* Top Opportunities — REDUCED emphasis */}
                {topOpps.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <div className="flex items-center gap-2" style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Recommended for you
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {topOpps.slice(0, 3).map(job => (
                                <JobCard key={job.id} job={job}
                                    matchData={{ matchPercentage: job.matchPercentage, matchedSkills: job.matchedSkills, missingSkills: job.missingSkills }}
                                    isBookmarked={bookmarkIds.includes(job.id)} onToggleBookmark={handleToggleBookmark}
                                    showScore
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section divider */}
                {topOpps.length > 0 && <div className="section-divider" />}

                {/* All Jobs */}
                <div>
                    <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>All Opportunities</h2>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {result.total} results
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                        </div>
                    ) : jobsWithMatch.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">

                            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>No opportunities found</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {jobsWithMatch.map(({ job, matchData }) => (
                                    <JobCard key={job.id} job={job} matchData={matchData}
                                        isBookmarked={bookmarkIds.includes(job.id)} onToggleBookmark={handleToggleBookmark} />
                                ))}
                            </div>
                            <Pagination currentPage={result.currentPage} totalPages={result.totalPages}
                                onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))} />
                        </>
                    )}
                </div>
            </div>

            {/* Filter Sidebar */}
            <FilterSidebar filters={filters} setFilters={setFilters} show={showFilters} onClose={() => setShowFilters(false)} />
        </div>
    );
}
