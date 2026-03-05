'use client'

import { useEffect } from 'react'
import { useOSStore } from '@/store/useOSStore'
import { BootSequence } from './BootSequence'
import { TopBar } from './TopBar'
import { SidebarDock } from './SidebarDock'
import { StatusBar } from './StatusBar'
import { ParticleField } from './ParticleField'
import { NotificationToast } from './NotificationToast'
import { CommandPalette } from './CommandPalette'
import { ScanlineOverlay } from '@/components/ui/ScanlineOverlay'
import { AnimatePresence, motion } from 'framer-motion'
import CustomCursor from './CustomCursor'

export function OSShell({ children }: { children: React.ReactNode }) {
  const { booted, setBooted, setPaletteOpen, paletteOpen, mood, activeModule } = useOSStore()

  // Keyboard shortcut: Ctrl+K / Cmd+K → command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(!paletteOpen)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [paletteOpen, setPaletteOpen])

  // Apply critical pulse to body when High stress
  useEffect(() => {
    if (mood === 'High') {
      document.body.style.animation = 'critical-pulse 1.5s ease-in-out 3'
      const timer = setTimeout(() => { document.body.style.animation = '' }, 4500)
      return () => clearTimeout(timer)
    }
  }, [mood])

  return (
    <>
      <CustomCursor />
      <ScanlineOverlay />
      <ParticleField />

      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            className="fixed inset-0 z-[9999]"
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <BootSequence onComplete={() => setBooted(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {booted && (
        <div
          className="fixed inset-0 flex flex-col"
          style={{ background: 'var(--void)' }}
        >
          <TopBar />

          <div className="flex flex-1 overflow-hidden" style={{ marginTop: 'var(--topbar-h)' }}>
            <SidebarDock />

            {/* Main viewport */}
            <main
              className="flex-1 overflow-y-auto overflow-x-hidden relative"
              style={{ marginLeft: 'var(--sidebar-w)', marginBottom: 'var(--statusbar-h)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-full p-6"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          <StatusBar />
        </div>
      )}

      <NotificationToast />
      <CommandPalette />
    </>
  )
}
