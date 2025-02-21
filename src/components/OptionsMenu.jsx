import React from "react";

function OptionsMenu({
  onClearAll,
  onExport,
  onImport,
  onSettings,
  onAbout,
  onClose
}) {
  return (
    <div className="options-menu">
      <ul>
        <li onClick={() => { onClearAll(); onClose(); }}>Clear All</li>
        <li onClick={() => { onImport(); onClose(); }}>Import</li>
        <li onClick={() => { onExport(); onClose(); }}>Export</li>
        <li onClick={() => { onSettings(); onClose(); }}>Settings</li>
        <li onClick={() => { onAbout(); onClose(); }}>About</li>
      </ul>
    </div>
  );
}

export default OptionsMenu;
