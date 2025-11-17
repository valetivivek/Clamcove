import React, { useState, useEffect } from 'react'
import { usePlayer } from './PlayerContext'
import { useSettings } from '../../contexts/SettingsContext'
import {
  IconPrevious,
  IconNext,
  IconPlay,
  IconPause,
  IconMixer,
  IconHeart,
  IconTimer,
  IconChecklist,
  IconNotes,
} from '../icons/Icons'

export default function PlayerBar({ onToggleMixer, onToggleTimer, onToggleTasks, onToggleNotes }) {
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, previousTrack } = usePlayer()
  const { settings } = useSettings()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  return (
    <div className="w-full">
      <div className="panel flex items-center gap-4 py-3 px-6 h-16">
        {/* Left cluster - Play controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={previousTrack}
            className="btn-icon flex items-center justify-center"
            aria-label="Previous track"
          >
            <IconPrevious className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            className="btn-icon w-12 h-12 text-white hover:opacity-90 flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: 'var(--theme-color)',
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="btn-icon flex items-center justify-center"
            aria-label="Next track"
          >
            <IconNext className="w-4 h-4" />
          </button>

          <div className="w-px h-8 bg-border mx-1"></div>

          <button 
            onClick={onToggleMixer}
            className="btn-icon flex items-center justify-center" 
            aria-label="Mixer"
          >
            <IconMixer className="w-4 h-4" />
          </button>
        </div>

        {/* Center - Progress bar with track info */}
        <div className="flex-1 flex flex-col gap-1 mx-4">
          {currentTrack && (
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-text-primary truncate flex-1">
                {currentTrack.title}
              </div>
              <div className="text-xs text-text-tertiary">
                {currentTrack.artist}
              </div>
            </div>
          )}
          <div className="h-1 bg-surface-secondary/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Right cluster - Functionality icons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="btn-icon flex items-center justify-center"
            aria-label="Favorites"
          >
            <IconHeart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <div className="w-px h-8 bg-border mx-1"></div>

          <button 
            onClick={onToggleTimer}
            className="btn-icon flex items-center justify-center"
            aria-label="Timer"
          >
            <IconTimer className="w-4 h-4" />
          </button>

          <button 
            onClick={onToggleTasks}
            className="btn-icon flex items-center justify-center"
            aria-label="Tasks"
          >
            <IconChecklist className="w-4 h-4" />
          </button>

          <button 
            onClick={onToggleNotes}
            className="btn-icon flex items-center justify-center"
            aria-label="Notes"
          >
            <IconNotes className="w-4 h-4" />
          </button>

          <div className="w-px h-8 bg-border mx-1"></div>

          <div className="text-sm font-semibold text-text-primary px-3 tabular-nums">
            {formatTime(currentTime)}
          </div>

          <button 
            onClick={handleFullscreen}
            className="btn-icon flex items-center justify-center"
            aria-label="Fullscreen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
