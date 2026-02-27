import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AboutPage from './components/AboutPage';
import WelcomeScreen from './components/WelcomeScreen';
import SharedNoteViewer from './components/SharedNoteViewer';
import ShareModal from './components/ShareModal';
import ShortcutsModal from './components/ShortcutsModal';
import { initDB, getAllNotes, createNewNote, saveNote, deleteNote } from './lib/storage';
import { isShareRoute } from './lib/sharing';
import Modal from './components/Modal';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zenmark-theme') || 'dark';
  });
  const saveTimeoutRef = useRef(null);
  const editorRef = useRef(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [viewingSharedNote, setViewingSharedNote] = useState(isShareRoute());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close mobile sidebar when switching to desktop
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    let startX = 0, startY = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;
      if (Math.abs(deltaX) < 60 || Math.abs(deltaY) > Math.abs(deltaX)) return;
      if (deltaX > 0 && startX < 30) {
        setSidebarOpen(true);
      } else if (deltaX < 0 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile, sidebarOpen]);

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

  const handleCreateNote = useCallback(async (template = 'blank') => {
    try {
      const newNote = await createNewNote('markdown', template);
      setNotes(prev => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      setShowAbout(false);
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  }, []);

  const deriveTitle = useCallback((content) => {
    if (!content) return '';
    const headingMatch = content.match(/^#{1,3}\s+(.+)$/m);
    if (headingMatch) {
      const title = headingMatch[1].trim();
      return title.length > 50 ? title.substring(0, 47) + '...' : title;
    }
    const firstLine = content.split('\n').find(l => l.trim().length > 0);
    if (firstLine) {
      const clean = firstLine.replace(/^[#>*\-\s]+/, '').trim();
      return clean.length > 50 ? clean.substring(0, 47) + '...' : clean;
    }
    return '';
  }, []);

  const handleUpdateNote = useCallback(async (updatedNote) => {
    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const activeNote = notes.find(n => n.id === updatedNote.id);
    const titleIsDefault = updatedNote.title === 'Untitled Note' ||
      (activeNote && activeNote.title === updatedNote.title && updatedNote.content !== activeNote?.content);

    let noteToSave = updatedNote;
    if (titleIsDefault && updatedNote.title === 'Untitled Note') {
      const autoTitle = deriveTitle(updatedNote.content);
      if (autoTitle) {
        noteToSave = { ...updatedNote, title: autoTitle };
      }
    }

    setNotes(prev => prev.map((note) =>
      note.id === noteToSave.id ? noteToSave : note
    ));

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await saveNote(noteToSave);
        setSaveStatus('saved');
      } catch (err) {
        console.error("Failed to save note:", err);
        setSaveStatus('unsaved');
      }
    }, 300);
  }, [notes, deriveTitle]);

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



  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleForceSave();
      }
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
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
      notes: notes.map(({ id, title, content, format, pinned, tags, createdAt, updatedAt }) => ({
        id, title, content, format, pinned, tags: tags || [], createdAt, updatedAt
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

  // Duplicate note
  const handleDuplicateNote = useCallback(async (note) => {
    try {
      const duplicatedNote = await createNewNote('markdown', 'blank');
      const newNote = {
        ...duplicatedNote,
        title: `${note.title} (Copy)`,
        content: note.content,
        pinned: false,
      };
      await saveNote(newNote);
      setNotes(prev => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
    } catch (err) {
      console.error('Failed to duplicate note:', err);
    }
  }, []);

  // Print note
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => !prev);
    if (!focusMode) {
      setSidebarVisible(false);
    }
  }, [focusMode]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  // Handle saving a shared note to user's notes
  const handleSaveSharedNote = useCallback(async (noteData) => {
    try {
      const newNote = await createNewNote(noteData.format || 'markdown', 'blank');
      const savedNote = {
        ...newNote,
        title: noteData.title || 'Shared Note',
        content: noteData.content || '',
      };
      await saveNote(savedNote);
      setNotes(prev => [savedNote, ...prev]);
      setActiveNoteId(savedNote.id);
      setViewingSharedNote(false);
      // Update URL to remove share path
      window.history.pushState({}, '', '/');
    } catch (err) {
      console.error('Failed to save shared note:', err);
    }
  }, []);

  // Handle returning home from shared view
  const handleGoHome = useCallback(() => {
    setViewingSharedNote(false);
    window.history.pushState({}, '', '/');
  }, []);

  // If viewing a shared note, render the viewer
  if (viewingSharedNote) {
    return (
      <SharedNoteViewer
        onSaveToNotes={handleSaveSharedNote}
        onGoHome={handleGoHome}
        theme={theme}
      />
    );
  }

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading ZenMark...</div>;
  }

  return (
    <div className="app-container">
      {/* Mobile Overlay - only visible when sidebar is open on mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="mobile-overlay visible"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {/* On mobile: always in DOM for animation, controlled by CSS .open class */}
      {/* On desktop: conditionally rendered based on sidebarVisible */}
      {(isMobile || sidebarVisible) && (
        <div
          className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}
        >
          <Sidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={(id) => {
              setActiveNoteId(id);
              if (isMobile) setSidebarOpen(false);
              setShowAbout(false);
            }}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onShowAbout={() => { setShowAbout(true); if (isMobile) setSidebarOpen(false); }}
            theme={theme}
            onToggleTheme={toggleTheme}
            onImportFile={handleImportFile}
            onExportAll={handleExportAll}
            onCloseSidebar={() => setSidebarOpen(false)}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Show About Page, Welcome Screen, or Editor */}
      {showAbout ? (
        <AboutPage onBack={() => setShowAbout(false)} />
      ) : !activeNote ? (
        <WelcomeScreen
          onCreateNote={handleCreateNote}
          isMobile={isMobile}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      ) : (
        <Editor
          ref={editorRef}
          activeNote={activeNote}
          onUpdateNote={handleUpdateNote}
          onDownload={handleDownload}
          onToggleSidebar={() => {
            if (isMobile) {
              setSidebarOpen(!sidebarOpen);
            } else {
              setSidebarVisible(!sidebarVisible);
            }
          }}
          sidebarVisible={isMobile ? true : sidebarVisible}
          saveStatus={saveStatus}
          theme={theme}
          focusMode={focusMode}
          onToggleFocusMode={toggleFocusMode}
          onDuplicate={handleDuplicateNote}
          onPrint={handlePrint}
          isMobile={isMobile}
          onShare={() => setIsShareModalOpen(true)}
          notes={notes}
          onNavigateToNote={(noteId) => {
            setActiveNoteId(noteId);
            if (isMobile) setSidebarOpen(false);
          }}
        />
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        note={activeNote}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />


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
