import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}>
                <HiChevronLeft size={16} />
            </button>

            {pages.map(p => (
                <button key={p} onClick={() => onPageChange(p)}
                    style={{
                        width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                        background: p === currentPage ? 'var(--accent-primary)' : 'var(--bg-card)',
                        border: `1px solid ${p === currentPage ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                        color: p === currentPage ? '#fff' : 'var(--text-secondary)',
                        fontWeight: p === currentPage ? 700 : 400, fontSize: '0.8rem',
                        cursor: 'pointer', transition: 'all 150ms',
                    }}>
                    {p}
                </button>
            ))}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}>
                <HiChevronRight size={16} />
            </button>
        </div>
    );
}
