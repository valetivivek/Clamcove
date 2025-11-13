import React, { useState, useEffect } from 'react'

export default function ClockDisplay() {
  const [time, setTime] = useState(new Date())
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(now)
      setDate(now)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="glass px-4 py-2 rounded-xl">
      <div className="text-2xl font-semibold text-textPrimary tabular-nums">
        {formatTime(time)}
      </div>
      <div className="text-xs text-textPrimary-muted uppercase tracking-wider mt-0.5">
        {formatDate(date)}
      </div>
    </div>
  )
}

