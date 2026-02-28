import { useState } from 'react';
import { allLocations, jobTypes, allSkills } from '../data/mockData';
import { HiXMark, HiAdjustmentsHorizontal } from 'react-icons/hi2';

const postedFilters = [
    { label: 'Any time', value: '' },
    { label: 'Last 24h', value: '1' },
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 30 days', value: '30' },
];

export default function FilterSidebar({ filters, setFilters, show, onClose }) {
    const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }));

    const toggleSkill = (skill) => {
        const current = filters.skills || [];
        const next = current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill];
        update('skills', next);
    };

    const activeCount = [filters.type, filters.location, filters.salaryMin, filters.salaryMax, ...(filters.skills || [])].filter(Boolean).length;

    const clearAll = () => {
        setFilters({ search: filters.search || '', page: 1, limit: 6, sortBy: filters.sortBy || 'newest' });
    };

    return (
        <>
            {show && <div className="fixed inset-0 z-40 mobile-only" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />}

            <aside className={`fixed top-0 right-0 z-50 h-screen overflow-y-auto lg:sticky lg:top-0 lg:z-auto lg:h-screen transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
                style={{
                    width: '280px', minWidth: '280px', padding: '24px',
                    background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-default)',
                    borderRadius: 0,
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <HiAdjustmentsHorizontal size={18} style={{ color: 'var(--accent-primary)' }} />
                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Filters</h3>
                        {activeCount > 0 && (
                            <span style={{
                                width: 20, height: 20, borderRadius: '50%',
                                background: 'var(--accent-primary)', color: '#fff',
                                fontSize: '0.65rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{activeCount}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {activeCount > 0 && (
                            <button onClick={clearAll} className="btn-primary" style={{
                                padding: '4px 12px', fontSize: '0.7rem',
                            }}>Clear all</button>
                        )}
                        <button className="mobile-only btn-ghost" onClick={onClose}>
                            <HiXMark size={20} />
                        </button>
                    </div>
                </div>

                {/* Job Type */}
                <FilterGroup title="Job Type">
                    <div className="flex flex-col gap-2">
                        {jobTypes.map(t => {
                            const active = filters.type === t;
                            return (
                                <button key={t} onClick={() => update('type', active ? '' : t)}
                                    className="flex items-center gap-2 w-full text-left" style={{
                                        padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                                        background: active ? 'var(--accent-glow)' : 'transparent',
                                        border: `1px solid ${active ? 'var(--border-accent)' : 'transparent'}`,
                                        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        fontSize: '0.82rem', fontWeight: active ? 600 : 400,
                                        cursor: 'pointer', transition: 'all 150ms', textTransform: 'capitalize',
                                        fontFamily: 'var(--font-sans)',
                                    }}>
                                    <span style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: active ? 'var(--accent-primary)' : 'var(--border-default)',
                                        transition: 'background 150ms',
                                    }} />
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </FilterGroup>

                {/* Location */}
                <FilterGroup title="Location">
                    <select value={filters.location || ''} onChange={(e) => update('location', e.target.value)}
                        style={{
                            width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                            color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none',
                            fontFamily: 'var(--font-sans)', cursor: 'pointer',
                        }}>
                        <option value="">All Locations</option>
                        {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </FilterGroup>

                {/* Salary Range */}
                <FilterGroup title="Salary Range (₹/mo)">
                    <div className="flex gap-2">
                        <input type="number" placeholder="Min" value={filters.salaryMin || ''} onChange={(e) => update('salaryMin', e.target.value)}
                            style={{
                                flex: 1, padding: '9px 10px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                                color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none',
                                width: '100%', fontFamily: 'var(--font-sans)',
                            }} />
                        <span style={{ color: 'var(--text-muted)', alignSelf: 'center', fontSize: '0.8rem' }}>–</span>
                        <input type="number" placeholder="Max" value={filters.salaryMax || ''} onChange={(e) => update('salaryMax', e.target.value)}
                            style={{
                                flex: 1, padding: '9px 10px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                                color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none',
                                width: '100%', fontFamily: 'var(--font-sans)',
                            }} />
                    </div>
                </FilterGroup>

                {/* Posted Within */}
                <FilterGroup title="Posted Within">
                    <div className="flex flex-wrap gap-1.5">
                        {postedFilters.map(pf => {
                            const active = (filters.postedWithin || '') === pf.value;
                            return (
                                <button key={pf.value} onClick={() => update('postedWithin', active ? '' : pf.value)}
                                    style={{
                                        padding: '5px 12px', borderRadius: 'var(--radius-full)',
                                        fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer',
                                        background: active ? 'var(--accent-primary)' : 'var(--bg-card)',
                                        color: active ? '#fff' : 'var(--text-secondary)',
                                        border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                                        transition: 'all 150ms', fontFamily: 'var(--font-sans)',
                                    }}>{pf.label}</button>
                            );
                        })}
                    </div>
                </FilterGroup>

                {/* Skills */}
                <FilterGroup title="Skills">
                    <div className="flex flex-wrap gap-1.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {allSkills.slice(0, 24).map(skill => {
                            const active = (filters.skills || []).includes(skill);
                            return (
                                <button key={skill} onClick={() => toggleSkill(skill)}
                                    style={{
                                        padding: '4px 11px', borderRadius: 'var(--radius-full)',
                                        fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer',
                                        background: active ? 'var(--accent-primary)' : 'var(--bg-card)',
                                        color: active ? '#fff' : 'var(--text-secondary)',
                                        border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                                        transition: 'all 150ms', fontFamily: 'var(--font-sans)',
                                    }}>{skill}</button>
                            );
                        })}
                    </div>
                </FilterGroup>

                {/* Mobile Apply button */}
                <button className="btn-primary w-full justify-center mobile-only" onClick={onClose} style={{ marginTop: '8px', padding: '12px' }}>
                    Apply Filters ({activeCount})
                </button>
            </aside>
        </>
    );
}

function FilterGroup({ title, children }) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <h4 style={{
                fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px',
            }}>
                {title}
            </h4>
            {children}
        </div>
    );
}
