'use client'

import { motion } from 'framer-motion'
import { MOOD_COLORS } from '@/lib/constants'

interface Props { probabilities: Record<'Low' | 'Moderate' | 'High', number> }

export function ProbabilityBars({ probabilities }: Props) {
  const sorted = (Object.entries(probabilities) as ['Low' | 'Moderate' | 'High', number][]).sort((a, b) => b[1] - a[1])

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
      <div 
        className="text-[8px] tracking-[0.25em] uppercase opacity-40 mb-1"
        style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
      >
        Neural Probability Output
      </div>
      <div className="space-y-3">
        {sorted.map(([level, prob], i) => (
          <div key={level} className="space-y-1">
            <div className="flex justify-between items-center text-[9px] font-black tracking-widest uppercase">
              <span style={{ fontFamily: 'var(--font-orbitron)', color: MOOD_COLORS[level] }}>{level}</span>
              <span style={{ fontFamily: 'var(--font-share-tech-mono)', color: MOOD_COLORS[level] }}>{Math.round(prob * 100)}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prob * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ 
                  background: MOOD_COLORS[level],
                  boxShadow: `0 0 10px ${MOOD_COLORS[level]}`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
