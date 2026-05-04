import { useState, useEffect } from 'react'
import { formatUptime } from '../utils/formatters.js'

export function useUptime() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return formatUptime(seconds)
}
