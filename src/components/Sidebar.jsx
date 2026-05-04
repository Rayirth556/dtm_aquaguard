import { NavLink } from 'react-router-dom'
import { Droplets, LayoutDashboard, Activity, Bell, BarChart2, Settings } from 'lucide-react'
import { useGlobal } from '../context/GlobalContext.jsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/nodes', label: 'Node Monitor', icon: Activity },
  { to: '/alerts', label: 'Alerts Log', icon: Bell },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const sidebarStyle = {
  width: 220,
  minWidth: 220,
  height: '100vh',
  background: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 0',
  position: 'sticky',
  top: 0,
}

const logoStyle = {
  padding: '0 20px',
  marginBottom: 32,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

export default function Sidebar() {
  const { alerts } = useGlobal()
  const activeAlerts = alerts.filter(a => a.status === 'Active').length

  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>
        <Droplets size={24} color="var(--accent-cyan)" />
        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent-cyan)', letterSpacing: '-0.5px' }}>
          AquaGuard
        </span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px',
              fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
              background: isActive ? 'rgba(0,212,255,0.06)' : 'transparent',
              transition: 'all 0.15s',
              position: 'relative',
            })}
          >
            <Icon size={18} />
            {label}
            {label === 'Alerts Log' && activeAlerts > 0 && (
              <span style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'var(--accent-red)', color: '#fff', fontSize: 10, fontWeight: 700,
                borderRadius: 8, padding: '2px 7px', minWidth: 20, textAlign: 'center',
              }}>
                {activeAlerts}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{
        padding: '16px 20px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span className="pulse-green" style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--accent-green)', display: 'inline-block',
        }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          System Active
        </span>
      </div>
    </aside>
  )
}
