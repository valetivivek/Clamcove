import React, { useState, useRef, useEffect } from 'react'

export default function DraggablePanel({ children, dragHandleRef }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const panelRef = useRef(null)

  useEffect(() => {
    const handle = dragHandleRef?.current
    if (!handle) return

    const handleMouseDown = (e) => {
      if (e.target.closest('button, input, select, textarea, a')) return
      
      e.preventDefault()
      setIsDragging(true)
      const rect = panelRef.current?.getBoundingClientRect()
      if (rect) {
        // Calculate offset from mouse to panel center
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const panelCenterX = centerX + position.x
        const panelCenterY = centerY + position.y
        
        setDragStart({
          x: e.clientX - panelCenterX,
          y: e.clientY - panelCenterY,
        })
      }
    }

    handle.addEventListener('mousedown', handleMouseDown)
    handle.style.cursor = 'grab'
    handle.style.userSelect = 'none'

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown)
    }
  }, [dragHandleRef, position])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return

      e.preventDefault()
      
      // Calculate new position relative to center
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const newX = e.clientX - dragStart.x - centerX
      const newY = e.clientY - dragStart.y - centerY

      // Constrain to viewport bounds
      const maxX = window.innerWidth / 2 - 160
      const maxY = window.innerHeight / 2 - 100
      const constrainedX = Math.max(-maxX, Math.min(maxX, newX))
      const constrainedY = Math.max(-maxY, Math.min(maxY, newY))

      setPosition({ x: constrainedX, y: constrainedY })
    }

    const handleMouseUp = (e) => {
      e.preventDefault()
      setIsDragging(false)
      if (dragHandleRef?.current) {
        dragHandleRef.current.style.cursor = 'grab'
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp, { passive: false })
      if (dragHandleRef?.current) {
        dragHandleRef.current.style.cursor = 'grabbing'
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, dragHandleRef])

  return (
    <div
      ref={panelRef}
      className="relative"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  )
}

