import React, { useState } from 'react'
import BackgroundLayer from './BackgroundLayer'
import OverlayLayer from './OverlayLayer'
import Sidebar from '../sidebar/Sidebar'
import PlayerBar from '../player/PlayerBar'
import MixerPanel from '../mixer/MixerPanel'
import PomodoroPanel from '../pomodoro/PomodoroPanel'
import TimerWidget from '../pomodoro/TimerWidget'
import TasksNotesPanel from '../tasks/TasksNotesPanel'
import BackgroundPanel from '../background/BackgroundPanel'
import SettingsPanel from '../settings/SettingsPanel'
import ClockWidget from '../clock/ClockWidget'
import CenterClock from '../clock/CenterClock'
import { useIdle } from '../../hooks/useIdle'
import { IconUser } from '../icons/Icons'

export default function MainLayout() {
  const [activePanel, setActivePanel] = useState(null)
  const [currentBackground, setCurrentBackground] = useState('cybercity')
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [timerState, setTimerState] = useState(null) // { minutes, seconds, mode }
  const isIdle = useIdle(300000)

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
      {/* Background Layer */}
      <BackgroundLayer backgroundId={currentBackground} />

      {/* Overlay for readability */}
      <OverlayLayer />

      {/* Center Clock Widget */}
      <CenterClock />

      {/* Top left - Branding and Timer Widget */}
      <div className={`absolute top-6 left-6 z-50 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'} flex flex-col gap-3`}>
        {timerState && (
          <TimerWidget 
            minutes={timerState.minutes}
            seconds={timerState.seconds}
            mode={timerState.mode}
            isRunning={timerState.isRunning}
            onClick={() => setActivePanel('pomodoro')}
          />
        )}
        <div>
          <h1 className="text-2xl font-sans font-light text-text-primary tracking-wide">
            Calm<span className="text-accent-primary">Cove</span>
          </h1>
          <p className="text-xs text-text-tertiary mt-1">Your cozy corner for focus</p>
        </div>
      </div>

      {/* Top right - Clock and Account */}
      <div className={`absolute top-6 right-24 z-50 flex items-center gap-4 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <ClockWidget />
        <button
          className="btn-icon"
          aria-label="Account"
          onClick={() => setActivePanel(activePanel === 'account' ? null : 'account')}
        >
          <IconUser />
        </button>
      </div>

      {/* Right Sidebar - Zen style */}
      <Sidebar activePanel={activePanel} onAction={handleSidebarAction} isFocusMode={isFocusMode} />

      {/* Bottom Player Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full max-w-4xl mx-auto px-4 pb-4">
          <PlayerBar onToggleMixer={() => setActivePanel(activePanel === 'mixer' ? null : 'mixer')} />
        </div>
      </div>

      {/* Mixer Panel - centered, draggable, resizable */}
      <MixerPanel isOpen={activePanel === 'mixer'} onClose={() => setActivePanel(null)} />

      {/* Pomodoro Panel - slides in from right */}
      <PomodoroPanel 
        isOpen={activePanel === 'pomodoro'} 
        onClose={() => setActivePanel(null)}
        onTimerStart={setTimerState}
        onTimerStop={() => setTimerState(null)}
        timerState={timerState}
        onTimerUpdate={(mins, secs, mode, isRunning) => setTimerState({ minutes: mins, seconds: secs, mode, isRunning })}
      />

      {/* Tasks & Notes Panel */}
      <TasksNotesPanel isOpen={activePanel === 'tasks'} onClose={() => setActivePanel(null)} />

      {/* Background Panel */}
      <BackgroundPanel
        isOpen={activePanel === 'background'}
        onClose={() => setActivePanel(null)}
        currentBackgroundId={currentBackground}
        onBackgroundChange={setCurrentBackground}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={activePanel === 'settings'}
        onClose={() => setActivePanel(null)}
      />
    </div>
  )
}
