import { memo } from 'react'
import StatusBadge from './StatusBadge.jsx'
import SparkLine from './SparkLine.jsx'
import { useGlobal } from '../context/GlobalContext.jsx'
import { formatAgo } from '../utils/formatters.js'

function getFlowColor(flowRate, threshold) {
  if (flowRate >= threshold) return 'var(--accent-red)'
  if (flowRate >= threshold * 0.7) return 'var(--accent-yellow)'
  return 'var(--accent-green)'
}

function NodeCard({ node }) {
  const { settings, closeValve, openValve } = useGlobal()
  const color = getFlowColor(node.flowRate, settings.leakThreshold)
  const isLeak = node.status === 'LEAK_DETECTED'

  return (
    <div className="card" style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      border: isLeak ? '1px solid var(--accent-red)' : '1px solid var(--border)',
      position: 'relative', overflow: 'hidden',
    }}>
      {isLeak && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent-red)' }} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {node.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{node.location}</div>
        </div>
        <StatusBadge status={node.status} />
      </div>

      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <span style={{ fontSize: 36, fontWeight: 700, color, letterSpacing: '-0.02em' }}>
          {node.flowRate.toFixed(1)}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4 }}>L/min</span>
      </div>

      <SparkLine data={node.history} color={color} height={60} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
        <span>Usage today: {node.totalUsageToday.toFixed(1)} L</span>
        <span>Updated: {formatAgo(node.lastUpdated)}</span>
      </div>

      <button
        onClick={() => node.valveOpen ? closeValve(node.id) : openValve(node.id)}
        style={{
          width: '100%', padding: '10px 0', borderRadius: 8,
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
          background: node.valveOpen ? 'var(--accent-red)' : 'var(--accent-green)',
          color: '#fff', border: 'none', transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.target.style.opacity = '0.85'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        {node.valveOpen ? 'Close Valve' : 'Open Valve'}
      </button>

      <style>{`@keyframes pulse-red { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}

export default memo(NodeCard)
