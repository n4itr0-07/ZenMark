import React from 'react';
import { ArrowLeft, Github, Heart, ExternalLink, FileText, Eye, Pin, Sun, Upload, Download, Keyboard, Palette, Copy, Printer, Maximize2, Clock, Strikethrough, Heading2, Quote, Code2, Bold, Italic, Link, Code, List, Share2, Lock } from 'lucide-react';

const AboutPage = ({ onBack }) => {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-app)',
            overflow: 'auto',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'var(--bg-sidebar)',
            }}>
                <button
                    onClick={onBack}
                    className="icon-btn"
                    title="Back to Notes"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>About ZenMark</h1>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                padding: '40px',
                maxWidth: '900px',
                margin: '0 auto',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
            }}>
                {/* Hero Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '48px',
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        color: 'var(--primary-color)',
                        marginBottom: '16px',
                        fontWeight: 700,
                    }}>
                        ZenMark
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        A modern, offline-capable markdown note-taking app
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        No servers • No sign-ups • 100% Private • Works Offline
                    </p>
                </div>

                {/* About Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        What is ZenMark?
                    </h3>
                    <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        ZenMark is a <strong style={{ color: 'var(--text-primary)' }}>privacy-focused</strong> note-taking application designed for developers, writers, and anyone who loves Markdown.
                        All your notes are stored locally in your browser's IndexedDB — <strong style={{ color: 'var(--primary-color)' }}>no accounts, no servers, no data collection</strong>.
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Built as a Progressive Web App (PWA), ZenMark works completely offline and can be installed on your device like a native app.
                    </p>
                </section>

                {/* All Features Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        All Features
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '12px',
                    }}>
                        {[
                            { icon: FileText, title: 'Full Markdown', desc: 'Headers, lists, tables, code blocks, blockquotes' },
                            { icon: Eye, title: 'Live Preview', desc: 'Split view, edit-only, or preview-only modes' },
                            { icon: Share2, title: 'Secure Sharing', desc: 'Share notes via encrypted links' },
                            { icon: Lock, title: 'End-to-End Encrypted', desc: 'Shared notes are encrypted in your browser' },
                            { icon: Palette, title: 'Syntax Highlighting', desc: '60+ languages with one-click copy' },
                            { icon: Pin, title: 'Pin Notes', desc: 'Keep important notes at the top' },
                            { icon: Sun, title: 'Light & Dark Themes', desc: 'Toggle with Alt+T, saves preference' },
                            { icon: FileText, title: '6 Note Templates', desc: 'Meeting, To-Do, Journal, Project, Code' },
                            { icon: Clock, title: 'Reading Time', desc: 'Estimated time based on word count' },
                            { icon: Copy, title: 'Duplicate Notes', desc: 'Create copies with one click' },
                            { icon: Maximize2, title: 'Focus Mode', desc: 'Distraction-free writing experience' },
                            { icon: Printer, title: 'Print Notes', desc: 'Print formatted markdown cleanly' },
                            { icon: Upload, title: 'Import Files', desc: 'Import .md and .txt files' },
                            { icon: Download, title: 'Export & Backup', desc: 'Download as .md or backup all as JSON' },
                        ].map((feature, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '12px',
                                background: 'var(--bg-card)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-subtle)',
                            }}>
                                <feature.icon size={20} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '0.95rem' }}>
                                        {feature.title}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Complete User Guide */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        Complete User Guide
                    </h3>
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                    }}>
                        {[
                            { step: '1', title: 'Create a Note', desc: 'Click the + dropdown → Select a template or "Blank Note". Shortcut: Alt+N' },
                            { step: '2', title: 'Write in Markdown', desc: 'Use **bold**, *italic*, `code`, # headers, - lists, > quotes, and more' },
                            { step: '3', title: 'Use the Toolbar', desc: 'Quick buttons for Bold, Italic, Strikethrough, Heading, Quote, List, Link, Code' },
                            { step: '4', title: 'Preview Your Work', desc: 'Toggle between Edit, Split, and Preview modes using the view buttons' },
                            { step: '5', title: 'Pin Important Notes', desc: 'Click the pin icon on any note to keep it at the top of your list' },
                            { step: '6', title: 'Search Notes', desc: 'Use the search bar in the sidebar to find notes by title or content' },
                            { step: '7', title: 'Switch Themes', desc: 'Click the sun/moon icon or press Alt+T to toggle light/dark mode' },
                            { step: '8', title: 'Focus Mode', desc: 'Click the maximize icon to hide the sidebar and focus on writing' },
                            { step: '9', title: 'Export & Backup', desc: 'Download individual notes as .md or backup all notes as JSON' },
                            { step: '10', title: 'Install as App', desc: 'On Chrome/Edge, click the install icon in the address bar' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                padding: '14px 16px',
                                borderBottom: i < 9 ? '1px solid var(--border-subtle)' : 'none',
                            }}>
                                <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    flexShrink: 0,
                                }}>
                                    {item.step}
                                </div>
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '0.95rem' }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Keyboard Shortcuts - Complete */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        Keyboard Shortcuts
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '8px',
                    }}>
                        {[
                            { keys: 'Ctrl + S', action: 'Save note' },
                            { keys: 'Alt + N', action: 'New note' },
                            { keys: 'Alt + T', action: 'Toggle theme' },
                            { keys: 'Ctrl + B', action: 'Bold text' },
                            { keys: 'Ctrl + I', action: 'Italic text' },
                            { keys: 'Ctrl + K', action: 'Insert link' },
                            { keys: 'Ctrl + `', action: 'Inline code' },
                            { keys: 'Ctrl + Shift + C', action: 'Code block' },
                            { keys: 'Ctrl + Shift + S', action: 'Strikethrough' },
                            { keys: 'Ctrl + H', action: 'Heading' },
                            { keys: 'Ctrl + Shift + Q', action: 'Blockquote' },
                            { keys: 'Ctrl + Shift + L', action: 'List item' },
                        ].map((shortcut, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 14px',
                                background: 'var(--bg-card)',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                            }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{shortcut.action}</span>
                                <kbd style={{
                                    background: 'var(--bg-sidebar)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-subtle)',
                                }}>
                                    {shortcut.keys}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contribute Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        Contribute
                    </h3>
                    <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        ZenMark is open source! Contributions, bug reports, and feature requests are welcome.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <a
                            href="https://github.com/n4itr0-07/ZenMark"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}
                        >
                            <Github size={18} />
                            View on GitHub
                            <ExternalLink size={14} />
                        </a>
                        <a
                            href="https://github.com/n4itr0-07/ZenMark/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'transparent',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-primary)',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}
                        >
                            Report an Issue
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    paddingTop: '32px',
                    borderTop: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                }}>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> by the ZenMark Team
                    </p>
                    <p style={{ marginTop: '8px' }}>
                        MIT License © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
