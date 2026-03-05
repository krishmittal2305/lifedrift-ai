'use client'

import { GlassPanel } from '@/components/ui/GlassPanel'
import { motion } from 'framer-motion'

export default function ChronoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <GlassPanel className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6 opacity-30">📅</div>
        <h2 
          className="text-xl font-black tracking-[0.4em] uppercase mb-4"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
        >
          Temporal Stress Planner
        </h2>
        <p 
          className="text-sm opacity-50 max-w-md"
          style={{ fontFamily: 'var(--font-rajdhani)', color: 'rgba(200,240,255,0.8)' }}
        >
          24-hour activity forecasting. Assign your planned blocks to visualize intra-day stress spikes and optimize your recovery windows.
        </p>
        <div className="mt-8 grid grid-cols-6 gap-2 w-full max-w-md">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ delay: i * 0.02 }}
              className="aspect-square rounded bg-[var(--cyan)] flex items-center justify-center text-[7px] font-mono"
            >
              {String(i).padStart(2, '0')}
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-[10px] tracking-widest opacity-30 font-mono">
          INITIALIZING 24H FORECASTING ENGINE...
        </div>
      </GlassPanel>
    </div>
  )
}
