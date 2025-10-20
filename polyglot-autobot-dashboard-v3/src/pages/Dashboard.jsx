import React, { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { FixedSizeList as List } from 'react-window'
import { t, nf, df } from '../i18n.js'
import { useLiveFeed } from '../dataFeed.js'
import { toCSV, downloadCSV } from '../utils/csv.js'
import { usePostCommand } from '../utils/commands.js'

const COLORS = {
  ok: getCSS('--ok', '#10B981'),
  warn: getCSS('--warn', '#F59E0B'),
  err: getCSS('--err', '#EF4444'),
  brand: getCSS('--brand', '#6366F1'),
}
function getCSS(v, fb){ try{ return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fb }catch{ return fb } }

export default function Dashboard({query=''}){
  const data = useLiveFeed()
  const postCommand = usePostCommand()
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('asc')

  const COLUMNS = [
    {key:'id', header:t('table.id')},
    {key:'status', header:t('table.status')},
    {key:'lang', header:t('table.lang')},
    {key:'action', header:t('table.action')},
    {key:'duration', header:t('table.duration')},
    {key:'ret', header:t('table.ret')},
    {key:'started', header:t('table.started')},
    {key:'finished', header:t('table.finished')},
  ]

  const filtered = useMemo(()=>{
    if(!query) return data.jobs
    const q = query.toLowerCase()
    return data.jobs.filter(r => (r.id+r.lang+r.action+r.status).toLowerCase().includes(q))
  }, [data.jobs, query])

  const sorted = useMemo(()=>{
    const arr = [...filtered]
    arr.sort((a,b)=>{
      const va=a[sortKey], vb=b[sortKey]
      if(va==null && vb!=null) return -1
      if(va!=null && vb==null) return 1
      if(va==null && vb==null) return 0
      if(va<vb) return sortDir==='asc'?-1:1
      if(va>vb) return sortDir==='asc'? 1:-1
      return 0
    })
    return arr
  }, [filtered, sortKey, sortDir])

  function toggleSort(key){ setSortKey(key); setSortDir(d => (sortKey===key ? (d==='asc'?'desc':'asc') : 'asc')) }
  function exportCSV(){ const csv = toCSV(sorted.slice(0,10000), COLUMNS); downloadCSV('jobs.csv', csv) }

  const row = ({index, style})=>{
    const r = sorted[index]
    const color = r.status==='completed'? COLORS.ok : r.status==='failed'? COLORS.err : COLORS.warn
    return (
      <div style={style} className="grid grid-cols-[200px,140px,100px,120px,120px,80px,240px,240px] px-3 border-b border-border items-center">
        <div className="truncate">{r.id}</div>
        <div style={{color}}>{t('status.'+r.status) || r.status}</div>
        <div>{r.lang}</div>
        <div>{r.action}</div>
        <div>{r.duration} s</div>
        <div>{(r.status==='failed')?1:0}</div>
        <div>{df(r.started)}</div>
        <div>{r.finished ? df(r.finished): '—'}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <span className="chip">{t('filters.range')}: Last 24h</span>
        <span className="chip">{t('filters.lang')}: All</span>
        <span className="chip">{t('filters.status')}: All</span>
        <span className="chip">{t('filters.owner')}: Me</span>
        <button className="btn ml-auto" onClick={()=>window.location.reload()}>{t('filters.reset')}</button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-5 gap-4">
        {[
          [t('kpi.jobsToday'), nf(data.kpi.jobs)],
          [t('kpi.successRate'), nf(data.kpi.success, {maximumFractionDigits:1})+'%'],
          [t('kpi.avgDuration'), nf(data.kpi.duration)+' s'],
          [t('kpi.queueLen'), nf(data.kpi.queue)],
          [t('kpi.modelSpend'), '$'+nf(data.kpi.spend, {minimumFractionDigits:2})]
        ].map(([name,val],i)=>(
          <div key={i} className="card p-4">
            <div className="small">{name}</div>
            <div className="text-3xl font-bold">{val}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-3">
          <div className="h2 mb-2">{t('chart.jobStatus24h')}</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.donut} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                <Cell fill={COLORS.ok} /><Cell fill={COLORS.err} /><Cell fill={COLORS.warn} />
              </Pie>
              <Legend /><Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-3">
          <div className="h2 mb-2">{t('chart.cpuMem')}</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.cpu}>
              <XAxis dataKey="t" /><YAxis yAxisId="left" unit="%" /><YAxis yAxisId="right" orientation="right" unit=" GB" />
              <Tooltip /><Legend />
              <Line yAxisId="left" type="monotone" dataKey="cpu" stroke={COLORS.brand} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="mem" stroke={COLORS.warn} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-3">
          <div className="h2 mb-2">{t('chart.topLangJobs')}</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.langs}>
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="value" fill={COLORS.brand} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table + Alerts */}
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <div className="card">
          <div className="card-h px-4 py-3 h2 flex items-center justify-between">
            <span>{t('table.recent')}</span>
            <div className="space-x-2">
              <button className="btn" onClick={exportCSV}>{t('actions.downloadCsv')}</button>
            </div>
          </div>
          <div className="grid grid-cols-[200px,140px,100px,120px,120px,80px,240px,240px] px-3 py-2 small bg-surface2 sticky top-0">
            {COLUMNS.map(c => (
              <button key={c.key} onClick={()=>toggleSort(c.key)} aria-sort={sortKey===c.key ? (sortDir==='asc'?'ascending':'descending') : 'none'} className="text-left hover:underline">
                {c.header} {sortKey===c.key ? (sortDir==='asc'?'▲':'▼') : ''}
              </button>
            ))}
          </div>
          <List height={360} itemCount={sorted.length} itemSize={32} width={'100%'}>
            {row}
          </List>
          <div className="flex items-center justify-between px-3 py-2 small border-t border-border">
            <span data-i18n="table.rowsOf" data-i18n-from="1" data-i18n-to="50" data-i18n-total={sorted.length}></span>
            <div className="space-x-2">
              <button className="btn">{t('pagination.prev')}</button>
              <button className="btn">{t('pagination.next')}</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-h px-4 py-3 h2">{t('alerts.title')}</div>
          <div className="p-3 space-y-3">
            {[
              {txt:`Queue length high: 9`, color:COLORS.warn},
              {txt:`Image gcc:13 CRITICAL=1`, color:COLORS.err},
              {txt:`Retry job id-0102`, color:COLORS.brand}
            ].map((a,i)=>(
              <div key={i} className="border border-border rounded-lg p-3 flex items-center gap-3 bg-surface2">
                <div style={{background:a.color}} className="w-2 h-6 rounded"></div>
                <div className="flex-1">{a.txt}</div>
                <button className="btn">{t('alerts.ack')}</button>
                <button className="btn">{t('alerts.mute')}</button>
              </div>
            ))}
            <div className="pt-2">
              <button className="btn" onClick={()=>postCommand('run_job',{lang:'python',action:'test',args:['-q']}).catch(e=>alert(e.message))}>Run test (Python)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
