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
    const newNote = {
      id: Date.now(),
      body: '',
      colors: selectedColor,
      position: { x: Math.random() * 300, y: Math.random() * 100 }
    }
    setNotes(prev => [...prev, newNote])
    setActiveNoteId(newNote.id)
  }, [selectedColor])

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
      
    }}>
      {children}
    </NotesContext.Provider>
  )
}