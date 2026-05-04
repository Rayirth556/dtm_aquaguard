import { Droplets, AlertTriangle, TrendingUp, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts'
import { useGlobal } from '../context/GlobalContext.jsx'
import { useUptime } from '../hooks/useUptime.js'
import SummaryCard from '../components/SummaryCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LiveClock from '../components/LiveClock.jsx'
import { formatAgo } from '../utils/formatters.js'

export default function Dashboard() {
  const { nodes, alerts, globalFlowHistory, settings, systemStatus } = useGlobal()
  const uptime = useUptime()

  const totalUsage = nodes.reduce((a, n) => a + n.totalUsageToday, 0)
  const leakCount = nodes.filter(n => n.status === 'LEAK_DETECTED').length
  const waterSaved = 2400 - 1200

  const leakColor = leakCount >= 2 ? 'var(--accent-red)' : leakCount === 1 ? 'var(--accent-orange)' : 'var(--accent-green)'

  const chartData = globalFlowHistory.map((val, i) => ({
    time: `-${(globalFlowHistory.length - 1 - i) * 2}s`,
    flow: parseFloat(val.toFixed(2)),
  }))

  const recentAlerts = alerts.slice(0, 5)

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">AquaGuard — Smart Water Monitor</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Real-time telemetry and flow analytics.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusBadge status={systemStatus} />
          <LiveClock />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <SummaryCard title="Total Water Used Today" value={`${totalUsage.toFixed(1)} L`} icon={Droplets} iconColor="var(--accent-cyan)" subtext="Across all 6 nodes" />
        <SummaryCard title="Active Leaks" value={leakCount} icon={AlertTriangle} iconColor={leakColor} valueColor={leakColor} subtext="Real-time detection" />
        <SummaryCard title="Water Saved This Month" value={`${waterSaved.toLocaleString()} L`} icon={TrendingUp} iconColor="var(--accent-green)" subtext="vs. unmonitored baseline" />
        <SummaryCard title="System Uptime" value={uptime} icon={Clock} iconColor="var(--accent-cyan)" subtext="Since last restart" />
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16 }}>
          Real-Time Average Flow Rate (L/min)
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={9} />
            <YAxis domain={[0, 20]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine y={settings.leakThreshold} stroke="var(--accent-red)" strokeDasharray="5 5" strokeWidth={1} />
            <Line type="monotone" dataKey="flow" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Recent Events
          </h2>
          {recentAlerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No events yet — monitoring active.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentAlerts.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border)',
                }}>
                  <AlertTriangle size={14} color={a.alertType.includes('Critical') ? 'var(--accent-red)' : 'var(--accent-orange)'} />
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>
                    {a.alertType} — {a.nodeName}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{formatAgo(a.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 12 }}>
            System Status
          </h2>
          <div style={{ marginBottom: 16 }}>
            <StatusBadge status={systemStatus} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {nodes.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: n.status === 'NORMAL' ? 'var(--accent-green)' : n.status === 'LEAK_DETECTED' ? 'var(--accent-red)' : 'var(--accent-orange)',
                }} />
                <span style={{ color: 'var(--text-secondary)' }}>{n.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
