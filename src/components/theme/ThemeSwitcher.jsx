import React from 'react'
import { useTheme } from './ThemeProvider'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary w-11 h-11 rounded-xl flex items-center justify-center"
      aria-label={`Switch to ${theme === 'bedroom' ? 'cafe' : 'bedroom'} theme`}
      title={`Current: ${theme}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {theme === 'bedroom' ? (
          // Sun icon for bedroom theme
          <>
            <circle cx="12" cy="12" r="5" strokeWidth="2" />
            <path d="M12 1v4M12 19v4M23 12h-4M5 12H1M20.66 3.34l-2.83 2.83M6.17 17.83l-2.83 2.83M20.66 20.66l-2.83-2.83M6.17 6.17L3.34 3.34" strokeWidth="2" />
          </>
        ) : (
          // Leaf icon for cafe theme
          <>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" strokeWidth="2" />
          </>
        )}
      </svg>
    </button>
  )
}

