
import { listMemories } from './memoryStore'

// naive suggestion from current memories
export async function suggestDefaults(context = {}) {
  const m = listMemories()
  const learnedSubtitle = m.find(x => x.text.toLowerCase().includes('subtitle speed') && x.text.includes('2.5'))
  const kaiVoice = m.find(x => /kai.*riven jp/i.test(x.text))
  const aspect =
    context.target === 'TikTok' ? '9:16' :
    context.target === 'YouTube' ? '16:9' : '1:1'

  return {
    subtitleSpeed: learnedSubtitle ? 2.5 : 3.0,
    voicePreset: kaiVoice ? 'Riven JP' : (context.tone === 'dark' ? 'Riven JP' : 'Echo EN'),
    aspectRatio: aspect,
    bgEffects: context.tone === 'dark' ? ['fog','rain'] : [],
    source: learnedSubtitle || kaiVoice ? 'learned' : 'fallback',
    context,
    generatedAt: new Date().toISOString()
  }
}
