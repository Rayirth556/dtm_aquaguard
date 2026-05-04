import { useGlobal } from '../context/GlobalContext.jsx'
import NodeCard from '../components/NodeCard.jsx'

export default function NodeMonitor() {
  const { nodes } = useGlobal()

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Node Monitor</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Live telemetry across all sensor channels
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {nodes.map(node => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  )
}
