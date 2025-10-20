// apply_patch.mjs
import fs from 'fs'
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'))

pkg.main = 'electron/main.cjs'
pkg.scripts = {
  ...(pkg.scripts||{}),
  "dev": pkg.scripts?.dev || "vite",
  "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
  "build": "vite build",
  "dist": "electron-builder"
}
pkg.build = {
  ...(pkg.build||{}),
  "appId": "com.polyglot.autobot",
  "productName": "Polyglot Autobot"
}
pkg.devDependencies = {
  ...(pkg.devDependencies||{}),
  "electron": pkg.devDependencies?.electron || "^32.0.0",
  "electron-builder": pkg.devDependencies?.["electron-builder"] || "^24.13.3",
  "concurrently": pkg.devDependencies?.concurrently || "^9.0.0",
  "wait-on": pkg.devDependencies?.["wait-on"] || "^7.2.0"
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
console.log('Patched package.json')