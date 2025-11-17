import React, { useRef } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import DraggablePanel from '../ui/DraggablePanel'
import { IconClose } from '../icons/Icons'

export default function SettingsPanel({ isOpen, onClose }) {
  const { settings, updateSettings } = useSettings()
  const dragHandleRef = useRef(null)

  if (!isOpen) return null

  return (
    <>
      {/* Panel - centered and draggable, no overlay */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 animate-scale-in" style={{ pointerEvents: 'none' }}>
        <DraggablePanel dragHandleRef={dragHandleRef} panelId="settings">
          <div className="panel-strong max-h-[85vh] flex flex-col overflow-hidden" style={{ pointerEvents: 'auto' }}>
          {/* Drag handle - header area */}
          <div 
            ref={dragHandleRef}
            className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60"></div>
              <h2 className="text-xl font-sans font-semibold text-text-primary tracking-tight">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100"
              aria-label="Close settings"
            >
              <IconClose />
            </button>
          </div>

          <div className="p-6 overflow-y-auto no-scrollbar flex-1">
            <div className="space-y-8">
              {/* Sidebar Position Section */}
              <section>
                <h3 className="text-xs font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                  Layout
                </h3>
                <div className="p-4 rounded-xl card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">Sidebar Position</span>
                    <span className="text-xs text-text-tertiary tabular-nums">
                      {Math.round(settings.sidebarPosition)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={settings.sidebarPosition}
                    onChange={(e) => updateSettings({ sidebarPosition: parseInt(e.target.value) })}
                    className="slider-base w-full"
                    aria-label="Sidebar position"
                  />
                  <p className="text-xs text-text-tertiary mt-2">Adjust vertical position of the sidebar</p>
                </div>
              </section>

              {/* Clock Customization Section */}
              <section>
                <h3 className="text-xs font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                  Center Clock
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-xl card">
                    <div>
                      <span className="text-sm font-medium text-text-primary block">Show Clock</span>
                      <span className="text-xs text-text-tertiary">Display center clock widget</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.clock.enabled}
                        onChange={(e) => updateSettings({ 
                          clock: { ...settings.clock, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                    </label>
                  </div>
                  
                  {settings.clock.enabled && (
                    <>
                      <div className="p-4 rounded-xl card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">Clock Size</span>
                        </div>
                        <div className="flex gap-2">
                          {['small', 'medium', 'large'].map((size) => (
                            <button
                              key={size}
                              onClick={() => updateSettings({ 
                                clock: { ...settings.clock, size }
                              })}
                              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex-1 flex items-center justify-center ${
                                settings.clock.size === size
                                  ? 'bg-accent-primary text-white'
                                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                              }`}
                            >
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">Clock Style</span>
                        </div>
                        <div className="flex gap-2">
                          {['digital', 'minimal', 'analog'].map((style) => (
                            <button
                              key={style}
                              onClick={() => updateSettings({ 
                                clock: { ...settings.clock, style }
                              })}
                              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex-1 flex items-center justify-center ${
                                settings.clock.style === style
                                  ? 'bg-accent-primary text-white'
                                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                              }`}
                            >
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Player Bar Section */}
              <section>
                <h3 className="text-xs font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                  Player Bar
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-xl card">
                    <div>
                      <span className="text-sm font-medium text-text-primary block">Auto-Hide</span>
                      <span className="text-xs text-text-tertiary">Automatically hide player bar after inactivity</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.playerBar?.autoHide !== false}
                        onChange={(e) => updateSettings({ 
                          playerBar: { ...settings.playerBar, autoHide: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                    </label>
                  </div>
                  
                  {settings.playerBar?.autoHide !== false && (
                    <div className="p-4 rounded-xl card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-primary">Hide After</span>
                        <span className="text-xs text-text-tertiary tabular-nums">
                          {Math.round((settings.playerBar?.hideTimeout || 600000) / 60000)} min
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={Math.round((settings.playerBar?.hideTimeout || 600000) / 60000)}
                        onChange={(e) => updateSettings({ 
                          playerBar: { ...settings.playerBar, hideTimeout: parseInt(e.target.value) * 60000 }
                        })}
                        className="slider-base w-full"
                        aria-label="Player bar hide timeout"
                      />
                      <p className="text-xs text-text-tertiary mt-2">Time before player bar auto-hides (1-30 minutes)</p>
                    </div>
                  )}
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

