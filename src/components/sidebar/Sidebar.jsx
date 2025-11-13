import React, { useState } from 'react'
import Tooltip from '../ui/Tooltip'
import { useIdle } from '../../hooks/useIdle'
import {
  IconImage,
  IconFocus,
  IconTimer,
  IconAlarm,
  IconChecklist,
  IconSettings,
  IconMenu,
} from '../icons/Icons'

const sidebarActions = [
  { id: 'background', icon: 'image', label: 'Background' },
  { id: 'focus', icon: 'focus', label: 'Focus Mode' },
  { id: 'pomodoro', icon: 'timer', label: 'Pomodoro' },
  { id: 'alarm', icon: 'alarm', label: 'Alarm' },
  { id: 'tasks', icon: 'checklist', label: 'Tasks' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]

const iconMap = {
  image: IconImage,
  settings: IconSettings,
  timer: IconTimer,
  alarm: IconAlarm,
  checklist: IconChecklist,
  focus: IconFocus,
}

export default function Sidebar({ activePanel, onAction, isFocusMode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const isIdle = useIdle(300000)

  return (
    <>
      {/* Desktop Sidebar - icons only, no container */}
      <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:block transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col gap-3">
            {sidebarActions.map((action) => {
              const Icon = iconMap[action.icon]
              const isActive = activePanel === action.id || (action.id === 'focus' && isFocusMode)

              return (
                <Tooltip key={action.id} label={action.label}>
                  <button
                    onClick={() => onAction(action.id)}
                    className={`btn-icon ${isActive ? 'btn-icon-active' : ''}`}
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
          className="btn-icon bg-primaryAccent text-white hover:bg-primaryAccent-light"
          aria-label="Menu"
        >
          <IconMenu />
        </button>

        {/* Mobile menu - expands upward */}
        {isMobileOpen && (
          <div className="absolute bottom-14 right-0 glass flex flex-col gap-2 p-2 animate-slide-up">
            {sidebarActions.map((action) => {
              const Icon = iconMap[action.icon]
              const isActive = activePanel === action.id || (action.id === 'focus' && isFocusMode)

              return (
                <button
                  key={action.id}
                  onClick={() => {
                    onAction(action.id)
                    setIsMobileOpen(false)
                  }}
                  className={`btn-icon ${isActive ? 'btn-icon-active' : ''}`}
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

