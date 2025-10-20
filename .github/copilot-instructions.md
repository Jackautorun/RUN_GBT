# AI Coding Agent Instructions

## Project Architecture

This is a **polyglot automation suite** with three main components:

1. **`polyglot-autobot-dashboard-v3/`** - React dashboard with Express API backend (Node.js + Vite)
2. **`fib_api.rb/`** - Ruby Sinatra microservice for Fibonacci calculations
3. **`Auto_Bot/`** - LLM evaluation framework using promptfoo

### Key Entry Points
- **Development**: `start-all.bat` (launches API on :9900 + UI on :5173)
- **Production**: Electron app via `npm run dist` → generates Windows .exe installer
- **API Testing**: Ruby service runs on :4567 (configurable via PORT env)

## Development Workflow

### Starting the Dashboard
```bash
# Windows batch scripts handle dual-server setup
start-all.bat          # Launches both API & UI in separate terminals
# OR individually:
start-api.bat          # Node.js Express API on port 9900
run-dev.bat           # Vite dev server on port 5173
```

### Critical Architecture Patterns

1. **Bilingual UI**: Thai/English i18n via `src/i18n.js` with localStorage persistence
2. **Mock Data Architecture**: `src/dataFeed.js` generates fake dashboard metrics (no real backend integration yet)
3. **API Communication**: Dashboard posts commands via `/run` endpoint expecting `{cmd: "status"}` format
4. **Electron Packaging**: `electron/main.cjs` forks `server.js` as child process, bundles with `electron-builder`

### Ruby Service Patterns
- **Memoized Fibonacci**: `FIB = {0=>0, 1=>1}` hash cache for performance
- **Input Validation**: Strict integer range `0..1_000_000` with JSON error responses
- **Sinatra Conventions**: RESTful GET `/fib/:n` endpoint, configurable port via ENV

## Component-Specific Notes

### React Dashboard (`src/`)
- **Styling**: TailwindCSS with custom CSS variables (`--ok`, `--warn`, `--err` colors)
- **Data Virtualization**: `react-window` for large table rendering
- **Charts**: Recharts library for PieChart/LineChart/BarChart components
- **State Management**: React hooks only, no external state library

### Promptfoo Integration
- **Config Pattern**: `promptfooconfig.yaml` uses `${OPENAI_API_KEY}` env var
- **Thai Language Support**: Tests include Thai text evaluation (`"สรุป"` assertions)
- **Provider Setup**: Targets `openai:gpt-4o-mini` model consistently

### Build & Distribution
- **Electron Builder**: Creates Windows NSIS installer with custom icon
- **Asset Bundling**: `files: [dist/**, electron/**, server.js]` pattern
- **Development Detection**: `!app.isPackaged` determines dev vs production URLs

## Critical Environment Variables
- `OPENAI_API_KEY` - Required for LLM evaluation (promptfoo)
- `PORT` - Ruby service port (default: 4567)
- `VITE_DEV_SERVER_URL` - Override dev server URL for Electron

## Common Debugging Scenarios

### API Connection Issues
- **EventSource Failures**: Dashboard uses `/api/events` SSE endpoint - check network tab for 404s
- **CORS Problems**: Electron sets `CORS_ORIGIN: '*'` but dev mode may need explicit origins
- **Auth Errors**: HTTP 401 throws `'AUTH'` error - check `apiKey` in sessionStorage vs `COMMAND_API_KEY` env
- **Retry Logic**: `http.js` implements exponential backoff (400ms → 5000ms) over 5 attempts

### Configuration State Issues
- **Port Mismatches**: API defaults differ - Electron uses :8080, dev scripts use :9900
- **Storage Persistence**: `apiUrl` in localStorage, `apiKey` in sessionStorage (security pattern)
- **Electron Detection**: `process.versions?.electron` check determines URL/key fallbacks
- **Theme Toggle**: Dark mode state stored in localStorage + document.documentElement class

### Mock Data Behavior
- **Live Updates**: `dataFeed.js` simulates real-time metrics every 2 seconds
- **EventSource Simulation**: Dashboard expects SSE format even with mock data
- **Job Status Logic**: Mock jobs use modulo patterns (i%17===0 → 'failed')
- **Memory Leaks**: EventSource connections must be properly closed on unmount

### Language/i18n Issues
- **Missing Translations**: Falls back to English if Thai key missing in `locales_th.json`
- **DOM Updates**: `data-i18n` attributes require `translateDOM()` call after language switch
- **Number Formatting**: Uses `Intl.NumberFormat` with Asia/Bangkok timezone assumptions

### Build/Distribution Problems
- **Electron Main Process**: `server.js` fork must succeed or app won't start
- **Asset Loading**: `isDev` flag switches between `http://localhost:5173` vs `file://` paths
- **Icon Missing**: `build/icon.ico` required for Windows installer generation
- **ASAR Packaging**: Server files must be in `files` array in `electron-builder.yml`