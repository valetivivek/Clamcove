import React, { useState, useEffect } from 'react'
import { backgrounds } from '../../config/backgrounds'

export default function BackgroundLayer({ currentBackgroundId }) {
  const [currentBg, setCurrentBg] = useState(null)
  const [nextBg, setNextBg] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const background = backgrounds.find(bg => bg.id === currentBackgroundId)
    if (!background) return

    if (!currentBg) {
      // First load
      setCurrentBg(background)
      return
    }

    if (background.id !== currentBg.id) {
      // Start transition
      setNextBg(background)
      setIsTransitioning(true)

      // Complete transition after fade
      setTimeout(() => {
        setCurrentBg(background)
        setNextBg(null)
        setIsTransitioning(false)
      }, 500)
    }
  }, [currentBackgroundId, currentBg])

  if (!currentBg) return null

  // Determine which image to use based on viewport size
  const getImageSrc = (bg) => {
    if (window.innerWidth >= 1920) return bg.srcLarge
    if (window.innerWidth >= 1280) return bg.srcMedium
    return bg.srcSmall
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Current background */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backgroundImage: `url(${getImageSrc(currentBg)})`,
        }}
      />

      {/* Next background (during transition) */}
      {nextBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${getImageSrc(nextBg)})`,
            opacity: isTransitioning ? 1 : 0,
          }}
        />
      )}

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}

