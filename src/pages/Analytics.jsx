import { useState, useRef, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import { useGlobal } from '../context/GlobalContext.jsx'
import { formatCurrency } from '../utils/formatters.js'

const PIE_COLORS = ['#00d4ff', '#00ff88', '#ff8c00', '#ff3b5c', '#ffd700', '#a855f7']

function getDayLabels(count) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()
  const labels = ['Today']
  for (let i = 1; i < count; i++) {
    if (i === 1) { labels.push('Yesterday'); continue }
    labels.push(days[(today - i + 7) % 7])
  }
  return labels
}

function generateExtendedData(base, count) {
  const result = [...base]
  for (let i = base.length; i < count; i++) {
    result.push(30 + ((i * 17 + 7) % 40))
  }
  return result
}

export default function Analytics() {
  const { nodes, dailyUsage, monthlyUsage, alerts } = useGlobal()
  const [range, setRange] = useState('7D')
  const tickRef = useRef(0)

  tickRef.current += 1
  const shouldUpdate = tickRef.current % 10 === 0 || tickRef.current <= 1

  const rangeCount = range === '7D' ? 7 : range === '30D' ? 30 : 90
  const extendedData = useMemo(() => generateExtendedData(dailyUsage, rangeCount), [dailyUsage, rangeCount])
  const labels = getDayLabels(rangeCount)

  const barData = extendedData.map((val, i) => ({
    day: labels[i] || `D-${i}`,
    usage: parseFloat(val.toFixed(1)),
  }))

  const totalUsage = nodes.reduce((a, n) => a + n.totalUsageToday, 0) || 1
  const pieData = nodes.map(n => ({
    name: n.name,
    value: parseFloat(((n.totalUsageToday / totalUsage) * 100).toFixed(1)),
  }))

  const savings = (2400 - monthlyUsage) * 0.05
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length
  const avgDaily = dailyUsage.length > 1
    ? (dailyUsage.slice(1).reduce((a, v) => a + v, 0) / (dailyUsage.length - 1)).toFixed(1)
    : '0.0'

  return (
    <div className="page-container">
      <h1 className="page-title">Usage Analytics</h1>
      <p className="page-subtitle">System-wide consumption and efficiency metrics.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Daily Water Usage (Last {rangeCount} Days)
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="usage" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {['7D', '30D', '90D'].map(r => (
                <button key={r} onClick={() => setRange(r)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  border: range === r ? '1px solid var(--accent-cyan)' : '1px solid var(--border)',
                  color: range === r ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  background: range === r ? 'rgba(0,212,255,0.08)' : 'transparent',
                }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Usage by Location
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Monthly Savings</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>{formatCurrency(savings)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Based on ₹0.05/litre rate</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Leaks Prevented</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{resolvedCount}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Avg Daily</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{avgDaily} L</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
