import { useState, useEffect } from 'react'
import { useGlobal } from '../context/GlobalContext.jsx'

function Toggle({ checked, onChange, label, subtext }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {subtext && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtext}</div>}
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  )
}

const plans = [
  { name: 'Basic', price: '₹999/mo', features: ['Up to 3 nodes', 'Email alerts only', '7-day history'], active: false, cta: 'Upgrade' },
  { name: 'Pro', price: '₹2,499/mo', features: ['Up to 10 nodes', 'All alert channels', '90-day history'], active: true, cta: 'Current Plan' },
  { name: 'Enterprise', price: '₹7,999/mo', features: ['Unlimited nodes', 'Priority support', '1-year history'], active: false, cta: 'Contact Sales' },
]

export default function Settings() {
  const { settings, updateSettings } = useGlobal()
  const [syncTime, setSyncTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setSyncTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const divider = { borderBottom: '1px solid var(--border)', marginBottom: 24, paddingBottom: 24 }

  return (
    <div className="page-container" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Configure detection thresholds and alert preferences.</p>

      <div style={divider}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
          Detection Settings
        </h3>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Leak Threshold</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-cyan)' }}>{settings.leakThreshold} L/min</span>
          </div>
          <input
            type="range" min="2" max="20" step="0.5"
            value={settings.leakThreshold}
            onChange={e => updateSettings({ leakThreshold: parseFloat(e.target.value) })}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Flows above this value trigger a leak alert</div>
        </div>
        <Toggle
          checked={settings.autoValveCutoff}
          onChange={v => updateSettings({ autoValveCutoff: v })}
          label="Automatic Valve Cutoff"
          subtext="Automatically close valve 5 seconds after leak detected"
        />
      </div>

      <div style={divider}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
          Alert Methods
        </h3>
        <Toggle
          checked={settings.alertMethods.email}
          onChange={v => updateSettings({ alertMethods: { ...settings.alertMethods, email: v } })}
          label="Email"
        />
        <Toggle
          checked={settings.alertMethods.sms}
          onChange={v => updateSettings({ alertMethods: { ...settings.alertMethods, sms: v } })}
          label="SMS"
        />
        <Toggle
          checked={settings.alertMethods.push}
          onChange={v => updateSettings({ alertMethods: { ...settings.alertMethods, push: v } })}
          label="Push Notification"
        />
      </div>

      <div style={divider}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
          Subscription Plan
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {plans.map(p => (
            <div key={p.name} className="card" style={{
              textAlign: 'center', padding: 20,
              border: p.active ? '1px solid var(--accent-cyan)' : '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 12 }}>{p.price}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {p.features.map(f => (
                  <span key={f} style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{f}</span>
                ))}
              </div>
              <button style={{
                width: '100%', padding: '8px 0', borderRadius: 8, fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                background: p.active ? 'rgba(0,212,255,0.1)' : 'transparent',
                border: `1px solid ${p.active ? 'var(--accent-cyan)' : 'var(--border)'}`,
                color: p.active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
          System Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['Firmware Version', 'v2.4.1'],
            ['Last Sync', syncTime.toLocaleTimeString()],
            ['Active Nodes', '6/6'],
            ['Cloud Region', 'ap-south-1 (Mumbai)'],
          ].map(([label, val]) => (
            <div key={label} style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
