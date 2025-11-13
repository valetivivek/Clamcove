import React, { useState } from 'react'
import BackgroundLayer from './BackgroundLayer'
import OverlayLayer from './OverlayLayer'
import Sidebar from '../sidebar/Sidebar'
import PlayerBar from '../player/PlayerBar'
import MixerPanel from '../mixer/MixerPanel'
import PomodoroPanel from '../pomodoro/PomodoroPanel'
import TasksPanel from '../tasks/TasksPanel'
import SettingsPanel from '../settings/SettingsPanel'

export default function MainLayout() {
  const [activePanel, setActivePanel] = useState(null)
  const [currentBackground, setCurrentBackground] = useState('bedroom')
  const [isFocusMode, setIsFocusMode] = useState(false)

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

      {/* Top branding area - minimal */}
      <div className="absolute top-6 left-6 z-20">
        <h1 className="text-2xl font-light text-textPrimary tracking-wide">
          CalmCove
        </h1>
      </div>

      {/* Central Mixer Panel - Lofizen inspired */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-4xl px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <MixerPanel />
        </div>
      </div>

      {/* Right Sidebar - LofiLab style */}
      <Sidebar activePanel={activePanel} onAction={handleSidebarAction} isFocusMode={isFocusMode} />

      {/* Bottom Player Bar - LofiLab style */}
      <PlayerBar />

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
