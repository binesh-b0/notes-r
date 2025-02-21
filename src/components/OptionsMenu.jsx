import React, { useContext, useRef, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";

function OptionsMenu() {
  const { 
    handleClearAllNotes,
    handleImportNotes,
    handleExportNotes,
    handleSettings,
    handleAbout,
    isOptionsMenuOpen,
    toggleOptionsMenu
  } = useContext(AppContext);
  
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleOptionsMenu(false);
      }
    };

    if (isOptionsMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsMenuOpen, toggleOptionsMenu]);

  return (
    <div className="options-container" ref={menuRef}>
      <button
        className="options-btn"
        aria-label="Extra options"
        onClick={() => toggleOptionsMenu(!isOptionsMenuOpen)}
      >
        ⋮
      </button>
      
      {isOptionsMenuOpen && (
        <div className="options-menu">
          <ul>
            <li onClick={() => { handleClearAllNotes(); toggleOptionsMenu(false); }}>
              Clear All
            </li>
            <li onClick={() => { handleImportNotes(); toggleOptionsMenu(false); }}>
              Import
            </li>
            <li onClick={() => { handleExportNotes(); toggleOptionsMenu(false); }}>
              Export
            </li>
            <li onClick={() => { handleSettings(); toggleOptionsMenu(false); }}>
              Settings
            </li>
            <li onClick={() => { handleAbout(); toggleOptionsMenu(false); }}>
              About
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default OptionsMenu;