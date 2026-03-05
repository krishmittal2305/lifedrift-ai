'use client'

import { motion } from 'framer-motion'
import type { Prediction } from '@/store/useOSStore'
import { MOOD_COLORS } from '@/lib/constants'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ConfidenceRing } from '@/components/charts/ConfidenceRing'
import { ProbabilityBars } from '@/components/charts/ProbabilityBars'
import { predict } from '@/lib/predict'

interface Props { prediction: Prediction }

export function ResultPanel({ prediction }: Props) {
  const { level, confidence, probabilities, inputs } = prediction
  const color = MOOD_COLORS[level]
  const fullResult = predict(inputs) // get recs

  return (
    <GlassPanel className="p-6" style={{ borderColor: `color-mix(in srgb, ${color} 25%, transparent)` }}>
      {/* Stress level display */}
      <div
        className="text-center py-6 mb-4 rounded-xl relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at center, color-mix(in srgb, ${color} 8%, transparent), transparent 70%)`,
          border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
        }}
      >
        <motion.div
          initial={{ scale: 0.3, letterSpacing: '0.5em' }}
          animate={{ scale: 1, letterSpacing: '-0.02em' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl font-black leading-none"
          style={{
            fontFamily: 'var(--font-orbitron)',
            color,
            textShadow: `0 0 40px ${color}, 0 0 80px color-mix(in srgb, ${color} 40%, transparent)`,
          }}
        >
          {level.toUpperCase()}
        </motion.div>
        <div
          className="text-sm mt-1 opacity-50 tracking-widest"
          style={{ fontFamily: 'var(--font-orbitron)', color }}
        >
          STRESS LEVEL
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfidenceRing confidence={confidence} color={color} />
        <ProbabilityBars probabilities={probabilities} />
      </div>

      {/* Recommendations */}
      <div className="space-y-2 mt-4">
        <div
          className="text-[9px] tracking-widest uppercase mb-2 opacity-50"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
        >
          Recommendations
        </div>
        {fullResult.recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-start gap-2 p-2 rounded-lg text-xs"
            style={{
              background: 'rgba(0,200,255,0.04)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-rajdhani)',
              color: 'rgba(200,240,255,0.7)',
            }}
          >
            <span style={{ color }}>{'>>'}</span>
            {rec}
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  )
}
