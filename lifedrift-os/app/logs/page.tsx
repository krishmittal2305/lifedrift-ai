'use client'

import { useState } from 'react'
import { useOSStore } from '@/store/useOSStore'
import type { StressLevel } from '@/lib/types'
import { MOOD_COLORS } from '@/lib/constants'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { motion, AnimatePresence } from 'framer-motion'

const FILTERS: (StressLevel | 'ALL')[] = ['ALL', 'Low', 'Moderate', 'High']

export default function LogsPage() {
  const { history, clearHistory } = useOSStore()
  const [filter, setFilter] = useState<StressLevel | 'ALL'>('ALL')

  const filtered = filter === 'ALL' ? history : history.filter((h) => h.level === filter)

  return (
    <div className="max-w-4xl space-y-5 mx-auto">
      <GlassPanel className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <h2
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
          >
            Prediction Audit Log
          </h2>
          <div className="flex items-center gap-3">
            {/* Filters */}
            <div className="flex gap-1 overflow-x-auto">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1 rounded-full text-[8px] tracking-widest uppercase transition-all whitespace-nowrap"
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    background: filter === f
                      ? f === 'ALL' ? 'rgba(0,200,255,0.15)' : `color-mix(in srgb, ${MOOD_COLORS[f as StressLevel]} 12%, transparent)`
                      : 'transparent',
                    border: `1px solid ${filter === f
                      ? f === 'ALL' ? 'var(--border-bright)' : MOOD_COLORS[f as StressLevel]
                      : 'var(--border)'
                    }`,
                    color: filter === f
                      ? f === 'ALL' ? 'var(--cyan)' : MOOD_COLORS[f as StressLevel]
                      : 'rgba(0,200,255,0.4)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[8px] tracking-widest uppercase opacity-30 hover:opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--stress-high)' }}
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Log entries */}
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-2 py-16 text-center"
                style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'rgba(0,200,255,0.25)', fontSize: 11 }}
              >
                <span className="text-4xl mb-4">📜</span>
                AWAITING FIRST ANALYSIS
                <span style={{ animation: 'blink 1s infinite' }}>_</span>
              </motion.div>
            ) : (
              filtered.map((entry, i) => {
                const color = MOOD_COLORS[entry.level]
                const time = entry.timestamp.toLocaleTimeString('en-US', { hour12: false })
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] hover:bg-white/5 transition-colors group"
                    style={{
                      fontFamily: 'var(--font-share-tech-mono)',
                      border: '1px solid rgba(0,200,255,0.04)',
                    }}
                  >
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span style={{ color: 'rgba(0,200,255,0.3)' }}>{time}</span>
                      <span style={{ color: 'rgba(0,200,255,0.2)' }}>›</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest flex-shrink-0"
                        style={{
                          fontFamily: 'var(--font-orbitron)',
                          color,
                          background: `color-mix(in srgb, ${color} 10%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                        }}
                      >
                        {entry.level.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ color: 'rgba(0,200,255,0.5)', flex: 1 }} className="truncate">
                      study:{entry.inputs.study.toFixed(1)}h  sleep:{entry.inputs.sleep.toFixed(1)}h  gpa:{entry.inputs.gpa.toFixed(2)}
                    </span>
                    {/* Confidence bar */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto sm:ml-0">
                      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${entry.confidence}%` }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                      <span style={{ color, minWidth: 28 }}>{entry.confidence.toFixed(0)}%</span>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>

        {/* Session stats */}
        {history.length > 0 && (
          <div
            className="mt-6 pt-4 grid grid-cols-3 gap-4 text-center"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {[
              { label: 'TOTAL', value: history.length },
              { label: 'HIGH', value: history.filter((h) => h.level === 'High').length, color: 'var(--stress-high)' },
              { label: 'AVG CONF', value: `${Math.round(history.reduce((a, h) => a + h.confidence, 0) / history.length)}%` },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl font-black"
                  style={{ fontFamily: 'var(--font-orbitron)', color: stat.color || 'var(--cyan)' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[8px] tracking-widest opacity-40 mt-0.5"
                  style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
