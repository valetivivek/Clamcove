import React, { useEffect, useRef } from 'react'
import { backgrounds } from '../../config/backgrounds'

export default function BackgroundLayer({ backgroundId }) {
  const backgroundRef = useRef(null)
  const background = backgrounds.find(bg => bg.id === backgroundId) || backgrounds.find(bg => bg.id === 'cybercity')
  const backgroundUrl = background?.srcLarge || `/assets/images/backgrounds/Cybercity.jpg`

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
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          willChange: 'transform',
          zIndex: 0,
        }}
      />
      {/* Fallback gradient if image doesn't load - behind image */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{ zIndex: -1 }} />
    </div>
  )
}

