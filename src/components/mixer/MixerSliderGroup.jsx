import React, { useState, useEffect } from 'react'
import { IconVolume, IconPlay, IconPause } from '../icons/Icons'

// Visualizer component - animated equalizer bars for ambient sounds
const Visualizer = ({ value, max = 100, isPlaying }) => {
  const [animationTime, setAnimationTime] = useState(0)
  const bars = 16
  const barWidth = 2.5
  const barGap = 1.5
  const maxHeight = 20

  useEffect(() => {
    if (isPlaying && value > 0) {
      const interval = setInterval(() => {
        setAnimationTime(prev => prev + 1)
      }, 60)
      return () => clearInterval(interval)
    }
  }, [isPlaying, value])

  return (
    <div className="flex items-end gap-0.5 h-5" style={{ width: `${bars * (barWidth + barGap)}px` }}>
      {Array.from({ length: bars }).map((_, i) => {
        const progress = (i / bars) * 100
        const isActive = isPlaying && progress < value && value > 0
        const baseHeight = isActive ? (value / max) * maxHeight : 2
        const variation = isActive 
          ? Math.sin(i * 0.5 + animationTime * 0.1) * 4 + 
            Math.cos(i * 0.3 + animationTime * 0.15) * 3
          : 0
        const height = Math.max(2, baseHeight + variation)
        
        // Color gradient based on position - neutral gray
        const lightness = 40 + (i / bars) * 20 // Gray gradient
        const color = isActive 
          ? `hsl(0, 0%, ${lightness}%)`
          : 'rgba(255, 255, 255, 0.1)'
        
        return (
          <div
            key={i}
            className="rounded-sm transition-all duration-100"
            style={{
              width: `${barWidth}px`,
              height: `${height}px`,
              minHeight: '2px',
              backgroundColor: color,
              boxShadow: isActive 
                ? `0 0 ${3 + (value / max) * 3}px ${color}`
                : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

export default function MixerSliderGroup({ slider, value, onChange, onToggle, isPlaying = false }) {
  const isAmbient = slider.id !== 'volume' && slider.id !== 'musicVolume'

  return (
    <div className="px-6 py-1">
      <div className={`card p-3 transition-all duration-200 relative overflow-hidden ${
        isPlaying && isAmbient 
          ? 'border-accent-primary/40 bg-accent-primary/5' 
          : isAmbient 
          ? 'opacity-60 border-border/30' 
          : value > 0 
          ? 'border-accent-primary/30' 
          : ''
      }`}>
        {/* Subtle background glow when playing */}
        {isPlaying && isAmbient && (
          <div 
            className="absolute inset-0 opacity-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at left center, rgb(96, 165, 250) 0%, transparent 60%)`,
            }}
          />
        )}
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1">
              {/* Play/Pause button for ambient sounds */}
              {isAmbient && (
                <button
                  onClick={onToggle}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    isPlaying
                      ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30'
                      : 'bg-surface-secondary text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary'
                  }`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <IconPause className="w-3.5 h-3.5" />
                  ) : (
                    <IconPlay className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
              
              <div className="flex-1">
                <span className={`text-xs font-medium ${
                  isPlaying && isAmbient
                    ? 'text-text-primary'
                    : isAmbient
                    ? 'text-text-tertiary'
                    : value > 0 
                    ? 'text-text-primary' 
                    : 'text-text-tertiary'
                }`}>
                  {slider.label}
                </span>
                {value > 0 && (
                  <span className={`text-xs font-mono ml-2 px-1.5 py-0.5 rounded ${
                    isPlaying && isAmbient
                      ? 'text-accent-primary bg-accent-primary/15'
                      : isAmbient
                      ? 'text-text-tertiary bg-surface-tertiary'
                      : 'text-accent-primary bg-accent-primary/10'
                  }`}>
                    {value}%
                  </span>
                )}
              </div>
            </div>
            
            {/* Visualizer for ambient sounds */}
            {isAmbient && (
              <div className="flex-shrink-0 ml-2">
                <Visualizer value={value} isPlaying={isPlaying} />
              </div>
            )}
          </div>

          {/* Slider - always visible but grayed out when not playing */}
          <div className="relative">
            <div className={`absolute inset-0 h-2 rounded-full transition-all duration-200 ${
              isPlaying && isAmbient
                ? 'bg-gradient-to-r from-surface-tertiary via-surface-secondary to-surface-tertiary opacity-30'
                : isAmbient
                ? 'bg-surface-tertiary opacity-20'
                : 'bg-gradient-to-r from-surface-tertiary via-surface-secondary to-surface-tertiary opacity-50'
            }`} />
            
            {/* Active fill */}
            <div 
              className={`absolute h-2 rounded-full transition-all duration-200 ${
                isPlaying && isAmbient ? '' : isAmbient ? 'opacity-30' : ''
              }`}
              style={{
                width: `${value}%`,
                background: isPlaying && isAmbient
                  ? `linear-gradient(90deg, 
                      rgb(96, 165, 250) 0%, 
                      rgb(96, 165, 250) 50%,
                      rgb(147, 197, 253) 100%)`
                  : `linear-gradient(90deg, 
                      rgb(96, 165, 250) 0%, 
                      rgb(96, 165, 250) 50%,
                      rgb(147, 197, 253) 100%)`,
                boxShadow: isPlaying && isAmbient
                  ? '0 0 12px rgba(96, 165, 250, 0.4), inset 0 0 6px rgba(96, 165, 250, 0.2)'
                  : 'none',
              }}
            />
            
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              value={value}
              onChange={(e) => {
                const newValue = parseInt(e.target.value)
                onChange(newValue)
              }}
              className="slider-base w-full"
              style={{
                background: 'transparent',
              }}
              aria-label={slider.label}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
