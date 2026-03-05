'use client'

import { motion } from 'framer-motion'
import type { FeatureImportance } from '@/lib/types'
import type { SliderValues } from '@/store/useOSStore'
import { MOOD_COLORS } from '@/lib/constants'

interface Props {
  features: FeatureImportance[]
  currentValues: SliderValues
}

export function ImportanceBars({ features, currentValues }: Props) {
  return (
    <div className="space-y-6">
      {features.map((f, i) => {
        const val = currentValues[f.feature] as number
        const pctOfMax = (val / 10) * 100 // simplified
        
        return (
          <div key={f.feature} className="space-y-1.5">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="text-xl">{f.icon}</span>
                <div className="flex flex-col">
                  <span 
                    className="text-[10px] font-black tracking-widest uppercase"
                    style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
                  >
                    {f.label}
                  </span>
                  <span 
                    className="text-[8px] opacity-40 uppercase"
                    style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
                  >
                    WEIGHT: {(f.importance * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span 
                  className="text-lg font-black leading-none"
                  style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)' }}
                >
                  {val.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${f.importance * 100}%` }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full relative"
                style={{ 
                  background: `linear-gradient(90deg, transparent, var(--cyan))`,
                  boxShadow: '0 0 10px var(--cyan)'
                }}
              >
                {/* Particle trail effect */}
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full blur-md"
                  style={{ background: 'var(--cyan)' }}
                />
              </motion.div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
