import { useEffect, useState } from 'react';

export function useApiStatus(apiUrl){
  const [status, setStatus] = useState('idle'); // idle | checking | ok | error
  async function pingOnce(url){
    if(!url) return setStatus('idle');
    setStatus('checking');
    try{
      const ctrl = new AbortController();
      const t = setTimeout(()=>ctrl.abort(), 2500);
      const r = await fetch(url.replace(/\/$/,'') + '/api/events', {
        method:'GET', headers:{Accept:'text/event-stream'}, signal: ctrl.signal
      });
      clearTimeout(t);
      setStatus(r.ok ? 'ok' : 'error');
    }catch{ setStatus('error'); }
  }
  useEffect(()=>{
    let id;
    pingOnce(apiUrl);
    if(apiUrl){
      id = setInterval(()=>pingOnce(apiUrl), 5000);
    }
    return ()=> id && clearInterval(id);
  }, [apiUrl]);
  return { status, ping: ()=>pingOnce(apiUrl) };
}
