import React, { useState, useRef } from 'react';
import { Plus, Trash2, Search, FileText, Github, Info, Pin, Sun, Moon, Upload, Download, ChevronDown, FileEdit, CheckSquare, BookOpen, FolderOpen, Code, X } from 'lucide-react';

const Sidebar = ({ notes, activeNoteId, onSelectNote, onCreateNote, onDeleteNote, onTogglePin, onShowAbout, theme, onToggleTheme, onImportFile, onExportAll, onCloseSidebar, isMobile }) => {
    const [search, setSearch] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);
    const fileInputRef = useRef(null);

    const templates = [
        { id: 'blank', name: 'Blank Note', icon: FileText },
        { id: 'meeting', name: 'Meeting Notes', icon: FileEdit },
        { id: 'todo', name: 'To-Do List', icon: CheckSquare },
        { id: 'journal', name: 'Daily Journal', icon: BookOpen },
        { id: 'project', name: 'Project Doc', icon: FolderOpen },
        { id: 'code', name: 'Code Snippet', icon: Code },
    ];

    // Filter and sort notes - pinned first, then by date
    const filteredNotes = notes
        .filter(note =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            // Pinned notes first
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            // Then by date
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    };

    const handleCreateFromTemplate = (templateId) => {
        onCreateNote(templateId);
        setShowTemplates(false);
    };

    return (
        <aside style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--bg-sidebar)' }}>
            {/* Header */}
            <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="sidebar-heading" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>ZenMark</div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button
                        className="icon-btn"
                        onClick={onToggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <div style={{ position: 'relative' }}>
                        <button
                            className="icon-btn active"
                            onClick={() => setShowTemplates(!showTemplates)}
                            title="New Note (Alt+N)"
                            style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
                        >
                            <Plus size={20} />
                            <ChevronDown size={12} />
                        </button>
                        {showTemplates && (
                            <>
                                <div
                                    style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                                    onClick={() => setShowTemplates(false)}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '4px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    zIndex: 99,
                                    minWidth: '160px',
                                    overflow: 'hidden',
                                }}>
                                    {templates.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => handleCreateFromTemplate(t.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                width: '100%',
                                                padding: '10px 14px',
                                                border: 'none',
                                                background: 'transparent',
                                                color: 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                textAlign: 'left',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-sidebar)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <t.icon size={16} color="var(--text-secondary)" />
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div style={{ padding: '0 12px', marginTop: '12px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-card)',
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
                        <div style={{ position: 'relative' }}>
                            <FileText size={16} />
                            {note.pinned && (
                                <Pin
                                    size={8}
                                    style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        color: 'var(--warning)',
                                        fill: 'var(--warning)'
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ flex: 1, marginLeft: '10px', overflow: 'hidden' }}>
                            <div className="file-name">{note.title || 'Untitled Note'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {formatDate(note.updatedAt)}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            <button
                                className="icon-btn"
                                style={{
                                    padding: '4px',
                                    opacity: note.pinned ? 1 : 0.5,
                                    color: note.pinned ? 'var(--warning)' : 'var(--text-muted)'
                                }}
                                onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
                                title={note.pinned ? 'Unpin Note' : 'Pin Note'}
                            >
                                <Pin size={12} style={note.pinned ? { fill: 'var(--warning)' } : {}} />
                            </button>
                            <button
                                className="icon-btn"
                                style={{ padding: '4px', opacity: 0.6 }}
                                onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                                title="Delete Note"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
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
                {/* Hidden file input for import */}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".md,.txt"
                    onChange={onImportFile}
                    style={{ display: 'none' }}
                />
                <button
                    className="icon-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Import .md or .txt file"
                >
                    <Upload size={18} />
                </button>
                <button
                    className="icon-btn"
                    onClick={onExportAll}
                    title="Export all notes (backup)"
                >
                    <Download size={18} />
                </button>
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
