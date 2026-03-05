'use client'

import { useEffect, useState } from 'react'
import { useOSStore } from '@/store/useOSStore'
import { MOOD_COLORS } from '@/lib/constants'

export function StatusBar() {
  const { sliders, mood, history, sessionStart } = useOSStore()
  const [sessionTime, setSessionTime] = useState('00:00:00')
  const moodColor = MOOD_COLORS[mood]

  const neuralActivity = mood === 'Low' ? 22 : mood === 'Moderate' ? 55 : 88

  // Live session timer
  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000)
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
      const s = String(elapsed % 60).padStart(2, '0')
      setSessionTime(`${h}:${m}:${s}`)
    }, 1000)
    return () => clearInterval(id)
  }, [sessionStart])

  const tickerContent = [
    `STUDY: ${sliders.study.toFixed(1)}h`,
    `SLEEP: ${sliders.sleep.toFixed(1)}h`,
    `GPA: ${sliders.gpa.toFixed(2)}`,
    `PHYSICAL: ${sliders.physical.toFixed(1)}h`,
    `SOCIAL: ${sliders.social.toFixed(1)}h`,
    `EXTRA: ${sliders.extra.toFixed(1)}h`,
  ].join('  ·  ')

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 gap-4"
      style={{
        height: 'var(--statusbar-h)',
        background: 'rgba(6,13,20,0.95)',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--font-share-tech-mono)',
        fontSize: 9,
      }}
    >
      {/* Live ticker — scrolling lifestyle values */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="whitespace-nowrap"
          style={{
            color: 'rgba(0,200,255,0.5)',
            animation: 'shimmer 12s linear infinite',
          }}
        >
          {tickerContent}  ·  {tickerContent}
        </div>
      </div>

      {/* Neural activity */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span style={{ color: 'rgba(0,200,255,0.4)' }}>NEURAL ACTIVITY:</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-3 rounded-sm transition-all duration-500"
              style={{
                background: i < neuralActivity / 10
                  ? moodColor
                  : 'var(--border)',
                opacity: i < neuralActivity / 10 ? 0.9 : 0.3,
              }}
            />
          ))}
        </div>
        <span style={{ color: moodColor }}>{neuralActivity}%</span>
      </div>

      {/* Session info */}
      <div className="flex items-center gap-3 flex-shrink-0" style={{ color: 'rgba(0,200,255,0.4)' }}>
        <span>SESSION: {sessionTime}</span>
        <span style={{ color: moodColor }}>PREDICTIONS: {history.length}</span>
      </div>
    </footer>
  )
}
