import React, { useState } from 'react'

export default function Tooltip({ children, label, delay = 500, position = 'right' }) {
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
        <div className={`absolute ${position === 'right' ? 'left-full ml-3' : 'right-full mr-3'} top-1/2 -translate-y-1/2 z-[100] pointer-events-none`}>
          <div className="bg-surface-tertiary border border-border px-3 py-1.5 rounded-lg whitespace-nowrap text-sm text-text-primary shadow-medium animate-fade-in">
            {label}
            <div className={`absolute ${position === 'right' ? 'right-full' : 'left-full'} top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent ${position === 'right' ? 'border-r-4 border-r-surface-tertiary' : 'border-l-4 border-l-surface-tertiary'}`} />
          </div>
        </div>
      )}
    </div>
  )
}

