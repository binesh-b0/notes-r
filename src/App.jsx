// App.js (updated)
import { useContext } from 'react'
import { NotesContext } from './contexts/NotesContext.jsx'
import NoteCard from './components/NoteCard'
import Dock from './components/Dock'
import './App.css'

function App() {
  const { notes } = useContext(NotesContext)

  return (
    <div>
      <Dock />
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}

export default App