import React, { useState } from 'react'
import BackgroundLayer from './BackgroundLayer'
import OverlayLayer from './OverlayLayer'
import Sidebar from '../sidebar/Sidebar'
import PlayerBar from '../player/PlayerBar'
import MixerPanel from '../mixer/MixerPanel'
import PomodoroPanel from '../pomodoro/PomodoroPanel'
import TasksPanel from '../tasks/TasksPanel'
import SettingsPanel from '../settings/SettingsPanel'
import ClockWidget from '../clock/ClockWidget'
import { useIdle } from '../../hooks/useIdle'
import { IconUser } from '../icons/Icons'

export default function MainLayout() {
  const [activePanel, setActivePanel] = useState(null)
  const [currentBackground, setCurrentBackground] = useState('bedroom')
  const [isFocusMode, setIsFocusMode] = useState(false)
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

      {/* Top branding area - warm and inviting */}
      <div className={`absolute top-6 left-6 z-50 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-display font-light text-textPrimary tracking-wide">
          Calm<span className="text-coolBlue">Cove</span>
        </h1>
        <p className="text-xs text-textPrimary-dim mt-1">Your cozy corner for focus</p>
      </div>

      {/* Top right - Clock and Account */}
      <div className={`absolute top-6 right-6 z-50 flex items-center gap-4 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <ClockWidget />
        <button
          className="btn-icon"
          aria-label="Account"
          onClick={() => setActivePanel(activePanel === 'account' ? null : 'account')}
        >
          <IconUser />
        </button>
      </div>

      {/* Right Sidebar - LofiLab style */}
      <Sidebar activePanel={activePanel} onAction={handleSidebarAction} isFocusMode={isFocusMode} />

      {/* Bottom Player Bar and Mixer */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full max-w-4xl mx-auto px-4 pb-4 space-y-3 flex flex-col-reverse">
          {/* Player Bar - at the bottom */}
          <PlayerBar onToggleMixer={() => setActivePanel(activePanel === 'mixer' ? null : 'mixer')} />
          
          {/* Mixer Panel - below player, toggleable */}
          {activePanel === 'mixer' && <MixerPanel onClose={() => setActivePanel(null)} />}
        </div>
      </div>

      {/* Pomodoro Panel - slides in from right */}
      <PomodoroPanel isOpen={activePanel === 'pomodoro'} onClose={() => setActivePanel(null)} />

      {/* Tasks Panel */}
      <TasksPanel isOpen={activePanel === 'tasks'} onClose={() => setActivePanel(null)} />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={activePanel === 'settings'}
        onClose={() => setActivePanel(null)}
        currentBackgroundId={currentBackground}
        onBackgroundChange={setCurrentBackground}
      />
    </div>
  )
}
