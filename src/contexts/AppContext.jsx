import { createContext, useContext, useState, useEffect } from 'react';
import { NotesContext } from './NotesContext';

// Create the AppContext to hold app-level state and handlers.
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Access functions from NotesContext.
  const { setNotes, allNotes, undoDelete } = useContext(NotesContext);

  // Local UI state for modals and options menu.
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isOptionsMenuOpen, setOptionsMenuOpen] = useState(false);

  // App-level settings state.
  const [appSettings, setAppSettings] = useState({
    maxHeight: 400,
    fontFamily: 'Arial',
    fontSize: 16,
    lineHeight: 1.5,
  });

  // Toggle options menu: if a boolean is passed, use it; otherwise, simply toggle.
  const toggleOptionsMenu = (state) => {
    setOptionsMenuOpen(typeof state === 'boolean' ? state : !isOptionsMenuOpen);
  };

  // Handlers for various actions.
  const handlers = {
    // Undo the last delete operation (max 5 stored).
    handleUndo: undoDelete,

    // Clear all notes after confirmation.
    handleClearAllNotes: () => {
      if (window.confirm('Are you sure you want to delete all notes?')) {
        setNotes([]);
        localStorage.removeItem('notes');
      }
    },

    // Export all notes as a JSON file.
    handleExportNotes: () => {
      const dataStr = JSON.stringify(allNotes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes.json';
      a.click();
      URL.revokeObjectURL(url);
    },

    // Import notes from a selected file.
    handleImportNotes: (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedNotes = JSON.parse(event.target.result);
          if (Array.isArray(importedNotes)) {
            setNotes(importedNotes);
            localStorage.setItem('notes', JSON.stringify(importedNotes));
            alert('Notes imported successfully!');
          } else {
            alert('Invalid format');
          }
        } catch (error) {
          alert('Error parsing file');
        }
      };
      reader.readAsText(file);
    },

    // Show the About modal.
    handleAbout: () => setShowAbout(true),

    // Show the Settings modal.
    handleSettings: () => setShowSettings(true),

    // Update application settings and persist them.
    updateSettings: (newSettings) => {
      // Merge new settings with the current ones.
      const mergedSettings = { ...appSettings, ...newSettings };
      setAppSettings(mergedSettings);
      localStorage.setItem('appSettings', JSON.stringify(mergedSettings));
    },
  };

  return (
    <AppContext.Provider
      value={{
        ...handlers,
        showAbout,
        showSettings,
        appSettings,
        setShowAbout,
        setShowSettings,
        isOptionsMenuOpen,
        toggleOptionsMenu,
      }}
    >
      {children}
      <AboutModal />
      <SettingsModal />
    </AppContext.Provider>
  );
};

// About Modal Component
const AboutModal = () => {
  const { showAbout, setShowAbout } = useContext(AppContext);

  // Render the modal only when showAbout is true.
  return showAbout && (
    <div className="modal-overlay">
      <div className="about-modal">
        <h2>Notes App</h2>
        <p>Version 1.0.0</p>
        <div className="features">
          <p>✨ Features:</p>
          <ul>
            <li>Create & organize notes</li>
            <li>Custom colors & fonts</li>
            <li>Import/Export notes</li>
            <li>Stores Locally</li>
          </ul>
        </div>
        <div
          className="modal-actions"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <button
            className="github-btn"
            onClick={() =>
              window.open('https://github.com/binesh-b0/notes-r')
            }
          >
            View on GitHub
          </button>
          <button className="close-btn" onClick={() => setShowAbout(false)}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal = () => {
  const { showSettings, setShowSettings, appSettings, updateSettings } = useContext(AppContext);
  const [localSettings, setLocalSettings] = useState(appSettings);

  // Update local settings when global appSettings change.
  useEffect(() => {
    setLocalSettings(appSettings);
  }, [appSettings]);

  // Handle saving updated settings.
  const handleSave = () => {
    updateSettings({
      ...localSettings,
      fontSize: Number(localSettings.fontSize),
      maxHeight: Number(localSettings.maxHeight),
    });
    setShowSettings(false);
  };

  // Render the modal only when showSettings is true.
  return showSettings && (
    <div className="modal-overlay">
      <div className="settings-modal">
        <h2 className="modal-title">Settings</h2>
        <div className="settings-grid">
          <div className="settings-column">
            <div className="form-row">
              <label className="input-label">
                <span>Font Family</span>
                <select
                  className="material-input"
                  value={localSettings.fontFamily}
                  onChange={(e) =>
                    setLocalSettings((s) => ({ ...s, fontFamily: e.target.value }))
                  }
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label className="input-label">
                <span>Font Size (px)</span>
                <input
                  type="number"
                  className="material-input"
                  min="12"
                  max="24"
                  value={localSettings.fontSize}
                  onChange={(e) =>
                    setLocalSettings((s) => ({ ...s, fontSize: e.target.value }))
                  }
                />
              </label>
            </div>
          </div>
          <div className="settings-column">
            <div className="form-row">
              <label className="input-label">
                <span>Max Note Height (px)</span>
                <input
                  type="number"
                  className="material-input"
                  min="200"
                  max="800"
                  value={localSettings.maxHeight}
                  onChange={(e) =>
                    setLocalSettings((s) => ({ ...s, maxHeight: e.target.value }))
                  }
                />
              </label>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button className="material-btn outlined" onClick={() => setShowSettings(false)}>
            Cancel
          </button>
          <button className="material-btn contained primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
