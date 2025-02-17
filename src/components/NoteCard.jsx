// components/NoteCard.jsx (updated)
import { useContext, useEffect, useRef, useState } from "react"
import { NotesContext } from "../contexts/NotesContext.jsx"
import Trash from "../icons/Trash"
import { setNewOffset, autoSize, setZIndex } from "../utils"

const NoteCard = ({ note }) => {
    const { deleteNote, updateNote } = useContext(NotesContext)
    const [position, setPosition] = useState(note.position)
    const [body, setBody] = useState(note.body)
    const colors = note.colors
    const debounceTimeout = useRef(null)

    const cardRef = useRef(null)
    const textareaRef = useRef(null)
    let mouseStartPosition = { x: 0, y: 0 }

    useEffect(() => {
        autoSize(textareaRef)
    }, [])

    const handleInput = (e) => {
        setBody(e.target.value)
        clearTimeout(debounceTimeout.current)
        debounceTimeout.current = setTimeout(() => {
            updateNote(note.id, { body: e.target.value })
            autoSize(textareaRef)
        }, 300)
    }

    const mouseDown = (e) => {
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

    return (
        <div
            ref={cardRef}
            className="card"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}>
            <div
                className="card-header"
                onMouseDown={mouseDown}
                style={{ backgroundColor: colors.colorHeader }}
            >
                <span onClick={() => deleteNote(note.id)}><Trash /></span>
            </div>
            <div className="card-body">
                <textarea
                    ref={textareaRef}
                    onInput={handleInput}
                    style={{ color: colors.colorText }}
                    value={body}
                    placeholder="Type something..."
                    onFocus={() => setZIndex(cardRef.current)}
                ></textarea>
            </div>
        </div>
    )
}

export default NoteCard