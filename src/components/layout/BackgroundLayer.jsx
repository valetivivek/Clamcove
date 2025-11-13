import React from 'react'

export default function BackgroundLayer({ backgroundId }) {
  // Placeholder background - replace with your image/video
  const backgroundUrl = `/assets/images/backgrounds/${backgroundId}.jpg`

  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundUrl})`,
        }}
      />
      {/* Fallback gradient if image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
    </div>
  )
}

