import React, { useRef, useState, useEffect } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import DraggablePanel from '../ui/DraggablePanel'
import { IconClose } from '../icons/Icons'

export default function SettingsPanel({ isOpen, onClose }) {
  const { settings, updateSettings } = useSettings()
  const dragHandleRef = useRef(null)
  const [activeTab, setActiveTab] = useState('layout')
  const [pendingThemeColor, setPendingThemeColor] = useState(settings.themeColor || '#22C55E')

  // Update pending theme color when settings change externally
  useEffect(() => {
    setPendingThemeColor(settings.themeColor || '#22C55E')
  }, [settings.themeColor])

  const handleApplyTheme = () => {
    updateSettings({ themeColor: pendingThemeColor })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Panel - centered and draggable, square shape */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[500px] h-[500px] animate-scale-in" style={{ pointerEvents: 'none' }}>
        <DraggablePanel dragHandleRef={dragHandleRef} panelId="settings">
          <div className="panel-strong w-full h-full flex flex-col overflow-hidden" style={{ pointerEvents: 'auto' }}>
          {/* Drag handle - header area */}
          <div 
            ref={dragHandleRef}
            className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/50 flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--theme-color-60, rgba(34, 197, 94, 0.6))' }}
              ></div>
              <h2 className="text-lg font-sans font-semibold text-text-primary tracking-tight">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100"
              aria-label="Close settings"
            >
              <IconClose />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/50 px-5 flex-shrink-0">
            {[
              { id: 'layout', label: 'Layout' },
              { id: 'theme', label: 'Theme' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-text-primary'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--theme-color)' }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-5 overflow-y-auto no-scrollbar flex-1">
            {/* Layout Tab */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                {/* Sidebar Position */}
                <div className="p-3 rounded-xl card">
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

                {/* Clock Settings */}
                <div className="p-3 rounded-xl card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-primary">Center Clock</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.clock.enabled}
                        onChange={(e) => updateSettings({ 
                          clock: { ...settings.clock, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 bg-surface-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          '--toggle-bg': 'var(--theme-color)',
                        }}
                      ></div>
                      <style>{`
                        input:checked + div {
                          background-color: var(--theme-color) !important;
                        }
                        input:focus + div {
                          box-shadow: 0 0 0 2px var(--theme-color-50, rgba(34, 197, 94, 0.5));
                        }
                      `}</style>
                    </label>
                  </div>
                  
                  {settings.clock.enabled && (
                    <div className="space-y-3 pt-3 border-t border-border/30">
                      <div>
                        <span className="text-xs text-text-tertiary block mb-2">Size</span>
                        <div className="flex gap-2">
                          {['small', 'medium', 'large'].map((size) => (
                            <button
                              key={size}
                              onClick={() => updateSettings({ 
                                clock: { ...settings.clock, size }
                              })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${
                                settings.clock.size === size
                                  ? 'text-white'
                                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                              }`}
                              style={settings.clock.size === size ? { backgroundColor: 'var(--theme-color)' } : {}}
                            >
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-text-tertiary block mb-2">Style</span>
                        <div className="flex gap-2">
                          {['digital', 'minimal', 'analog'].map((style) => (
                            <button
                              key={style}
                              onClick={() => updateSettings({ 
                                clock: { ...settings.clock, style }
                              })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${
                                settings.clock.style === style
                                  ? 'text-white'
                                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                              }`}
                              style={settings.clock.style === style ? { backgroundColor: 'var(--theme-color)' } : {}}
                            >
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                        {/* Player Bar Settings */}
                        <div className="p-3 rounded-xl card">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-sm font-medium text-text-primary block">Player Bar Auto-Hide</span>
                              <span className="text-xs text-text-tertiary">Hide after inactivity</span>
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
                              <div 
                                className="w-11 h-6 bg-surface-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                              ></div>
                              <style>{`
                                input:checked + div {
                                  background-color: var(--theme-color) !important;
                                }
                                input:focus + div {
                                  box-shadow: 0 0 0 2px var(--theme-color-50, rgba(34, 197, 94, 0.5));
                                }
                              `}</style>
                            </label>
                          </div>
                  
                  {settings.playerBar?.autoHide !== false && (
                    <div className="pt-3 border-t border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-tertiary">Hide After</span>
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
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl card">
                  <div className="mb-3">
                    <span className="text-sm font-medium text-text-primary block mb-1">Accent Color</span>
                    <span className="text-xs text-text-tertiary">Customize the accent color throughout the app</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={pendingThemeColor}
                      onChange={(e) => setPendingThemeColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                      style={{
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'transparent',
                        padding: 0,
                      }}
                      aria-label="Theme color picker"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={pendingThemeColor}
                        onChange={(e) => {
                          const value = e.target.value
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(value.replace('#', ''))) {
                            setPendingThemeColor(value.startsWith('#') ? value : `#${value}`)
                          }
                        }}
                        className="input-base w-full text-sm"
                        placeholder="#22C55E"
                        maxLength={7}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-xs text-text-tertiary block mb-2">Presets:</span>
                    <div className="flex gap-2 flex-wrap">
                      {['#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setPendingThemeColor(color)}
                          className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                          style={{
                            backgroundColor: color,
                            borderColor: pendingThemeColor === color ? color : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: pendingThemeColor === color ? `0 0 0 2px ${color}40` : 'none',
                          }}
                          aria-label={`Select ${color} color`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button - Separate card for visibility */}
                <div className="p-3 rounded-xl card">
                    <button
                      onClick={handleApplyTheme}
                      disabled={pendingThemeColor === settings.themeColor}
                      className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        pendingThemeColor === settings.themeColor
                          ? 'bg-surface-tertiary text-text-tertiary cursor-not-allowed opacity-60'
                          : 'text-white hover:opacity-90 active:scale-95 shadow-lg'
                      }`}
                      style={pendingThemeColor !== settings.themeColor ? {
                        backgroundColor: 'var(--theme-color)',
                        boxShadow: '0 10px 15px -3px var(--theme-color-40), 0 4px 6px -2px var(--theme-color-20)',
                      } : {}}
                    >
                      {pendingThemeColor === settings.themeColor ? 'No Changes to Apply' : 'Apply Theme'}
                    </button>
                  
                  {pendingThemeColor !== settings.themeColor && (
                    <p className="text-xs text-text-tertiary mt-2 text-center">
                      Click "Apply Theme" to apply your color changes
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
        </DraggablePanel>
      </div>
    </>
  )
}

