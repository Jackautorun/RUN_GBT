// src/utils/http.js
export async function postJSON(url, body, apiKey, {retries=5, t=400}={}){
  for(let i=0;i<retries;i++){
    try{
      const r = await fetch(url, {
        method:'POST',
        headers:{'Content-Type':'application/json', ...(apiKey?{Authorization:`Bearer ${apiKey}`}:{})},
        body: JSON.stringify(body)
      });
      if(r.status===401) throw new Error('AUTH');      // คีย์ไม่ตรง
      if(!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    }catch(e){
      if(i===retries-1 || e.message==='AUTH') throw e;
      await new Promise(r=>setTimeout(r, t));          // backoff
      t = Math.min(t*1.8, 5000);
    }
  }
}
