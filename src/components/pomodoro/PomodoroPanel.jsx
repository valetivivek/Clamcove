import React, { useState, useEffect, useRef } from 'react'
import DraggablePanel from '../ui/DraggablePanel'
import { IconClose, IconReset } from '../icons/Icons'
import TimerWidget from './TimerWidget'

const TIMER_PRESETS = {
  work: [
    { label: '15 min', value: 15 },
    { label: '25 min', value: 25 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
  ],
  break: [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '20 min', value: 20 },
  ],
}

export default function PomodoroPanel({ isOpen, onClose, onTimerStart, onTimerStop, timerState, onTimerUpdate }) {
  const [minutes, setMinutes] = useState(timerState?.minutes || 25)
  const [seconds, setSeconds] = useState(timerState?.seconds || 0)
  const [isRunning, setIsRunning] = useState(timerState?.isRunning || false)
  const [mode, setMode] = useState(timerState?.mode || 'work') // work or break
  const [selectedPreset, setSelectedPreset] = useState(25)
  const dragHandleRef = useRef(null)
  const intervalRef = useRef(null)

  // Sync with external timer state
  useEffect(() => {
    if (timerState) {
      setMinutes(timerState.minutes)
      setSeconds(timerState.seconds)
      setIsRunning(timerState.isRunning)
      setMode(timerState.mode)
    } else {
      // Initialize timer state when panel opens if no state exists
      if (isOpen && !timerState) {
        const defaultMins = mode === 'work' ? 25 : 5
        if (onTimerUpdate) onTimerUpdate(defaultMins, 0, mode, false)
      }
    }
  }, [timerState, isOpen, mode, onTimerUpdate])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes === 0) {
              handleComplete()
              return 0
            }
            const newMins = minutes - 1
            setMinutes(newMins)
            if (onTimerUpdate) onTimerUpdate(newMins, 59, mode, true)
            return 59
          }
          const newSecs = prev - 1
          if (onTimerUpdate) onTimerUpdate(minutes, newSecs, mode, true)
          return newSecs
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
  }, [isRunning, minutes, seconds, mode, onTimerUpdate])

  const handleComplete = () => {
    setIsRunning(false)
    if (onTimerUpdate) onTimerUpdate(0, 0, mode, false)
    if (onTimerStop) onTimerStop()
  }

  const handleStart = () => {
    setIsRunning(true)
    if (onTimerStart) onTimerStart({ minutes, seconds, mode, isRunning: true })
  }

  const handlePause = () => {
    setIsRunning(false)
    if (onTimerUpdate) onTimerUpdate(minutes, seconds, mode, false)
    // Don't call onTimerStop here - keep the timer state so widget can still show
  }

  const handleReset = () => {
    setIsRunning(false)
    const defaultMins = mode === 'work' ? 25 : 5
    setMinutes(defaultMins)
    setSeconds(0)
    if (onTimerUpdate) onTimerUpdate(defaultMins, 0, mode, false)
    // Optionally clear timer state on reset - user can decide
    // if (onTimerStop) onTimerStop()
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setIsRunning(false)
    const defaultTime = newMode === 'work' ? 25 : 5
    setMinutes(defaultTime)
    setSelectedPreset(defaultTime)
    setSeconds(0)
    if (onTimerUpdate) onTimerUpdate(defaultTime, 0, newMode, false)
  }

  const handlePresetSelect = (presetMinutes) => {
    if (!isRunning) {
      setSelectedPreset(presetMinutes)
      setMinutes(presetMinutes)
      setSeconds(0)
      // Update timer state so widget shows even when panel is closed
      if (onTimerUpdate) onTimerUpdate(presetMinutes, 0, mode, false)
    }
  }

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Only render panel if it's open
  if (!isOpen) return null

  return (
    <>
      {/* Panel - centered and draggable, no overlay */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 animate-scale-in" style={{ pointerEvents: 'none' }}>
        <DraggablePanel dragHandleRef={dragHandleRef}>
          <div className="panel-strong overflow-hidden" style={{ pointerEvents: 'auto' }}>
            {/* Drag handle - header area */}
            <div 
              ref={dragHandleRef}
              className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60"></div>
                <h3 className="text-xl font-sans font-semibold text-text-primary tracking-tight">Pomodoro Timer</h3>
              </div>
              <button
                onClick={() => {
                  // Don't clear timer state when closing, just close the panel
                  onClose()
                }}
                className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100"
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>

            <div className="p-6">

              {/* Mode switcher */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleModeChange('work')}
                  className={`chip flex-1 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    mode === 'work' ? 'chip-active' : ''
                  }`}
                >
                  Work
                </button>
                <button
                  onClick={() => handleModeChange('break')}
                  className={`chip flex-1 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    mode === 'break' ? 'chip-active' : ''
                  }`}
                >
                  Break
                </button>
              </div>

              {/* Timer presets */}
              <div className="mb-6">
                <div className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Quick Start
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TIMER_PRESETS[mode].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePresetSelect(preset.value)}
                      disabled={isRunning}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center ${
                        selectedPreset === preset.value && !isRunning
                          ? 'bg-accent-primary text-white'
                          : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                      } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer display - zen aesthetic, prominent */}
              <div className="text-center mb-8">
                <div className="text-6xl font-sans font-light text-accent-primary tabular-nums mb-3 tracking-tight">
                  {formatTime(minutes, seconds)}
                </div>
                <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                  {mode === 'work' ? 'Focus time' : 'Take a break'}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {!isRunning ? (
                  <button 
                    onClick={handleStart} 
                    className="btn-primary flex-1 py-3 text-sm font-semibold rounded-xl flex items-center justify-center"
                  >
                    Start
                  </button>
                ) : (
                  <button 
                    onClick={handlePause} 
                    className="btn-secondary flex-1 py-3 text-sm font-semibold rounded-xl flex items-center justify-center"
                  >
                    Pause
                  </button>
                )}
                <button 
                  onClick={handleReset} 
                  className="btn-icon w-12 h-12 rounded-xl flex items-center justify-center"
                  aria-label="Reset"
                >
                  <IconReset />
                </button>
              </div>
            </div>
          </div>
        </DraggablePanel>
      </div>
    </>
  )
}

