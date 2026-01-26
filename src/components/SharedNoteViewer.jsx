import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileText, Download, Save, AlertCircle, ArrowLeft, Lock, Clock, Loader2, ExternalLink } from 'lucide-react';
import { fetchSharedNote, getShareParams } from '../lib/sharing';

const SharedNoteViewer = ({ onSaveToNotes, onGoHome, theme }) => {
    const [noteData, setNoteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [timeToLive, setTimeToLive] = useState(null);

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
            setNoteData(result.noteData);
            setTimeToLive(result.timeToLive);
        } else {
            setError(result.error);
        }
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
        if (seconds < 60) return 'Less than a minute';
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

    if (loading) {
        return (
            <div className="shared-viewer-container">
                <div className="shared-viewer-loading">
                    <Loader2 size={40} className="spinner-icon" />
                    <h2>Decrypting Shared Note</h2>
                    <p>Fetching and decrypting content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shared-viewer-container">
                <div className="shared-viewer-error">
                    <AlertCircle size={48} color="var(--error-color)" />
                    <h2>Unable to Open Shared Note</h2>
                    <p>{error}</p>
                    <button className="btn-primary" onClick={onGoHome}>
                        <ArrowLeft size={18} />
                        Go to ZenMark
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="shared-viewer-container">
            {/* Header */}
            <div className="shared-viewer-header">
                <div className="shared-viewer-title-section">
                    <div className="shared-badge">
                        <Lock size={14} />
                        Encrypted Shared Note
                    </div>
                    <h1 className="shared-viewer-title">
                        <FileText size={24} />
                        {noteData?.title || 'Untitled'}
                    </h1>
                    {timeToLive && (
                        <div className="shared-expire-badge">
                            <Clock size={12} />
                            Expires in {formatTimeRemaining(timeToLive)}
                        </div>
                    )}
                </div>

                <div className="shared-viewer-actions">
                    <button
                        className="btn-secondary"
                        onClick={handleDownload}
                        title="Download"
                    >
                        <Download size={18} />
                        <span className="btn-text">Download</span>
                    </button>
                    <button
                        className={`btn-primary ${saved ? 'saved' : ''}`}
                        onClick={handleSaveToNotes}
                        disabled={saved}
                    >
                        <Save size={18} />
                        <span className="btn-text">{saved ? 'Saved!' : 'Save to My Notes'}</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="shared-viewer-content">
                {noteData?.format === 'markdown' || noteData?.format === undefined ? (
                    <div className="markdown-preview shared-markdown">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{ code: CodeBlock }}
                        >
                            {noteData?.content || ''}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <pre className="shared-plaintext">
                        {noteData?.content || ''}
                    </pre>
                )}
            </div>

            {/* Footer */}
            <div className="shared-viewer-footer">
                <div className="shared-footer-content">
                    <button className="shared-home-link" onClick={onGoHome}>
                        <ArrowLeft size={16} />
                        Create your own notes
                    </button>
                    <div className="shared-branding">
                        <span>Powered by</span>
                        <strong>ZenMark</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharedNoteViewer;
