'use client'

import { useOSStore } from '@/store/useOSStore'
import { MOOD_COLORS } from '@/lib/constants'
import { RadarChart } from '@/components/charts/RadarChart'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { motion } from 'framer-motion'

export default function RadarPage() {
  const { sliders, mood } = useOSStore()
  const moodColor = MOOD_COLORS[mood]

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassPanel className="p-6 flex flex-col items-center justify-center min-h-[500px]">
          <h2 
            className="text-xs tracking-[0.4em] uppercase mb-8"
            style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
          >
            Biometric Lifestyle Axis
          </h2>
          <RadarChart values={sliders} color={moodColor} />
          <div className="mt-8 text-[10px] tracking-widest opacity-30 font-mono text-center max-w-xs">
            REAL-TIME LIFESTYLE DEFICIT ANALYSIS ENGINE ACTIVE. MONITORING 6 KEY PARAMETERS.
          </div>
        </GlassPanel>

        <div className="space-y-5">
          <GlassPanel className="p-6">
            <h3 
              className="text-xs tracking-[0.2em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
            >
              Axis Optimization Logic
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Study Axis', info: 'Primary stress driver. High study density detected.' },
                { label: 'Sleep Axis', info: 'Restorative buffer. Essential for neural recovery.' },
                { label: 'Social Axis', info: 'Oxytocin modulator. Reduces academic isolation.' }
              ].map((axis, i) => (
                <motion.div
                  key={axis.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/5"
                >
                  <div 
                    className="text-[9px] font-black tracking-widest uppercase mb-1"
                    style={{ fontFamily: 'var(--font-orbitron)', color: moodColor }}
                  >
                    {axis.label}
                  </div>
                  <p 
                    className="text-xs opacity-60"
                    style={{ fontFamily: 'var(--font-rajdhani)', color: 'rgba(200,240,255,0.8)' }}
                  >
                    {axis.info}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-8 text-center bg-[var(--cyan)]/5 border-[var(--cyan)]/20">
            <div className="text-3xl mb-4">⚖️</div>
            <div 
              className="text-sm font-black tracking-widest uppercase mb-2"
              style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
            >
              System Balance Score
            </div>
            <div 
              className="text-5xl font-black mb-2"
              style={{ fontFamily: 'var(--font-share-tech-mono)', color: moodColor }}
            >
              {Math.round(82 + (mood === 'Low' ? 12 : mood === 'Moderate' ? -8 : -35))}%
            </div>
            <p 
              className="text-[10px] opacity-40 uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
            >
              Optimal Alignment Predicted
            </p>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
