import { openDB } from 'idb';

const DB_NAME = 'zenmark-db';
const STORE_NAME = 'notes';

// Initialize DB
export const initDB = async () => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('updatedAt', 'updatedAt');
            }
        },
    });

    // Try to persist storage
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`Persisted storage granted: ${isPersisted}`);
    }

    return db;
};

// CRUD Operations

export const getAllNotes = async () => {
    const db = await initDB();
    return db.getAllFromIndex(STORE_NAME, 'updatedAt');
};

export const getNote = async (id) => {
    const db = await initDB();
    return db.get(STORE_NAME, id);
};

export const saveNote = async (note) => {
    const db = await initDB();
    // Ensure note has an id and timestamps
    const now = new Date().toISOString();
    const noteToSave = {
        ...note,
        updatedAt: now,
        createdAt: note.createdAt || now,
    };
    await db.put(STORE_NAME, noteToSave);
    return noteToSave;
};

export const deleteNote = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const createNewNote = async (format = 'markdown') => {
    const id = generateUUID();
    const defaultContent = format === 'markdown'
        ? '# Untitled Note\n\nStart typing here...'
        : 'Untitled Note\n\nStart typing here...';
    const note = {
        id,
        title: 'Untitled Note',
        content: defaultContent,
        format: format, // 'markdown' or 'text'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await saveNote(note);
    return note;
};
