import React from 'react'
import { usePlayer } from '../player/PlayerContext'
import BackgroundSelector from '../background/BackgroundSelector'
import ThemeSwitcher from '../theme/ThemeSwitcher'

export default function SettingsPanel({ isOpen, onClose, currentBackgroundId, onBackgroundChange }) {
  const { volume, setVolume } = usePlayer()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
      <div
        className="glass-strong w-full max-w-2xl p-6 pointer-events-auto animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-textPrimary">Settings</h2>
          <button
            onClick={onClose}
            className="btn-secondary w-8 h-8 rounded-lg text-lg leading-none"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Section */}
          <section>
            <h3 className="text-sm font-medium text-textPrimary-muted mb-3 uppercase tracking-wider">
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-textPrimary">Theme:</span>
                <ThemeSwitcher />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-textPrimary w-20">Brightness:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="slider-base flex-1"
                  aria-label="Brightness"
                />
                <span className="text-sm text-textPrimary-dim w-12 text-right tabular-nums">
                  50%
                </span>
              </div>
            </div>
          </section>

          {/* Background Section */}
          <section>
            <h3 className="text-sm font-medium text-textPrimary-muted mb-3 uppercase tracking-wider">
              Background Scene
            </h3>
            <BackgroundSelector
              currentBackgroundId={currentBackgroundId}
              onSelect={onBackgroundChange}
            />
          </section>

          {/* Volume Section */}
          <section>
            <h3 className="text-sm font-medium text-textPrimary-muted mb-3 uppercase tracking-wider">
              Volume
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-textPrimary w-20">Master:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                className="slider-base flex-1"
                aria-label="Master volume"
              />
              <span className="text-sm text-textPrimary-dim w-12 text-right tabular-nums">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

