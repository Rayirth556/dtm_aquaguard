import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import { NODE_DEFINITIONS } from '../constants/nodes.js'
import { startSimulation, registerNodeUpdate } from '../simulation/simulationEngine.js'

const GlobalContext = createContext(null)

function generateInitialHistory() {
  return Array.from({ length: 30 }, () => 1.5 + (Math.random() - 0.5) * 0.4)
}

const initialState = {
  nodes: [],
  alerts: [],
  globalFlowHistory: generateInitialHistory(),
  settings: {
    leakThreshold: 8,
    autoValveCutoff: true,
    alertMethods: { email: true, sms: false, push: true },
  },
  dailyUsage: [0, 42, 38, 55, 61, 47, 53],
  monthlyUsage: 1200,
}

function computeSystemStatus(nodes) {
  const leakCount = nodes.filter(n => n.status === 'LEAK_DETECTED').length
  if (leakCount >= 2) return 'CRITICAL'
  if (leakCount === 1) return 'WARNING'
  return 'NORMAL'
}

function reducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      const { updatedNodes, avgFlow } = action.payload
      const history = [...state.globalFlowHistory.slice(-59), avgFlow]
      return { ...state, nodes: updatedNodes, globalFlowHistory: history }
    }
    case 'TRIGGER_LEAK': {
      const { nodeId, flowRate } = action.payload
      const nodes = state.nodes.map(n =>
        n.id === nodeId ? { ...n, status: 'LEAK_DETECTED', flowRate } : n
      )
      return { ...state, nodes }
    }
    case 'CLOSE_VALVE': {
      const nodes = state.nodes.map(n =>
        n.id === action.payload.nodeId
          ? { ...n, status: 'VALVE_CLOSED', valveOpen: false, flowRate: 0 }
          : n
      )
      return { ...state, nodes }
    }
    case 'OPEN_VALVE': {
      const nodes = state.nodes.map(n =>
        n.id === action.payload.nodeId
          ? { ...n, status: 'NORMAL', valveOpen: true, flowRate: 1.5 }
          : n
      )
      return { ...state, nodes }
    }
    case 'RESOLVE_ALERT': {
      const { alertId, nodeId } = action.payload
      const alerts = state.alerts.map(a =>
        a.id === alertId ? { ...a, status: 'Resolved' } : a
      )
      const nodes = state.nodes.map(n =>
        n.id === nodeId ? { ...n, status: 'NORMAL', valveOpen: true } : n
      )
      return { ...state, nodes, alerts }
    }
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'UPDATE_DAILY': {
      const usage = [...state.dailyUsage]
      usage[0] = action.payload.todayUsage
      const monthly = state.monthlyUsage + 0.05
      return { ...state, dailyUsage: usage, monthlyUsage: monthly }
    }
    default:
      return state
  }
}

export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const settingsRef = useRef(state.settings)

  useEffect(() => {
    settingsRef.current = state.settings
  }, [state.settings])

  useEffect(() => {
    const cleanup = startSimulation(dispatch, () => settingsRef.current)
    return cleanup
  }, [])

  const closeValve = useCallback((nodeId) => {
    dispatch({ type: 'CLOSE_VALVE', payload: { nodeId } })
    registerNodeUpdate(nodeId, { status: 'VALVE_CLOSED', valveOpen: false, flowRate: 0 })
  }, [])

  const openValve = useCallback((nodeId) => {
    dispatch({ type: 'OPEN_VALVE', payload: { nodeId } })
    registerNodeUpdate(nodeId, { status: 'NORMAL', valveOpen: true, flowRate: 1.5 })
  }, [])

  const resolveAlert = useCallback((alertId, nodeId) => {
    dispatch({ type: 'RESOLVE_ALERT', payload: { alertId, nodeId } })
    registerNodeUpdate(nodeId, { status: 'NORMAL', valveOpen: true, flowRate: 1.5 })
  }, [])

  const updateSettings = useCallback((partial) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: partial })
  }, [])

  const systemStatus = computeSystemStatus(state.nodes)

  return (
    <GlobalContext.Provider value={{
      ...state, systemStatus, dispatch,
      closeValve, openValve, resolveAlert, updateSettings,
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  const ctx = useContext(GlobalContext)
  if (!ctx) throw new Error('useGlobal must be inside GlobalProvider')
  return ctx
}
