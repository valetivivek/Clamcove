import React from 'react'
import { PlayerProvider } from './components/player/PlayerContext'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <PlayerProvider>
      <MainLayout />
    </PlayerProvider>
  )
}

export default App
