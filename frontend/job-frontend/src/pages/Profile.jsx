import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiXMark, HiOutlineDocumentArrowUp, HiOutlineCheckCircle, HiCamera, HiOutlineMapPin, HiPlus, HiOutlineBuildingOffice2, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { allSkills } from '../data/mockData';
import toast from 'react-hot-toast';

const suggestedSkills = ['Data Analysis', 'React', 'SQL', 'Python', 'Node.js', 'Figma'];

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const isRecruiter = user?.role === 'admin';
    const [showSuccess, setShowSuccess] = useState(false);

    if (showSuccess) return <ProfileSyncSuccess isRecruiter={isRecruiter} />;

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                    {isRecruiter ? 'Recruiter Profile' : 'Complete Your Profile'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 8 }}>
                    {isRecruiter
                        ? 'Set up your recruiter profile to connect with top talent.'
                        : "Let's personalize your opportunity intelligence experience."}
                </p>
            </div>

            {isRecruiter ? <RecruiterForm onSuccess={() => setShowSuccess(true)} /> : <StudentForm onSuccess={() => setShowSuccess(true)} />}
        </div>
    );
}

/* ═════════════════════ STUDENT FORM ═════════════════════ */
function StudentForm({ onSuccess }) {
    const { user, updateProfile } = useAuth();
    const fileRef = useRef(null);

    const [firstName, setFirstName] = useState(user?.firstName || user?.name?.split(' ')[0] || '');
    const [middleName, setMiddleName] = useState(user?.middleName || '');
    const [lastName, setLastName] = useState(user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '');
    const [location, setLocation] = useState(user?.location || '');
    const [skills, setSkills] = useState(user?.skills || []);
    const [skillInput, setSkillInput] = useState('');
    const [salary, setSalary] = useState(user?.expectedSalary || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || null);

    const addSkill = (s) => {
        const skill = (s || skillInput).trim();
        if (skill && !skills.includes(skill)) { setSkills([...skills, skill]); setSkillInput(''); }
    };
    const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { toast.error('Max file size is 2MB'); return; }
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleResumeUpload = () => {
        updateProfile({ resumeUrl: 'https://res.cloudinary.com/demo/resume.pdf' });
        toast.success('Resume uploaded!');
    };

    const handleSave = () => {
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
        updateProfile({ name: fullName, firstName, middleName, lastName, location, skills, bio, expectedSalary: salary, photoUrl: photoPreview });
        onSuccess();
    };

    const availableSuggestions = suggestedSkills.filter(s => !skills.includes(s));

    return (
        <>
            {/* Photo */}
            <PhotoUpload photoPreview={photoPreview} fallback={user?.name?.charAt(0) || 'U'} fileRef={fileRef} onChange={handlePhotoChange} />

            {/* Name */}
            <Section>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr 1fr', gap: 14 }}>
                    <FieldInput label="First" value={firstName} onChange={setFirstName} placeholder="John" />
                    <FieldInput label="Middle" value={middleName} onChange={setMiddleName} placeholder="D." />
                    <FieldInput label="Last" value={lastName} onChange={setLastName} placeholder="Doe" />
                </div>
            </Section>

            {/* Location */}
            <Section>
                <FieldLabel>Current Location</FieldLabel>
                <IconInput icon={<HiOutlineMapPin size={16} />} value={location} onChange={setLocation} placeholder="City, Country" />
            </Section>

            {/* Resume */}
            <Section>
                <FieldLabel>Resume Sync</FieldLabel>
                {user?.resumeUrl ? (
                    <UploadedState onRemove={() => updateProfile({ resumeUrl: '' })} label="Resume uploaded" />
                ) : (
                    <DropZone onClick={handleResumeUpload} icon={<HiOutlineDocumentArrowUp size={32} />} title="Drag & drop your resume" subtitle="PDF, DOCX up to 5MB" />
                )}
            </Section>

            {/* Skills */}
            <Section>
                <FieldLabel>Skills You Know</FieldLabel>
                <SkillsInput skills={skills} skillInput={skillInput} setSkillInput={setSkillInput} addSkill={addSkill} removeSkill={removeSkill} />
                {availableSuggestions.length > 0 && <SkillSuggestions suggestions={availableSuggestions.slice(0, 5)} onAdd={addSkill} />}
            </Section>

            {/* Salary */}
            <Section>
                <FieldLabel>Expected Salary (Optional)</FieldLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <InputPrefix>INR</InputPrefix>
                    <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="60,000" style={{ ...inputStyle, borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', flex: 1 }} />
                    <span style={{ marginLeft: 12, fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>/ MONTHLY</span>
                </div>
            </Section>

            {/* Bio */}
            <Section mb={36}>
                <FieldLabel>Bio</FieldLabel>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about your career goals and what you're looking for..." rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 100 }} />
            </Section>

            <SaveButton onClick={handleSave} label="Complete Sync" />
        </>
    );
}

/* ═════════════════════ RECRUITER FORM ═════════════════════ */
function RecruiterForm({ onSuccess }) {
    const { user, updateProfile } = useAuth();
    const fileRef = useRef(null);

    const [firstName, setFirstName] = useState(user?.firstName || user?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '');
    const [companyName, setCompanyName] = useState(user?.companyName || '');
    const [position, setPosition] = useState(user?.position || '');
    const [companyWebsite, setCompanyWebsite] = useState(user?.companyWebsite || '');
    const [location, setLocation] = useState(user?.location || '');
    const [hiringFor, setHiringFor] = useState(user?.hiringFor || []);
    const [hiringInput, setHiringInput] = useState('');
    const [bio, setBio] = useState(user?.bio || '');
    const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || null);

    const roleOptions = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'DevOps', 'Data Scientist', 'UI/UX Designer', 'ML Engineer'];

    const addHiringRole = (s) => {
        const role = (s || hiringInput).trim();
        if (role && !hiringFor.includes(role)) { setHiringFor([...hiringFor, role]); setHiringInput(''); }
    };
    const removeHiringRole = (s) => setHiringFor(hiringFor.filter(r => r !== s));

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { toast.error('Max file size is 2MB'); return; }
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        updateProfile({ name: fullName, firstName, lastName, companyName, position, companyWebsite, location, hiringFor, bio, photoUrl: photoPreview });
        onSuccess();
    };

    const availableSuggestions = roleOptions.filter(r => !hiringFor.includes(r));

    return (
        <>
            {/* Photo */}
            <PhotoUpload photoPreview={photoPreview} fallback={user?.name?.charAt(0) || 'R'} fileRef={fileRef} onChange={handlePhotoChange} />

            {/* Name */}
            <Section>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FieldInput label="First Name" value={firstName} onChange={setFirstName} placeholder="Jane" />
                    <FieldInput label="Last Name" value={lastName} onChange={setLastName} placeholder="Smith" />
                </div>
            </Section>

            {/* Company Name */}
            <Section>
                <FieldLabel>Company Name</FieldLabel>
                <IconInput icon={<HiOutlineBuildingOffice2 size={16} />} value={companyName} onChange={setCompanyName} placeholder="Acme Corp" />
            </Section>

            {/* Position / Title */}
            <Section>
                <FieldLabel>Your Position / Title</FieldLabel>
                <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="HR Manager, Tech Lead, etc." style={inputStyle} />
            </Section>

            {/* Company Website */}
            <Section>
                <FieldLabel>Company Website (Optional)</FieldLabel>
                <IconInput icon={<HiOutlineGlobeAlt size={16} />} value={companyWebsite} onChange={setCompanyWebsite} placeholder="https://company.com" />
            </Section>

            {/* Location */}
            <Section>
                <FieldLabel>Office Location</FieldLabel>
                <IconInput icon={<HiOutlineMapPin size={16} />} value={location} onChange={setLocation} placeholder="City, Country" />
            </Section>

            {/* Hiring For Roles */}
            <Section>
                <FieldLabel>Actively Hiring For</FieldLabel>
                <SkillsInput skills={hiringFor} skillInput={hiringInput} setSkillInput={setHiringInput} addSkill={addHiringRole} removeSkill={removeHiringRole} placeholder="Type a role..." />
                {availableSuggestions.length > 0 && <SkillSuggestions suggestions={availableSuggestions.slice(0, 5)} onAdd={addHiringRole} />}
            </Section>

            {/* Bio */}
            <Section mb={36}>
                <FieldLabel>About / Hiring Message</FieldLabel>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell candidates about your team, culture, and what you're looking for..." rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 100 }} />
            </Section>

            <SaveButton onClick={handleSave} label="Save Recruiter Profile" />
        </>
    );
}

/* ═════════════════════ SHARED COMPONENTS ═════════════════════ */

const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
    color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none',
    fontFamily: 'var(--font-sans)',
};

