import React from 'react'
import { PlayerProvider } from './components/player/PlayerContext'
import { ThemeProvider } from './components/theme/ThemeProvider'
import { SettingsProvider } from './contexts/SettingsContext'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <PlayerProvider>
          <MainLayout />
        </PlayerProvider>
      </ThemeProvider>
    </SettingsProvider>
  )
}

export default App
