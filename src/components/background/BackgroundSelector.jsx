import React, { useState, useRef, useEffect } from 'react'
import { backgrounds } from '../../config/backgrounds.js'

export default function BackgroundSelector({ currentBackgroundId, onSelect }) {
  const [hoveredId, setHoveredId] = useState(null)
  const videoRefs = useRef({})

  // Handle video preview on hover
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video) {
        if (hoveredId === id || currentBackgroundId === id) {
          video.play().catch(() => {
            // Autoplay failed, that's okay
          })
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [hoveredId, currentBackgroundId])

  return (
    <div className="grid grid-cols-2 gap-3">
      {backgrounds.map((bg) => {
        const isVideo = bg.type === 'video'
        const isSelected = currentBackgroundId === bg.id
        const isHovered = hoveredId === bg.id
        
        return (
          <button
            key={bg.id}
            onClick={() => onSelect(bg.id)}
            onMouseEnter={() => setHoveredId(bg.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
              isSelected
                ? 'border-accent-primary ring-2 ring-accent-primary/50 scale-105'
                : 'border-border hover:border-accent-primary/30 hover:scale-102'
            }`}
            aria-label={`Select ${bg.name} background`}
          >
            {/* Video Preview */}
            {isVideo ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current[bg.id] = el
                }}
                src={bg.src}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                style={{
                  opacity: isHovered || isSelected ? 1 : 0.7,
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-secondary to-surface-tertiary" />
            )}
            
            {/* Video indicator badge */}
            {isVideo && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md flex items-center gap-1.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-xs font-medium text-white">Live</span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Name and description */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="text-sm font-medium text-white mb-0.5">
                {bg.name}
              </div>
              {bg.description && (
                <div className="text-xs text-white/70">
                  {bg.description}
                </div>
              )}
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-accent-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

