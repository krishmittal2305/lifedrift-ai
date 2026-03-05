'use client'

import { useOSStore } from '@/store/useOSStore'
import { AnimatePresence, motion } from 'framer-motion'

const TYPE_CONFIG = {
  success:  { color: 'var(--teal)',          icon: '✓' },
  warning:  { color: 'var(--amber)',          icon: '⚠' },
  critical: { color: 'var(--stress-high)',    icon: '⚠' },
  info:     { color: 'var(--cyan)',           icon: 'ℹ' },
}

export function NotificationToast() {
  const { toasts, removeToast } = useOSStore()

  return (
    <div className="fixed top-16 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const cfg = TYPE_CONFIG[toast.type as keyof typeof TYPE_CONFIG]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto w-72 glass-panel overflow-hidden relative"
              style={{ borderColor: `color-mix(in srgb, ${cfg.color} 25%, transparent)` }}
            >
              {/* Progress drain bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5"
                style={{ background: cfg.color }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5"
                style={{ background: cfg.color }}
              />
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: cfg.color, fontSize: 12 }}>{cfg.icon}</span>
                    <span
                      className="text-[9px] font-black tracking-widest"
                      style={{ fontFamily: 'var(--font-orbitron)', color: cfg.color }}
                    >
                      {toast.title}
                    </span>
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-xs opacity-30 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--cyan)' }}
                  >
                    ×
                  </button>
                </div>
                <p
                  className="text-xs leading-relaxed opacity-60"
                  style={{ fontFamily: 'var(--font-rajdhani)', color: 'rgba(200,240,255,0.8)' }}
                >
                  {toast.message}
                </p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
