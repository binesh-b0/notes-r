import { useContext, useEffect, useRef, useState } from "react"
import { NotesContext } from "../contexts/NotesContext.jsx"
import Trash from "../icons/Trash"
import { setNewOffset, autoSize, setZIndex } from "../utils"
import { AppContext } from "../contexts/AppContext.jsx"

const NoteCard = ({ note }) => {
    const { deleteNote, updateNote, setActiveNoteId, searchQuery, activeNoteId } = useContext(NotesContext)
    const {appSettings} = useContext(AppContext)
    const [position, setPosition] = useState(note.position)
    const [body, setBody] = useState(note.body)
    const colors = note.colors
    const debounceTimeout = useRef(null)

    const createdAt = new Date(note.createdAt).toLocaleString()
    const characterCount = note.body.length

    const cardRef = useRef(null)
    const textareaRef = useRef(null)
    let mouseStartPosition = { x: 0, y: 0 }

    useEffect(() => {
        autoSize(textareaRef, appSettings.maxHeight)
    }, [])

    const handleInput = (e) => {
        setBody(e.target.value)
        clearTimeout(debounceTimeout.current)
        debounceTimeout.current = setTimeout(() => {
            updateNote(note.id, { body: e.target.value })
            autoSize(textareaRef, appSettings.maxHeight)
        }, 300)
    }

    const mouseDown = (e) => {
        setActiveNoteId(note.id)
        setZIndex(cardRef.current)
        mouseStartPosition.x = e.clientX
        mouseStartPosition.y = e.clientY
        document.addEventListener("mousemove", mouseMove)
        document.addEventListener("mouseup", mouseUp)
    }

    const mouseMove = (e) => {
        const mouseMoveDir = {
            x: mouseStartPosition.x - e.clientX,
            y: mouseStartPosition.y - e.clientY,
        }
        mouseStartPosition.x = e.clientX
        mouseStartPosition.y = e.clientY
        const newPosition = setNewOffset(cardRef.current, mouseMoveDir)
        setPosition(newPosition)
    }

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove)
        document.removeEventListener("mouseup", mouseUp)
        updateNote(note.id, { position })
    }

    //if the note is active, set focus on the textarea
    useEffect(() => {
        if (activeNoteId === note.id && textareaRef.current) {
            textareaRef.current.focus()
        }
    }
    , [activeNoteId, note.id])

    return (
        <div
            ref={cardRef}
            className={`card ${
                // If there’s an active search query and the note text includes it, add a highlight
                searchQuery &&
                note.body.toLowerCase().includes(searchQuery.toLowerCase())
                  ? "highlight"
                  : ""
              }`}            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            role="article"
            aria-label={`Note created on ${createdAt} `}
            >
            <div
                className="card-header"
                onMouseDown={mouseDown}
                style={{ backgroundColor: colors.colorHeader }}
            >
                 <button 
                    onClick={() => deleteNote(note.id)}
                    aria-label="Delete note"
                    className="icon-button"
                >
                    <Trash />
                </button>
            </div>
            <div className="card-body">
                <textarea
                    ref={textareaRef}
                    onInput={handleInput}
                    style={{ 
                        color: colors.colorText,
                        fontSize: appSettings.fontSize,
                        fontFamily: appSettings.fontFamily,
                        lineHeight: appSettings.lineHeight,
                    }}
                    value={body}
                    placeholder="Type something..."
                    onFocus={() => setZIndex(cardRef.current)}
                    aria-label="Note content"
                ></textarea>
            </div>
            <div className="card-footer"
                style={{ 
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    color: colors.colorText,
                    opacity: 0.7,
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <span>{createdAt}</span>
                <span>{characterCount} chars</span>
            </div>
        </div>
    )
}

export default NoteCard