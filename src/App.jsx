import React, { useState, useEffect } from 'react';
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

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

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

  const handleCreateNote = async () => {
    try {
      const newNote = await createNewNote();
      setNotes([newNote, ...notes]);
      setActiveNoteId(newNote.id);
      setShowAbout(false);
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    await saveNote(updatedNote);
  };

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
            onShowAbout={() => setShowAbout(true)}
          />
        </div>
      )}

      {/* Show About Page or Editor */}
      {showAbout ? (
        <AboutPage onBack={() => setShowAbout(false)} />
      ) : (
        <Editor
          activeNote={activeNote}
          onUpdateNote={handleUpdateNote}
          onDownload={handleDownload}
          onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          sidebarVisible={sidebarVisible}
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
