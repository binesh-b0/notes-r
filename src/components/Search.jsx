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

  const isHidden = allNotes.length <= 2 ? 'hidden' : 'show';

  return (
    <div className={`search-pill ${isHidden}`}>
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
