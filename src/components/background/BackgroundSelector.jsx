import React from 'react'
import { backgrounds } from '../../config/backgrounds.js'

export default function BackgroundSelector({ currentBackgroundId, onSelect }) {
  const getImageSrc = (bg) => {
    if (window.innerWidth >= 1280) return bg.srcMedium
    return bg.srcSmall
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {backgrounds.map((bg) => (
        <button
          key={bg.id}
          onClick={() => onSelect(bg.id)}
          className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
            currentBackgroundId === bg.id
              ? 'border-accent ring-2 ring-accent/50 scale-105'
              : 'border-white/10 hover:border-white/20 hover:scale-102'
          }`}
          aria-label={`Select ${bg.name} background`}
        >
          <img
            src={getImageSrc(bg)}
            alt={bg.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 text-sm font-medium text-white">
            {bg.name}
          </div>
        </button>
      ))}
    </div>
  )
}

