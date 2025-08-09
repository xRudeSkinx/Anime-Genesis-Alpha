
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { suggestDefaults } from '../state/prefs.js'

export default function App() {
  const [ctx, setCtx] = useState({ character:'Kai', tone:'dark', target:'TikTok' })
  const [def, setDef] = useState(null)

  useEffect(()=>{
    (async ()=>{
      const d = await suggestDefaults(ctx)
      setDef(d)
    })()
  }, [JSON.stringify(ctx)])

  return (
    <div className="container grid">
      <div className="card">
        <h1 style={{margin:'0 0 .5rem'}}>Anime Genesis — Studio</h1>
        <p className="small">GENCORE feeds defaults. Use the <b>Sandbox</b> to teach it; return here to see the Studio auto-fill.</p>
        <div className="hstack" style={{marginTop:'.8rem'}}>
          <Link to="/gencore" className="btn">🧠 Open GENCORE Sandbox</Link>
        </div>
      </div>

      <div className="card grid">
        <h2 className="title">🎬 Scene Editor (MVP)</h2>
        <div className="kv">
          <label>Character</label>
          <input value={ctx.character} onChange={e=>setCtx(x=>({...x, character:e.target.value}))}/>
          <label>Tone</label>
          <select value={ctx.tone} onChange={e=>setCtx(x=>({...x, tone:e.target.value}))}>
            <option>dark</option><option>light</option><option>epic</option>
          </select>
          <label>Target</label>
          <select value={ctx.target} onChange={e=>setCtx(x=>({...x, target:e.target.value}))}>
            <option>TikTok</option><option>YouTube</option><option>Instagram</option>
          </select>
        </div>

        <div className="card" style={{marginTop:'.6rem'}}>
          <h3 className="title">GENCORE Defaults</h3>
          {!def ? <p className="small">Loading…</p> :
          <pre>{JSON.stringify(def, null, 2)}</pre>}
        </div>
      </div>
    </div>
  )
}
