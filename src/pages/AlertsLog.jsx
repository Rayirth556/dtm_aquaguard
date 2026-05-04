import { useState, useRef, useEffect } from 'react'
import { Download, CheckCircle } from 'lucide-react'
import { useGlobal } from '../context/GlobalContext.jsx'
import AlertRow from '../components/AlertRow.jsx'

export default function AlertsLog() {
  const { alerts, resolveAlert } = useGlobal()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const tableRef = useRef(null)

  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollTop = 0
  }, [alerts.length])

  const filtered = alerts
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a => a.nodeName.toLowerCase().includes(search.toLowerCase()))

  const tabs = ['All', 'Active', 'Resolved']

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Alerts Log</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Real-time system anomalies and threshold violation data
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
          borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)',
          color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600,
        }}>
          <Download size={14} /> Export
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 600,
              borderBottom: filter === tab ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: filter === tab ? 'var(--text-primary)' : 'var(--text-muted)',
              background: 'transparent', transition: 'all 0.15s',
            }}>
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by node name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 13,
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text-primary)', width: 240,
          }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div ref={tableRef} style={{ maxHeight: 480, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <CheckCircle size={40} color="var(--accent-green)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--accent-green)', fontSize: 14, fontWeight: 600 }}>
                No alerts — all systems normal
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  {['Timestamp', 'Node', 'Alert Type', 'Flow Rate', 'Status', 'Action'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: 'var(--text-muted)', textAlign: h === 'Flow Rate' || h === 'Action' ? 'right' : h === 'Status' ? 'center' : 'left',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(alert => (
                  <AlertRow key={alert.id} alert={alert} onResolve={resolveAlert} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
