import { memo } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { formatTimestamp } from '../utils/formatters.js'

function AlertRow({ alert, onResolve }) {
  const isActive = alert.status === 'Active'
  const isCritical = alert.alertType === 'Critical Leak Detected'

  return (
    <tr style={{ borderBottom: '1px solid var(--border)', opacity: isActive ? 1 : 0.6 }}>
      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
        {formatTimestamp(alert.timestamp)}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500 }}>{alert.nodeName}</td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
          background: isCritical ? 'rgba(255,59,92,0.12)' : 'rgba(255,140,0,0.12)',
          color: isCritical ? 'var(--accent-red)' : 'var(--accent-orange)',
        }}>
          {alert.alertType}
        </span>
      </td>
      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, textAlign: 'right', color: isCritical ? 'var(--accent-red)' : 'var(--accent-orange)' }}>
        {alert.flowRate.toFixed(1)} L/min
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
        <StatusBadge status={alert.status} />
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        {isActive ? (
          <button
            onClick={() => onResolve(alert.id, alert.nodeId)}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-primary)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-cyan)'; e.target.style.color = 'var(--accent-cyan)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-primary)' }}
          >
            Resolve
          </button>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Closed</span>
        )}
      </td>
    </tr>
  )
}

export default memo(AlertRow)
