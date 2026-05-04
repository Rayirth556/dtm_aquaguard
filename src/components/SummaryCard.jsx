export default function SummaryCard({ title, value, icon: Icon, iconColor, subtext, valueColor }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 130 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: 'var(--text-secondary)',
        }}>
          {title}
        </span>
        {Icon && <Icon size={20} color={iconColor || 'var(--accent-cyan)'} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 36, fontWeight: 700, lineHeight: 1.1,
          color: valueColor || 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>
          {value}
        </span>
      </div>
      {subtext && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtext}</span>
      )}
    </div>
  )
}
