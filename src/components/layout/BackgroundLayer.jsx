import React, { useEffect, useRef, useState } from 'react'
import { backgrounds } from '../../config/backgrounds'

export default function BackgroundLayer({ backgroundId }) {
  const backgroundRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const background = backgrounds.find(bg => bg.id === backgroundId) || backgrounds.find(bg => bg.id === 'cybercity')
  const backgroundUrl = background?.srcLarge || `/assets/images/backgrounds/Cybercity.jpg`

  // Preload image for better LCP
  useEffect(() => {
    const img = new Image()
    img.src = backgroundUrl
    img.onload = () => setImageLoaded(true)
  }, [backgroundUrl])

  useEffect(() => {
    // Subtle parallax effect on scroll
    const handleScroll = () => {
      if (backgroundRef.current) {
        const scrollY = window.scrollY || window.pageYOffset
        backgroundRef.current.style.transform = `translateY(${scrollY * 0.5}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Priority load hero image with responsive srcset */}
      <picture>
        <source 
          media="(min-width: 1920px)" 
          srcSet={background?.srcLarge || backgroundUrl}
        />
        <source 
          media="(min-width: 1024px)" 
          srcSet={background?.srcMedium || backgroundUrl}
        />
        <img
          ref={backgroundRef}
          src={background?.srcSmall || backgroundUrl}
          srcSet={`
            ${background?.srcSmall || backgroundUrl} 1024w,
            ${background?.srcMedium || backgroundUrl} 1920w,
            ${background?.srcLarge || backgroundUrl} 3840w
          `}
          alt={`${background?.name || 'Background'} scene`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          style={{ 
            willChange: 'transform',
            opacity: imageLoaded ? 1 : 0,
            zIndex: 0,
          }}
          loading="eager"
          fetchPriority="high"
        />
      </picture>
      {/* Fallback gradient - shown while image loads */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-tertiary transition-opacity duration-300 ease-in-out"
        style={{ 
          zIndex: -1,
          opacity: imageLoaded ? 0 : 1,
        }}
      />
    </div>
  )
}

