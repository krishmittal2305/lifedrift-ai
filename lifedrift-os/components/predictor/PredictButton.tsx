'use client'

import { MOOD_COLORS } from '@/lib/constants'
import { useOSStore } from '@/store/useOSStore'
import { motion } from 'framer-motion'

interface Props {
  onClick: () => void
  loading: boolean
}

export function PredictButton({ onClick, loading }: Props) {
  const { mood } = useOSStore()
  const moodColor = MOOD_COLORS[mood]

  return (
    <div className="relative mt-8 group">
      <motion.button
        onClick={onClick}
        disabled={loading}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        className="w-full relative overflow-hidden py-4 rounded-xl font-bold tracking-[0.3em] uppercase transition-all duration-300"
        style={{
          fontFamily: 'var(--font-orbitron)',
          background: `color-mix(in srgb, ${moodColor} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${moodColor} 35%, transparent)`,
          color: moodColor,
          boxShadow: `0 0 20px color-mix(in srgb, ${moodColor} 8%, transparent)`,
        }}
      >
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
          style={{ animation: 'shimmer 3s linear infinite' }}
        />

        <div className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <div 
                className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
              />
              <span className="opacity-70">Processing Neural Signal...</span>
            </>
          ) : (
            <>
              <span>Initiate Stress Prediction</span>
              <span className="opacity-40 font-normal">››</span>
            </>
          )}
        </div>
      </motion.button>

      {/* Reflection glow */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 opacity-20 pointer-events-none blur-2xl transition-all duration-300 group-hover:opacity-40"
        style={{ background: moodColor }}
      />
    </div>
  )
}
