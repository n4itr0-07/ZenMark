import React, { useState } from 'react';
import { X, Lock, Unlock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const LockModal = ({ isOpen, onClose, mode, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const isLocking = mode === 'lock';
    const title = isLocking ? 'Lock Note' : 'Unlock Note';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!password) { setError('Password is required'); return; }
        if (isLocking && password !== confirm) { setError('Passwords do not match'); return; }
        if (isLocking && password.length < 4) { setError('Password must be at least 4 characters'); return; }
        onSubmit(password);
        setPassword('');
        setConfirm('');
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal" style={{ maxWidth: '380px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isLocking ? <Lock size={20} color="var(--primary-color)" /> : <Unlock size={20} color="var(--primary-color)" />}
                        <h2 className="modal-title">{title}</h2>
                    </div>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} style={{ padding: '16px 20px' }}>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '10px 40px 10px 12px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                placeholder={isLocking ? 'Enter password' : 'Enter password to unlock'}
                            />
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    {isLocking && (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                placeholder="Confirm password"
                            />
                        </div>
                    )}
                    {error && (
                        <div style={{ color: 'var(--error, #ef4444)', fontSize: '0.8rem', marginBottom: '12px' }}>
                            {error}
                        </div>
                    )}
                    {isLocking && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '12px' }}>
                            <ShieldCheck size={14} />
                            <span>AES-256 encryption — cannot be recovered without the password</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">{isLocking ? 'Lock' : 'Unlock'}</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LockModal;
