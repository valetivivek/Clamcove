import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Load theme from localStorage or default to 'bedroom'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('calmcove-theme') || 'bedroom'
  })

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('calmcove-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'bedroom' ? 'cafe' : 'bedroom')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

