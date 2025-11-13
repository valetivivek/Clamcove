import { useState, useEffect, useRef } from 'react'

export function useIdle(timeout = 300000) {
  const [isIdle, setIsIdle] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const resetTimer = () => {
      setIsIdle(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true)
      }, timeout)
    }

    resetTimer()

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [timeout])

  return isIdle
}

