import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Eye, Edit3, Columns, Download, Type, Hash, PanelLeftClose, PanelLeft, Copy, Check, Save, Loader2, Bold, Italic, Link, Code, List, Maximize2, Minimize2, Printer, Strikethrough, Heading2, Quote, Code2 } from 'lucide-react';

const Editor = ({ activeNote, onUpdateNote, onDownload, onToggleSidebar, sidebarVisible, saveStatus = 'saved', theme = 'dark', focusMode = false, onToggleFocusMode, onDuplicate, onPrint }) => {
    const [viewMode, setViewMode] = useState('split');
    const [copiedCode, setCopiedCode] = useState(null);
    const textareaRef = useRef(null);

    // Calculate word, character, line count, and reading time
    const { wordCount, charCount, lineCount, readingTime } = useMemo(() => {
        if (!activeNote?.content) return { wordCount: 0, charCount: 0, lineCount: 0, readingTime: '0 min' };

        const content = activeNote.content;

        // Character count (including spaces and newlines)
        const chars = content.length;

        // Line count
        const lines = content.split('\n').length;

        // Word count - match actual words (alphanumeric sequences)
        const wordMatches = content.match(/\b[\w']+\b/g);
        const words = wordMatches ? wordMatches.length : 0;

        // Reading time (average 200 words per minute)
        const minutes = Math.ceil(words / 200);
        const readTime = minutes < 1 ? '< 1 min' : `${minutes} min read`;

        return { wordCount: words, charCount: chars, lineCount: lines, readingTime: readTime };
    }, [activeNote?.content]);

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
    }, [viewMode]);

    // Reset view mode when switching notes
    useEffect(() => {
        if (activeNote) {
            const noteFormat = activeNote.format || 'markdown';
            if (noteFormat === 'text' && (viewMode === 'split' || viewMode === 'preview')) {
                setViewMode('edit');
            }
        }
    }, [activeNote?.id, activeNote?.format]);

    const handleCopyCode = async (code, id) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(id);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

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

    // Markdown formatting helper
    const insertFormatting = useCallback((prefix, suffix = prefix) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = activeNote.content;
        const selectedText = text.substring(start, end);

        let newText;
        let newCursorPos;

        if (selectedText) {
            // Wrap selection
            newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
            newCursorPos = end + prefix.length + suffix.length;
        } else {
            // Insert placeholder
            newText = text.substring(0, start) + prefix + suffix + text.substring(end);
            newCursorPos = start + prefix.length;
        }

        onEditField('content', newText);

        // Restore cursor position after state update
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [activeNote?.content, onEditField]);

    // Formatting shortcuts
    const handleBold = useCallback(() => insertFormatting('**'), [insertFormatting]);
    const handleItalic = useCallback(() => insertFormatting('*'), [insertFormatting]);
    const handleLink = useCallback(() => insertFormatting('[', '](url)'), [insertFormatting]);
    const handleCode = useCallback(() => insertFormatting('`'), [insertFormatting]);
    const handleList = useCallback(() => insertFormatting('- ', ''), [insertFormatting]);
    const handleCodeBlock = useCallback(() => insertFormatting('```\n', '\n```'), [insertFormatting]);
    const handleStrikethrough = useCallback(() => insertFormatting('~~'), [insertFormatting]);
    const handleHeading = useCallback(() => insertFormatting('## ', ''), [insertFormatting]);
    const handleQuote = useCallback(() => insertFormatting('> ', ''), [insertFormatting]);
    const handleHorizontalRule = useCallback(() => insertFormatting('\n---\n', ''), [insertFormatting]);

    // Keyboard shortcuts for formatting
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!activeNote || noteFormat !== 'markdown') return;

            // Ctrl/Cmd + B = Bold
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                handleBold();
            }
            // Ctrl/Cmd + I = Italic
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                handleItalic();
            }
            // Ctrl/Cmd + K = Link
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                handleLink();
            }
            // Ctrl/Cmd + Shift + C = Code Block (triple ticks)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                handleCodeBlock();
            }
            // Ctrl/Cmd + ` = Inline Code
            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault();
                handleCode();
            }
            // Ctrl/Cmd + Shift + S = Strikethrough
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                handleStrikethrough();
            }
            // Ctrl/Cmd + H = Heading
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                handleHeading();
            }
            // Ctrl/Cmd + Shift + Q = Quote
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Q') {
                e.preventDefault();
                handleQuote();
            }
            // Ctrl/Cmd + Shift + L = List
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                handleList();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeNote, noteFormat, handleBold, handleItalic, handleLink, handleCode, handleCodeBlock, handleStrikethrough, handleHeading, handleQuote, handleList]);

    const showEditor = viewMode === 'edit' || viewMode === 'split' || noteFormat === 'text';
    const showPreview = noteFormat === 'markdown' && (viewMode === 'preview' || viewMode === 'split');
    const isSplit = viewMode === 'split' && noteFormat === 'markdown';

    // Custom components for ReactMarkdown
    // Language display names mapping
    const languageNames = {
        js: 'JavaScript',
        javascript: 'JavaScript',
        ts: 'TypeScript',
        typescript: 'TypeScript',
        jsx: 'JSX',
        tsx: 'TSX',
        py: 'Python',
        python: 'Python',
        java: 'Java',
        cpp: 'C++',
        'c++': 'C++',
        c: 'C',
        cs: 'C#',
        csharp: 'C#',
        php: 'PHP',
        rb: 'Ruby',
        ruby: 'Ruby',
        go: 'Go',
        rust: 'Rust',
        rs: 'Rust',
        swift: 'Swift',
        kotlin: 'Kotlin',
        kt: 'Kotlin',
        scala: 'Scala',
        sql: 'SQL',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        sass: 'Sass',
        less: 'Less',
        json: 'JSON',
        xml: 'XML',
        yaml: 'YAML',
        yml: 'YAML',
        md: 'Markdown',
        markdown: 'Markdown',
        bash: 'Bash',
        shell: 'Shell',
        sh: 'Shell',
        zsh: 'Zsh',
        powershell: 'PowerShell',
        ps1: 'PowerShell',
        dockerfile: 'Dockerfile',
        docker: 'Docker',
        nginx: 'Nginx',
        apache: 'Apache',
        graphql: 'GraphQL',
        r: 'R',
        matlab: 'MATLAB',
        perl: 'Perl',
        lua: 'Lua',
        dart: 'Dart',
        vue: 'Vue',
        svelte: 'Svelte',
        elixir: 'Elixir',
        erlang: 'Erlang',
        haskell: 'Haskell',
        clojure: 'Clojure',
        lisp: 'Lisp',
        scheme: 'Scheme',
        text: 'Text',
        plaintext: 'Plain Text',
        txt: 'Text',
    };

    const getLanguageDisplayName = (lang) => {
        if (!lang) return 'Code';
        const lower = lang.toLowerCase();
        return languageNames[lower] || lang.charAt(0).toUpperCase() + lang.slice(1);
    };

    let codeBlockCounter = 0;

    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            codeBlockCounter++;
            const codeId = `code-block-${codeBlockCounter}`;

            if (!inline && (language || codeString.includes('\n'))) {
                return (
                    <div style={{
                        position: 'relative',
                        margin: '1em 0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                    }}>
                        {/* Code block header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: 'var(--code-header)',
                            borderBottom: '1px solid var(--border-subtle)',
                        }}>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                letterSpacing: '0.3px',
                            }}>
                                {getLanguageDisplayName(language)}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCopyCode(codeString, codeId);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 8px',
                                    background: copiedCode === codeId ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    border: `1px solid ${copiedCode === codeId ? 'var(--success)' : 'var(--border-subtle)'}`,
                                    borderRadius: '4px',
                                    color: copiedCode === codeId ? 'var(--success)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    transition: 'all 0.2s',
                                }}
                                title="Copy code"
                            >
                                {copiedCode === codeId ? (
                                    <>
                                        <Check size={12} />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={12} />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={theme === 'dark' ? oneDark : oneLight}
                            language={language || 'text'}
                            PreTag="div"
                            customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                fontSize: '0.9em',
                                padding: '16px',
                            }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            // Inline code
            return (
                <code style={{
                    background: 'var(--bg-card)',
                    padding: '0.2em 0.4em',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                }} {...props}>
                    {children}
                </code>
            );
        },
        // Headings
        h1: ({ children }) => <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '1.5em', marginBottom: '0.5em', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3em' }}>{children}</h1>,
        h2: ({ children }) => <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1.25em', marginBottom: '0.5em', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3em' }}>{children}</h2>,
        h3: ({ children }) => <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1em', marginBottom: '0.5em', color: 'var(--text-primary)' }}>{children}</h3>,
        h4: ({ children }) => <h4 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1em', marginBottom: '0.5em', color: 'var(--text-primary)' }}>{children}</h4>,
        // Paragraphs
        p: ({ children }) => <p style={{ marginBottom: '1em', lineHeight: 1.7, color: 'var(--text-primary)' }}>{children}</p>,
        // Lists
        ul: ({ children }) => <ul style={{ paddingLeft: '2em', marginBottom: '1em' }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ paddingLeft: '2em', marginBottom: '1em' }}>{children}</ol>,
        li: ({ children }) => <li style={{ marginBottom: '0.5em', color: 'var(--text-primary)' }}>{children}</li>,
        // Links
        a: ({ href, children }) => <a href={href} style={{ color: 'var(--primary-color)', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{children}</a>,
        // Blockquotes
        blockquote: ({ children }) => (
            <blockquote style={{
                borderLeft: '4px solid var(--primary-color)',
                paddingLeft: '16px',
                margin: '1em 0',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                padding: '12px 16px',
                borderRadius: '0 8px 8px 0',
            }}>
                {children}
            </blockquote>
        ),
        // Strong/Bold
        strong: ({ children }) => <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{children}</strong>,
        // Emphasis/Italic
        em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
        // Horizontal rule
        hr: () => <hr style={{ border: 'none', height: '1px', background: 'var(--border-subtle)', margin: '2em 0' }} />,
        // Tables
        table: ({ children }) => <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1em' }}>{children}</table>,
        th: ({ children }) => <th style={{ border: '1px solid var(--border-subtle)', padding: '8px 12px', background: 'var(--bg-card)', fontWeight: 600, textAlign: 'left', color: 'var(--text-primary)' }}>{children}</th>,
        td: ({ children }) => <td style={{ border: '1px solid var(--border-subtle)', padding: '8px 12px', color: 'var(--text-primary)' }}>{children}</td>,
        // Strikethrough
        del: ({ children }) => <del style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{children}</del>,
        // Task lists
        input: ({ checked, ...props }) => (
            <input
                type="checkbox"
                checked={checked}
                readOnly
                style={{ marginRight: '8px' }}
                {...props}
            />
        ),
        // Images
        img: ({ src, alt }) => <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '8px', margin: '1em 0' }} />,
    };

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
                    <button
                        className="icon-btn"
                        onClick={() => onDuplicate && onDuplicate(activeNote)}
                        title="Duplicate Note"
                    >
                        <Copy size={18} />
                    </button>
                    <button
                        className="icon-btn"
                        onClick={onPrint}
                        title="Print Note"
                    >
                        <Printer size={18} />
                    </button>
                    <button
                        className={`icon-btn ${focusMode ? 'active' : ''}`}
                        onClick={onToggleFocusMode}
                        title={focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
                    >
                        {focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>

            {/* Formatting Toolbar - Only for Markdown */}
            {noteFormat === 'markdown' && showEditor && (
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '8px 20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--glass-bg)',
                    flexWrap: 'wrap',
                }}>
                    <button className="icon-btn" onClick={handleBold} title="Bold (Ctrl+B)">
                        <Bold size={16} />
                    </button>
                    <button className="icon-btn" onClick={handleItalic} title="Italic (Ctrl+I)">
                        <Italic size={16} />
                    </button>
                    <button className="icon-btn" onClick={handleStrikethrough} title="Strikethrough (Ctrl+Shift+S)">
                        <Strikethrough size={16} />
                    </button>
                    <div style={{ width: '1px', background: 'var(--border-subtle)', margin: '0 4px' }}></div>
                    <button className="icon-btn" onClick={handleHeading} title="Heading (Ctrl+H)">
                        <Heading2 size={16} />
                    </button>
                    <button className="icon-btn" onClick={handleQuote} title="Quote (Ctrl+Shift+Q)">
                        <Quote size={16} />
                    </button>
                    <button className="icon-btn" onClick={handleList} title="List (Ctrl+Shift+L)">
                        <List size={16} />
                    </button>
                    <div style={{ width: '1px', background: 'var(--border-subtle)', margin: '0 4px' }}></div>
                    <button className="icon-btn" onClick={handleLink} title="Link (Ctrl+K)">
                        <Link size={16} />
                    </button>
                    <button className="icon-btn" onClick={handleCode} title="Inline Code (Ctrl+`)">
                        <Code size={16} />
                    </button>
                    <button className="icon-btn" onClick={handleCodeBlock} title="Code Block (Ctrl+Shift+C)">
                        <Code2 size={16} />
                    </button>
                </div>
            )}

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
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <textarea
                            ref={textareaRef}
                            value={activeNote.content}
                            onChange={(e) => onEditField('content', e.target.value)}
                            placeholder={noteFormat === 'markdown' ? 'Type your markdown here...' : 'Type your text here...'}
                            style={{
                                width: '100%',
                                flex: 1,
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
                        style={{
                            flex: 1,
                            height: '100%',
                            overflow: 'auto',
                            padding: '24px 32px',
                        }}
                    >
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                            >
                                {activeNote.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 20px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-sidebar)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
            }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                    <span>{lineCount} lines</span>
                    <span style={{ color: 'var(--primary-color)' }}>{readingTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {saveStatus === 'saving' && (
                        <>
                            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Saving...</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <Save size={12} style={{ color: 'var(--success)' }} />
                            <span style={{ color: 'var(--success)' }}>Saved</span>
                        </>
                    )}
                    {saveStatus === 'unsaved' && (
                        <>
                            <span style={{ color: 'var(--text-secondary)' }}>Unsaved changes</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;
