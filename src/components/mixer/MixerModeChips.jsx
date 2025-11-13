import React from 'react'
import { mixerModes } from '../../config/mixer'

export default function MixerModeChips({ activeMode, onModeChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {mixerModes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`chip ${activeMode === mode.id ? 'chip-active' : ''}`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}

