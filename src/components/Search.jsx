// components/SearchPill.jsx
import { useContext } from 'react'
import { NotesContext } from '../contexts/NotesContext'

function Search() {
  const { searchQuery, setSearchQuery, allNotes } = useContext(NotesContext)

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="search-pill" style={allNotes.length === 0 ? { display: 'none' } : {}}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search notes"
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="clear-search-btn"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default Search
