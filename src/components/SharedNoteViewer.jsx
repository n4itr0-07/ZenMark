import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileText, Download, Save, AlertCircle, ArrowLeft, Lock, Clock, Loader2, Eye, EyeOff, Shield, Copy, Check } from 'lucide-react';
import { fetchSharedNote, getShareParams, decryptSharedPassword } from '../lib/sharing';

const SharedNoteViewer = ({ onSaveToNotes, onGoHome, theme }) => {
    const [noteData, setNoteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [timeToLive, setTimeToLive] = useState(null);
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [encryptedData, setEncryptedData] = useState(null);
    const [noteFormat, setNoteFormat] = useState('markdown');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [pwError, setPwError] = useState('');
    const [unlocking, setUnlocking] = useState(false);

    useEffect(() => {
        loadSharedNote();
    }, []);

    const loadSharedNote = async () => {
        setLoading(true);
        setError('');

        const params = getShareParams();
        if (!params) {
            setError('Invalid share link.');
            setLoading(false);
            return;
        }

        const result = await fetchSharedNote(params.pasteId, params.key);

        setLoading(false);

        if (result.success) {
            if (result.passwordProtected) {
                setPasswordRequired(true);
                setEncryptedData(result.encryptedData);
                setNoteFormat(result.format || 'markdown');
                setTimeToLive(result.timeToLive);
            } else {
                setNoteData(result.noteData);
                setTimeToLive(result.timeToLive);
            }
        } else {
            setError(result.error);
        }
    };

    const handleUnlock = async () => {
        if (!password) { setPwError('Enter the password'); return; }
        setUnlocking(true);
        setPwError('');
        const result = await decryptSharedPassword(encryptedData, password);
        setUnlocking(false);
        if (result === null) {
            setPwError('Wrong password — please try again');
            return;
        }
        setNoteData({ ...result, format: noteFormat });
        setPasswordRequired(false);
    };

    const handleSaveToNotes = () => {
        if (noteData && onSaveToNotes) {
            onSaveToNotes(noteData);
            setSaved(true);
        }
    };

    const handleDownload = () => {
        if (!noteData) return;
        const ext = noteData.format === 'markdown' ? 'md' : 'txt';
        const blob = new Blob([noteData.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${noteData.title || 'shared-note'}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatTimeRemaining = (seconds) => {
        if (!seconds) return null;
        if (seconds < 60) return 'less than a minute';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
        return `${Math.floor(seconds / 86400)} days`;
    };

    const CodeBlock = ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';

        if (!inline && language) {
            return (
                <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            );
        }

        return <code className={className} {...props}>{children}</code>;
    };

    // Loading state
    if (loading) {
        return (
            <div className="sv-page">
                <div className="sv-center-card">
                    <div className="sv-spinner-wrap">
                        <Loader2 size={36} className="spinner-icon" />
                    </div>
                    <h2 className="sv-card-title">Decrypting Note</h2>
                    <p className="sv-card-desc">Fetching and decrypting your shared note...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="sv-page">
                <div className="sv-center-card">
                    <div className="sv-icon-circle sv-icon-error">
                        <AlertCircle size={28} />
                    </div>
                    <h2 className="sv-card-title">Unable to Open Note</h2>
                    <p className="sv-card-desc">{error}</p>
                    <button className="sv-btn sv-btn-primary" onClick={onGoHome}>
                        <ArrowLeft size={16} />
                        Go to ZenMark
                    </button>
                </div>
            </div>
        );
    }

    // Password prompt
    if (passwordRequired) {
        return (
            <div className="sv-page">
                <div className="sv-center-card sv-card-password">
                    <div className="sv-icon-circle sv-icon-lock">
                        <Lock size={28} />
                    </div>
                    <h2 className="sv-card-title">Password Protected</h2>
                    <p className="sv-card-desc">This note is protected. Enter the password to view it.</p>
                    <form onSubmit={(e) => { e.preventDefault(); handleUnlock(); }} className="sv-pw-form">
                        <div className="sv-pw-field">
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setPwError(''); }}
                                autoFocus
                                placeholder="Enter password"
                                className={`sv-pw-input ${pwError ? 'sv-pw-input-error' : ''}`}
                            />
                            <button type="button" className="sv-pw-toggle" onClick={() => setShowPw(!showPw)}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {pwError && <p className="sv-pw-error">{pwError}</p>}
                        <button type="submit" className="sv-btn sv-btn-primary sv-btn-full" disabled={unlocking}>
                            {unlocking ? (
                                <><Loader2 size={16} className="spinner-icon" /> Decrypting...</>
                            ) : (
                                <><Lock size={16} /> Unlock Note</>
                            )}
                        </button>
                    </form>
                    {timeToLive && (
                        <div className="sv-meta-badge">
                            <Clock size={12} />
                            Expires in {formatTimeRemaining(timeToLive)}
                        </div>
                    )}
                </div>
                <div className="sv-page-footer">
                    <button className="sv-footer-link" onClick={onGoHome}>
                        <ArrowLeft size={14} />
                        Create your own notes
                    </button>
                    <span className="sv-footer-brand">Powered by <strong>ZenMark</strong></span>
                </div>
            </div>
        );
    }

    // Note content
    return (
        <div className="sv-page">
            <div className="sv-note-card">
                <div className="sv-note-header">
                    <div className="sv-note-header-left">
                        <div className="sv-badge-row">
                            <span className="sv-badge">
                                <Shield size={12} />
                                Encrypted
                            </span>
                            {timeToLive && (
                                <span className="sv-badge sv-badge-muted">
                                    <Clock size={12} />
                                    {formatTimeRemaining(timeToLive)} left
                                </span>
                            )}
                        </div>
                        <h1 className="sv-note-title">
                            <FileText size={22} />
                            {noteData?.title || 'Untitled Note'}
                        </h1>
                    </div>
                    <div className="sv-note-actions">
                        <button className="sv-btn sv-btn-ghost" onClick={handleDownload} title="Download">
                            <Download size={18} />
                            <span className="sv-btn-label">Download</span>
                        </button>
                        <button
                            className={`sv-btn sv-btn-primary ${saved ? 'sv-btn-saved' : ''}`}
                            onClick={handleSaveToNotes}
                            disabled={saved}
                        >
                            <Save size={18} />
                            <span className="sv-btn-label">{saved ? 'Saved!' : 'Save to My Notes'}</span>
                        </button>
                    </div>
                </div>

                <div className="sv-note-body">
                    {noteData?.format === 'markdown' || noteData?.format === undefined ? (
                        <div className="markdown-preview sv-markdown">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{ code: CodeBlock }}
                            >
                                {noteData?.content || ''}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <pre className="sv-plaintext">
                            {noteData?.content || ''}
                        </pre>
                    )}
                </div>
            </div>

            <div className="sv-page-footer">
                <button className="sv-footer-link" onClick={onGoHome}>
                    <ArrowLeft size={14} />
                    Create your own notes
                </button>
                <span className="sv-footer-brand">Powered by <strong>ZenMark</strong></span>
            </div>
        </div>
    );
};

export default SharedNoteViewer;
