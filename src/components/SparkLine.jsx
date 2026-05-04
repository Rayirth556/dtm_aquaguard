export default function SparkLine({ data = [], color = 'var(--accent-cyan)', height = 60 }) {
  if (data.length === 0) {
    return <svg width="100%" height={height} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 2
  const usableHeight = height - padding * 2

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1 || 1)) * 100
    const y = padding + usableHeight - ((val - min) / range) * usableHeight
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
