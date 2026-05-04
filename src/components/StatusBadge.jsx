const statusMap = {
  NORMAL: { bg: 'rgba(0,255,136,0.12)', color: 'var(--accent-green)', text: 'NORMAL' },
  LEAK_DETECTED: { bg: 'rgba(255,59,92,0.15)', color: 'var(--accent-red)', text: 'LEAK DETECTED' },
  VALVE_CLOSED: { bg: 'rgba(255,140,0,0.12)', color: 'var(--accent-orange)', text: 'VALVE CLOSED' },
  Active: { bg: 'rgba(255,59,92,0.15)', color: 'var(--accent-red)', text: 'ACTIVE' },
  Resolved: { bg: 'rgba(0,255,136,0.12)', color: 'var(--accent-green)', text: 'RESOLVED' },
}

export default function StatusBadge({ status }) {
  const cfg = statusMap[status] || statusMap.NORMAL
  const isLeak = status === 'LEAK_DETECTED' || status === 'Active'

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 8,
      background: cfg.bg, color: cfg.color,
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      animation: isLeak ? 'pulse-red 800ms ease-in-out infinite' : 'none',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: cfg.color,
        animation: isLeak ? 'pulse-red 800ms ease-in-out infinite' : 'none',
      }} />
      {cfg.text}
    </span>
  )
}
