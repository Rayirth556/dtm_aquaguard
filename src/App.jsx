import { Routes, Route, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NodeMonitor from './pages/NodeMonitor.jsx'
import AlertsLog from './pages/AlertsLog.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'

function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg-primary)' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nodes" element={<NodeMonitor />} />
        <Route path="/alerts" element={<AlertsLog />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
