'use client'

import { useOSStore } from '@/store/useOSStore'
import { FEATURE_IMPORTANCES } from '@/lib/constants'
import { detectArchetype } from '@/lib/archetypes'
import { ImportanceBars } from '@/components/charts/ImportanceBars'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { motion } from 'framer-motion'

export default function MatrixPage() {
  const { sliders } = useOSStore()
  const archetype = detectArchetype(sliders)

  return (
    <div className="max-w-7xl space-y-5 mx-auto">
      {/* Header chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {FEATURE_IMPORTANCES.map((f, i) => (
          <motion.div
            key={f.feature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,200,255,0.2)' }}
            className="glass-panel p-4 text-center"
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <div
              className="text-2xl font-black leading-none"
              style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
            >
              {(f.importance * 100).toFixed(1)}%
            </div>
            <div
              className="text-[8px] mt-1 tracking-widest uppercase opacity-50"
              style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
            >
              {f.label.toUpperCase()}
            </div>
            {/* Mini bar */}
            <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${f.importance * 100}%` }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--cyan), var(--teal))',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Feature bars */}
        <GlassPanel className="p-6">
          <h3
            className="text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
          >
            Feature Importance Matrix
          </h3>
          <ImportanceBars features={FEATURE_IMPORTANCES} currentValues={sliders} />
        </GlassPanel>

        {/* Archetype detector */}
        <GlassPanel className="p-6">
          <h3
            className="text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
          >
            Stress Archetype Detector
          </h3>
          <motion.div
            key={archetype.id}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl p-6 text-center h-full flex flex-col justify-center"
            style={{
              background: `radial-gradient(ellipse at center, color-mix(in srgb, ${archetype.color} 8%, transparent), transparent)`,
              border: `1px solid color-mix(in srgb, ${archetype.color} 25%, transparent)`,
            }}
          >
            <div className="text-6xl mb-4">{archetype.emoji}</div>
            <div
              className="text-2xl font-black tracking-widest"
              style={{ fontFamily: 'var(--font-orbitron)', color: archetype.color }}
            >
              {archetype.name}
            </div>
            <p
              className="mt-3 text-sm leading-relaxed opacity-70 mb-4"
              style={{ fontFamily: 'var(--font-rajdhani)', color: 'rgba(200,240,255,0.8)' }}
            >
              {archetype.description}
            </p>
            <div
              className="p-3 rounded-lg text-xs"
              style={{
                background: 'rgba(0,200,255,0.05)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-share-tech-mono)',
                color: archetype.color,
              }}
            >
              {'>> '}{archetype.tip}
            </div>
          </motion.div>
        </GlassPanel>
      </div>

      {/* Terminal data table */}
      <GlassPanel className="p-6">
        <h3
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
        >
          Live Parameter Readout
        </h3>
        <div
          className="text-[10px] overflow-x-auto"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'rgba(0,200,255,0.5)' }}
        >
          <div
            className="grid grid-cols-5 pb-2 mb-2 min-w-[600px]"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {['FEATURE', 'IMPORTANCE', 'DATASET AVG', 'YOUR VALUE', 'DELTA'].map((h) => (
              <span key={h} className="tracking-widest uppercase text-[8px]">{h}</span>
            ))}
          </div>
          {FEATURE_IMPORTANCES.map((f, i) => {
            const val = sliders[f.feature as keyof typeof sliders] as number
            const delta = val - f.avgValue
            return (
              <motion.div
                key={f.feature}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-5 py-2 hover:bg-white/5 rounded transition-colors min-w-[600px]"
                style={{ borderBottom: '1px solid rgba(0,200,255,0.04)' }}
              >
                <span style={{ color: 'rgba(200,240,255,0.8)' }}>{f.icon} {f.label}</span>
                <span style={{ color: 'var(--teal)' }}>{(f.importance * 100).toFixed(2)}%</span>
                <span>{f.avgValue.toFixed(1)}</span>
                <span style={{ color: 'var(--cyan)' }}>{val.toFixed(1)}</span>
                <span style={{ color: delta > 0 ? 'var(--stress-high)' : 'var(--stress-low)' }}>
                  {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </GlassPanel>
    </div>
  )
}
