import { useContext } from 'react'
import { NotesContext } from './contexts/NotesContext.jsx'
import NoteCard from './components/NoteCard'
import Dock from './components/Dock'
import './App.css'
import Search from './components/Search.jsx'
import OptionsMenu from './components/OptionsMenu'
import { AppProvider } from './contexts/AppContext.jsx'


function App() {

  return (
    <AppProvider>
      <div className="header">
        <Dock />
        <OptionsMenu />
        <Search />
      </div>
      <NoteList />
    </AppProvider>
  );
}

const NoteList = () => {
  const { notes, allNotes, searchQuery } = useContext(NotesContext);

  return (
    <>
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
        <NoteCard key={`${note.id}`} note={note} />
      ))}
    </>
  );
};

export default App