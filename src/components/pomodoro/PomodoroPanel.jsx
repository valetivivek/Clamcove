import React, { useState, useEffect, useRef } from 'react'
import DraggablePanel from '../ui/DraggablePanel'
import { IconClose, IconReset } from '../icons/Icons'

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

export default function PomodoroPanel({ isOpen, onClose }) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work') // work or break
  const [selectedPreset, setSelectedPreset] = useState(25)
  const intervalRef = useRef(null)
  const dragHandleRef = useRef(null)

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
    const defaultTime = newMode === 'work' ? 25 : 5
    setMinutes(defaultTime)
    setSelectedPreset(defaultTime)
    setSeconds(0)
  }

  const handlePresetSelect = (presetMinutes) => {
    if (!isRunning) {
      setSelectedPreset(presetMinutes)
      setMinutes(presetMinutes)
      setSeconds(0)
    }
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

      {/* Panel - centered and draggable */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 animate-scale-in">
        <DraggablePanel dragHandleRef={dragHandleRef}>
          <div className="glass-strong overflow-hidden">
            {/* Drag handle - header area */}
            <div 
              ref={dragHandleRef}
              className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-glass-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-coolBlue/60"></div>
                <h3 className="text-xl font-display font-semibold text-textPrimary tracking-tight">Pomodoro Timer</h3>
              </div>
              <button
                onClick={onClose}
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
                  className={`chip flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
                    mode === 'work' 
                      ? 'chip-active shadow-glow' 
                      : 'hover:bg-glass-medium'
                  }`}
                >
                  Work
                </button>
                <button
                  onClick={() => handleModeChange('break')}
                  className={`chip flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
                    mode === 'break' 
                      ? 'chip-active shadow-glow' 
                      : 'hover:bg-glass-medium'
                  }`}
                >
                  Break
                </button>
              </div>

              {/* Timer presets */}
              <div className="mb-6">
                <div className="text-xs font-medium text-textPrimary-muted mb-2 uppercase tracking-wider">
                  Quick Start
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TIMER_PRESETS[mode].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePresetSelect(preset.value)}
                      disabled={isRunning}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        selectedPreset === preset.value && !isRunning
                          ? 'bg-coolBlue/80 text-white'
                          : 'bg-glass-soft text-textPrimary-muted hover:bg-glass-medium hover:text-textPrimary'
                      } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer display - cool and prominent */}
              <div className="text-center mb-8">
                <div className="text-6xl font-light text-coolBlue tabular-nums mb-3 tracking-tight">
                  {formatTime(minutes, seconds)}
                </div>
                <div className="text-sm font-medium text-textPrimary-muted uppercase tracking-wider">
                  {mode === 'work' ? 'Focus time' : 'Take a break'}
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                {!isRunning ? (
                  <button 
                    onClick={handleStart} 
                    className="btn-primary flex-1 py-3 text-sm font-semibold rounded-xl shadow-medium hover:shadow-glow"
                  >
                    Start
                  </button>
                ) : (
                  <button 
                    onClick={handlePause} 
                    className="btn-secondary flex-1 py-3 text-sm font-semibold rounded-xl"
                  >
                    Pause
                  </button>
                )}
                <button 
                  onClick={handleReset} 
                  className="btn-icon w-12 h-12 rounded-xl"
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

