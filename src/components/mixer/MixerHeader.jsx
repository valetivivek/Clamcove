import React from 'react'
import { IconClose, IconReset } from '../icons/Icons'

export default function MixerHeader({ onClose, onReset, onMuteAll, totalActive }) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60"></div>
        <h3 className="text-xl font-sans font-semibold text-text-primary tracking-tight">Mixer</h3>
        {totalActive > 0 && (
          <span className="text-xs font-medium text-text-tertiary bg-surface-secondary px-2 py-0.5 rounded-full">
            {totalActive} active
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {totalActive > 0 && (
          <button
            onClick={onMuteAll}
            className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-lg"
            aria-label="Mute all ambient sounds"
            title="Mute all ambient sounds"
          >
            Mute All
          </button>
        )}
        <button
          onClick={onReset}
          className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-lg"
          aria-label="Reset mixer"
          title="Reset all sliders"
        >
          <IconReset className="w-4 h-4" />
        </button>
        <button 
          onClick={onClose}
          className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100" 
          aria-label="Close mixer"
        >
          <IconClose />
        </button>
      </div>
    </div>
  )
}
