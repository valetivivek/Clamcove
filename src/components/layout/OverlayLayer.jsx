import React from 'react'

export default function OverlayLayer() {
  return (
    <>
      {/* Cool gradient overlay for atmosphere - subtle */}
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-coolBlue/2 via-transparent to-darkCool/40 pointer-events-none" />
      {/* Vignette effect - darker edges, cool center */}
      <div className="fixed inset-0 z-10 pointer-events-none" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, rgba(20, 25, 35, 0.4) 100%)'
           }} />
    </>
  )
}

