import React from 'react'
import { mixerModes } from '../../config/mixer'

// Icon components
const IconChill = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const IconEnergy = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
)

const IconFocus = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
  </svg>
)

const IconAll = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M2 20h2v-6H2v6zm5 0h2v-8H7v8zm5 0h2v-4h-2v4zm5 0h2v-2h-2v2zm5 0h2v-6h-2v6zM2 7h2V4H2v3zm5 0h2V4H7v3zm5 0h2V4h-2v3zm5 0h2V4h-2v3zm5 0h2V4h-2v3z" />
  </svg>
)

const modeIcons = {
  chill: IconChill,
  energy: IconEnergy,
  focus: IconFocus,
  all: IconAll,
}

export default function MixerModeChips({ activeMode, onModeChange }) {
  return (
    <div className="flex gap-2 justify-center">
      {mixerModes.map((mode) => {
        const Icon = modeIcons[mode.id]
        const isActive = activeMode === mode.id
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'bg-surface-tertiary'
                : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary/50'
            }`}
            style={isActive ? { color: 'var(--theme-color)' } : {}}
          >
            {Icon && (
              <Icon 
                style={isActive ? { color: 'var(--theme-color)' } : {}} 
                className={!isActive ? 'text-text-secondary' : ''}
              />
            )}
            <span>{mode.label}</span>
          </button>
        )
      })}
    </div>
  )
}
