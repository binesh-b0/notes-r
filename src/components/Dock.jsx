// components/Dock.jsx (updated)
import { useContext } from 'react'
import { NotesContext } from '../contexts/NotesContext'

const colorOptions = [
  {
    id: "color-purple",
    colorHeader: "#FED0FD",
    colorBody: "#FEE5FD",
    colorText: "#18181A"
  },
  {
    id: "color-blue",
    colorHeader: "#9BD1DE",
    colorBody: "#A6DCE9",
    colorText: "#18181A"
  },
  {
    id: "color-yellow",
    colorHeader: "#FFEFBE",
    colorBody: "#FFF5DF",
    colorText: "#18181A"
  }
]

const Dock = () => {
  const { selectedColor, setSelectedColor, addNote, updateNoteColors } = useContext(NotesContext)

  return (
    <div className="dock">
      <button className="add-btn" onClick={addNote}>+</button>
      <div className="color-picker">
        {colorOptions.map(color => (
          <button
            key={color.id}
            className="color-option"
            style={{ 
              backgroundColor: color.colorHeader,
              border: selectedColor.id === color.id ? '2px solid black' : 'none'
            }}
            onClick={() => {
                setSelectedColor(color);
                updateNoteColors(color); 
              }}
          />
        ))}
      </div>
    </div>
  )
}

export default Dock