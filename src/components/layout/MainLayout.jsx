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
  const [currentBackground, setCurrentBackground] = useState('autumn-bedroom')
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [timerState, setTimerState] = useState(null) // { minutes, seconds, mode }
  const { settings } = useSettings()
  const isIdle = useIdle(settings.idleTimeout || 300000)
  const [isPlayerBarVisible, setIsPlayerBarVisible] = useState(true)
  const playerBarTimeoutRef = useRef(null)
  const playerBarAreaRef = useRef(null)

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
    if (action === 'focus') {
      setIsFocusMode(!isFocusMode)
      if (!isFocusMode) {
        document.documentElement.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      return
    }
    
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
          Calm<span className="text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-lg">Cove</span>
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
      <Sidebar activePanel={activePanel} onAction={handleSidebarAction} isFocusMode={isFocusMode} />

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
            onToggleNotes={() => setActivePanel(activePanel === 'tasks' ? null : 'tasks')}
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
        {activePanel === 'tasks' && (
          <TasksNotesPanel isOpen={true} onClose={() => setActivePanel(null)} />
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
