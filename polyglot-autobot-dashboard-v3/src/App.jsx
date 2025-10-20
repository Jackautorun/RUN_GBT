import React, { useMemo, useState, useEffect } from 'react'
import { t, setLang } from './i18n.js'
import Dashboard from './pages/Dashboard.jsx'

export default function App(){
  const [dark, setDark] = useState(true)
  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
  },[dark])
  return (
    <div className="h-full flex">
      <aside className="w-64 bg-surface text-txt border-r border-border p-4">
        <div className="h1 mb-4">Polyglot Autobot</div>
        <nav className="space-y-2">
          <a className="block px-3 py-2 rounded-lg bg-surface-2">{t('nav.dashboard')}</a>
          <a className="block px-3 py-2 rounded-lg hover:bg-surface-2">{t('nav.jobs')}</a>
          <a className="block px-3 py-2 rounded-lg hover:bg-surface-2">{t('nav.cloud')}</a>
          <a className="block px-3 py-2 rounded-lg hover:bg-surface-2">{t('nav.google')}</a>
          <a className="block px-3 py-2 rounded-lg hover:bg-surface-2">{t('nav.hardware')}</a>
          <a className="block px-3 py-2 rounded-lg hover:bg-surface-2">{t('nav.security')}</a>
          <a className="block px-3 py-2 rounded-lg hover:bg-surface-2">{t('nav.scheduler')}</a>
          <a className="block px-3 py-2 rounded-lg hover:bg-surface-2">{t('nav.settings')}</a>
        </nav>
        <div className="mt-6 space-y-2">
          <button className="btn w-full" onClick={()=>setDark(d=>!d)}>{dark?'Dark':'Light'}</button>
          <select className="btn w-full" onChange={e=>setLang(e.target.value)} defaultValue={localStorage.getItem('lang')||'th'}>
            <option value="th">ไทย</option>
            <option value="en">English</option>
          </select>
        </div>
      </aside>
      <main className="flex-1 bg-bg text-txt overflow-auto">
        <header className="sticky top-0 z-10 card-h px-6 py-4 flex items-center justify-between">
          <div className="h1">{t('nav.dashboard')}</div>
          <input className="btn" placeholder={t('search.placeholder')} />
        </header>
        <div className="p-4 space-y-4">
          <Dashboard />
        </div>
      </main>
    </div>
  )
}
