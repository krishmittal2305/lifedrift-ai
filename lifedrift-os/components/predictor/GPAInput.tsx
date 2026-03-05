'use client'

import { MOOD_COLORS } from '@/lib/constants'
import { useOSStore } from '@/store/useOSStore'

interface Props {
  value: number
  onChange: (v: number) => void
}

export function GPAInput({ value, onChange }: Props) {
  const { mood } = useOSStore()
  const moodColor = MOOD_COLORS[mood]

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-[9px] tracking-[0.15em] uppercase flex items-center gap-1.5"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'rgba(0,200,255,0.6)' }}
        >
          🎓 GPA
        </span>
        <span
          className="text-sm font-normal tabular-nums"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: moodColor }}
        >
          {value.toFixed(2)}
        </span>
      </div>

      <div className="relative">
        <input
          type="number"
          min={2.24}
          max={4.0}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full bg-white/5 border border-[var(--border)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--cyan)] transition-colors tabular-nums"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: moodColor }}
        />
        <div 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] opacity-30 pointer-events-none"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
        >
          MAX 4.00
        </div>
      </div>

      <div
        className="flex justify-between mt-1 text-[8px] tabular-nums opacity-40"
        style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)' }}
      >
        <span>AVG 3.11</span>
        <span>YOURS {value.toFixed(2)}</span>
      </div>
    </div>
  )
}
