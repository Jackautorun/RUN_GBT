import { useEffect, useRef, useState } from 'react'
import { useConfig } from './config.jsx'

function genInitial(){
  return {
    kpi: { jobs: 152, success: 96.4, duration: 71, queue: 2, spend: 18.42 },
    donut: [{name:'Completed', value:146},{name:'Failed',value:5},{name:'Cancelled',value:1}],
    cpu: Array.from({length:24}, (_,i)=>({t:i, cpu: 40+18*Math.sin(i/3), mem: 1.2+0.6*Math.sin(i/2)})),
    langs: [{name:'python', value:92},{name:'node',value:54},{name:'go',value:36},{name:'rust',value:28},{name:'cpp',value:18}],
    jobs: Array.from({length:1200}, (_,i)=>({ id:`id-${i.toString().padStart(4,'0')}`, status: (i%17===0?'failed':(i%31===0?'cancelled':'completed')), lang: ['python','node','go','rust','cpp'][i%5], action:['run','test','lint','fmt'][i%4], duration: Math.floor(Math.random()*90)+2, started: Date.now()-i*60000, finished: Date.now()-i*60000 + (Math.random()*90000)}))
  }
}

export function useLiveFeed(){
  const { cfg } = useConfig()
  const [state, setState] = useState(genInitial())
  const timer = useRef(null)
  const sse = useRef(null)

  useEffect(()=>{
    if(sse.current){ try{sse.current.close()}catch{} sse.current=null }
    if(!cfg.apiUrl) return
    try{
      const url = cfg.apiUrl.replace(/\/$/, '') + '/api/events'
      const es = new EventSource(url)
      sse.current = es
      es.onmessage = (ev)=>{
        try{
          const msg = JSON.parse(ev.data)
          setState(s=>{
            const n={...s}
            if(msg.kpi) n.kpi={...s.kpi,...msg.kpi}
            if(msg.donut) n.donut=msg.donut
            if(msg.cpu) n.cpu=msg.cpu
            if(msg.langs) n.langs=msg.langs
            if(msg.job) n.jobs=[msg.job,...s.jobs].slice(0,20000)
            return n
          })
        }catch{}
      }
      es.onerror = ()=>{ try{ es.close() }catch{} }
    }catch{}
    return ()=>{ if(sse.current) try{ sse.current.close() }catch{} }
  }, [cfg.apiUrl])

  useEffect(()=>{
    timer.current = setInterval(()=>{
      setState(s=>{
        const nextJobs = s.kpi.jobs + (Math.random()>0.5?1:0)
        const nextQueue = Math.max(0, s.kpi.queue + (Math.random()>0.7?1:-1))
        return {
          ...s,
          kpi: {...s.kpi, jobs: nextJobs, queue: nextQueue, success: 95 + Math.random()*5 },
          cpu: s.cpu.map((p)=>({ ...p, cpu: Math.max(0, Math.min(100, p.cpu + (Math.random()*6-3))), mem: Math.max(0.2, Math.min(3, p.mem + (Math.random()*0.2-0.1))) }))
        }
      })
    }, 2000)
    return ()=>{ if(timer.current) clearInterval(timer.current) }
  }, [])

  return state
}
