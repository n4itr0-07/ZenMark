import { openDB } from 'idb';

const DB_NAME = 'zenmark-db';
const STORE_NAME = 'notes';

export const initDB = async () => {
    const db = await openDB(DB_NAME, 2, {
        upgrade(db, oldVersion, _newVersion, transaction) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('updatedAt', 'updatedAt');
                store.createIndex('tags', 'tags', { multiEntry: true });
            } else if (oldVersion < 2) {
                const store = transaction.objectStore(STORE_NAME);
                if (!store.indexNames.contains('tags')) {
                    store.createIndex('tags', 'tags', { multiEntry: true });
                }
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

export const noteTemplates = {
    blank: {
        name: 'Blank Note',
        content: '# Untitled Note\n\nStart writing here...'
    },
    meeting: {
        name: 'Meeting Notes',
        content: `# 📋 Meeting Notes

> **Date:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}  
> **Time:** 
> **Location:** 

## 👥 Attendees
- [ ] 
- [ ] 

---

## 📌 Agenda
1. 
2. 
3. 

## 💬 Discussion Summary


## ✅ Action Items
| Task | Owner | Due Date |
|------|-------|----------|
|  |  |  |

## 📅 Next Meeting
- **Date:** 
- **Topics to follow up:** 
`
    },
    todo: {
        name: 'To-Do List',
        content: `# ✅ To-Do List

> Created: ${new Date().toLocaleDateString()}

## 🔴 High Priority
- [ ] 
- [ ] 

## 🟡 Medium Priority
- [ ] 
- [ ] 

## 🟢 Low Priority
- [ ] 

---

## ⏳ In Progress
- [ ] 

## ✔️ Completed
- [x] Example completed task

---
*Tip: Use \`- [ ]\` for unchecked and \`- [x]\` for checked items*
`
    },
    journal: {
        name: 'Daily Journal',
        content: `# 📓 Daily Journal

> **${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}**

## 🌅 Morning Intentions
*What do I want to accomplish today?*
- 

## 📝 Notes & Thoughts


## 🎯 Key Accomplishments
- 

## 💡 What I Learned


## 🙏 Gratitude
*3 things I'm grateful for today:*
1. 
2. 
3. 

## 🌙 Reflection
*How was today overall? What could be improved?*


---
*"The only way to do great work is to love what you do." - Steve Jobs*
`
    },
    project: {
        name: 'Project Doc',
        content: `# 🚀 Project: [Name]

## 📋 Overview
Brief description of what this project is about.

## 🎯 Goals & Objectives
- [ ] Primary goal
- [ ] Secondary goal

## 📊 Status
| Phase | Status | Progress |
|-------|--------|----------|
| Planning | ✅ Done | 100% |
| Design | 🔄 In Progress | 50% |
| Development | ⏳ Pending | 0% |
| Testing | ⏳ Pending | 0% |
| Launch | ⏳ Pending | 0% |

## 📅 Timeline
- **Start Date:** 
- **Target Completion:** 

## 👥 Team
| Name | Role |
|------|------|
|  | Project Lead |
|  | Developer |

## 📝 Requirements
### Must Have
- 

### Nice to Have
- 

## 🔗 Resources & Links
- 

## 📌 Notes
- 
`
    },
    code: {
        name: 'Code Snippet',
        content: `# 💻 Code Snippet

> **Language:** JavaScript  
> **Category:** Utility

## 📝 Description
What does this code do?

## 🔧 Code

\`\`\`javascript
// Your code here
function example() {
  return "Hello, World!";
}
\`\`\`

## 📖 Usage

\`\`\`javascript
// How to use this code
const result = example();
console.log(result);
\`\`\`

## ⚙️ Parameters
| Name | Type | Description |
|------|------|-------------|
| param1 | string | Description |

## 📤 Returns
- \`string\` - Description of return value

## 📌 Notes
- Important considerations
- Edge cases to be aware of
`
    }
};

export const getAllTags = async () => {
    const notes = await getAllNotes();
    const tagSet = new Set();
    notes.forEach(note => {
        if (Array.isArray(note.tags)) {
            note.tags.forEach(tag => tagSet.add(tag));
        }
    });
    return [...tagSet].sort();
};

export const createNewNote = async (format = 'markdown', template = 'blank') => {
    const id = generateUUID();
    const templateData = noteTemplates[template] || noteTemplates.blank;
    const defaultContent = format === 'markdown'
        ? (templateData.content || '# Untitled Note\n\nStart typing here...')
        : 'Untitled Note\n\nStart typing here...';
    const defaultTitle = template !== 'blank' ? templateData.name : 'Untitled Note';
    const note = {
        id,
        title: defaultTitle,
        content: defaultContent,
        format: format, // 'markdown' or 'text'
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await saveNote(note);
    return note;
};
