import React, { useState } from 'react'

export default function Tooltip({ children, label, delay = 500 }) {
  const [show, setShow] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setShow(true)
    }, delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setShow(false)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-[100] pointer-events-none">
          <div className="glass-strong px-3 py-1.5 rounded-lg whitespace-nowrap text-sm text-textPrimary shadow-large animate-fade-in">
            {label}
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-glass-medium" />
          </div>
        </div>
      )}
    </div>
  )
}

