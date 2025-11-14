import React, { useState, useRef, useEffect } from 'react'

export default function ResizablePanel({ children, minWidth = 300, minHeight = 200, maxWidth = 800, maxHeight = 600 }) {
  const [size, setSize] = useState({ width: 500, height: 500 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const panelRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y

      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX))
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY))

      setSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'se-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, resizeStart, minWidth, minHeight, maxWidth, maxHeight])

  const handleResizeStart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    const rect = panelRef.current?.getBoundingClientRect()
    if (rect) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
      })
    }
  }

  return (
    <div
      ref={panelRef}
      className="relative"
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    >
      {children}
      {/* Resize handle - bottom-right corner */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize group"
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, rgba(96, 165, 250, 0.3) 30%, rgba(96, 165, 250, 0.3) 50%, transparent 50%)',
        }}
      >
        {/* Visual indicator */}
        <div className="absolute bottom-0 right-0 w-6 h-6 flex items-end justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 border-r-2 border-b-2 border-accent-primary/60 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
}
