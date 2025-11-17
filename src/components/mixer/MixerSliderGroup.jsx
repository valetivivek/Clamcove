import React from 'react'
import { IconPlay, IconPause } from '../icons/Icons'


export default function MixerSliderGroup({ slider, value, onChange, onToggle, isPlaying = false }) {
  const isAmbient = slider.id !== 'volume' && slider.id !== 'musicVolume'

  return (
    <div 
      className={`card p-3 transition-all duration-200 ${
        isAmbient && !isPlaying ? 'opacity-50' : ''
      }`}
      style={isPlaying && isAmbient ? {
        borderColor: 'var(--theme-color-30, rgba(34, 197, 94, 0.3))',
      } : {}}
    >
      {/* Compact vertical layout for grid */}
      <div className="space-y-2.5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Play/Pause button */}
            {isAmbient && (
              <button
                onClick={onToggle}
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  isPlaying
                    ? 'text-white'
                    : 'bg-surface-secondary text-text-tertiary hover:bg-surface-tertiary'
                }`}
                style={isPlaying ? {
                  backgroundColor: 'var(--theme-color)',
                } : {}}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <IconPause className="w-3.5 h-3.5" />
                ) : (
                  <IconPlay className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>
            )}
            
            <span className={`text-xs font-medium truncate ${
              isPlaying && isAmbient
                ? 'text-text-primary'
                : isAmbient
                ? 'text-text-tertiary'
                : 'text-text-primary'
            }`}>
              {slider.label}
            </span>
          </div>
          
          {value > 0 && (
            <span 
              className="text-xs font-semibold tabular-nums flex-shrink-0 ml-2"
              style={isPlaying && isAmbient ? {
                color: 'var(--theme-color)',
              } : (!isAmbient ? {
                color: 'var(--theme-color)',
              } : {})}
            >
              {value}%
            </span>
          )}
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="absolute inset-0 h-1.5 rounded-full bg-surface-tertiary opacity-40" />
          <div 
            className={`absolute h-1.5 rounded-full transition-all duration-200 ${
              isAmbient && !isPlaying ? 'opacity-40' : ''
            }`}
            style={{
              width: `${value}%`,
              backgroundColor: 'var(--theme-color)',
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
            className="slider-base w-full relative z-10"
            style={{ background: 'transparent', height: '6px' }}
            aria-label={slider.label}
          />
        </div>
      </div>
    </div>
  )
}
