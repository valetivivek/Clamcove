import React, { useState } from 'react'
import Tooltip from '../ui/Tooltip'
import { useIdle } from '../../hooks/useIdle'
import { useSettings } from '../../contexts/SettingsContext'
import {
  IconImage,
  IconTimer,
  IconAlarm,
  IconChecklist,
  IconSettings,
  IconMenu,
} from '../icons/Icons'

const sidebarActions = [
  { id: 'background', icon: 'image', label: 'Background' },
  { id: 'pomodoro', icon: 'timer', label: 'Pomodoro' },
  { id: 'tasks', icon: 'checklist', label: 'Tasks & Notes' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]

const iconMap = {
  image: IconImage,
  settings: IconSettings,
  timer: IconTimer,
  alarm: IconAlarm,
  checklist: IconChecklist,
}

export default function Sidebar({ activePanel, onAction }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const isIdle = useIdle(300000)
  const { settings } = useSettings()
  
  // Calculate top position based on settings (0-100% from top)
  const topPosition = `${settings.sidebarPosition}%`

  return (
    <>
      {/* Desktop Sidebar - right side, icons only, no container */}
      <div 
        className={`fixed right-6 z-40 hidden md:block transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}
        style={{ top: topPosition, transform: 'translateY(-50%)' }}
      >
        <div className="flex flex-col gap-2.5">
            {sidebarActions.map((action) => {
              const Icon = iconMap[action.icon]

              return (
                <Tooltip key={action.id} label={action.label} position="left">
                  <button
                    onClick={() => onAction(action.id)}
                    className="btn-icon"
                    aria-label={action.label}
                  >
                    {Icon && <Icon />}
                  </button>
                </Tooltip>
              )
            })}
        </div>
      </div>

      {/* Mobile Sidebar - Collapsed button */}
      <div className="fixed right-4 bottom-20 z-40 md:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="btn-icon text-white hover:opacity-90 transition-all duration-200"
          style={{
            backgroundColor: 'var(--theme-color)',
          }}
          aria-label="Menu"
        >
          <IconMenu />
        </button>

        {/* Mobile menu - expands upward */}
        {isMobileOpen && (
          <div className="absolute bottom-14 right-0 panel flex flex-col gap-2 p-2 animate-slide-up">
            {sidebarActions.map((action) => {
              const Icon = iconMap[action.icon]

              return (
                <button
                  key={action.id}
                  onClick={() => {
                    onAction(action.id)
                    setIsMobileOpen(false)
                  }}
                  className="btn-icon"
                  aria-label={action.label}
                >
                  {Icon && <Icon />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

