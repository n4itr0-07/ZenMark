import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AboutPage from './components/AboutPage';
import { initDB, getAllNotes, createNewNote, saveNote, deleteNote } from './lib/storage';
import Modal from './components/Modal';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    return localStorage.getItem('zenmark-theme') || 'dark';
  });
  const saveTimeoutRef = useRef(null);
  const editorRef = useRef(null);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zenmark-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Load notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        await initDB();
        const savedNotes = await getAllNotes();
        savedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setNotes(savedNotes);
        if (savedNotes.length > 0) {
          setActiveNoteId(savedNotes[0].id);
        }
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, []);

  const handleCreateNote = useCallback(async () => {
    try {
      const newNote = await createNewNote();
      setNotes(prev => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      setShowAbout(false);
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  }, []);

  const handleUpdateNote = useCallback(async (updatedNote) => {
    setSaveStatus('unsaved');

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Update state immediately for responsiveness
    setNotes(prev => prev.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    ));

    // Debounced save (300ms after last keystroke)
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await saveNote(updatedNote);
        setSaveStatus('saved');
      } catch (err) {
        console.error("Failed to save note:", err);
        setSaveStatus('unsaved');
      }
    }, 300);
  }, []);

  // Toggle pin for a note
  const handleTogglePin = useCallback(async (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      const updatedNote = { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() };
      setNotes(prev => prev.map(n => n.id === noteId ? updatedNote : n));
      await saveNote(updatedNote);
    }
  }, [notes]);

  // Force save function (for Ctrl+S)
  const handleForceSave = useCallback(async () => {
    const activeNote = notes.find(n => n.id === activeNoteId);
    if (activeNote) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      setSaveStatus('saving');
      try {
        await saveNote(activeNote);
        setSaveStatus('saved');
      } catch (err) {
        console.error("Failed to save note:", err);
        setSaveStatus('unsaved');
      }
    }
  }, [notes, activeNoteId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S or Cmd+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleForceSave();
      }
      // Alt+N - New note (using Alt to avoid browser's Ctrl+N)
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
      // Alt+T - Toggle theme
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleForceSave, handleCreateNote, toggleTheme]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteNote = async (id) => {
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      await deleteNote(noteToDelete);
      const newNotes = notes.filter(n => n.id !== noteToDelete);
      setNotes(newNotes);
      if (activeNoteId === noteToDelete) {
        setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
      }
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleDownload = (note, format) => {
    const safeTitle = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note';

    if (format === 'md') {
      const blob = new Blob([note.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeTitle}.md`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'txt') {
      const blob = new Blob([note.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeTitle}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Import .md file
  const handleImportFile = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const title = file.name.replace(/\.md$|\.txt$/i, '') || 'Imported Note';
      const newNote = await createNewNote();
      const importedNote = {
        ...newNote,
        title,
        content,
        format: file.name.endsWith('.md') ? 'markdown' : 'text',
      };
      await saveNote(importedNote);
      setNotes(prev => [importedNote, ...prev]);
      setActiveNoteId(importedNote.id);
      setShowAbout(false);
    } catch (err) {
      console.error('Failed to import file:', err);
    }
    // Reset input
    event.target.value = '';
  }, []);

  // Export all notes as JSON backup
  const handleExportAll = useCallback(() => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      notes: notes.map(({ id, title, content, format, pinned, createdAt, updatedAt }) => ({
        id, title, content, format, pinned, createdAt, updatedAt
      }))
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zenmark-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading ZenMark...</div>;
  }

  return (
    <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 19 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Header (Hamburger) */}
      <div className="d-md-none" style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 30,
        display: window.innerWidth < 768 ? 'block' : 'none'
      }}>
        <button className="icon-btn" style={{ background: 'var(--bg-card)' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {sidebarVisible && (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <Sidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={(id) => { setActiveNoteId(id); setSidebarOpen(false); setShowAbout(false); }}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onShowAbout={() => setShowAbout(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
            onImportFile={handleImportFile}
            onExportAll={handleExportAll}
          />
        </div>
      )}

      {/* Show About Page or Editor */}
      {showAbout ? (
        <AboutPage onBack={() => setShowAbout(false)} />
      ) : (
        <Editor
          ref={editorRef}
          activeNote={activeNote}
          onUpdateNote={handleUpdateNote}
          onDownload={handleDownload}
          onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          sidebarVisible={sidebarVisible}
          saveStatus={saveStatus}
          theme={theme}
        />
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Note"
        actions={
          <>
            <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="btn-danger" onClick={confirmDelete}>Delete</button>
          </>
        }
      >
        <p>Are you sure you want to delete this note? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default App;
