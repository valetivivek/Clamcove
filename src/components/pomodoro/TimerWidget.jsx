import React, { useState, useEffect } from 'react'
import { IconTimer } from '../icons/Icons'

export default function TimerWidget({ minutes, seconds, mode, isRunning, onClick }) {
  const [displayMinutes, setDisplayMinutes] = useState(minutes)
  const [displaySeconds, setDisplaySeconds] = useState(seconds)
  const intervalRef = React.useRef(null)

  // Update display when props change
  useEffect(() => {
    setDisplayMinutes(minutes)
    setDisplaySeconds(seconds)
  }, [minutes, seconds])

  // Update timer display when running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setDisplaySeconds((prev) => {
          if (prev === 0) {
            if (displayMinutes === 0) {
              return 0
            }
            setDisplayMinutes((prevMins) => prevMins - 1)
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
  }, [isRunning, displayMinutes])

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <button
      onClick={onClick}
      className="panel flex items-center gap-3 px-4 py-2.5 hover:bg-surface-tertiary transition-all duration-200 group cursor-pointer"
      aria-label="Open timer"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isRunning ? 'bg-accent-primary/20' : 'bg-surface-secondary'
      }`}>
        <IconTimer className={`w-4 h-4 ${isRunning ? 'text-accent-primary' : 'text-text-secondary'}`} />
      </div>
      <div className="flex flex-col items-start min-w-0">
        <div className={`text-lg font-sans font-light tabular-nums leading-none ${
          isRunning ? 'text-accent-primary' : 'text-text-secondary'
        }`}>
          {formatTime(displayMinutes, displaySeconds)}
        </div>
        <div className="text-xs text-text-tertiary uppercase tracking-wider">
          {mode === 'work' ? 'Focus' : 'Break'} {isRunning ? '• Running' : '• Paused'}
        </div>
      </div>
    </button>
  )
}

