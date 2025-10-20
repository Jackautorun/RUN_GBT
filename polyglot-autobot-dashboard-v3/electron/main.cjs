// electron/main.cjs
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let backend = null;
const isDev = !app.isPackaged;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

function getStartUrl() {
  return isDev
    ? DEV_URL
    : 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadURL(getStartUrl());
}

app.whenReady().then(() => {
  const env = {
    ...process.env,
    COMMAND_API_KEY: process.env.COMMAND_API_KEY || 'dev-key',
    PORT: process.env.PORT || '8080',
    CORS_ORIGIN: '*'
  };
  backend = fork(path.join(__dirname, '..', 'server.js'), [], { env });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (backend) { try { backend.kill(); } catch (_) {} }
});
