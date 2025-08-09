
const KEY = 'gencore.memories.v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
function save(mem) { localStorage.setItem(KEY, JSON.stringify(mem)) }
export function listMemories() { return load().sort((a,b)=>b.createdAt-a.createdAt) }

export function addMemory({ type, text, tags = [], source = 'user', confidence = 0.85 }) {
  const all = load()
  const id = String(Date.now()) + Math.random().toString(36).slice(2)
  const m = { id, type, text, tags, source, confidence, createdAt: Date.now(), updatedAt: Date.now() }
  all.push(m); save(all); return m
}
export function deleteMemory(id) { save(load().filter(m => m.id !== id)) }
export function clearAllMemories() { save([]) }

export function recall(query) {
  const q = (query||'').toLowerCase().split(/\s+/).filter(Boolean)
  return listMemories()
    .map(m => {
      const hay = [m.text, ...(m.tags||[])].join(' ').toLowerCase()
      const score = q.reduce((s,w)=> s + (hay.includes(w)?1:0), 0)
      return { score, m }
    })
    .filter(x => x.score>0).sort((a,b)=> b.score - a.score).map(x => x.m)
}

export function seedGencore() {
  if (listMemories().some(m => (m.tags||[]).includes('gencore-seed'))) return
  const add = (o)=>addMemory({ ...o, tags:[...(o.tags||[]),'gencore-seed'] })

  add({ type:'rule', text:'CRITICAL: Only anime content allowed — no Western cartoons', tags:['content','anime','restriction'], confidence:1 })
  add({ type:'rule', text:'Default subtitle speed is 2.5 seconds per line', tags:['subtitle','timing'], confidence:.95 })
  add({ type:'preference', text:'Kai voice preset: Riven JP', tags:['voice','character:Kai'], confidence:.9 })
  add({ type:'preference', text:'Echo EN voice for narration/exposition', tags:['voice','narrator','english'], confidence:.85 })
  add({ type:'fact', text:'Platform supports TikTok (9:16), YouTube (16:9), Instagram (1:1) aspect ratios', tags:['export','aspect-ratio'], confidence:.95 })
  add({ type:'preference', text:'Default export: MP4, 1080p, 24fps', tags:['export','format'], confidence:.9 })
  add({ type:'fact', text:'Dark scenes require filter brightness(0.4) and fog effect', tags:['visual','scene:dark'], confidence:.9 })
  add({ type:'event', text:'Previewed rooftop fight scene with Riven JP voice and rain effect', tags:['preview','scene:rooftop','voice:RivenJP'], confidence:.8 })
  add({ type:'draft', text:'Opening shot for Shadow Hunter Ep02 — foggy alley, neon lights, Kai holding blade', tags:['story','draft','episode:2'], confidence:.75 })
}

export function runLearningPass() {
  const mem = listMemories()
  let updates = 0
  const has25 = mem.some(m => /2\.5\s*seconds/i.test(m.text))
  const kai = mem.find(m => /kai voice preset/i.test(m.text))
  if (has25) { addMemory({ type:'preference', text:'[learned] Subtitle speed ~2.5s', tags:['learned','subtitle'], source:'learned', confidence:.85 }); updates++ }
  if (kai)   { addMemory({ type:'preference', text:'[learned] Kai uses Riven JP by default', tags:['learned','voice','character:Kai'], source:'learned', confidence:.9 }); updates++ }
  return { updated: updates }
}
