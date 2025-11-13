import React, { useRef } from 'react'
import { usePlayer } from '../player/PlayerContext'
import BackgroundSelector from '../background/BackgroundSelector'
import ThemeSwitcher from '../theme/ThemeSwitcher'
import DraggablePanel from '../ui/DraggablePanel'
import { IconClose } from '../icons/Icons'

export default function SettingsPanel({ isOpen, onClose, currentBackgroundId, onBackgroundChange }) {
  const { volume, setVolume } = usePlayer()
  const dragHandleRef = useRef(null)

  if (!isOpen) return null

  return (
    <>
      {/* Dim overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel - centered and draggable */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 animate-scale-in">
        <DraggablePanel dragHandleRef={dragHandleRef}>
          <div className="glass-strong max-h-[85vh] flex flex-col overflow-hidden">
          {/* Drag handle - header area */}
          <div 
            ref={dragHandleRef}
            className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-glass-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-coolBlue/60"></div>
              <h2 className="text-xl font-display font-semibold text-textPrimary tracking-tight">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100"
              aria-label="Close settings"
            >
              <IconClose />
            </button>
          </div>

          <div className="p-6 overflow-y-auto scrollbar-thin flex-1">
            <div className="space-y-8">
              {/* Theme Section */}
              <section>
                <h3 className="text-xs font-semibold text-textPrimary-muted mb-4 uppercase tracking-wider">
                  Appearance
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-glass-soft border border-glass-border/50">
                    <div>
                      <span className="text-sm font-medium text-textPrimary block">Theme</span>
                      <span className="text-xs text-textPrimary-dim">Switch between themes</span>
                    </div>
                    <ThemeSwitcher />
                  </div>
                  <div className="p-4 rounded-xl bg-glass-soft border border-glass-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-textPrimary">Brightness</span>
                      <span className="text-xs text-textPrimary-dim tabular-nums">50%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="slider-base w-full"
                      aria-label="Brightness"
                    />
                  </div>
                </div>
              </section>

              {/* Background Section */}
              <section>
                <h3 className="text-xs font-semibold text-textPrimary-muted mb-4 uppercase tracking-wider">
                  Background Scene
                </h3>
                <div className="p-4 rounded-xl bg-glass-soft border border-glass-border/50">
                  <BackgroundSelector
                    currentBackgroundId={currentBackgroundId}
                    onSelect={onBackgroundChange}
                  />
                </div>
              </section>

              {/* Volume Section */}
              <section>
                <h3 className="text-xs font-semibold text-textPrimary-muted mb-4 uppercase tracking-wider">
                  Audio
                </h3>
                <div className="p-4 rounded-xl bg-glass-soft border border-glass-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-textPrimary">Master Volume</span>
                    <span className="text-xs text-textPrimary-dim tabular-nums">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                    className="slider-base w-full"
                    aria-label="Master volume"
                  />
                </div>
              </section>
            </div>
          </div>
          </div>
        </DraggablePanel>
      </div>
    </>
  )
}

