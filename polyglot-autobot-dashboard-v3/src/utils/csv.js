export function toCSV(rows, columns){
  const head = columns.map(c=>esc(c.header)).join(',')
  const body = rows.map(r=>columns.map(c=>esc(r[c.key])).join(',')).join('\n')
  return '\ufeff' + head + '\n' + body
}
function esc(v){ if(v==null) return '""'; const s=String(v).replace(/"/g,'""'); return '"'+s+'"' }
export function downloadCSV(name, text){
  const blob = new Blob([text], {type:'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url)
}
