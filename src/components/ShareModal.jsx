import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, AlertCircle, Link2, X, Clock, Loader2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { createShareLink, EXPIRE_OPTIONS } from '../lib/sharing';

const ShareModal = ({ isOpen, onClose, note }) => {
    const [shareUrl, setShareUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [expire, setExpire] = useState('1week');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState('options');

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setTimeout(() => {
                setShareUrl('');
                setError('');
                setCopied(false);
                setStep('options');
                setExpire('1week');
                setPassword('');
                setShowPassword(false);
            }, 200);
        }
    }, [isOpen]);

    const handleShare = async () => {
        setStep('generating');
        setLoading(true);
        setError('');

        const result = await createShareLink({
            title: note.title,
            content: note.content,
            format: note.format || 'markdown'
        }, { expire, password: password || undefined });

        setLoading(false);

        if (result.success) {
            setShareUrl(result.url);
            setStep('success');
        } else {
            setError(result.error);
            setStep('error');
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />

            <div className="modal share-modal">
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Share2 size={20} color="var(--primary-color)" />
                        <h2 className="modal-title">Share Note</h2>
                    </div>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    {step === 'options' && (
                        <div className="share-options">
                            <p className="share-description">
                                Create a secure, shareable link for <strong>"{note?.title || 'Untitled'}"</strong>
                            </p>

                            <div className="share-option-group">
                                <label className="share-option-label">
                                    <Clock size={16} />
                                    Link Expiration
                                </label>
                                <div className="share-expire-grid">
                                    {EXPIRE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            className={`expire-btn ${expire === opt.value ? 'active' : ''}`}
                                            onClick={() => setExpire(opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="share-info-box">
                                <p>🔒 <strong>End-to-end encrypted</strong></p>
                                <p>Only people with the link can read your note</p>
                            </div>

                            <div className="share-option-group">
                                <label className="share-option-label">
                                    <Lock size={16} />
                                    Password Protection (optional)
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave empty for no password"
                                        style={{
                                            width: '100%',
                                            padding: '10px 40px 10px 12px',
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '6px',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    {password && (
                                        <button
                                            type="button"
                                            className="icon-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    )}
                                </div>
                                {password && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '6px' }}>
                                        <ShieldCheck size={13} />
                                        <span>Viewers will need this password to read the note</span>
                                    </div>
                                )}
                            </div>

                            <button
                                className="btn-primary share-generate-btn"
                                onClick={handleShare}
                            >
                                <Share2 size={18} />
                                Generate Share Link
                            </button>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="share-loading">
                            <Loader2 size={32} className="spinner-icon" />
                            <p>Encrypting and uploading...</p>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="share-error">
                            <AlertCircle size={32} color="var(--error-color)" />
                            <p>{error}</p>
                            <button className="btn-secondary" onClick={() => setStep('options')}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="share-success">
                            <div className="share-success-header">
                                <Check size={24} color="var(--success-color, #22c55e)" />
                                <span>Link Created!</span>
                            </div>

                            <div className="share-url-container">
                                <Link2 size={16} color="var(--text-muted)" />
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="share-url-input"
                                    onClick={(e) => e.target.select()}
                                />
                            </div>

                            <button
                                className={`btn-primary share-copy-btn ${copied ? 'copied' : ''}`}
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <>
                                        <Check size={18} />
                                        Copied to Clipboard!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={18} />
                                        Copy Link
                                    </>
                                )}
                            </button>

                            <div className="share-expire-notice">
                                <Clock size={14} />
                                <span>Expires in {EXPIRE_OPTIONS.find(o => o.value === expire)?.label.toLowerCase()}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ShareModal;
