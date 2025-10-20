@echo off
cd /d %~dp0
set "PORT=9900"
echo Starting API on http://127.0.0.1:%PORT%
node server.js
