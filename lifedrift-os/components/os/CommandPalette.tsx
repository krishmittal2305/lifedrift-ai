'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useOSStore } from '@/store/useOSStore'
import { MODULE_META } from '@/lib/constants'
import type { ModuleId } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

const COMMANDS = [
  ...Object.entries(MODULE_META).map(([id, m]) => ({
    id: `nav-${id}`, label: `Open ${m.label} Module`, icon: m.icon,
    category: 'NAVIGATE', action: (router: ReturnType<typeof useRouter>, store: ReturnType<typeof useOSStore.getState>) => {
      store.setActiveModule(id as ModuleId)
      router.push(m.path)
    }
  })),
  { id: 'reset', label: 'Reset All Sliders to Average', icon: '↺', category: 'ACTION',
    action: (_: unknown, store: ReturnType<typeof useOSStore.getState>) => store.resetSliders() },
  { id: 'clear', label: 'Clear Prediction History', icon: '🗑', category: 'ACTION',
    action: (_: unknown, store: ReturnType<typeof useOSStore.getState>) => store.clearHistory() },
]

export function CommandPalette() {
  const router = useRouter()
  const { paletteOpen, setPaletteOpen } = useOSStore()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (paletteOpen) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [paletteOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!paletteOpen) return
      if (e.key === 'ArrowDown') setSelected((s) => Math.min(s + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setSelected((s) => Math.max(s - 1, 0))
      if (e.key === 'Enter' && filtered[selected]) {
        filtered[selected].action(router, useOSStore.getState())
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [paletteOpen, filtered, selected, router, setPaletteOpen])

  return (
    <AnimatePresence>
      {paletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(2,4,8,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[201] glass-panel overflow-hidden"
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span style={{ color: 'var(--border-bright)', fontSize: 14 }}>⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
                placeholder="Search modules and commands..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--cyan)', caretColor: 'var(--cyan)' }}
              />
              <kbd
                className="text-[9px] px-1.5 py-0.5 rounded opacity-30"
                style={{ fontFamily: 'var(--font-share-tech-mono)', border: '1px solid var(--border)', color: 'var(--cyan)' }}
              >
                ESC
              </kbd>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => { cmd.action(router, useOSStore.getState()); setPaletteOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={{
                    background: i === selected ? 'rgba(0,200,255,0.08)' : 'transparent',
                    borderLeft: i === selected ? '2px solid var(--cyan)' : '2px solid transparent',
                  }}
                >
                  <span className="text-base">{cmd.icon}</span>
                  <span
                    className="flex-1 text-sm"
                    style={{ fontFamily: 'var(--font-rajdhani)', color: i === selected ? 'var(--cyan)' : 'rgba(200,240,255,0.5)' }}
                  >
                    {cmd.label}
                  </span>
                  <span
                    className="text-[8px] tracking-widest opacity-30"
                    style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
                  >
                    {cmd.category}
                  </span>
                </button>
              ))}
            </div>
            <div
              className="px-4 py-2 text-[9px] opacity-30 flex gap-4"
              style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)', borderTop: '1px solid var(--border)' }}
            >
              <span>↑↓ navigate</span>
              <span>↵ execute</span>
              <span>esc dismiss</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
