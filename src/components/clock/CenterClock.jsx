import React, { useState, useEffect } from 'react'
import { useSettings } from '../../contexts/SettingsContext'

export default function CenterClock() {
  const { settings } = useSettings()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Debug: Check if settings are loaded
  if (!settings || !settings.clock) {
    // If settings not loaded yet, show default clock
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center gap-2 pointer-events-none">
        <div 
          className="text-6xl font-sans font-light tabular-nums tracking-tight drop-shadow-lg"
          style={{ 
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          {time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // 12-hour format with AM/PM
          })}
        </div>
      </div>
    )
  }

  if (!settings.clock.enabled) return null

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // 12-hour format with AM/PM
    })
  }

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Clock is always white for clean, readable display
  const clockColor = '#ffffff'
  const sizeClass = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl',
  }[settings.clock.size] || 'text-6xl'
  const clockSize = {
    small: 120,
    medium: 180,
    large: 240,
  }[settings.clock.size] || 180
  const style = settings.clock.style || 'digital'

  // Calculate analog clock hand angles
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const hourAngle = (hours * 30) + (minutes * 0.5) // 30 degrees per hour, 0.5 per minute
  const minuteAngle = minutes * 6 // 6 degrees per minute

  const renderClock = () => {
    switch (style) {
      case 'minimal':
        return (
          <div className="flex flex-col items-center gap-1">
            <div 
              className={`${sizeClass} font-sans font-light tabular-nums tracking-tight`}
              style={{ 
                color: clockColor,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}
            >
              {formatTime(time)}
            </div>
            <div className="text-sm font-sans font-light text-white/90">
              {formatDay(time)} • {formatDate(time)}
            </div>
          </div>
        )
      case 'analog':
        return (
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative rounded-full border-2 flex items-center justify-center"
              style={{ 
                width: `${clockSize}px`,
                height: `${clockSize}px`,
                borderColor: clockColor,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Clock face */}
              <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
              
              {/* Hour markers */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour, index) => {
                const angle = (index * 30) - 90 // Start at top (12 o'clock)
                const radius = clockSize / 2 - 20
                const x = Math.cos(angle * Math.PI / 180) * radius
                const y = Math.sin(angle * Math.PI / 180) * radius
                return (
                  <div
                    key={hour}
                    className="absolute text-xs font-medium"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      color: clockColor,
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {hour}
                  </div>
                )
              })}
              
              {/* Hour hand */}
              <div
                className="absolute origin-bottom"
                style={{
                  width: '4px',
                  height: `${clockSize * 0.25}px`,
                  backgroundColor: clockColor,
                  borderRadius: '2px 2px 0 0',
                  transform: `rotate(${hourAngle}deg)`,
                  transformOrigin: 'bottom center',
                  left: '50%',
                  bottom: '50%',
                  marginLeft: '-2px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  zIndex: 2
                }}
              />
              
              {/* Minute hand */}
              <div
                className="absolute origin-bottom"
                style={{
                  width: '3px',
                  height: `${clockSize * 0.35}px`,
                  backgroundColor: clockColor,
                  borderRadius: '1.5px 1.5px 0 0',
                  transform: `rotate(${minuteAngle}deg)`,
                  transformOrigin: 'bottom center',
                  left: '50%',
                  bottom: '50%',
                  marginLeft: '-1.5px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  zIndex: 3
                }}
              />
              
              {/* Center dot */}
              <div
                className="absolute rounded-full"
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: clockColor,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  zIndex: 4
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-base font-sans font-medium text-white uppercase tracking-wider drop-shadow-md">
                {formatDay(time)}
              </div>
              <div className="text-sm font-sans font-light text-white/90 drop-shadow-md">
                {formatDate(time)}
              </div>
            </div>
          </div>
        )
      default: // digital
        return (
          <>
            <div 
              className={`${sizeClass} font-sans font-light tabular-nums tracking-tight drop-shadow-lg`}
              style={{ 
                color: clockColor,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              {formatTime(time)}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg font-sans font-medium text-white uppercase tracking-wider drop-shadow-md">
                {formatDay(time)}
              </div>
              <div className="text-sm font-sans font-light text-white/90 drop-shadow-md">
                {formatDate(time)}
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center gap-2 pointer-events-none">
      {renderClock()}
    </div>
  )
}

