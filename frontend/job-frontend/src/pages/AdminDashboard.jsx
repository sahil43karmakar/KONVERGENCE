import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminStats, mockJobs } from '../api/mockApi';
import { HiOutlineUsers, HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineChartBar, HiOutlineClock, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdminStats().then(s => { setStats(s); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-16">
            <div className="spinner" />
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
                <div>
                    <span className="section-label">Admin</span>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6 }}>Dashboard</h1>
                </div>
                <button onClick={() => navigate('/admin/jobs/new')} className="btn-primary" style={{ gap: 6 }}>
                    <HiOutlinePlus size={18} /> Add Job
                </button>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, marginBottom: 36 }}>
                <StatCard icon={<HiOutlineUsers size={24} />} label="Total Users" value={stats?.totalUsers} />
                <StatCard icon={<HiOutlineDocumentText size={24} />} label="Applications" value={stats?.totalApplications} />
                <StatCard icon={<HiOutlineBriefcase size={24} />} label="Total Jobs" value={stats?.totalJobs} />
                <StatCard icon={<HiOutlineChartBar size={24} />} label="Active Jobs" value={stats?.activeJobs} color="var(--success)" />
                <StatCard icon={<HiOutlineClock size={24} />} label="Expired" value={stats?.expiredJobs} color="var(--danger)" />
            </div>

            {/* Most Applied Job */}
            {stats?.mostAppliedJob && (
                <div className="glass-card-static" style={{
                    padding: '24px 28px', marginBottom: 36,
                    border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
                }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                        Most Applied Job
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{stats.mostAppliedJob.role}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginLeft: 8 }}>at {stats.mostAppliedJob.company}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                            {stats.mostAppliedJob.applicationCount} applications
                        </span>
                    </div>
                </div>
            )}

            {/* Jobs Table */}
            <div className="glass-card-static" style={{
                padding: 0, overflow: 'hidden',
                border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
            }}>
                <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--border-default)' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Job Management</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                                {['Company', 'Role', 'Type', 'Salary', 'Deadline', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        padding: '14px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600,
                                        color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockJobs.map(job => {
                                const isExpired = new Date(job.deadline) < new Date();
                                return (
                                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600 }}>{job.company}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{job.role}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem',
                                                fontWeight: 600, textTransform: 'capitalize',
                                                background: job.type === 'remote' ? 'rgba(59,130,246,0.1)' : job.type === 'internship' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                                                color: job.type === 'remote' ? '#3B82F6' : job.type === 'internship' ? '#F59E0B' : '#22C55E',
                                                border: `1px solid ${job.type === 'remote' ? 'rgba(59,130,246,0.2)' : job.type === 'internship' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'}`,
                                            }}>{job.type}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            ₹{(job.salary / 1000).toFixed(0)}k
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: isExpired ? 'var(--danger)' : 'var(--text-secondary)' }}>
                                            {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <button onClick={() => navigate(`/admin/jobs/${job.id}/edit`)} style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                                    cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 150ms',
                                                }}><HiOutlinePencil size={15} /></button>
                                                <button style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                                                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                                    cursor: 'pointer', color: 'var(--danger)', transition: 'all 150ms',
                                                }}><HiOutlineTrash size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="glass-card-static" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            padding: '28px 16px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
        }}>
            <span style={{ color: color || 'var(--accent-primary)', marginBottom: 12 }}>{icon}</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: color || 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>{label}</div>
        </div>
    );
}
