import React, { useState } from 'react';
import { Plus, Trash2, Search, FileText, Github, Info } from 'lucide-react';

const Sidebar = ({ notes, activeNoteId, onSelectNote, onCreateNote, onDeleteNote, onShowAbout }) => {
    const [search, setSearch] = useState('');

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div className="sidebar-header">
                <h1 className="sidebar-heading">ZenMark</h1>
                <button className="icon-btn active" onClick={onCreateNote} title="New Note">
                    <Plus size={20} />
                </button>
            </div>

            {/* Search */}
            <div style={{ padding: '0 12px', marginTop: '12px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <Search size={14} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            marginLeft: '8px',
                            color: 'var(--text-primary)',
                            width: '100%',
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            {/* Notes List - Scrollable */}
            <div className="file-list" style={{ flex: 1, overflow: 'auto' }}>
                {filteredNotes.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {search ? 'No notes found' : 'No notes yet'}
                    </div>
                )}

                {filteredNotes.map(note => (
                    <div
                        key={note.id}
                        className={`file-item ${note.id === activeNoteId ? 'active' : ''}`}
                        onClick={() => onSelectNote(note.id)}
                    >
                        <FileText size={16} />
                        <div style={{ flex: 1, marginLeft: '10px', overflow: 'hidden' }}>
                            <div className="file-name">{note.title || 'Untitled Note'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {formatDate(note.updatedAt)}
                            </div>
                        </div>
                        <button
                            className="icon-btn"
                            style={{ padding: '4px', opacity: 0.6 }}
                            onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                            title="Delete Note"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer - Fixed at bottom */}
            <div style={{
                padding: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                <a
                    href="https://github.com/n4itr0-07/ZenMark"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    title="View on GitHub"
                    style={{ textDecoration: 'none' }}
                >
                    <Github size={18} />
                </a>
                <button
                    className="icon-btn"
                    onClick={onShowAbout}
                    title="About ZenMark"
                >
                    <Info size={18} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
