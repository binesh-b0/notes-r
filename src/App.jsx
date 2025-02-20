// App.js (updated)
import { useContext } from 'react'
import { NotesContext } from './contexts/NotesContext.jsx'
import NoteCard from './components/NoteCard'
import Dock from './components/Dock'
import './App.css'
import Search from './components/Search.jsx'

function App() {  
  const { notes, allNotes, searchQuery } = useContext(NotesContext)

  return (
    <div>
      <div className="header">
        <Dock />
        <Search />
      </div>
    
      {notes.length === 0 && (
        <div className="empty-state">
          {allNotes.length === 0 ? (
            <p>No notes yet. Click "+" to create one!</p>
          ) : (
            <p>No notes found for "{searchQuery}"</p>
          )}
        </div>
      )}

      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}

export default App