import { NODE_DEFINITIONS } from '../constants/nodes.js'

let internalNodes = []
const listeners = new Map()

export function registerNodeUpdate(nodeId, patch) {
  const node = internalNodes.find(n => n.id === nodeId)
  if (node) Object.assign(node, patch)
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

function initNodes() {
  return NODE_DEFINITIONS.map(def => ({
    id: def.id,
    name: def.name,
    location: def.location,
    flowRate: randomBetween(0.8, 2.5),
    history: [],
    status: 'NORMAL',
    valveOpen: true,
    totalUsageToday: 0,
    lastUpdated: new Date(),
  }))
}

function tickNodes() {
  for (const node of internalNodes) {
    if (node.status === 'VALVE_CLOSED') {
      node.flowRate = 0
    } else if (node.status === 'LEAK_DETECTED') {
      node.flowRate = randomBetween(12, 18)
    } else {
      node.flowRate = clamp(node.flowRate + randomBetween(-0.2, 0.2), 0.5, 3.0)
    }
    node.history = [...node.history.slice(-19), node.flowRate]
    node.totalUsageToday += (node.flowRate / 60) * 2
    node.lastUpdated = new Date()
  }
}

function computeAvgFlow() {
  if (internalNodes.length === 0) return 0
  const sum = internalNodes.reduce((acc, n) => acc + n.flowRate, 0)
  return sum / internalNodes.length
}

function scheduleLeak(dispatch, getSettings, isFirst) {
  const delay = isFirst ? 12000 : randomBetween(15000, 20000)
  const timeoutId = setTimeout(() => {
    const available = internalNodes.filter(n => n.status === 'NORMAL')
    if (available.length === 0) {
      scheduleLeak(dispatch, getSettings, false)
      return
    }
    const node = available[Math.floor(Math.random() * available.length)]
    node.status = 'LEAK_DETECTED'
    node.flowRate = randomBetween(12, 18)

    dispatch({ type: 'TRIGGER_LEAK', payload: { nodeId: node.id, flowRate: node.flowRate } })

    const alertType = node.flowRate > 15 ? 'Critical Leak Detected' : 'Abnormal High Flow'
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date(),
        nodeId: node.id,
        nodeName: node.name,
        alertType,
        flowRate: node.flowRate,
        status: 'Active',
      },
    })

    const settings = getSettings()
    if (settings.autoValveCutoff) {
      const valveTimeout = setTimeout(() => {
        dispatch({ type: 'CLOSE_VALVE', payload: { nodeId: node.id } })
        registerNodeUpdate(node.id, { status: 'VALVE_CLOSED', valveOpen: false, flowRate: 0 })
      }, 5000)
      activeTimers.push(valveTimeout)
    }

    scheduleLeak(dispatch, getSettings, false)
  }, delay)
  activeTimers.push(timeoutId)
}

let activeTimers = []

export function startSimulation(dispatch, getSettings) {
  activeTimers = []
  internalNodes = initNodes()

  const snapshot = internalNodes.map(n => ({
    id: n.id, name: n.name, location: n.location,
    flowRate: n.flowRate, history: [...n.history],
    status: n.status, valveOpen: n.valveOpen,
    totalUsageToday: n.totalUsageToday, lastUpdated: n.lastUpdated,
  }))
  dispatch({ type: 'TICK', payload: { updatedNodes: snapshot, avgFlow: computeAvgFlow() } })

  const tickInterval = setInterval(() => {
    tickNodes()
    const snap = internalNodes.map(n => ({
      id: n.id, name: n.name, location: n.location,
      flowRate: n.flowRate, history: [...n.history],
      status: n.status, valveOpen: n.valveOpen,
      totalUsageToday: n.totalUsageToday, lastUpdated: n.lastUpdated,
    }))
    const avgFlow = computeAvgFlow()
    dispatch({ type: 'TICK', payload: { updatedNodes: snap, avgFlow } })
    dispatch({ type: 'UPDATE_DAILY', payload: { todayUsage: snap.reduce((a, n) => a + n.totalUsageToday, 0) } })
  }, 2000)

  scheduleLeak(dispatch, getSettings, true)

  return () => {
    clearInterval(tickInterval)
    activeTimers.forEach(id => clearTimeout(id))
    activeTimers = []
  }
}
