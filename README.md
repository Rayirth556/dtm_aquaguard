# AquaGuard — Build Complete ✅

Smart Water Leakage Detection Dashboard for Hostels — fully functional with live IoT simulation.

## Screenshots

````carousel
![Dashboard — Summary cards, real-time flow chart, recent events, and system status](C:/Users/rayir/.gemini/antigravity/brain/a073bed4-3693-4b19-9e29-48f7b623b9ee/aquaguard_dashboard_full_1777915806702.png)
<!-- slide -->
![Node Monitor — 3×2 grid with status badges, sparklines, and valve controls](C:/Users/rayir/.gemini/antigravity/brain/a073bed4-3693-4b19-9e29-48f7b623b9ee/node_monitor_page_1777915901739.png)
<!-- slide -->
![Alerts Log — Filterable table with resolve actions and search](C:/Users/rayir/.gemini/antigravity/brain/a073bed4-3693-4b19-9e29-48f7b623b9ee/alerts_log_page_1777915915924.png)
<!-- slide -->
![Analytics — Bar chart, donut pie chart, savings metrics](C:/Users/rayir/.gemini/antigravity/brain/a073bed4-3693-4b19-9e29-48f7b623b9ee/analytics_page_1_1777915944263.png)
<!-- slide -->
![Settings — Threshold slider, toggles, subscription plans, system info](C:/Users/rayir/.gemini/antigravity/brain/a073bed4-3693-4b19-9e29-48f7b623b9ee/settings_page_1777915960888.png)
````

## Live Demo Recording

![AquaGuard page navigation walkthrough](C:/Users/rayir/.gemini/antigravity/brain/a073bed4-3693-4b19-9e29-48f7b623b9ee/pages_verification_1777915864120.webp)

## Project Structure

```
aquaguard/
├── index.html                          # Inter font, SEO meta
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                        # Entry: BrowserRouter + GlobalProvider
    ├── App.jsx                         # Routes + Sidebar layout
    ├── index.css                       # CSS variables, dark theme, scrollbar
    ├── constants/nodes.js              # 6 frozen node definitions
    ├── simulation/simulationEngine.js  # Pure JS simulation (no React)
    ├── context/GlobalContext.jsx       # useReducer + startSimulation
    ├── hooks/useUptime.js              # HH:MM:SS uptime counter
    ├── utils/formatters.js             # formatLitres, formatCurrency, etc.
    ├── components/
    │   ├── Sidebar.jsx                 # NavLink routing, alert badge
    │   ├── SummaryCard.jsx             # Reusable metric card
    │   ├── StatusBadge.jsx             # NORMAL/LEAK/VALVE status
    │   ├── NodeCard.jsx                # React.memo, sparkline, valve button
    │   ├── SparkLine.jsx               # Pure SVG polyline
    │   ├── AlertRow.jsx                # React.memo table row
    │   └── LiveClock.jsx               # 24hr clock, 1s interval
    └── pages/
        ├── Dashboard.jsx               # Cards + recharts line + events
        ├── NodeMonitor.jsx             # 3×2 node grid
        ├── AlertsLog.jsx               # Filter tabs + search + table
        ├── Analytics.jsx               # Bar + donut + stats
        └── Settings.jsx                # Threshold, toggles, plans
```

## Key Features

| Feature | Implementation |
|---------|---------------|
| **Simulation** | Tick every 2s, leak every 15–20s (first at 12s), auto valve cutoff after 5s |
| **State Management** | `useReducer` with 8 action types, ref-based settings getter |
| **Sync** | `registerNodeUpdate()` keeps simulation & context in sync |
| **Performance** | `React.memo` on NodeCard & AlertRow, `useCallback` on dispatch wrappers |
| **Charts** | Recharts LineChart, BarChart, PieChart with dark theme styling |
| **Sparklines** | Pure SVG polyline with normalized data |

## Running

```bash
cd aquaguard
npm run dev
# → http://localhost:5173/
```
