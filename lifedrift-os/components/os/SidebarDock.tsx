'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useOSStore } from '@/store/useOSStore'
import { MODULE_META, MOOD_COLORS } from '@/lib/constants'
import type { ModuleId } from '@/lib/types'
import { motion } from 'framer-motion'

const MODULES = Object.entries(MODULE_META) as [ModuleId, typeof MODULE_META[keyof typeof MODULE_META]][]

export function SidebarDock() {
  const router = useRouter()
  const pathname = usePathname()
  const { setActiveModule, mood } = useOSStore()
  const moodColor = MOOD_COLORS[mood]

  const navigate = (id: ModuleId, path: string) => {
    setActiveModule(id)
    router.push(path)
  }

  return (
    <aside
      className="fixed left-0 bottom-0 flex flex-col items-center justify-center gap-1 py-4 z-40"
      style={{
        top: 'var(--topbar-h)',
        width: 'var(--sidebar-w)',
        background: 'rgba(6,13,20,0.95)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {MODULES.map(([id, meta]) => {
        const isActive = pathname === meta.path || (pathname === '/' && id === 'neural')
        return (
          <motion.button
            key={id}
            onClick={() => navigate(id, meta.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all duration-200"
            style={{
              background: isActive ? `color-mix(in srgb, ${moodColor} 10%, transparent)` : 'transparent',
              borderLeft: isActive ? `3px solid ${moodColor}` : '3px solid transparent',
              boxShadow: isActive ? `inset 0 0 20px color-mix(in srgb, ${moodColor} 8%, transparent)` : 'none',
              opacity: isActive ? 1 : 0.45,
            }}
          >
            {/* Active scan line animation */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                initial={false}
              >
                <div
                  className="absolute left-0 right-0 h-px opacity-30"
                  style={{
                    background: moodColor,
                    animation: 'scan-line 2s linear infinite',
                  }}
                />
              </motion.div>
            )}

            <span className="text-lg leading-none">{meta.icon}</span>
            <span
              className="text-[7px] tracking-widest leading-none"
              style={{
                fontFamily: 'var(--font-orbitron)',
                color: isActive ? moodColor : 'var(--border-bright)',
              }}
            >
              {meta.label}
            </span>
          </motion.button>
        )
      })}

      {/* Divider */}
      <div className="w-8 h-px my-1" style={{ background: 'var(--border)' }} />

      {/* Life signal pulse avatar */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <div className="relative w-10 h-10 flex items-center justify-center">
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border"
              style={{
                width: ring * 12 + 4,
                height: ring * 12 + 4,
                borderColor: moodColor,
                opacity: 0.15 / ring,
                animation: `pulse-ring ${1.2 + ring * 0.4}s ease-out infinite`,
                animationDelay: `${ring * 0.2}s`,
              }}
            />
          ))}
          <div
            className="w-6 h-6 rounded-full relative z-10"
            style={{ background: moodColor, boxShadow: `0 0 12px ${moodColor}` }}
          />
        </div>
        <span
          className="text-[7px] tracking-widest"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--border-bright)' }}
        >
          YOU
        </span>
      </div>
    </aside>
  )
}
