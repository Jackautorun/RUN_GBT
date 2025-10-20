@echo off
cd /d %~dp0

REM Start API
start "API 9900" cmd /k start-api.bat

REM Delay a bit then start UI
timeout /t 3 /nobreak >nul
start "UI 5173" cmd /k run-dev.bat
