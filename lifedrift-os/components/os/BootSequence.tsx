'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BOOT_LINES = [
  { text: 'LIFEDRIFT OS v2.1.0', delay: 0,    style: 'text-[var(--cyan)] font-bold text-xl' },
  { text: 'NEURAL LIFESTYLE ENGINE', delay: 300, style: 'text-[var(--teal)] text-sm' },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 500, style: 'text-[var(--border-bright)] text-xs' },
  { text: '[ LOADING STRESS INFERENCE MODULE ].............. OK', delay: 700,  style: 'text-[var(--teal)] text-xs' },
  { text: '[ CALIBRATING RANDOM FOREST (100 TREES) ]........ OK', delay: 950,  style: 'text-[var(--teal)] text-xs' },
  { text: '[ MOUNTING STUDENT DATASET (2000 RECORDS) ]...... OK', delay: 1150, style: 'text-[var(--teal)] text-xs' },
  { text: '[ INITIALIZING BIOMETRIC INTERFACE ]............. OK', delay: 1350, style: 'text-[var(--teal)] text-xs' },
  { text: '[ SCANNING LIFESTYLE PARAMETERS ]................ OK', delay: 1550, style: 'text-[var(--teal)] text-xs' },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 1750, style: 'text-[var(--border-bright)] text-xs' },
  { text: 'SYSTEM READY. WELCOME, STUDENT.',            delay: 1950, style: 'text-[var(--cyan)] font-bold' },
]

interface Props { onComplete: () => void }

export function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Show each line on schedule
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines((prev) => [...prev, i]), line.delay)
    })
    // Animate progress bar
    const interval = setInterval(() => setProgress((p) => Math.min(p + 1.2, 100)), 28)
    // Complete after all lines
    const timeout = setTimeout(onComplete, 3200)
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center scanlines"
      style={{ background: 'var(--void)' }}
      onClick={onComplete}
    >
      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)' }}
      />

      <div className="relative z-10 w-full max-w-2xl px-8 font-mono space-y-1" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
        {BOOT_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.2 }}
            className={line.style}
            style={{
              textShadow: '0 0 8px currentColor',
              display: visibleLines.includes(i) ? 'block' : 'none'
            }}
          >
            {line.text}
            {i === BOOT_LINES.length - 1 && visibleLines.includes(i) && (
              <span className="inline-block w-2 h-4 ml-1 bg-current align-middle" style={{ animation: 'blink 1s infinite' }} />
            )}
          </motion.div>
        ))}

        {/* Progress bar */}
        <div className="mt-6 pt-2">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--teal), var(--cyan))',
                boxShadow: '0 0 12px var(--cyan)',
                width: `${progress}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="mt-1 text-[10px] text-right" style={{ color: 'var(--teal)', fontFamily: 'var(--font-share-tech-mono)' }}>
            {Math.round(progress)}%
          </div>
        </div>

        <div className="mt-4 text-[9px] opacity-40" style={{ color: 'var(--cyan)' }}>
          PRESS ANY KEY TO SKIP
        </div>
      </div>
    </div>
  )
}