function Section({ children, mb = 28 }) {
    return <div style={{ marginBottom: mb }}>{children}</div>;
}

function FieldLabel({ children }) {
    return <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, display: 'block' }}>{children}</label>;
}

function FieldInput({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>{label}</label>
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
        </div>
    );
}

function IconInput({ icon, value, onChange, placeholder }) {
    return (
        <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{icon}</span>
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
    );
}

function InputPrefix({ children }) {
    return (
        <div style={{
            padding: '11px 14px', background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)', borderRight: 'none',
            borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap',
        }}>{children}</div>
    );
}

function PhotoUpload({ photoPreview, fallback, fileRef, onChange }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
                <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: photoPreview ? `url(${photoPreview}) center/cover` : 'var(--bg-elevated)',
                    border: '3px solid var(--border-default)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', fontSize: '2.5rem', fontWeight: 700, overflow: 'hidden',
                }}>
                    {!photoPreview && fallback}
                </div>
                <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--accent-primary)', border: '3px solid var(--bg-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <HiCamera size={14} style={{ color: '#fff' }} />
                </div>
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={onChange} style={{ display: 'none' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: 12 }}>Profile Photo</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>JPG or PNG. Max 2MB.</span>
        </div>
    );
}

function DropZone({ onClick, icon, title, subtitle }) {
    return (
        <button onClick={onClick} style={{
            width: '100%', padding: '36px 24px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)', border: '2px dashed var(--border-default)',
            color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            transition: 'border-color var(--transition-fast)', fontFamily: 'var(--font-sans)',
        }}>
            {icon}
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
            <span style={{ fontSize: '0.72rem' }}>{subtitle}</span>
        </button>
    );
}

