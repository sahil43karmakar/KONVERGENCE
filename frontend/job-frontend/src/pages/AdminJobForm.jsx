import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobById } from '../api/mockApi';
import { HiArrowLeft, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function AdminJobForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        company: '', role: '', location: '', type: 'full-time',
        salary: '', deadline: '', description: '', applyLink: ''
    });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchJobById(id).then(j => {
                if (j) {
                    setForm({
                        company: j.company, role: j.role, location: j.location, type: j.type,
                        salary: j.salary, deadline: j.deadline, description: j.description, applyLink: j.applyLink
                    });
                    setSkills(j.skillsRequired);
                }
            });
        }
    }, [id, isEdit]);

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(''); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.company || !form.role) return toast.error('Company and role are required');
        toast.success(isEdit ? 'Job updated!' : 'Job created!');
        navigate('/admin');
    };

    return (
        <div className="max-w-2xl">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1 mb-6" style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem',
                cursor: 'pointer', fontWeight: 500,
            }}>
                <HiArrowLeft size={16} /> Back to Dashboard
            </button>

            <span className="section-label">{isEdit ? 'Edit' : 'New'} Job</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '4px', marginBottom: '24px' }}>
                {isEdit ? 'Edit Job Posting' : 'Create Job Posting'}
            </h1>

            <div className="glass-card" style={{ padding: '28px' }}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Company" value={form.company} onChange={(v) => update('company', v)} placeholder="TechNova" />
                        <FormInput label="Role" value={form.role} onChange={(v) => update('role', v)} placeholder="Frontend Developer" />
                        <FormInput label="Location" value={form.location} onChange={(v) => update('location', v)} placeholder="Bangalore" />
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Type</label>
                            <select value={form.type} onChange={(e) => update('type', e.target.value)} style={{
                                width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                            }}>
                                <option value="full-time">Full-time</option>
                                <option value="internship">Internship</option>
                                <option value="remote">Remote</option>
                            </select>
                        </div>
                        <FormInput label="Salary (₹/month)" value={form.salary} onChange={(v) => update('salary', v)} placeholder="45000" type="number" />
                        <FormInput label="Deadline" value={form.deadline} onChange={(v) => update('deadline', v)} type="date" />
                    </div>

                    <FormInput label="Apply Link" value={form.applyLink} onChange={(v) => update('applyLink', v)} placeholder="https://..." />

                    {/* Skills */}
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Skills Required</label>
                        <div className="flex gap-2">
                            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                placeholder="Add skill..." style={{
                                    flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                    color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                                }} />
                            <button type="button" onClick={addSkill} className="btn-primary" style={{ padding: '10px 16px' }}>Add</button>
                        </div>
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {skills.map(s => (
                                    <span key={s} className="flex items-center gap-1" style={{
                                        padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                        background: 'var(--accent-glow)', color: 'var(--accent-primary)',
                                        fontSize: '0.8rem', fontWeight: 500, border: '1px solid var(--border-accent)',
                                    }}>
                                        {s}
                                        <button type="button" onClick={() => setSkills(skills.filter(sk => sk !== s))} style={{
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex',
                                        }}><HiXMark size={14} /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Description</label>
                        <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
                            rows={5} placeholder="Job description..." style={{
                                width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', resize: 'vertical',
                                fontFamily: 'var(--font-sans)',
                            }} />
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center" style={{ marginTop: '8px', padding: '12px' }}>
                        {isEdit ? 'Update Job' : 'Create Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function FormInput({ label, value, onChange, placeholder = '', type = 'text' }) {
    return (
        <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
                style={{
                    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                }} />
        </div>
    );
}
