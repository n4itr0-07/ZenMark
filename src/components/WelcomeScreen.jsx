import React from 'react';
import { FileText, Zap, Lock, Wifi, Download, Keyboard, Plus } from 'lucide-react';

const WelcomeScreen = ({ onCreateNote, isMobile, onOpenSidebar }) => {
    return (
        <div className="welcome-container">
            <div className="welcome-content-wrapper">
                {/* Hero */}
                <div className="welcome-hero">
                    <div className="welcome-badge">
                        ✦ Markdown Notes
                    </div>
                    <h1 className="welcome-title">
                        Write. Think. Zen.
                    </h1>
                    <p className="welcome-subtitle">
                        A beautiful, offline-capable markdown editor.{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>No account. No tracking. 100% yours.</strong>
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="welcome-actions">
                    <button
                        onClick={() => onCreateNote('blank')}
                        className="welcome-btn-primary"
                    >
                        <Plus size={18} />
                        New Note
                    </button>
                    {isMobile && (
                        <button
                            onClick={onOpenSidebar}
                            className="welcome-btn-secondary"
                        >
                            Open Menu
                        </button>
                    )}
                </div>

                {/* Features Grid */}
                <div className="welcome-features-grid">
                    {[
                        { icon: FileText, title: 'Full Markdown', desc: 'Headers, lists, code blocks, tables & more' },
                        { icon: Lock, title: '100% Private', desc: 'All data stays on your device' },
                        { icon: Wifi, title: 'Works Offline', desc: 'No internet required once loaded' },
                        { icon: Zap, title: 'Instant & Fast', desc: 'Zero lag, instant loading' },
                        { icon: Download, title: 'Export Anytime', desc: 'Download as .md or backup all' },
                        { icon: Keyboard, title: 'Shortcuts', desc: 'Ctrl+B, Ctrl+I, Ctrl+K & more' },
                    ].map((feature, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon-wrap">
                                <feature.icon size={18} color="var(--primary-color)" />
                            </div>
                            <div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Start Guide */}
                <div className="quick-start-card">
                    <h3 className="feature-title" style={{ fontSize: '0.9rem', marginBottom: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Quick Start
                    </h3>
                    <ol className="quick-start-list">
                        <li>Click <strong style={{ color: 'var(--text-primary)' }}>"New Note"</strong> above</li>
                        <li>Write in Markdown (or plain text)</li>
                        <li>Notes auto-save to your browser</li>
                        <li>Use the sidebar to manage notes</li>
                    </ol>
                </div>

                {/* Footer hint */}
                <p className="welcome-footer">
                    💡 {isMobile ? 'Tap ☰ menu' : 'Use the sidebar'} for templates, themes & tools
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
