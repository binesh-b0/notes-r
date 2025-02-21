import { createContext, useState, useEffect, useCallback, useMemo } from 'react'

export const NotesContext = createContext()

export const NotesProvider = ({ children }) => {
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('')

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes
    const query = searchQuery.toLowerCase()
    return notes.filter(note =>
      note.body.toLowerCase().includes(query)
    )
  }, [notes, searchQuery])
  
  const [selectedColor, setSelectedColor] = useState({
    colorHeader: "#FED0FD",
    colorBody: "#FEE5FD",
    colorText: "#18181A"
  })

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])


const addNote = useCallback(() => {
  const lastNote = notes[notes.length - 1];
  let baseX = 20, baseY = 80; // Start below dock
  
  if (lastNote) {
    baseX = lastNote.position.x + 20;
    baseY = lastNote.position.y + 20;    
    // Reset position if getting too far
    if (baseX > window.innerWidth - 400) {
      baseX = 20;
      baseY += 100;
    }
  }

  const newNote = {
    id: Date.now(),
    body: '',
    colors: selectedColor,
    position: { 
      x: baseX, 
      y: baseY,
      // Add small random offset for natural look
      x: baseX + Math.random() * 10,
      y: baseY + Math.random() * 10
    }
  };
  
  setNotes(prev => [...prev, newNote]);
  setActiveNoteId(newNote.id);
}, [selectedColor, notes]);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }, [])

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ))
  }, [])

  const updateNoteColors = useCallback((newColors) => {
    if (activeNoteId) {
      setNotes(prev => prev.map(note => 
        note.id === activeNoteId ? { ...note, colors: newColors } : note
      ));
    }
  }, [activeNoteId]);

  return (
    <NotesContext.Provider value={{
      activeNoteId,
      setActiveNoteId,
      updateNoteColors,
      notes : filteredNotes,
      allNotes: notes,
      selectedColor,
      setSelectedColor,
      addNote,
      deleteNote,
      updateNote,
      searchQuery,
      setSearchQuery,
      setNotes
      
    }}>
      {children}
    </NotesContext.Provider>
  )
}