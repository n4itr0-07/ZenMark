import React from 'react';
import { ArrowLeft, Github, Heart, ExternalLink } from 'lucide-react';

const AboutPage = ({ onBack }) => {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)',
            overflow: 'auto',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
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
                        color: 'var(--text-primary)',
                        marginBottom: '16px',
                        fontWeight: 700,
                    }}>
                        ZenMark
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                        A professional, offline-capable markdown note-taking application
                    </p>
                </div>

                {/* About Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        What is ZenMark?
                    </h3>
                    <p style={{ marginBottom: '16px' }}>
                        ZenMark is a modern, privacy-focused note-taking application designed for developers, writers, and anyone who loves Markdown.
                        All your notes are stored locally in your browser using IndexedDB — no accounts, no servers, no data collection.
                    </p>
                    <p>
                        Built with React and designed with a beautiful dark glassmorphism theme, ZenMark provides a distraction-free
                        writing experience with powerful markdown features.
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
                            { title: 'Full Markdown Support', desc: 'Headers, lists, code blocks, tables, and more' },
                            { title: 'Live Preview', desc: 'See your formatted content as you type' },
                            { title: 'GitHub-Flavored Alerts', desc: 'Support for [!NOTE], [!TIP], [!WARNING], etc.' },
                            { title: 'Syntax Highlighting', desc: 'Beautiful code highlighting for 180+ languages' },
                            { title: 'Export Options', desc: 'Download as .md, .txt, or PDF' },
                            { title: 'Works Offline', desc: 'No internet required after first load' },
                            { title: 'Privacy First', desc: 'All data stays in your browser' },
                            { title: 'Dark Theme', desc: 'Easy on the eyes, day or night' },
                        ].map((feature, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-subtle)',
                            }}>
                                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px', fontSize: '1rem' }}>
                                    {feature.title}
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contribute Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.3rem' }}>
                        Contribute
                    </h3>
                    <p style={{ marginBottom: '16px' }}>
                        ZenMark is open source and we welcome contributions! Whether you want to report a bug, suggest a feature,
                        or submit a pull request, we'd love to hear from you.
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
                    color: 'var(--text-muted)',
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
