import React, { useState, useEffect, useRef } from 'react'

export default function TimerPanel({ isOpen, onClose }) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [initialMinutes, setInitialMinutes] = useState(25)
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
    // Show subtle notification
    if (Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: 'Your focus session is complete.',
        icon: '/favicon.ico',
        tag: 'timer',
      })
    }
  }

  const handleStart = () => {
    if (minutes === 0 && seconds === 0) {
      setMinutes(initialMinutes)
      setSeconds(0)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setMinutes(initialMinutes)
    setSeconds(0)
  }

  const handlePreset = (mins) => {
    setInitialMinutes(mins)
    setMinutes(mins)
    setSeconds(0)
    setIsRunning(false)
  }

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
      <div
        className="glass-strong w-full max-w-md p-6 pointer-events-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-textPrimary">Focus Timer</h2>
          <button
            onClick={onClose}
            className="btn-secondary w-8 h-8 rounded-lg text-lg leading-none"
            aria-label="Close timer"
          >
            ×
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-primaryAccent tabular-nums mb-4">
            {formatTime(minutes, seconds)}
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => handlePreset(25)}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
          >
            25m
          </button>
          <button
            onClick={() => handlePreset(15)}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
          >
            15m
          </button>
          <button
            onClick={() => handlePreset(45)}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
          >
            45m
          </button>
          <button
            onClick={() => handlePreset(90)}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
          >
            90m
          </button>
        </div>

        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button onClick={handleStart} className="btn-primary px-6 py-2 rounded-lg">
              Start
            </button>
          ) : (
            <button onClick={handlePause} className="btn-secondary px-6 py-2 rounded-lg">
              Pause
            </button>
          )}
          <button onClick={handleReset} className="btn-secondary px-6 py-2 rounded-lg">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

