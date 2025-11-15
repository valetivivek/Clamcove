import React, { useEffect, useRef, useState } from 'react'
import { backgrounds } from '../../config/backgrounds'

export default function BackgroundLayer({ backgroundId }) {
  const backgroundRef = useRef(null)
  const videoRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const background = backgrounds.find(bg => bg.id === backgroundId) || backgrounds[0]
  const isVideo = background?.type === 'video'
  const backgroundUrl = isVideo ? background?.src : (background?.srcLarge || background?.src)

  // Preload image for better LCP (only for static images)
  useEffect(() => {
    if (!isVideo) {
      const img = new Image()
      img.src = backgroundUrl
      img.onload = () => setImageLoaded(true)
    }
  }, [backgroundUrl, isVideo])

  // Handle video loading and playback
  useEffect(() => {
    if (isVideo && videoRef.current && backgroundUrl) {
      const video = videoRef.current
      setVideoError(false)
      setVideoLoaded(false)
      
      // Set up video attributes
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.playbackRate = 1.0
      video.preload = 'auto'
      
      const handleCanPlay = () => {
        setVideoLoaded(true)
        video.play().catch((err) => {
          console.warn('Video autoplay failed:', err)
          // Still show video even if autoplay fails
          setVideoLoaded(true)
        })
      }
      
      const handleLoadedData = () => {
        setVideoLoaded(true)
      }
      
      const handleError = (e) => {
        console.error('Video loading error:', e)
        setVideoError(true)
        setVideoLoaded(false)
      }
      
      const handleLoadStart = () => {
        setVideoLoaded(false)
      }
      
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('error', handleError)
      video.addEventListener('loadstart', handleLoadStart)
      
      // Set source and load
      if (video.src !== backgroundUrl) {
        video.src = backgroundUrl
        video.load()
      }
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadstart', handleLoadStart)
        video.pause()
        video.src = ''
        video.load() // Reset video element
      }
    }
  }, [isVideo, backgroundUrl])

  useEffect(() => {
    // Subtle parallax effect on scroll (only for images)
    if (!isVideo) {
      const handleScroll = () => {
        if (backgroundRef.current) {
          const scrollY = window.scrollY || window.pageYOffset
          backgroundRef.current.style.transform = `translateY(${scrollY * 0.5}px)`
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isVideo])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {isVideo ? (
        // Video Background (Live Wallpaper)
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            style={{
              opacity: videoLoaded && !videoError ? 1 : 0,
              zIndex: 0,
              filter: 'brightness(1.2) contrast(1.1) saturate(1.1)',
            }}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
          />
          {/* Error message if video fails to load */}
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-text-secondary text-sm">
                Failed to load video
              </div>
            </div>
          )}
        </>
      ) : (
        // Image Background (Static)
        <>
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
        </>
      )}
      
      {/* Fallback gradient - shown while content loads */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-tertiary transition-opacity duration-300 ease-in-out"
        style={{ 
          zIndex: -2,
          opacity: (isVideo ? videoLoaded : imageLoaded) ? 0 : 1,
        }}
      />
    </div>
  )
}

