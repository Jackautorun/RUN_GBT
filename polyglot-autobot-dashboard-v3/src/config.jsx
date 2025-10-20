import React, { createContext, useContext, useMemo, useState } from 'react';

const Ctx = createContext(null);
const isElectron = !!(typeof process !== 'undefined' && process.versions?.electron);

function readInitial(){
  return {
    apiUrl: localStorage.getItem('api_url') || (isElectron ? 'http://127.0.0.1:8080' : ''),
    apiKey: sessionStorage.getItem('api_key') || '',
    lang:   localStorage.getItem('lang') || 'th',
    theme:  localStorage.getItem('theme') || 'dark'
  };
}

export function ConfigProvider({ children }){
  const [cfg, setCfg] = useState(readInitial);
  const value = useMemo(()=>({
    cfg,
    setApiUrl: v => { localStorage.setItem('api_url', v); setCfg(c=>({...c, apiUrl:v})); },
    setApiKey: v => { sessionStorage.setItem('api_key', v); setCfg(c=>({...c, apiKey:v})); },
    setLang:   v => { localStorage.setItem('lang', v); setCfg(c=>({...c, lang:v})); },
    setTheme:  v => { localStorage.setItem('theme', v); document.documentElement.classList.toggle('dark', v==='dark'); setCfg(c=>({...c, theme:v})); },
    reset:     () => setCfg(readInitial())
  }), [cfg]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useConfig = ()=> useContext(Ctx);
