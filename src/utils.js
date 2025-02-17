export const setNewOffset = (card, moveDir) => {
    const rect = card.getBoundingClientRect()
    const newX = rect.left - moveDir.x
    const newY = rect.top - moveDir.y
    const maxX = window.innerWidth - rect.width
    const maxY = window.innerHeight - rect.height
    
    return {
      x: Math.min(Math.max(newX, 0), maxX),
      y: Math.min(Math.max(newY, 0), maxY)
    }
  }
export function autoSize(textAreaRef) {
    const { current } = textAreaRef;
    current.style.height = "auto"; // Reset the height
    current.style.height = current.scrollHeight + "px"; // Set the new height
}

export const setZIndex = (selectedCard) => {
    selectedCard.style.zIndex = 999;
 
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        if (card !== selectedCard) {
            card.style.zIndex = selectedCard.style.zIndex - 1;
        }
    });
};

