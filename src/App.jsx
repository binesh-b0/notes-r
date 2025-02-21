import { useContext, useEffect, useState, useRef } from 'react'
import { NotesContext } from './contexts/NotesContext.jsx'
import NoteCard from './components/NoteCard'
import Dock from './components/Dock'
import './App.css'
import Search from './components/Search.jsx'
import OptionsMenu from './components/OptionsMenu'


function App() {
  const { notes, allNotes, searchQuery, setNotes } = useContext(NotesContext)
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleToggleOptions = () => {
    setShowOptions(prev => !prev);
  }

  const handleClearAllNotes = () => {
    if (window.confirm('Are you sure you want to delete all notes?')) {
      setNotes([]);
      localStorage.removeItem('notes');
    }
  }

    const handleExportNotes = () => {
      const dataStr = JSON.stringify(allNotes, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "notes.json"
      a.click()
      URL.revokeObjectURL(url)
    }

    const handleImportNotes = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger file selection
      }
    };
    
    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedNotes = JSON.parse(event.target.result);
            if (Array.isArray(importedNotes)) {
              setNotes(importedNotes);
              localStorage.setItem('notes', JSON.stringify(importedNotes));
              alert('Notes imported successfully!');
            } else {
              alert('Invalid format: JSON should be an array of notes.');
            }
          } catch (error) {
            alert('Error parsing JSON file.');
          }
        };
        reader.readAsText(file);
      }
    };

    const handleAbout = () => {
      window.open('https://github.com/binesh-b0/notes-r', '_blank');
    }

    const handleSettings = () => {
      alert('yet to implement.')
    }

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowOptions(false)
        }
      }
      if (showOptions) {
        document.addEventListener("mousedown", handleClickOutside)
      } else {
        document.removeEventListener("mousedown", handleClickOutside)
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [showOptions])

  return (
    <div>
      <div className="header">
        <Dock />
        <div className="options-container" ref={menuRef}>
          <button
            className="options-btn"
            aria-label="Extra options"
            onClick={handleToggleOptions}
          >
            ⋮
          </button>
          {showOptions && (
            <OptionsMenu
              onClearAll={handleClearAllNotes}
              onExport={handleExportNotes}
              onImport={handleImportNotes}
              onSettings={handleSettings}
              onAbout={handleAbout}
              onClose={() => setShowOptions(false)}
            />
          )}
            <input
    type="file"
    ref={fileInputRef}
    style={{ display: "none" }}
    accept=".json"
    onChange={handleFileSelect} // Reads and imports the file
  />
        </div>
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