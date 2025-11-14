import React, { useState, useRef, useEffect } from 'react'
import { mixerSliders, mixerModes } from '../../config/mixer'
import { tracks } from '../../config/tracks'
import MixerHeader from './MixerHeader'
import MixerModeChips from './MixerModeChips'
import MixerSliderGroup from './MixerSliderGroup'
import { usePlayer } from '../player/PlayerContext'
import DraggablePanel from '../ui/DraggablePanel'
import ResizablePanel from '../ui/ResizablePanel'

export default function MixerPanel({ isOpen, onClose }) {
  const [activeMode, setActiveMode] = useState('chill')
  const { setVolume, setCurrentTrackIndex } = usePlayer()
  const dragHandleRef = useRef(null)
  const [sliderValues, setSliderValues] = useState(() => {
    const saved = localStorage.getItem('calmcove-mixer-values')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // Fallback to defaults
      }
    }
    const initial = {}
    mixerSliders.forEach((slider) => {
      initial[slider.id] = slider.defaultValue
    })
    return initial
  })
  const [playingSounds, setPlayingSounds] = useState(() => {
    const saved = localStorage.getItem('calmcove-playing-sounds')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return {}
      }
    }
    return {}
  })

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('calmcove-mixer-values', JSON.stringify(sliderValues))
  }, [sliderValues])

  // Save playing sounds state
  useEffect(() => {
    localStorage.setItem('calmcove-playing-sounds', JSON.stringify(playingSounds))
  }, [playingSounds])

  // Sync music volume with player context
  useEffect(() => {
    const musicVolume = sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : 60
    setVolume(musicVolume / 100) // Convert 0-100 to 0-1
  }, [sliderValues.musicVolume, setVolume])

  const handleSliderChange = (sliderId, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [sliderId]: value,
    }))
  }

  const handleToggle = (sliderId) => {
    // Toggle play/pause state for ambient sounds
    if (sliderId !== 'volume' && sliderId !== 'musicVolume') {
      setPlayingSounds(prev => ({
        ...prev,
        [sliderId]: !prev[sliderId]
      }))
    } else {
      // For volume sliders, toggle mute/unmute
      const currentValue = sliderValues[sliderId]
      if (currentValue > 0) {
        handleSliderChange(sliderId, 0)
      } else {
        const slider = mixerSliders.find((s) => s.id === sliderId)
        handleSliderChange(sliderId, slider?.defaultValue || 50)
      }
    }
  }

  const handleModeChange = (modeId) => {
    setActiveMode(modeId)
    // Filter tracks by mode and switch to first matching track
    if (modeId === 'all') {
      // For 'all', just go to first track
      setCurrentTrackIndex(0)
    } else {
      // Find first track matching the mode
      const modeMap = {
        chill: 'chill',
        energy: 'energy',
        focus: 'focus',
      }
      const targetMode = modeMap[modeId]
      if (targetMode) {
        const matchingIndex = tracks.findIndex(track => track.mode === targetMode)
        if (matchingIndex !== -1) {
          setCurrentTrackIndex(matchingIndex)
        }
      }
    }
  }

  const handleReset = () => {
    const initial = {}
    mixerSliders.forEach((slider) => {
      initial[slider.id] = slider.defaultValue
    })
    setSliderValues(initial)
  }

  const handleMuteAll = () => {
    // Stop all ambient sounds
    const stopped = {}
    ambientSliders.forEach((slider) => {
      stopped[slider.id] = false
    })
    setPlayingSounds(prev => ({
      ...prev,
      ...stopped,
    }))
  }

  if (!isOpen) return null

  const volumeSlider = mixerSliders.find(s => s.id === 'volume')
  const musicVolumeSlider = mixerSliders.find(s => s.id === 'musicVolume')
  const ambientSliders = mixerSliders.filter(s => s.id !== 'volume' && s.id !== 'musicVolume')
  const totalActive = ambientSliders.filter(s => playingSounds[s.id]).length

  return (
    <>
      {/* Panel - centered, draggable, and resizable */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in" style={{ pointerEvents: 'none' }}>
        <DraggablePanel dragHandleRef={dragHandleRef}>
          <ResizablePanel minWidth={500} minHeight={500} maxWidth={800} maxHeight={700}>
            <div 
              className="panel-strong h-full flex flex-col overflow-hidden" 
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - drag handle */}
              <div ref={dragHandleRef}>
                <MixerHeader onClose={onClose} onReset={handleReset} onMuteAll={handleMuteAll} totalActive={totalActive} />
              </div>

              {/* Content - scrollable */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Mode chips - controls music type */}
                <div className="px-6 pt-3 pb-2">
                  <MixerModeChips activeMode={activeMode} onModeChange={handleModeChange} />
                </div>

                {/* Master Volume Section */}
                {volumeSlider && (
                  <div className="px-6 py-3">
                    <div className="card p-4 relative overflow-hidden">
                      {/* Background gradient effect */}
                      <div 
                        className="absolute inset-0 opacity-10 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, rgb(96, 165, 250) 0%, transparent 70%)`,
                          opacity: (sliderValues.volume || volumeSlider.defaultValue) / 100 * 0.15
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-semibold text-text-primary">{volumeSlider.label}</h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xl font-bold text-accent-primary tabular-nums" style={{
                                textShadow: '0 0 15px rgba(96, 165, 250, 0.5)'
                              }}>
                                {sliderValues.volume || volumeSlider.defaultValue}%
                              </div>
                            </div>
                            {/* Compact circular progress */}
                            <div className="relative">
                              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="none"
                                  stroke="rgba(255, 255, 255, 0.1)"
                                  strokeWidth="6"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="none"
                                  stroke="rgb(96, 165, 250)"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  strokeDasharray={`${2 * Math.PI * 40}`}
                                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (sliderValues.volume || volumeSlider.defaultValue) / 100)}`}
                                  className="transition-all duration-300"
                                  style={{
                                    filter: 'drop-shadow(0 0 6px rgba(96, 165, 250, 0.6))'
                                  }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Compact visualizer and slider in one row */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0">
                            <Visualizer value={sliderValues.volume || volumeSlider.defaultValue} isVolume={true} />
                          </div>
                          
                          {/* Enhanced Volume slider with gradient */}
                          <div className="relative flex-1">
                            {/* Slider track background with gradient */}
                            <div className="absolute inset-0 h-2.5 rounded-full bg-gradient-to-r from-surface-tertiary via-surface-secondary to-surface-tertiary opacity-50" />
                            
                            {/* Active fill with animated gradient - no transition for immediate response */}
                            <div 
                              className="absolute h-2.5 rounded-full"
                              style={{
                                width: `${sliderValues.volume || volumeSlider.defaultValue}%`,
                                background: `linear-gradient(90deg, 
                                  rgb(96, 165, 250) 0%, 
                                  rgb(96, 165, 250) 50%,
                                  rgb(147, 197, 253) 100%)`,
                                boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), inset 0 0 8px rgba(96, 165, 250, 0.2)',
                                transition: 'none', // Remove transition for immediate response
                              }}
                            />
                            
                            {/* Volume level markers */}
                            <div className="absolute inset-0 flex items-center justify-between px-0.5 pointer-events-none">
                              {[0, 25, 50, 75, 100].map((mark) => (
                                <div
                                  key={mark}
                                  className={`w-0.5 h-2.5 rounded-full transition-all duration-300 ${
                                    (sliderValues.volume || volumeSlider.defaultValue) >= mark
                                      ? 'bg-accent-primary opacity-60'
                                      : 'bg-white/20 opacity-30'
                                  }`}
                                  style={{
                                    boxShadow: (sliderValues.volume || volumeSlider.defaultValue) >= mark
                                      ? '0 0 4px rgba(96, 165, 250, 0.5)'
                                      : 'none'
                                  }}
                                />
                              ))}
                            </div>
                            
                            <input
                              type="range"
                              min={volumeSlider.min}
                              max={volumeSlider.max}
                              value={sliderValues.volume || volumeSlider.defaultValue}
                              onChange={(e) => handleSliderChange('volume', parseInt(e.target.value))}
                              className="slider-volume-compact w-full relative z-10"
                              aria-label="Master Volume"
                            />
                          </div>
                        </div>
                        
                        {/* Compact volume labels */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-tertiary">0</span>
                          <span className={`font-medium transition-colors duration-300 ${
                            (sliderValues.volume || volumeSlider.defaultValue) < 30
                              ? 'text-status-error'
                              : (sliderValues.volume || volumeSlider.defaultValue) < 70
                              ? 'text-status-warning'
                              : 'text-status-success'
                          }`}>
                            {(sliderValues.volume || volumeSlider.defaultValue) < 30
                              ? 'Low'
                              : (sliderValues.volume || volumeSlider.defaultValue) < 70
                              ? 'Medium'
                              : 'High'}
                          </span>
                          <span className="text-text-tertiary">100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Music Volume Section */}
                {musicVolumeSlider && (
                  <div className="px-6 py-2">
                    <div className="card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-text-primary">{musicVolumeSlider.label}</h3>
                        <div className="text-sm font-bold text-accent-primary tabular-nums">
                          {sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : musicVolumeSlider.defaultValue}%
                        </div>
                      </div>
                      
                      {/* Music volume slider */}
                      <div className="relative">
                        <input
                          type="range"
                          min={musicVolumeSlider.min}
                          max={musicVolumeSlider.max}
                          value={sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : musicVolumeSlider.defaultValue}
                          onChange={(e) => handleSliderChange('musicVolume', parseInt(e.target.value))}
                          className="slider-base w-full"
                          style={{
                            background: `linear-gradient(to right, rgb(96, 165, 250) 0%, rgb(96, 165, 250) ${sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : musicVolumeSlider.defaultValue}%, rgba(255,255,255,0.1) ${sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : musicVolumeSlider.defaultValue}%, rgba(255,255,255,0.1) 100%)`
                          }}
                          aria-label="Music Volume"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Ambient Sounds Header */}
                <div className="px-6 py-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Ambient Sounds</h3>
                    <span className="text-xs text-text-tertiary">
                      {totalActive} active
                    </span>
                  </div>
                </div>

                {/* Ambient Sound Sliders */}
                <div className="space-y-0.5 pb-3">
                  {ambientSliders.map((slider) => (
                    <MixerSliderGroup
                      key={slider.id}
                      slider={slider}
                      value={sliderValues[slider.id] || slider.defaultValue}
                      isPlaying={playingSounds[slider.id] || false}
                      onChange={(value) => handleSliderChange(slider.id, value)}
                      onToggle={() => handleToggle(slider.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </DraggablePanel>
      </div>
    </>
  )
}

// Enhanced Visualizer component for volume
const Visualizer = ({ value, max = 100, isVolume = false }) => {
  const [animationTime, setAnimationTime] = useState(0)
  const bars = 24
  const barWidth = 2.5
  const barGap = 1.5
  const maxHeight = 28

  useEffect(() => {
    if (value > 0) {
      const interval = setInterval(() => {
        setAnimationTime(prev => prev + 1)
      }, 50) // Update every 50ms for smooth animation
      return () => clearInterval(interval)
    }
  }, [value])

  return (
    <div className="flex items-end gap-0.5 h-7" style={{ width: `${bars * (barWidth + barGap)}px` }}>
      {Array.from({ length: bars }).map((_, i) => {
        const progress = (i / bars) * 100
        const isActive = progress < value && value > 0
        const baseHeight = isActive ? (value / max) * maxHeight : 3
        // More dynamic waveform variation with animation
        const variation = isActive 
          ? Math.sin(i * 0.5 + animationTime * 0.1) * 8 + 
            Math.cos(i * 0.3 + animationTime * 0.15) * 5 +
            Math.sin(i * 0.8 + animationTime * 0.05) * 3
          : 0
        const height = Math.max(3, baseHeight + variation)
        
        // Color gradient based on position and value
        const intensity = value / max
        const hue = 210 + (i / bars) * 20 // Blue to cyan gradient
        const saturation = 60 + intensity * 40
        const lightness = 50 + intensity * 20
        const color = isActive 
          ? `hsl(${hue}, ${saturation}%, ${lightness}%)`
          : 'rgba(255, 255, 255, 0.1)'
        
        return (
          <div
            key={i}
            className="rounded-sm transition-all duration-150"
            style={{
              width: `${barWidth}px`,
              height: `${height}px`,
              minHeight: '3px',
              backgroundColor: color,
              boxShadow: isActive 
                ? `0 0 ${4 + intensity * 4}px ${color}, 0 0 ${2 + intensity * 2}px ${color}`
                : 'none',
              transform: isActive ? `scaleY(${0.9 + intensity * 0.1})` : 'scaleY(1)',
            }}
          />
        )
      })}
    </div>
  )
}
