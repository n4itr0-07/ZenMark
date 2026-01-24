import React from 'react';
import { ArrowLeft, Github, Heart, ExternalLink, FileText, Eye, Pin, Sun, Upload, Download, Keyboard, Palette } from 'lucide-react';

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
                maxWidth: '800px',
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
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        A modern, offline-capable markdown note-taking app
                    </p>
                </div>

                {/* About Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        What is ZenMark?
                    </h3>
                    <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        ZenMark is a privacy-focused note-taking application designed for developers, writers, and anyone who loves Markdown.
                        All your notes are stored locally in your browser — <strong style={{ color: 'var(--text-primary)' }}>no accounts, no servers, no data collection</strong>.
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Built as a Progressive Web App (PWA), ZenMark works offline and can be installed on your device just like a native app.
                    </p>
                </section>

                {/* Features Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        Features
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                    }}>
                        {[
                            { icon: FileText, title: 'Full Markdown Support', desc: 'Headers, lists, code blocks, tables, and more' },
                            { icon: Eye, title: 'Live Preview', desc: 'Split view to see formatted content as you type' },
                            { icon: Palette, title: 'Syntax Highlighting', desc: 'Beautiful code highlighting for 60+ languages' },
                            { icon: Pin, title: 'Pin Notes', desc: 'Keep important notes at the top of your list' },
                            { icon: Sun, title: 'Light & Dark Themes', desc: 'Switch themes to match your preference' },
                            { icon: Upload, title: 'Import Files', desc: 'Import .md and .txt files directly' },
                            { icon: Download, title: 'Export & Backup', desc: 'Download notes or backup everything as JSON' },
                            { icon: Keyboard, title: 'Keyboard Shortcuts', desc: 'Quick actions for power users' },
                        ].map((feature, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-card)',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-subtle)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <feature.icon size={18} color="var(--primary-color)" />
                                    <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1rem' }}>
                                        {feature.title}
                                    </h4>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How to Use Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        How to Use
                    </h3>
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                    }}>
                        {[
                            { step: '1', title: 'Create a Note', desc: 'Click the + button in the sidebar or press Alt+N' },
                            { step: '2', title: 'Write in Markdown', desc: 'Use the editor to write. Bold with **text**, italic with *text*, code with `code`' },
                            { step: '3', title: 'Preview Your Work', desc: 'Click the eye icon to preview, or use split view for side-by-side editing' },
                            { step: '4', title: 'Pin Important Notes', desc: 'Click the pin icon on any note to keep it at the top' },
                            { step: '5', title: 'Export Your Notes', desc: 'Download individual notes as .md or backup all notes using the download icon' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                padding: '16px',
                                borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none',
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    flexShrink: 0,
                                }}>
                                    {item.step}
                                </div>
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '1rem' }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Keyboard Shortcuts Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        Keyboard Shortcuts
                    </h3>
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                    }}>
                        {[
                            { keys: 'Ctrl + S', action: 'Save note' },
                            { keys: 'Alt + N', action: 'Create new note' },
                            { keys: 'Alt + T', action: 'Toggle light/dark theme' },
                        ].map((shortcut, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
                            }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{shortcut.action}</span>
                                <kbd style={{
                                    background: 'var(--bg-sidebar)',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
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
