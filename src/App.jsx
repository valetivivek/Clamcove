import React from 'react'
import { PlayerProvider } from './components/player/PlayerContext'
import { ThemeProvider } from './components/theme/ThemeProvider'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <MainLayout />
      </PlayerProvider>
    </ThemeProvider>
  )
}

export default App