function UploadedState({ onRemove, label }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
        }}>
            <HiOutlineCheckCircle size={22} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>{label}</span>
            <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 500 }}>Remove</button>
        </div>
    );
}

function SkillsInput({ skills, skillInput, setSkillInput, addSkill, removeSkill, placeholder }) {
    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
            padding: '10px 14px', minHeight: 48,
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
        }}>
            {skills.map(s => (
                <span key={s} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-glow)', color: 'var(--accent-primary)',
                    fontSize: '0.78rem', fontWeight: 500, border: '1px solid var(--border-accent)',
                }}>
                    {s}
                    <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0 }}><HiXMark size={13} /></button>
                </span>
            ))}
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder={skills.length === 0 ? (placeholder || 'Type a skill...') : ''}
                style={{ flex: 1, minWidth: 100, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', fontFamily: 'var(--font-sans)' }}
            />
        </div>
    );
}

function SkillSuggestions({ suggestions, onAdd }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Suggestions:</span>
            {suggestions.map(s => (
                <button key={s} onClick={() => onAdd(s)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                    background: 'none', border: '1px solid var(--border-default)',
                    color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', transition: 'all 150ms',
                }}>
                    <HiPlus size={10} /> {s}
                </button>
            ))}
        </div>
    );
}

function SaveButton({ onClick, label }) {
    return (
        <>
            <button onClick={onClick} className="btn-primary" style={{
                width: '100%', justifyContent: 'center', padding: '14px',
                fontSize: '0.95rem', fontWeight: 700, borderRadius: 'var(--radius-md)',
            }}>
                {label}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 16, marginBottom: 40 }}>
                You can always update this later in settings.
            </p>
        </>
    );
}

