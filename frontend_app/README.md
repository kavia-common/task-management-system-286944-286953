# Ocean To‑Do (Playful)

A single‑page to‑do app with a playful Ocean Professional theme. Local Storage persistence by default, optional API mode via env flags.

## Features
- Create tasks with title (required), notes, and due date
- List with filters: All, Active, Completed
- Toggle completion
- Inline edit title/notes/due date
- Delete with confirmation
- Search filter
- Item counts and Clear Completed
- Accessible: labels, keyboard navigation, visible focus, aria‑live updates
- Persistence: localStorage by default; optional API if enabled

## Getting Started
- Install dependencies:
  npm install
- Run the app:
  npm start
- Run tests:
  npm test
- Build for production:
  npm run build

## Environment Variables
These can be set in .env:
- REACT_APP_API_BASE: Base URL for backend API (e.g., https://api.example.com)
- REACT_APP_BACKEND_URL: Alternative name for API base (fallback)
- REACT_APP_FEATURE_FLAGS: CSV or JSON array of feature flags. Include useApi to enable API mode.
- Optional:
  REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_EXPERIMENTS_ENABLED

### Enable API mode
- Set:
  REACT_APP_FEATURE_FLAGS=useApi
  REACT_APP_API_BASE=https://your-api.example.com
- If either the flag or API base is missing, the app uses Local Storage.

In development, the console shows a banner indicating the current mode.

## Notes
- Data shape:
  {
    id: string,
    title: string,
    notes?: string,
    dueDate?: string (YYYY-MM-DD),
    completed: boolean,
    createdAt: ISO string,
    updatedAt: ISO string
  }

- Storage key: todo.tasks.v1
