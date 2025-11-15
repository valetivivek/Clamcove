import React, { useState, useEffect } from 'react'
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

  // Expose startFocusSession for SSG CTA
  useEffect(() => {
    window.startFocusSession = () => {
      setActivePanel('pomodoro')
    }
    return () => {
      delete window.startFocusSession
    }
  }, [])

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
        onStartFocus={() => setActivePanel('pomodoro')}
      />

      {/* Background Layer */}
      <BackgroundLayer backgroundId={currentBackground} />

      {/* Overlay for readability */}
      <OverlayLayer />

      {/* Center Clock Widget */}
      <CenterClock />

      {/* Top left - Branding */}
      <div className={`absolute top-6 left-6 z-50 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-sans font-light text-text-primary tracking-wide">
          Calm<span className="text-accent-primary">Cove</span>
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

      {/* Bottom Player Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full max-w-4xl mx-auto px-4 pb-4">
          <PlayerBar onToggleMixer={() => setActivePanel(activePanel === 'mixer' ? null : 'mixer')} />
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
