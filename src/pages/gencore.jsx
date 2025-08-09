
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMemories, addMemory, deleteMemory, clearAllMemories, recall, seedGencore, runLearningPass } from '../state/memoryStore.js'
import { suggestDefaults } from '../state/prefs.js'

export default function Gencore() {
  const [mem, setMem] = useState([])
  const [form, setForm] = useState({ type:'rule', text:'', tags:'' })
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [bridge, setBridge] = useState(null)

  const refresh = ()=> setMem(listMemories())
  useEffect(()=>{ refresh(); }, [])

  const counts = mem.reduce((a,m)=> (a[m.type]=(a[m.type]||0)+1, a), {})
  const onAdd = ()=>{
    if(!form.text.trim()) return
    addMemory({ type:form.type, text:form.text, tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean) })
    setForm({ ...form, text:'', tags:'' })
    refresh()
  }
  const onAsk = ()=> setResults(recall(q))
  const onSeed = ()=> { seedGencore(); refresh() }
  const onLearn = ()=> { const r = runLearningPass(); alert(`Learning updated ${r.updated} items`); refresh() }
  const onClear = ()=> { clearAllMemories(); refresh() }
  const testBridge = async ()=>{
    const d = await suggestDefaults({ character:'Kai', tone:'dark', target:'TikTok' })
    setBridge(d)
  }

  return (
    <div className="container grid">
      <div className="card hstack">
        <Link to="/" className="btn gray">← Back to Studio</Link>
        <h2 style={{margin:0}}>🧠 GENCORE — Sandbox</h2>
      </div>

      <div className="card hstack">
        <button className="btn" onClick={onSeed}>🌱 Seed Test Data</button>
        <button className="btn" onClick={onLearn}>🧠 Run Learning Pass</button>
        <button className="btn gray" onClick={onClear}>🗑️ Clear All</button>
        <button className="btn" onClick={testBridge}>🔌 Test Studio Defaults</button>
      </div>

      {bridge && <div className="card">
        <h3 className="title">Studio Defaults (from GENCORE)</h3>
        <pre>{JSON.stringify(bridge, null, 2)}</pre>
      </div>}

      <div className="card">
        <h3 className="title">Status Dashboard</h3>
        <p>Total: <b>{mem.length}</b> — Rules {counts.rule||0} • Prefs {counts.preference||0} • Facts {counts.fact||0} • Events {counts.event||0} • Drafts {counts.draft||0}</p>
      </div>

      <div className="card grid">
        <h3 className="title">Add Memory</h3>
        <div className="hstack">
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option>rule</option><option>preference</option><option>fact</option><option>event</option><option>draft</option>
          </select>
          <input placeholder="tags, comma,separated" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/>
        </div>
        <textarea rows="3" placeholder="Teach GENCORE…" value={form.text} onChange={e=>setForm({...form,text:e.target.value})}/>
        <button className="btn" onClick={onAdd}>Add</button>
      </div>

      <div className="card grid">
        <h3 className="title">Ask GENCORE</h3>
        <div className="hstack">
          <input placeholder="e.g., What voice should Kai use?" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" onClick={onAsk}>Ask</button>
        </div>
        {results.length>0 && <div>
          <p className="small">Top sources:</p>
          <ul>
            {results.slice(0,5).map(r=> <li key={r.id}>{r.text} <span className="badge">{r.type}</span></li>)}
          </ul>
        </div>}
      </div>

      <div className="card">
        <h3 className="title">Memory Store</h3>
        {mem.length===0 && <p className="small">No memories yet. Click “Seed Test Data”.</p>}
        {mem.map(m=>(
          <div key={m.id} style={{borderTop:'1px solid #23242a', paddingTop:'.7rem', marginTop:'.7rem'}}>
            <div className="hstack">
              <span className="badge">{m.type}</span>
              <span className="small">{new Date(m.createdAt).toLocaleString()}</span>
            </div>
            <p style={{margin:'.4rem 0'}}>{m.text}</p>
            <div style={{marginBottom:'.4rem'}}>{(m.tags||[]).map(t=><span key={t} className="badge">{t}</span>)}</div>
            <button className="btn gray" onClick={()=>{ deleteMemory(m.id); refresh() }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
