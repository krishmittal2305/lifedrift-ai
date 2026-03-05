import type { SliderValues } from '@/store/useOSStore'

export interface Archetype {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  tip: string
}

export function detectArchetype(s: SliderValues): Archetype {
  if (s.study > 8.5 && s.sleep < 6.5)
    return { id: 'grinder',   name: 'THE GRINDER',     emoji: '🔥', color: '#ff2d4b',
             description: 'Maximum academic intensity. High stress risk. Burning the candle at both ends.',
             tip: 'Add 1 hour of sleep. Your study ROI is diminishing.' }

  if (s.physical > 6)
    return { id: 'athlete',   name: 'THE ATHLETE',     emoji: '⚡', color: '#00ffd5',
             description: 'Physical activity dominates. Good stress buffer but watch study-sleep balance.',
             tip: 'Your body is strong. Now train the mind with focused study blocks.' }

  if (s.social > 4)
    return { id: 'socialite', name: 'THE SOCIALITE',   emoji: '🌐', color: '#ff2d9b',
             description: 'Highly social. Great support network, but academic focus may suffer.',
             tip: 'Convert 1 social hour to study — small shift, large GPA impact.' }

  if (s.sleep > 9)
    return { id: 'sleeper',   name: 'THE RECHARGER',   emoji: '🌙', color: '#7b2fff',
             description: 'Sleep-first lifestyle. Great recovery but check study and activity hours.',
             tip: 'Well-rested is powerful. Use that energy for consistent 7h study blocks.' }

  if (s.social < 1 && s.extra < 1)
    return { id: 'hermit',    name: 'THE HERMIT',      emoji: '🔮', color: '#00c8ff',
             description: 'Isolated academic focus. Risk of burnout without social buffers.',
             tip: 'Even 1h of social time weekly significantly reduces cortisol.' }

  if (s.sleep < 6)
    return { id: 'nightowl',  name: 'THE NIGHT OWL',  emoji: '🦉', color: '#ffaa00',
             description: 'Chronically undersleeping. Memory consolidation and mood at risk.',
             tip: 'Sleep is when your brain files today\'s knowledge. Protect it.' }

  if (s.extra > 3)
    return { id: 'overcommit','name': 'THE OVERCOMMITTED', emoji: '🎪', color: '#ff9500',
             description: 'High extracurricular load. Diverse but potentially spread too thin.',
             tip: 'Focus on 1-2 activities with depth over breadth.' }

  return { id: 'balanced',  name: 'THE BALANCED',    emoji: '✨', color: '#00ffd5',
           description: 'Well-rounded lifestyle profile. Near-optimal stress balance.',
           tip: 'You\'re doing it right. Fine-tune sleep toward 8h for the edge.' }
}
