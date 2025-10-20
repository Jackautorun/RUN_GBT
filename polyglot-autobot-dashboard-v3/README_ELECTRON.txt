Patch นี้ทำให้แพ็กเป็น .exe พร้อมไอคอน

วิธีใช้:
1) แตกไฟล์แพตช์ลงทับโปรเจกต์ React (v3) เดิม ให้มีโฟลเดอร์ electron/, build/, server.js, apply_patch.mjs
2) รัน:
   npm i -D electron electron-builder concurrently wait-on
   node apply_patch.mjs
3) โหมดทดสอบ Electron:
   npm run electron:dev
4) สร้างไฟล์ติดตั้ง .exe:
   npm run build
   npm run dist
ไฟล์ติดตั้งอยู่ใน ./release/Polyglot Autobot-Setup-<version>.exe