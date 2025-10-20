import React from 'react';
import { ConfigProvider, useConfig } from './config.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Settings from './pages/Settings.jsx';
import { useApiStatus } from './hooks/useApiStatus.js';

function AppInner(){
  const { cfg } = useConfig();
  const { status } = useApiStatus(cfg.apiUrl);
  const [tab, setTab] = React.useState('dashboard');
  const badge = status==='ok' ? 'badge-ok' : status==='error' ? 'badge-err' : 'badge-warn';
  const label = status==='ok' ? 'Connected' : status==='error' ? 'Disconnected' : 'Checking…';

  return (
    <div className="min-h-screen bg-bg text-txt">
      <div className="flex">
        <aside className="w-56 p-3">
          <div className="h1 mb-4">Polyglot Autobot</div>
          <div className={`mb-3 badge ${badge}`}>{label}</div>
          <button className="btn w-full mb-2" onClick={()=>setTab('dashboard')}>Dashboard</button>
          <button className="btn w-full" onClick={()=>setTab('settings')}>Settings</button>
        </aside>
        <main className="flex-1 p-4">
          {tab === 'settings' ? <Settings/> : <Dashboard/>}
        </main>
      </div>
    </div>
  );
}
export default function App(){ return <ConfigProvider><AppInner/></ConfigProvider>; }
