import React from 'react';
import { FileText, Zap, Lock, Wifi, Download, Keyboard, Plus } from 'lucide-react';

const WelcomeScreen = ({ onCreateNote, isMobile, onOpenSidebar }) => {
    return (
        <div className="welcome-container">
            <div className="welcome-content-wrapper">
                {/* Hero */}
                <div className="welcome-hero">
                    <h1 className="welcome-title">
                        Welcome to ZenMark
                    </h1>
                    <p className="welcome-subtitle">
                        A beautiful, offline-capable markdown note-taking app.<br />
                        <strong style={{ color: 'var(--text-primary)' }}>No account needed. 100% private.</strong>
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="welcome-actions">
                    <button
                        onClick={() => onCreateNote('blank')}
                        className="welcome-btn-primary"
                    >
                        <Plus size={20} />
                        Create Your First Note
                    </button>
                    {/* Always show Open Menu on mobile, or check isMobile prop logic */}
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
                        { icon: Wifi, title: 'Works Offline', desc: 'No internet? No problem!' },
                        { icon: Zap, title: 'Fast & Light', desc: 'Instant loading, zero lag' },
                        { icon: Download, title: 'Export Anytime', desc: 'Download as .md or backup all' },
                        { icon: Keyboard, title: 'Keyboard Shortcuts', desc: 'Ctrl+B, Ctrl+I, Ctrl+K & more' },
                    ].map((feature, i) => (
                        <div key={i} className="feature-card">
                            <feature.icon size={24} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <h3 className="feature-title">
                                    {feature.title}
                                </h3>
                                <p className="feature-desc">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Start Guide */}
                <div className="quick-start-card">
                    <h3 className="feature-title" style={{ fontSize: '1rem', marginBottom: '16px' }}>
                        🚀 Quick Start
                    </h3>
                    <ol className="quick-start-list">
                        <li>Click <strong>"Create Your First Note"</strong> above</li>
                        <li>Write in Markdown (or plain text)</li>
                        <li>Your notes auto-save locally</li>
                        <li>Use the sidebar to manage all your notes</li>
                    </ol>
                </div>

                {/* Footer hint */}
                <p className="welcome-footer">
                    💡 Tip: {isMobile ? 'Tap the ☰ menu' : 'Use the sidebar'} to access templates, themes & more
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
