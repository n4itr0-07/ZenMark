import React, { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Eye, Edit3, Columns, Download, Type, Hash, PanelLeftClose, PanelLeft } from 'lucide-react';

const Editor = ({ activeNote, onUpdateNote, onDownload, onToggleSidebar, sidebarVisible }) => {
    const [viewMode, setViewMode] = useState('split');
    const [htmlContent, setHtmlContent] = useState('');
    const previewRef = useRef(null);

    // Transform GFM alerts
    const transformAlerts = (content) => {
        const alertRegex = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*\n?)*)/gim;
        return content.replace(alertRegex, (match, type, body) => {
            const cleanBody = body.replace(/^>\s?/gm, '').trim();
            return `<div class="markdown-alert markdown-alert-${type.toLowerCase()}"><p class="markdown-alert-title">${type.toUpperCase()}</p>\n\n${cleanBody}\n\n</div>\n`;
        });
    };

    // Parse markdown content
    useEffect(() => {
        if (activeNote) {
            const noteFormat = activeNote.format || 'markdown';
            if (noteFormat === 'text') {
                const escaped = activeNote.content
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br>');
                setHtmlContent(`<div class="plain-text-content">${escaped}</div>`);
            } else {
                marked.setOptions({
                    gfm: true,
                    breaks: true,
                    highlight: function (code, lang) {
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return hljs.highlight(code, { language: lang }).value;
                            } catch (e) { }
                        }
                        return hljs.highlightAuto(code).value;
                    }
                });

                const transformedContent = transformAlerts(activeNote.content);
                const rawHtml = marked.parse(transformedContent);
                const cleanHtml = DOMPurify.sanitize(rawHtml, {
                    ADD_ATTR: ['class'],
                    ADD_TAGS: ['div']
                });
                setHtmlContent(cleanHtml);
            }
        }
    }, [activeNote?.content, activeNote?.format]);

    // Apply highlight.js
    useEffect(() => {
        if (previewRef.current) {
            previewRef.current.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }, [htmlContent]);

    // Handle responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && viewMode === 'split') {
                setViewMode('edit');
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset view mode when switching notes
    useEffect(() => {
        if (activeNote) {
            const noteFormat = activeNote.format || 'markdown';
            if (noteFormat === 'text' && (viewMode === 'split' || viewMode === 'preview')) {
                setViewMode('edit');
            }
        }
    }, [activeNote?.id, activeNote?.format]);

    if (!activeNote) {
        return (
            <div className="main-content" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <p>Select a note or create a new one to start writing.</p>
            </div>
        );
    }

    const noteFormat = activeNote.format || 'markdown';

    const onEditField = (field, value) => {
        onUpdateNote({
            ...activeNote,
            [field]: value,
            updatedAt: new Date().toISOString(),
        });
    };

    const toggleFormat = () => {
        onEditField('format', noteFormat === 'markdown' ? 'text' : 'markdown');
    };

    const showEditor = viewMode === 'edit' || viewMode === 'split' || noteFormat === 'text';
    const showPreview = noteFormat === 'markdown' && (viewMode === 'preview' || viewMode === 'split');
    const isSplit = viewMode === 'split' && noteFormat === 'markdown';

    return (
        <div className="main-content">
            <div className="toolbar">
                <button
                    className="icon-btn"
                    onClick={onToggleSidebar}
                    title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
                    style={{ marginRight: '12px' }}
                >
                    {sidebarVisible ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                </button>

                <input
                    className="file-title-input"
                    value={activeNote.title}
                    onChange={(e) => onEditField('title', e.target.value)}
                    placeholder="Note Title"
                />

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        className={`icon-btn ${noteFormat === 'markdown' ? 'active' : ''}`}
                        onClick={toggleFormat}
                        title={noteFormat === 'markdown' ? 'Switch to Plain Text' : 'Switch to Markdown'}
                    >
                        {noteFormat === 'markdown' ? <Hash size={18} /> : <Type size={18} />}
                    </button>

                    <div style={{ width: '1px', background: 'var(--border-subtle)', margin: '0 4px' }}></div>

                    <button
                        className={`icon-btn ${viewMode === 'edit' ? 'active' : ''}`}
                        onClick={() => setViewMode('edit')}
                        title="Edit Mode"
                    >
                        <Edit3 size={18} />
                    </button>

                    {noteFormat === 'markdown' && (
                        <>
                            <button
                                className={`icon-btn ${viewMode === 'split' ? 'active' : ''}`}
                                onClick={() => setViewMode('split')}
                                title="Split View"
                                style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }}
                            >
                                <Columns size={18} />
                            </button>
                            <button
                                className={`icon-btn ${viewMode === 'preview' ? 'active' : ''}`}
                                onClick={() => setViewMode('preview')}
                                title="Preview Mode"
                            >
                                <Eye size={18} />
                            </button>
                        </>
                    )}

                    <div style={{ width: '1px', background: 'var(--border-subtle)', margin: '0 8px' }}></div>

                    <button
                        className="icon-btn"
                        onClick={() => onDownload(activeNote, noteFormat === 'markdown' ? 'md' : 'txt')}
                        title={`Download ${noteFormat === 'markdown' ? '.md' : '.txt'}`}
                    >
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
            }}>
                {/* Editor */}
                {showEditor && (
                    <div style={{
                        width: isSplit ? '50%' : '100%',
                        height: '100%',
                        borderRight: isSplit ? '2px solid #3b82f6' : 'none',
                    }}>
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => onEditField('content', e.target.value)}
                            placeholder={noteFormat === 'markdown' ? 'Type your markdown here...' : 'Type your text here...'}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: 'transparent',
                                border: 'none',
                                resize: 'none',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1rem',
                                lineHeight: 1.6,
                                outline: 'none',
                                padding: '24px 32px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                )}

                {/* Preview */}
                {showPreview && (
                    <div
                        ref={previewRef}
                        style={{
                            flex: 1,
                            height: '100%',
                            overflow: 'auto',
                            padding: '24px 32px',
                        }}
                    >
                        <div
                            className="markdown-body"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Editor;
