import React from 'react'

export default function OverlayLayer() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 100%)',
        zIndex: 1,
      }}
    />
  )
}

