import React, { useState, useEffect, useRef } from 'react'

export default function PomodoroPanel({ isOpen, onClose }) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work') // work or break
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes === 0) {
              handleComplete()
              return 0
            }
            setMinutes((prevMins) => prevMins - 1)
            return 59
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, minutes])

  const handleComplete = () => {
    setIsRunning(false)
    // Subtle notification - could show in mixer panel
    console.log('Timer complete!')
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setMinutes(mode === 'work' ? 25 : 5)
    setSeconds(0)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setIsRunning(false)
    setMinutes(newMode === 'work' ? 25 : 5)
    setSeconds(0)
  }

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <>
      {/* Dim overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel - slides in from right */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-80 animate-slide-in-right">
        <div className="glass-strong p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-textPrimary">Pomodoro</h3>
            <button
              onClick={onClose}
              className="btn-icon w-8 h-8"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mode switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleModeChange('work')}
              className={`chip flex-1 ${mode === 'work' ? 'chip-active' : ''}`}
            >
              Work
            </button>
            <button
              onClick={() => handleModeChange('break')}
              className={`chip flex-1 ${mode === 'break' ? 'chip-active' : ''}`}
            >
              Break
            </button>
          </div>

          {/* Timer display */}
          <div className="text-center mb-6">
            <div className="text-5xl font-light text-primaryAccent tabular-nums mb-2">
              {formatTime(minutes, seconds)}
            </div>
            <div className="text-sm text-textPrimary-muted">
              {mode === 'work' ? 'Focus time' : 'Take a break'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isRunning ? (
              <button onClick={handleStart} className="btn-icon flex-1 bg-primaryAccent text-white hover:bg-primaryAccent-light">
                Start
              </button>
            ) : (
              <button onClick={handlePause} className="btn-icon flex-1">
                Pause
              </button>
            )}
            <button onClick={handleReset} className="btn-icon">
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

