@echo off
cd /d %~dp0
echo Starting UI (Vite) on http://127.0.0.1:5173
set "VITE_PORT=5173"
REM Use npm or pnpm as available
where pnpm >nul 2>nul && ( pnpm run dev ) || ( npm run dev )
