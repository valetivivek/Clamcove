import React from 'react'
import { usePlayer } from './PlayerContext'
import {
  IconPrevious,
  IconNext,
  IconPlay,
  IconPause,
  IconMixer,
  IconHeart,
} from '../icons/Icons'

export default function PlayerBar({ onToggleMixer }) {
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, previousTrack } = usePlayer()

  return (
    <div className="w-full">
      <div className="panel flex items-center gap-3 py-2 px-3 h-14">
        {/* Left cluster - Play controls */}
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={previousTrack}
            className="btn-icon w-9 h-9 flex items-center justify-center"
            aria-label="Previous track"
          >
            <IconPrevious />
          </button>

          <button
            onClick={togglePlayPause}
            className="btn-icon w-10 h-10 bg-accent-primary text-white hover:bg-accent-primary/90 flex items-center justify-center"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="btn-icon w-9 h-9 flex items-center justify-center"
            aria-label="Next track"
          >
            <IconNext />
          </button>

          <button 
            onClick={onToggleMixer}
            className="btn-icon w-9 h-9 flex items-center justify-center" 
            aria-label="Mixer"
          >
            <IconMixer className="w-4 h-4" />
          </button>
        </div>

        {/* Center - Track info with album art */}
        <div className="flex-1 min-w-0 px-3 flex items-center gap-2.5">
          {currentTrack?.coverImageUrl && (
            <img
              src={currentTrack.coverImageUrl}
              alt="Album cover"
              className="w-9 h-9 rounded-lg shadow-soft object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-text-primary truncate">
              {currentTrack?.title || 'No track selected'}
            </div>
            <div className="text-[10px] text-text-secondary truncate">
              {currentTrack?.artist || 'Select a track'}
            </div>
          </div>
        </div>

        {/* Right cluster - Favorites */}
        <div className="flex items-center justify-center gap-1.5">
          <button className="btn-icon w-9 h-9 flex items-center justify-center" aria-label="Favorites">
            <IconHeart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
