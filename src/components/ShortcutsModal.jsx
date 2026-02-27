import React from 'react';
import { X, Keyboard } from 'lucide-react';

const shortcuts = [
    {
        category: 'General', items: [
            { keys: ['Ctrl', 'S'], action: 'Save note' },
            { keys: ['Alt', 'N'], action: 'New note' },
            { keys: ['Alt', 'T'], action: 'Toggle theme' },
            { keys: ['Ctrl', '/'], action: 'Shortcuts' },
        ]
    },
    {
        category: 'Formatting', items: [
            { keys: ['Ctrl', 'B'], action: 'Bold' },
            { keys: ['Ctrl', 'I'], action: 'Italic' },
            { keys: ['Ctrl', 'K'], action: 'Insert link' },
            { keys: ['Ctrl', '`'], action: 'Inline code' },
            { keys: ['Ctrl', 'H'], action: 'Heading' },
            { keys: ['Ctrl', 'Shift', 'S'], action: 'Strikethrough' },
            { keys: ['Ctrl', 'Shift', 'Q'], action: 'Quote' },
            { keys: ['Ctrl', 'Shift', 'L'], action: 'List' },
            { keys: ['Ctrl', 'Shift', 'C'], action: 'Code block' },
        ]
    },
];

const ShortcutsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal shortcuts-modal">
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Keyboard size={20} color="var(--primary-color)" />
                        <h2 className="modal-title">Keyboard Shortcuts</h2>
                    </div>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body" style={{ padding: '16px 20px' }}>
                    {shortcuts.map((group) => (
                        <div key={group.category} style={{ marginBottom: '20px' }}>
                            <div style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'var(--text-muted)',
                                marginBottom: '10px',
                            }}>
                                {group.category}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {group.items.map((shortcut) => (
                                    <div
                                        key={shortcut.action}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '6px 0',
                                        }}
                                    >
                                        <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                                            {shortcut.action}
                                        </span>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {shortcut.keys.map((key, i) => (
                                                <React.Fragment key={i}>
                                                    <kbd className="kbd">{key}</kbd>
                                                    {i < shortcut.keys.length - 1 && (
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', alignSelf: 'center' }}>+</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ShortcutsModal;
