import { useState, useEffect } from 'react'

export default function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const h = String(time.getHours()).padStart(2, '0')
  const m = String(time.getMinutes()).padStart(2, '0')
  const s = String(time.getSeconds()).padStart(2, '0')

  return (
    <span style={{
      fontFamily: 'monospace', fontSize: 13, fontWeight: 500,
      color: 'var(--accent-cyan)', letterSpacing: '-0.01em',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      padding: '6px 12px', borderRadius: 8,
    }}>
      {h}:{m}:{s}
    </span>
  )
}
