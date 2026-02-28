import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi2';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center cursor-pointer"
            style={{
                width: 38, height: 38,
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: theme === 'dark' ? '#F59E0B' : 'var(--accent-primary)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
            }}
        >
            {theme === 'dark' ? <HiSun size={18} /> : <HiMoon size={18} />}
        </button>
    );
}
