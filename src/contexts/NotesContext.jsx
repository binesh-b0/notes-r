import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const NotesContext = createContext()

export const NotesProvider = ({ children }) => {
  // Active note id helps determine which note is selected for editing.
  const [activeNoteId, setActiveNoteId] = useState(null);
  // Search query for filtering notes.
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize notes from localStorage or as an empty array.
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })

  // A stack to store the last 5 deleted notes for undo functionality.
  const [undoStack, setUndoStack] = useState([]);

  // Filter notes based on search query.
  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(note =>
      note.body.toLowerCase().includes(query)
    );
  }, [notes, searchQuery])
  
  // Selected color scheme for new notes.
  const [selectedColor, setSelectedColor] = useState({
    colorHeader: "#FED0FD",
    colorBody: "#FEE5FD",
    colorText: "#18181A"
  })

  // Persist notes to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Adds a new note with a unique id, position offset, and current color settings.
  const addNote = useCallback(() => {
    const lastNote = notes[notes.length - 1];
    // Default position if no note exists.
    let baseX = 20, baseY = 80;
    
    if (lastNote) {
      // Position new note relative to the last note.
      baseX = lastNote.position.x + 20;
      baseY = lastNote.position.y + 20;
      // Reset position if too far to the right.
      if (baseX > window.innerWidth - 400) {
        baseX = 20;
        baseY += 100;
      }
    }

    // Create new note with a small random offset added to base position.
    const newNote = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      body: '',
      colors: selectedColor,
      position: { 
        x: baseX + Math.random() * 10,
        y: baseY + Math.random() * 10
      }
    };
    
    setNotes(prev => [...prev, newNote]);
    setActiveNoteId(newNote.id);
  }, [selectedColor, notes]);

  // Deletes a note by id and pushes it onto the undo stack (max 5).
  const deleteNote = useCallback((id) => {
    setNotes(prev => {
      const noteToDelete = prev.find(note => note.id === id);
      if (noteToDelete) {
        setUndoStack(prevStack => {
          // Prepend the deleted note (LIFO order).
          const newStack = [noteToDelete, ...prevStack];
          // Limit stack size to 5 items.
          if (newStack.length > 5) {
            newStack.pop(); // Remove the oldest deletion.
          }
          return newStack;
        });
      }
      return prev.filter(note => note.id !== id);
    });
  }, []);

  // Updates a note's content or properties.
  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  }, []);

  // Updates the color scheme of the active note.
  const updateNoteColors = useCallback((newColors) => {
    if (activeNoteId) {
      setNotes(prev => prev.map(note => 
        note.id === activeNoteId ? { ...note, colors: newColors } : note
      ));
    }
  }, [activeNoteId]);

  // Undo the most recent deletion by popping the last deleted note from the stack.
  const undoDelete = useCallback(() => {
    setUndoStack(prevStack => {
      if (prevStack.length === 0) return prevStack;
      const [lastDeleted, ...rest] = prevStack;
      setNotes(prevNotes => {
        // Ensure the note isn't already present.
        if (prevNotes.some(note => note.id === lastDeleted.id)) {
          return prevNotes;
        }
        return [...prevNotes, lastDeleted];
      });
      return rest;
    });
  }, []);

  return (
    <NotesContext.Provider value={{
      activeNoteId,
      setActiveNoteId,
      updateNoteColors,
      // Expose filtered notes for display.
      notes: filteredNotes,
      // allNotes contains the full list.
      allNotes: notes,
      selectedColor,
      setSelectedColor,
      addNote,
      deleteNote,
      updateNote,
      searchQuery,
      setSearchQuery,
      setNotes,
      undoDelete,
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export default NotesProvider;
