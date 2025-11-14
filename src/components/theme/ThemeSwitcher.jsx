import React from 'react'
import { useTheme } from './ThemeProvider'
import { IconTheme } from '../icons/Icons'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary w-9 h-9 rounded-lg flex items-center justify-center"
      aria-label={`Switch to ${theme === 'bedroom' ? 'cafe' : 'bedroom'} theme`}
      title={`Current: ${theme} - Click to switch`}
    >
      <IconTheme className="w-4 h-4" />
    </button>
  )
}

