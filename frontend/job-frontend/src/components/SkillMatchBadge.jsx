export default function SkillMatchBadge({ percentage, size = 'md', showLabel = true }) {
    const sizes = {
        sm: { dim: 40, stroke: 3, font: '0.65rem' },
        md: { dim: 56, stroke: 4, font: '0.8rem' },
        lg: { dim: 80, stroke: 5, font: '1.1rem' },
    };

    const s = sizes[size];
    const radius = (s.dim - s.stroke * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const color = percentage >= 70 ? 'var(--success)' : percentage >= 40 ? 'var(--warning)' : 'var(--danger)';

    return (
        <div className="flex items-center gap-2">
            <svg width={s.dim} height={s.dim} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={s.dim / 2} cy={s.dim / 2} r={radius}
                    fill="none" stroke="var(--border-default)" strokeWidth={s.stroke} />
                <circle cx={s.dim / 2} cy={s.dim / 2} r={radius}
                    fill="none" stroke={color} strokeWidth={s.stroke}
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                    fill={color} fontSize={s.font} fontWeight="700"
                    style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
                    {percentage}%
                </text>
            </svg>
            {showLabel && size !== 'sm' && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match</span>
            )}
        </div>
    );
}
