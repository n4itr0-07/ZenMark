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
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
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
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    };

    const getPreview = (content) => {
        if (!content) return '';
        const cleaned = content
            .replace(/#{1,6}\s/g, '')
            .replace(/\*\*|__|\*|_|~~|`/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/^\s*[-*+>]\s/gm, '')
            .trim();
        const firstLine = cleaned.split('\n').find(l => l.trim());
        return firstLine ? firstLine.trim().slice(0, 72) : '';
    };

    const handleCreateFromTemplate = (templateId) => {
        onCreateNote(templateId);
        setShowTemplates(false);
    };

    return (
        <aside style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--bg-sidebar)' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                flexShrink: 0,
            }}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">✦</div>
                    ZenMark
                    <span className="note-count-badge">{notes.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button
                        className="icon-btn"
                        onClick={onToggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                    <div style={{ position: 'relative' }}>
                        <button
                            className="icon-btn active"
                            onClick={() => setShowTemplates(!showTemplates)}
                            title="New Note (Alt+N)"
                            style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 10px' }}
                        >
                            <Plus size={18} />
                            <ChevronDown size={11} />
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
                                    marginTop: '6px',
                                    background: 'var(--glass-bg)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '10px',
                                    boxShadow: 'var(--glass-shadow)',
                                    zIndex: 99,
                                    minWidth: '168px',
                                    overflow: 'hidden',
                                    padding: '4px',
                                }}>
                                    {templates.map((t) => (
                                        <button
                                            key={t.id}
                                            className="template-item"
                                            onClick={() => handleCreateFromTemplate(t.id)}
                                        >
                                            <t.icon size={15} color="var(--text-secondary)" />
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
            <div style={{ padding: '12px 12px 8px' }}>
                <div className="search-bar">
                    <Search size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            className="icon-btn"
                            onClick={() => setSearch('')}
                            style={{ padding: '2px', minWidth: 'unset', minHeight: 'unset' }}
                            title="Clear search"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>
            </div>

            {/* Notes List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
                {filteredNotes.length === 0 && (
                    <div style={{ padding: '28px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {search ? 'No matching notes' : 'No notes yet'}
                    </div>
                )}

                {filteredNotes.map(note => (
                    <div
                        key={note.id}
                        className={`note-card ${note.id === activeNoteId ? 'active' : ''}`}
                        onClick={() => onSelectNote(note.id)}
                    >
                        <div className="note-card-header">
                            <div className="note-card-icon">
                                <FileText size={14} />
                                {note.pinned && (
                                    <Pin
                                        size={7}
                                        style={{
                                            position: 'absolute',
                                            top: -3,
                                            right: -3,
                                            color: 'var(--warning)',
                                            fill: 'var(--warning)',
                                        }}
                                    />
                                )}
                            </div>
                            <div className="note-card-meta">
                                <div className="note-card-title">{note.title || 'Untitled Note'}</div>
                                <div className="note-card-date">{formatDate(note.updatedAt)}</div>
                            </div>
                            <div className="note-card-actions">
                                <button
                                    className="icon-btn"
                                    style={{
                                        padding: '3px',
                                        color: note.pinned ? 'var(--warning)' : 'var(--text-muted)',
                                    }}
                                    onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
                                    title={note.pinned ? 'Unpin Note' : 'Pin Note'}
                                >
                                    <Pin size={12} style={note.pinned ? { fill: 'var(--warning)' } : {}} />
                                </button>
                                <button
                                    className="icon-btn"
                                    style={{ padding: '3px' }}
                                    onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                                    title="Delete Note"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                        {note.content && (
                            <div className="note-card-preview">
                                {getPreview(note.content)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{
                padding: '10px 12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '4px',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
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
                    <Upload size={17} />
                </button>
                <button
                    className="icon-btn"
                    onClick={onExportAll}
                    title="Export all notes (backup)"
                >
                    <Download size={17} />
                </button>
                <a
                    href="https://github.com/n4itr0-07/ZenMark"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    title="View on GitHub"
                    style={{ textDecoration: 'none' }}
                >
                    <Github size={17} />
                </a>
                <button
                    className="icon-btn"
                    onClick={onShowAbout}
                    title="About ZenMark"
                >
                    <Info size={17} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
