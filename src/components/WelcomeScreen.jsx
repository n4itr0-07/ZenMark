import React from 'react';
import { FileText, Zap, Lock, Wifi, Download, Keyboard, Plus } from 'lucide-react';

const WelcomeScreen = ({ onCreateNote, isMobile, onOpenSidebar }) => {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '24px' : '48px',
            textAlign: 'center',
            background: 'var(--bg-editor)',
            overflow: 'auto',
        }}>
            {/* Hero */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    Welcome to ZenMark
                </h1>
                <p style={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '500px',
                    lineHeight: 1.6,
                }}>
                    A beautiful, offline-capable markdown note-taking app.<br />
                    <strong style={{ color: 'var(--text-primary)' }}>No account needed. 100% private.</strong>
                </p>
            </div>

            {/* CTA Buttons */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '48px',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                <button
                    onClick={() => onCreateNote('blank')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                    }}
                >
                    <Plus size={20} />
                    Create Your First Note
                </button>
                {isMobile && (
                    <button
                        onClick={onOpenSidebar}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            padding: '14px 28px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Open Menu
                    </button>
                )}
            </div>

            {/* Features Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '16px',
                maxWidth: '800px',
                width: '100%',
            }}>
                {[
                    { icon: FileText, title: 'Full Markdown', desc: 'Headers, lists, code blocks, tables & more' },
                    { icon: Lock, title: '100% Private', desc: 'All data stays on your device' },
                    { icon: Wifi, title: 'Works Offline', desc: 'No internet? No problem!' },
                    { icon: Zap, title: 'Fast & Light', desc: 'Instant loading, zero lag' },
                    { icon: Download, title: 'Export Anytime', desc: 'Download as .md or backup all' },
                    { icon: Keyboard, title: 'Keyboard Shortcuts', desc: 'Ctrl+B, Ctrl+I, Ctrl+K & more' },
                ].map((feature, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '16px',
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'left',
                    }}>
                        <feature.icon size={24} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600 }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Start Guide */}
            <div style={{
                marginTop: '40px',
                padding: '24px',
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                maxWidth: '500px',
                width: '100%',
            }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>
                    🚀 Quick Start
                </h3>
                <ol style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    paddingLeft: '20px',
                    margin: 0,
                    lineHeight: 1.8,
                }}>
                    <li>Click <strong>"Create Your First Note"</strong> above</li>
                    <li>Write in Markdown (or plain text)</li>
                    <li>Your notes auto-save locally</li>
                    <li>Use the sidebar to manage all your notes</li>
                </ol>
            </div>

            {/* Footer hint */}
            <p style={{
                marginTop: '32px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
            }}>
                💡 Tip: {isMobile ? 'Tap the ☰ menu' : 'Use the sidebar'} to access templates, themes & more
            </p>
        </div>
    );
};

export default WelcomeScreen;
