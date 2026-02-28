import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    HiOutlineBriefcase, HiOutlineBookmark, HiOutlineViewColumns,
    HiOutlineChartBarSquare, HiOutlineUser,
    HiOutlineArrowRightOnRectangle, HiBars3, HiXMark
} from 'react-icons/hi2';
import { RiDashboardLine } from 'react-icons/ri';
import ThemeToggle from './ThemeToggle';

const studentLinks = [
    { to: '/jobs', icon: HiOutlineBriefcase, label: 'Opportunities' },
    { to: '/saved', icon: HiOutlineBookmark, label: 'Saved Jobs' },
    { to: '/tracker', icon: HiOutlineViewColumns, label: 'Tracker' },
    { to: '/dashboard', icon: HiOutlineChartBarSquare, label: 'Intelligence' },
    { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

const adminLinks = [
    { to: '/admin', icon: RiDashboardLine, label: 'Dashboard' },
    { to: '/jobs', icon: HiOutlineBriefcase, label: 'All Jobs' },
    { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 40,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                }} onClick={() => setSidebarOpen(false)} />
            )}

            {/* Left Sidebar */}
            <aside style={{
                width: 260, minWidth: 260, height: '100vh',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-default)',
                position: sidebarOpen ? 'fixed' : undefined,
                top: 0, left: 0, zIndex: sidebarOpen ? 50 : undefined,
                transform: sidebarOpen ? 'translateX(0)' : undefined,
            }}
                className="layout-sidebar"
            >
                {/* Logo */}
                <div style={{
                    height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px', borderBottom: '1px solid var(--border-default)',
                }}>
                    <button onClick={() => navigate('/')} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: 'none', cursor: 'pointer',
                    }}>
                        <span style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                            skill<span style={{ color: 'var(--text-primary)' }}>Sync</span>
                        </span>
                        <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', fontWeight: 400, fontSize: '0.875rem' }}>/&gt;</span>
                    </button>
                    {/* Close — only shows via CSS on mobile */}
                    <button className="mobile-only btn-ghost" onClick={() => setSidebarOpen(false)}>
                        <HiXMark size={22} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <link.icon size={20} style={{ flexShrink: 0 }} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom: User + Logout */}
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--accent-primary), #6366F1)',
                            color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Hi {user?.name} !</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', justifyContent: 'center', padding: '10px 16px',
                        background: 'none', border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                        color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500,
                        transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
                    }}>
                        <HiOutlineArrowRightOnRectangle size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Right side: Navbar + Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Top Navbar */}
                <header style={{
                    height: 64, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 32px',
                    background: 'var(--bg-surface)',
                    borderBottom: '1px solid var(--border-default)',
                }}>
                    {/* Hamburger — only shows via CSS on mobile */}
                    <button className="mobile-only btn-ghost" onClick={() => setSidebarOpen(true)}>
                        <HiBars3 size={22} />
                    </button>
                    <div />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ThemeToggle />
                        <div style={{
                            padding: '6px 12px', borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                            fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)',
                        }}>
                            {user?.role === 'admin' ? 'Admin' : 'Student'}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '40px 40px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
