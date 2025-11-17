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
        <DraggablePanel dragHandleRef={dragHandleRef} panelId="mixer">
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
                <div className="px-6 pt-4 pb-3">
                  <MixerModeChips activeMode={activeMode} onModeChange={handleModeChange} />
                </div>

                {/* Master Controls - Horizontal compact bar */}
                <div className="px-6 pb-4">
                  <div className="card p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Master Volume */}
                      {volumeSlider && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-text-secondary">{volumeSlider.label}</span>
                            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--theme-color)' }}>
                              {sliderValues.volume || volumeSlider.defaultValue}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 h-2 rounded-full bg-surface-tertiary opacity-50" />
                            <div 
                              className="absolute h-2 rounded-full transition-all duration-200"
                              style={{
                                width: `${sliderValues.volume || volumeSlider.defaultValue}%`,
                                backgroundColor: 'var(--theme-color)',
                              }}
                            />
                            <input
                              type="range"
                              min={volumeSlider.min}
                              max={volumeSlider.max}
                              value={sliderValues.volume || volumeSlider.defaultValue}
                              onChange={(e) => handleSliderChange('volume', parseInt(e.target.value))}
                              className="slider-base w-full relative z-10"
                              style={{ background: 'transparent' }}
                              aria-label="Master Volume"
                            />
                          </div>
                        </div>
                      )}

                      {/* Music Volume */}
                      {musicVolumeSlider && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-text-secondary">{musicVolumeSlider.label}</span>
                            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--theme-color)' }}>
                              {sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : musicVolumeSlider.defaultValue}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 h-2 rounded-full bg-surface-tertiary opacity-50" />
                            <div 
                              className="absolute h-2 rounded-full transition-all duration-200"
                              style={{
                                width: `${sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : musicVolumeSlider.defaultValue}%`,
                                backgroundColor: 'var(--theme-color)',
                              }}
                            />
                            <input
                              type="range"
                              min={musicVolumeSlider.min}
                              max={musicVolumeSlider.max}
                              value={sliderValues.musicVolume !== undefined ? sliderValues.musicVolume : musicVolumeSlider.defaultValue}
                              onChange={(e) => handleSliderChange('musicVolume', parseInt(e.target.value))}
                              className="slider-base w-full relative z-10"
                              style={{ background: 'transparent' }}
                              aria-label="Music Volume"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ambient Sounds - Grid Layout */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Ambient Sounds</h3>
                    <span className="text-xs text-text-tertiary">
                      {totalActive} active
                    </span>
                  </div>
                  
                  {/* Grid of ambient sound cards */}
                  <div className="grid grid-cols-2 gap-3">
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
            </div>
          </ResizablePanel>
        </DraggablePanel>
      </div>
    </>
  )
}

