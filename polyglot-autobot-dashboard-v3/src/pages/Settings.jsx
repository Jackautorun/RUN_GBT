import React from 'react';
import { useConfig } from '../config.jsx';
import { useApiStatus } from '../hooks/useApiStatus.js';

export default function Settings(){
  const { cfg, setApiUrl, setApiKey, setLang, setTheme, reset } = useConfig();
  const [f, setF] = React.useState({ apiUrl: cfg.apiUrl, apiKey: cfg.apiKey, lang: cfg.lang, theme: cfg.theme });
  const [msg, setMsg] = React.useState('');
  const { status, ping } = useApiStatus(f.apiUrl);

  React.useEffect(()=> setF({ apiUrl: cfg.apiUrl, apiKey: cfg.apiKey, lang: cfg.lang, theme: cfg.theme }), [cfg.apiUrl, cfg.apiKey, cfg.lang, cfg.theme]);

  const save = ()=>{
    setApiUrl(f.apiUrl.trim());
    setApiKey(f.apiKey.trim());
    setLang(f.lang);
    setTheme(f.theme);
    setMsg('Saved');
    setTimeout(()=>setMsg(''), 1500);
  };
  const cancel = ()=>{
    setF({ apiUrl: cfg.apiUrl, apiKey: cfg.apiKey, lang: cfg.lang, theme: cfg.theme });
    setMsg('Cancelled');
    setTimeout(()=>setMsg(''), 1200);
  };

  const badge = status==='ok' ? 'badge-ok' : status==='error' ? 'badge-err' : 'badge-warn';
  const label = status==='ok' ? 'Connected' : status==='error' ? 'Disconnected' : 'Checking…';

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`badge ${badge}`}>Status: {label}</div>
        <button className="btn" onClick={ping}>Test</button>
        {msg && <div className="small">{msg}</div>}
      </div>

      <div className="card p-4 space-y-3">
        <div className="h2 mb-2">Connection</div>
        <label className="small">API URL</label>
        <input className="input" value={f.apiUrl} onChange={e=>setF(s=>({...s, apiUrl:e.target.value}))} placeholder="http://127.0.0.1:8080"/>
        <label className="small mt-3">API Key (optional)</label>
        <input className="input" value={f.apiKey} onChange={e=>setF(s=>({...s, apiKey:e.target.value}))} placeholder="Bearer key"/>
      </div>

      <div className="card p-4 grid grid-cols-2 gap-4">
        <div>
          <div className="small mb-2">Theme</div>
          <select className="input" value={f.theme} onChange={e=>setF(s=>({...s, theme:e.target.value}))}>
            <option value="dark">Dark</option><option value="light">Light</option>
          </select>
        </div>
        <div>
          <div className="small mb-2">Language</div>
          <select className="input" value={f.lang} onChange={e=>setF(s=>({...s, lang:e.target.value}))}>
            <option value="th">ไทย</option><option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn-primary" onClick={save}>Save</button>
        <button className="btn-secondary" onClick={cancel}>Cancel</button>
        <button className="btn" onClick={reset}>Reset to default</button>
      </div>
    </div>
  );
}
