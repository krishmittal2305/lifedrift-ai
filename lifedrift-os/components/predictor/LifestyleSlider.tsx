'use client'

import type { SliderConfig } from '@/lib/types'
import { MOOD_COLORS } from '@/lib/constants'
import { useOSStore } from '@/store/useOSStore'

interface Props {
  config: SliderConfig
  value: number
  onChange: (v: number) => void
}

export function LifestyleSlider({ config, value, onChange }: Props) {
  const { mood } = useOSStore()
  const moodColor = MOOD_COLORS[mood]
  const pct = ((value - config.min) / (config.max - config.min)) * 100
  const delta = value - config.avg
  const deltaStr = delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-[9px] tracking-[0.15em] uppercase flex items-center gap-1.5"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'rgba(0,200,255,0.6)' }}
        >
          {config.icon} {config.label}
        </span>
        <span
          className="text-sm font-normal tabular-nums"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: moodColor }}
        >
          {value.toFixed(1)}{config.unit}
        </span>
      </div>

      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{
          background: `linear-gradient(to right, ${moodColor} ${pct}%, var(--border) ${pct}%)`,
          transition: 'background 0.1s',
        }}
      />

      <div
        className="flex justify-between mt-1 text-[8px] tabular-nums opacity-40"
        style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)' }}
      >
        <span>AVG {config.avg}{config.unit}</span>
        <span>YOURS {value.toFixed(1)}{config.unit}</span>
        <span style={{ color: delta > 0 ? 'var(--stress-high)' : 'var(--stress-low)' }}>
          Δ {deltaStr}{config.unit}
        </span>
      </div>
    </div>
  )
}
