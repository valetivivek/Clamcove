import React, { useState, useEffect, useRef } from 'react'
import BackgroundLayer from './BackgroundLayer'
import OverlayLayer from './OverlayLayer'
import Sidebar from '../sidebar/Sidebar'
import PlayerBar from '../player/PlayerBar'
// Dynamic imports for code splitting
const MixerPanel = React.lazy(() => import('../mixer/MixerPanel'))
const PomodoroPanel = React.lazy(() => import('../pomodoro/PomodoroPanel'))
const TasksNotesPanel = React.lazy(() => import('../tasks/TasksNotesPanel'))
const BackgroundPanel = React.lazy(() => import('../background/BackgroundPanel'))
const SettingsPanel = React.lazy(() => import('../settings/SettingsPanel'))

import TimerWidget from '../pomodoro/TimerWidget'
import CenterClock from '../clock/CenterClock'
import OnboardingFlow from '../onboarding/OnboardingFlow'
import { useIdle } from '../../hooks/useIdle'
import { useSettings } from '../../contexts/SettingsContext'

export default function MainLayout() {
  const [activePanel, setActivePanel] = useState(null)
  const [currentBackground, setCurrentBackground] = useState('temple-gate-autumn')
  const [timerState, setTimerState] = useState(null) // { minutes, seconds, mode }
  const { settings } = useSettings()
  const isIdle = useIdle(settings.idleTimeout || 300000)
  const [isPlayerBarVisible, setIsPlayerBarVisible] = useState(true)
  const playerBarTimeoutRef = useRef(null)
  const playerBarAreaRef = useRef(null)

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Apply theme color to CSS variables - runs on mount and when theme changes
  useEffect(() => {
    const applyTheme = () => {
      const themeColor = settings.themeColor || '#22C55E'
      const rgb = hexToRgb(themeColor)
      if (rgb) {
        // Set base color on document root
        const root = document.documentElement
        root.style.setProperty('--theme-color', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
        root.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
        root.style.setProperty('--theme-color-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`)
        
        // Calculate lighter and darker variants
        const light = { r: Math.min(255, rgb.r + 40), g: Math.min(255, rgb.g + 25), b: Math.min(255, rgb.b + 34) }
        const dark = { r: Math.max(0, rgb.r - 12), g: Math.max(0, rgb.g - 34), b: Math.max(0, rgb.b - 20) }
        root.style.setProperty('--theme-color-light', `rgb(${light.r}, ${light.g}, ${light.b})`)
        root.style.setProperty('--theme-color-dark', `rgb(${dark.r}, ${dark.g}, ${dark.b})`)
        
        // Add rgba versions with common opacities for better browser support
        root.style.setProperty('--theme-color-5', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`)
        root.style.setProperty('--theme-color-10', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`)
        root.style.setProperty('--theme-color-15', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`)
        root.style.setProperty('--theme-color-20', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`)
        root.style.setProperty('--theme-color-30', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`)
        root.style.setProperty('--theme-color-40', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`)
        root.style.setProperty('--theme-color-50', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`)
        root.style.setProperty('--theme-color-60', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`)
      }
    }
    
    // Apply immediately on mount and when theme changes
    applyTheme()
  }, [settings.themeColor])

  // Expose startFocusSession for SSG CTA
  useEffect(() => {
    window.startFocusSession = () => {
      setActivePanel('pomodoro')
    }
    return () => {
      delete window.startFocusSession
    }
  }, [])

  // PlayerBar auto-hide logic
  useEffect(() => {
    const autoHideEnabled = settings.playerBar?.autoHide !== false
    if (!autoHideEnabled) {
      setIsPlayerBarVisible(true)
      return
    }

    const hideTimeout = settings.playerBar?.hideTimeout || 600000 // Default 10 minutes

    const resetHideTimer = () => {
      if (playerBarTimeoutRef.current) {
        clearTimeout(playerBarTimeoutRef.current)
      }
      setIsPlayerBarVisible(true)
      playerBarTimeoutRef.current = setTimeout(() => {
        setIsPlayerBarVisible(false)
      }, hideTimeout)
    }

    // Initial timer
    resetHideTimer()

    // Track mouse activity near player bar area (bottom 100px of screen)
    const handleMouseMove = (e) => {
      const bottomThreshold = 100 // pixels from bottom
      const isNearBottom = window.innerHeight - e.clientY <= bottomThreshold
      
      if (isNearBottom) {
        resetHideTimer()
      }
    }

    // Track any interaction that should show the bar
    const handleInteraction = () => {
      resetHideTimer()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)

    return () => {
      if (playerBarTimeoutRef.current) {
        clearTimeout(playerBarTimeoutRef.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [settings.playerBar])

  const handleSidebarAction = (action) => {
    if (activePanel === action) {
      setActivePanel(null)
    } else {
      setActivePanel(action)
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Onboarding Flow */}
      <OnboardingFlow 
        onComplete={() => {}} 
        onStartFocus={() => {}}
      />

      {/* Background Layer */}
      <BackgroundLayer backgroundId={currentBackground} />

      {/* Overlay for readability */}
      <OverlayLayer />

      {/* Center Clock Widget */}
      <CenterClock />

      {/* Top left - Branding */}
      <div className={`absolute top-6 left-6 z-50 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-sans font-bold text-text-primary tracking-tight">
          Calm<span 
            className="px-2 py-0.5 rounded-lg"
            style={{ 
              color: 'var(--theme-color)',
              backgroundColor: 'var(--theme-color-10, rgba(34, 197, 94, 0.1))'
            }}
          >Cove</span>
        </h1>
      </div>

      {/* Top right - Pomodoro Timer (only when active) */}
      {timerState && (
        <div className={`absolute top-6 right-6 z-50 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
          <TimerWidget 
            minutes={timerState.minutes}
            seconds={timerState.seconds}
            mode={timerState.mode}
            isRunning={timerState.isRunning}
            onClick={() => setActivePanel('pomodoro')}
          />
        </div>
      )}

      {/* Right Sidebar - Zen style */}
      <Sidebar activePanel={activePanel} onAction={handleSidebarAction} />

      {/* Bottom Player Bar - Full width */}
      <div 
        ref={playerBarAreaRef}
        className={`fixed bottom-0 left-0 right-0 z-40 transition-opacity duration-500 ${
          isIdle || !isPlayerBarVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onMouseEnter={() => {
          // Show immediately on hover
          if (settings.playerBar?.autoHide !== false) {
            setIsPlayerBarVisible(true)
            if (playerBarTimeoutRef.current) {
              clearTimeout(playerBarTimeoutRef.current)
            }
          }
        }}
      >
        <div className="w-full px-4 pb-2">
          <PlayerBar 
            onToggleMixer={() => setActivePanel(activePanel === 'mixer' ? null : 'mixer')}
            onToggleTimer={() => setActivePanel(activePanel === 'pomodoro' ? null : 'pomodoro')}
            onToggleTasks={() => setActivePanel(activePanel === 'tasks' ? null : 'tasks')}
            onToggleNotes={() => {
              if (activePanel === 'tasks') {
                // If tasks panel is open, switch to notes tab
                setActivePanel('notes')
              } else {
                setActivePanel(activePanel === 'notes' ? null : 'notes')
              }
            }}
          />
        </div>
      </div>

      {/* Lazy-loaded panels with Suspense */}
      <React.Suspense fallback={null}>
        {/* Mixer Panel - centered, draggable, resizable */}
        {activePanel === 'mixer' && (
          <MixerPanel isOpen={true} onClose={() => setActivePanel(null)} />
        )}

        {/* Pomodoro Panel - slides in from right */}
        {activePanel === 'pomodoro' && (
          <PomodoroPanel 
            isOpen={true} 
            onClose={() => setActivePanel(null)}
            onTimerStart={setTimerState}
            onTimerStop={() => setTimerState(null)}
            timerState={timerState}
            onTimerUpdate={(mins, secs, mode, isRunning) => setTimerState({ minutes: mins, seconds: secs, mode, isRunning })}
          />
        )}

        {/* Tasks & Notes Panel */}
        {(activePanel === 'tasks' || activePanel === 'notes') && (
          <TasksNotesPanel 
            isOpen={true} 
            onClose={() => setActivePanel(null)}
            initialTab={activePanel === 'notes' ? 'notes' : 'tasks'}
          />
        )}

        {/* Background Panel */}
        {activePanel === 'background' && (
          <BackgroundPanel
            isOpen={true}
            onClose={() => setActivePanel(null)}
            currentBackgroundId={currentBackground}
            onBackgroundChange={setCurrentBackground}
          />
        )}

        {/* Settings Panel */}
        {activePanel === 'settings' && (
          <SettingsPanel
            isOpen={true}
            onClose={() => setActivePanel(null)}
          />
        )}
      </React.Suspense>
    </div>
  )
}
