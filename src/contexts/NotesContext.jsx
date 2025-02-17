import { createContext, useState, useEffect, useCallback } from 'react'

export const NotesContext = createContext()

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })
  
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
  }, [selectedColor])

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }, [])

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ))
  }, [])

  return (
    <NotesContext.Provider value={{
      notes,
      selectedColor,
      setSelectedColor,
      addNote,
      deleteNote,
      updateNote
    }}>
      {children}
    </NotesContext.Provider>
  )
}