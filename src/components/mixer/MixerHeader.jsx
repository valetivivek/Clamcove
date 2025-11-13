import React from 'react'
import { IconMenu, IconShuffle, IconCrown, IconClose } from '../icons/Icons'

export default function MixerHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
      <div className="flex items-center gap-3">
        <button className="text-textPrimary-muted hover:text-textPrimary transition-colors" aria-label="Menu">
          <IconMenu />
        </button>
        <h2 className="text-base font-medium text-textPrimary">Mixer</h2>
        <button className="text-green-400 hover:text-green-300 transition-colors" aria-label="Shuffle">
          <IconShuffle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-coolBlue hover:text-coolBlue-light transition-colors" aria-label="Presets">
          <IconCrown />
        </button>
        <span className="text-xs text-textPrimary-muted">Presets</span>
        <button 
          onClick={onClose}
          className="text-textPrimary-muted hover:text-textPrimary transition-colors" 
          aria-label="Close mixer"
        >
          <IconClose />
        </button>
      </div>
    </div>
  )
}

