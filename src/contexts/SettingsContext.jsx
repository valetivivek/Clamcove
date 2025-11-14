import React, { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('calmcove-settings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return getDefaultSettings()
      }
    }
    return getDefaultSettings()
  })

  useEffect(() => {
    // Save to localStorage whenever settings change
    localStorage.setItem('calmcove-settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

function getDefaultSettings() {
  return {
    sidebarPosition: 50, // 0-100, percentage from top
    idleTimeout: 300000, // 5 minutes in milliseconds
    clock: {
      enabled: true,
      size: 'medium', // small, medium, large
      style: 'digital', // digital, minimal, analog
    }
  }
}

