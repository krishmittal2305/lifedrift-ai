'use client'

import { useEffect, useState } from 'react'
import { useOSStore } from '@/store/useOSStore'
import { MOOD_COLORS } from '@/lib/constants'

export function TopBar() {
  const { mood } = useOSStore()
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [neuralLoad, setNeuralLoad] = useState(20)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Neural load fluctuates around a mood-based baseline
  useEffect(() => {
    const base = mood === 'Low' ? 22 : mood === 'Moderate' ? 55 : 88
    const id = setInterval(() => {
      setNeuralLoad(base + (Math.random() - 0.5) * 10)
    }, 800)
    return () => clearInterval(id)
  }, [mood])

  const moodColor = MOOD_COLORS[mood]
  const badgeLabel = mood.toUpperCase() + ' STRESS'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: 'var(--topbar-h)',
        background: 'rgba(6,13,20,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* LEFT: logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: moodColor,
            boxShadow: `0 0 0 0 ${moodColor}`,
            animation: 'pulse-ring 2s infinite',
          }}
        />
        <span
          className="text-sm font-black tracking-widest"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
        >
          LIFE<span style={{ color: moodColor }}>DRIFT</span>
        </span>
        <span
          className="text-[9px] opacity-40 ml-1"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)' }}
        >
          OS v2.1.0
        </span>
      </div>

      {/* CENTER: clock */}
      <div className="text-center">
        <div
          className="text-sm font-normal tracking-widest tabular-nums"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)', textShadow: '0 0 10px var(--cyan)' }}
        >
          {time}
        </div>
        <div
          className="text-[9px] opacity-50 mt-0.5 tracking-widest"
          style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--cyan)' }}
        >
          {date}
        </div>
      </div>

      {/* RIGHT: stress badge + neural load */}
      <div className="flex items-center gap-4">
        {/* Neural load */}
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--border-bright)' }}
          >
            NEURAL
          </span>
          <div
            className="w-16 h-1 rounded-full overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${neuralLoad}%`, background: `linear-gradient(90deg, ${moodColor}, var(--cyan))` }}
            />
          </div>
          <span
            className="text-[9px] tabular-nums"
            style={{ fontFamily: 'var(--font-share-tech-mono)', color: moodColor, minWidth: 28 }}
          >
            {Math.round(neuralLoad)}%
          </span>
        </div>

        {/* Stress badge */}
        <div
          className="px-3 py-1 rounded text-[9px] font-black tracking-widest"
          style={{
            fontFamily: 'var(--font-orbitron)',
            color: moodColor,
            background: `color-mix(in srgb, ${moodColor} 8%, transparent)`,
            border: `1px solid color-mix(in srgb, ${moodColor} 35%, transparent)`,
            transition: 'all 0.8s ease',
          }}
        >
          ● {badgeLabel}
        </div>
      </div>
    </header>
  )
}