/* ═══════════════════ PROFILE SYNC SUCCESS MODAL ═══════════════════ */
function ProfileSyncSuccess({ isRecruiter }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const skills = isRecruiter ? (user?.hiringFor || []) : (user?.skills || []);
    const displaySkills = skills.slice(0, 3);
    const moreCount = skills.length - displaySkills.length;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--bg-primary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            overflowY: 'auto',
        }}>
            {/* Top bar */}
            <div style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 28px', flexShrink: 0,
            }}>
                <button onClick={() => navigate(isRecruiter ? '/admin' : '/dashboard')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', fontSize: '1.4rem', lineHeight: 1,
                }}>
                    <HiXMark size={24} />
                </button>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>SkillSync</span>
                <div style={{ width: 24 }} />
            </div>

            {/* Content */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '0 32px', maxWidth: 420, textAlign: 'center',
            }}>
                {/* Checkmark illustration */}
                <div style={{ position: 'relative', marginBottom: 36 }}>
                    <span style={{ position: 'absolute', top: -8, left: -14, fontSize: '1.4rem', color: '#FBBF24' }}>&#9733;</span>
                    <span style={{ position: 'absolute', top: 20, right: -30, fontSize: '0.9rem', opacity: 0.6, color: '#FBBF24' }}>&#10024;</span>
                    <span style={{ position: 'absolute', bottom: -10, right: -10, fontSize: '1.1rem', color: '#FBBF24' }}>&#10022;</span>

                    <div style={{
                        width: 120, height: 120, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 60px rgba(59,130,246,0.3)',
                    }}>
                        <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 12 }}>
                    Profile Successfully Synced!
                </h1>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 36 }}>
                    We've analyzed your data to build your professional profile.
                </p>

                {/* Analysis card */}
                <div style={{
                    width: '100%', padding: '24px', borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                    textAlign: 'left', marginBottom: 40,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                            background: 'var(--accent-glow)', border: '1px solid var(--border-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent-primary)',
                        }}>
                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <rect x={3} y={3} width={18} height={18} rx={2} />
                                <path d="M3 9h18M9 21V9" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Initial Analysis Complete</div>
                            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {skills.length} {isRecruiter ? 'roles' : 'skills'} identified
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {isRecruiter ? `${user?.hiringFor?.length || 0} positions active` : '3 certificates verified'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {skills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {displaySkills.map(s => (
                                <span key={s} style={{
                                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                    fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                                    background: 'var(--accent-glow)', color: 'var(--accent-primary)',
                                    border: '1px solid var(--border-accent)', letterSpacing: '0.03em',
                                }}>{s}</span>
                            ))}
                            {moreCount > 0 && (
                                <span style={{
                                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                    fontSize: '0.72rem', fontWeight: 600,
                                    background: 'var(--bg-elevated)', color: 'var(--text-muted)',
                                    border: '1px solid var(--border-default)',
                                }}>+{moreCount} MORE</span>
                            )}
                        </div>
                    )}
                </div>

                {/* CTA */}
                <button onClick={() => navigate(isRecruiter ? '/admin' : '/dashboard')} className="btn-primary" style={{
                    width: '100%', justifyContent: 'center', padding: '16px',
                    fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-md)', gap: 8,
                }}>
                    {isRecruiter ? 'Go to Dashboard' : 'Show My Ultimate Profile'}
                    <span style={{ fontSize: '1.1rem' }}>&rarr;</span>
                </button>

                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 16, marginBottom: 40 }}>
                    {isRecruiter ? 'Profile visible to all applicants.' : 'Skills updated across all campus opportunities.'}
                </p>
            </div>
        </div>
    );
}
