import { useState, useEffect } from 'react';
import { fetchApplications, updateApplicationStatus, removeApplication } from '../api/mockApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { HiOutlineBriefcase, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const columns = [
    { id: 'applied', title: 'Applied', color: 'var(--accent-primary)' },
    { id: 'interview', title: 'Interview', color: 'var(--warning)' },
    { id: 'selected', title: 'Selected', color: 'var(--success)' },
    { id: 'rejected', title: 'Rejected', color: 'var(--danger)' },
];

export default function Tracker() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications().then(a => { setApps(a); setLoading(false); });
    }, []);

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const newStatus = destination.droppableId;

        setApps(prev => prev.map(a => a.id === draggableId ? { ...a, status: newStatus } : a));
        await updateApplicationStatus(draggableId, newStatus);
    };

    const handleRemove = async (appId) => {
        setApps(prev => prev.filter(a => a.id !== appId));
        await removeApplication(appId);
        toast.success('Application removed');
    };

    if (loading) return (
        <div className="flex items-center justify-center py-16">
            <div className="spinner" />
        </div>
    );

    return (
        <div>
            <span className="section-label">Kanban Board</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '4px', marginBottom: '8px' }}>
                Opportunity Tracker
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
                Apply to jobs from the Opportunities page. Drag cards to track your progress.
            </p>

            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                    {columns.map(col => {
                        const items = apps.filter(a => a.status === col.id);
                        return (
                            <div key={col.id} style={{
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-default)',
                                display: 'flex', flexDirection: 'column',
                            }}>
                                {/* Column Header */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '16px 20px',
                                    borderBottom: `2px solid ${col.color}`,
                                }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{col.title}</span>
                                    <span style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 26, height: 26, borderRadius: 'var(--radius-full)',
                                        background: col.color, color: '#fff',
                                        fontSize: '0.72rem', fontWeight: 700,
                                    }}>{items.length}</span>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={col.id}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}
                                            style={{
                                                padding: 16, minHeight: 240, flex: 1,
                                                display: 'flex', flexDirection: 'column', gap: 12,
                                                background: snapshot.isDraggingOver ? 'var(--accent-glow)' : 'transparent',
                                                transition: 'background 200ms',
                                            }}>
                                            {items.map((app, index) => (
                                                <Draggable key={app.id} draggableId={app.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                padding: '16px 18px',
                                                                background: snapshot.isDragging ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                                                                border: `1px solid ${snapshot.isDragging ? 'var(--border-accent)' : 'var(--border-default)'}`,
                                                                borderRadius: 'var(--radius-md)',
                                                                boxShadow: snapshot.isDragging ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
                                                            }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                                                <div style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.3 }}>
                                                                    {app.job?.role || 'Unknown Role'}
                                                                </div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRemove(app.id); }}
                                                                    title="Remove application"
                                                                    style={{
                                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                                        color: 'var(--text-muted)', padding: 4, borderRadius: 'var(--radius-sm)',
                                                                        transition: 'color 150ms', flexShrink: 0,
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                                                >
                                                                    <HiOutlineTrash size={14} />
                                                                </button>
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.4 }}>
                                                                {app.job?.company || 'Unknown'}
                                                            </div>
                                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                                {app.appliedAt}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {items.length === 0 && (
                                                <div style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                    justifyContent: 'center', flex: 1, gap: 8,
                                                    color: 'var(--text-muted)',
                                                }}>
                                                    <HiOutlineBriefcase size={28} />
                                                    <span style={{ fontSize: '0.78rem' }}>Drop here</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}
