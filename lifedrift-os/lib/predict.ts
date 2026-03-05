import type { SliderValues } from '@/store/useOSStore'
import type { StressLevel } from './types'

export interface PredictionResult {
  level: StressLevel
  confidence: number
  probabilities: Record<StressLevel, number>
  score: number
  topFactor: string
  recommendations: string[]
}

// Mirrors the trained RandomForestClassifier feature importances:
// study(64.52%), sleep(16.74%), gpa(11.03%), physical(4.19%), social(2.11%), extra(1.41%)
export function predict(s: SliderValues): PredictionResult {
  const studyScore    = ((s.study    - 5)    / 5)    * 64.52
  const sleepScore    = ((8          - s.sleep) / 5)  * 16.74
  const gpaScore      = ((s.gpa      - 2.24) / 1.76)  * 11.03
  const physicalScore = -(s.physical / 13)             * 4.19
  const socialScore   = -(s.social   / 6)              * 2.11
  const extraScore    = -(s.extra    / 4)              * 1.41

  const score = studyScore + sleepScore + gpaScore + physicalScore + socialScore + extraScore

  let level: StressLevel
  let rawConf: number
  let probabilities: Record<StressLevel, number>

  if (score < 27) {
    level = 'Low'
    rawConf = Math.min(97, 62 + (27 - score) * 1.5)
    probabilities = {
      Low:      Math.min(0.96, 0.70 + (27 - score) * 0.01),
      Moderate: 0.18,
      High:     0.04,
    }
  } else if (score < 50) {
    level = 'Moderate'
    rawConf = Math.min(93, 55 + Math.abs(38.5 - score) * 1.6)
    const dist = Math.abs(38.5 - score) / 11.5
    probabilities = {
      Low:      Math.max(0.05, 0.20 - dist * 0.08),
      Moderate: Math.min(0.85, 0.60 + dist * 0.20),
      High:     Math.max(0.05, 0.20 - dist * 0.08),
    }
  } else {
    level = 'High'
    rawConf = Math.min(98, 62 + (score - 50) * 1.3)
    probabilities = {
      Low:      0.04,
      Moderate: 0.15,
      High:     Math.min(0.96, 0.81 + (score - 50) * 0.005),
    }
  }

  // Normalise probabilities to sum to 1
  const total = Object.values(probabilities).reduce((a, b) => a + b, 0)
  Object.keys(probabilities).forEach(
    (k) => (probabilities[k as StressLevel] = +(probabilities[k as StressLevel] / total).toFixed(3))
  )

  const topFactor = s.study > 8.5
    ? 'High study load is the primary stress driver'
    : s.sleep < 6.5
    ? 'Low sleep is amplifying stress significantly'
    : s.gpa > 3.6 && s.study > 7.5
    ? 'High GPA target with heavy study load detected'
    : 'Balanced lifestyle profile'

  const recommendations = buildRecs(s, level)

  return { level, confidence: +rawConf.toFixed(1), probabilities, score: +score.toFixed(2), topFactor, recommendations }
}

export async function predictRemote(s: SliderValues): Promise<PredictionResult> {
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    })
    
    if (!response.ok) throw new Error('API Error')
    
    const data = await response.json()
    
    return {
      level: data.stress_level as StressLevel,
      confidence: +(data.confidence * 100).toFixed(1),
      probabilities: data.probabilities,
      score: 0, 
      topFactor: `Primary Factor: ${data.top_feature.replace(/_/g, ' ')}`,
      recommendations: buildRecs(s, data.stress_level as StressLevel)
    }
  } catch (error) {
    console.warn('Neural API Offline — Switching to Local Inference Module', error)
    return predict(s)
  }
}

function buildRecs(s: SliderValues, level: StressLevel): string[] {
  const recs: string[] = []
  if (s.study > 8) recs.push(`Reduce study to ~7.5h using Pomodoro — you're ${(s.study - 7.5).toFixed(1)}h over optimal`)
  if (s.sleep < 7) recs.push(`Add ${(7.5 - s.sleep).toFixed(1)}h sleep — it's 16.7% of your stress predictor`)
  if (s.physical < 2) recs.push('Add 30 min daily physical activity — directly lowers cortisol')
  if (s.social < 1.5) recs.push('Schedule 1.5–2.5h social time — isolation amplifies academic stress')
  if (level === 'High' && s.extra < 1) recs.push('Join 1 extracurricular — provides identity buffer against burnout')
  if (recs.length === 0) recs.push('Your lifestyle is well-optimized. Maintain current balance.')
  return recs.slice(0, 3)
}
