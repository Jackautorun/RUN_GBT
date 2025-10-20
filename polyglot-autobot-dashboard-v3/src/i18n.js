import en from './locales_en.json'
import th from './locales_th.json'
const LOCALES = { en, th }
let LANG = localStorage.getItem('lang') || (navigator.language?.startsWith('th') ? 'th' : 'en')
export function setLang(lang){ LANG = (lang==='th')?'th':'en'; localStorage.setItem('lang', LANG); translateDOM() }
export function t(key, vars={}){ const dict=LOCALES[LANG]||en; let s=(dict[key]??en[key]??key); for(const [k,v] of Object.entries(vars)){ s=s.replaceAll(`{${k}}`, String(v)) } return s }
export function nf(n, opts={}){ return new Intl.NumberFormat(LANG, opts).format(n) }
export function df(d, opts={ hour:'2-digit', minute:'2-digit', timeZone:'Asia/Bangkok' }){ return new Intl.DateTimeFormat(LANG, opts).format(new Date(d)) }
export function translateDOM(root=document){ root.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); const from=el.getAttribute('data-i18n-from'); const to=el.getAttribute('data-i18n-to'); const total=el.getAttribute('data-i18n-total'); const txt=t(k,{from,to,total}); if(el.tagName==='INPUT'&&'placeholder'in el){ el.placeholder=txt } else { el.textContent=txt } }) }
document.addEventListener('DOMContentLoaded', translateDOM)
