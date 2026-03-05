'use client'

import { motion } from 'framer-motion'

interface Props { confidence: number, color: string }

export function ConfidenceRing({ confidence, color }: Props) {
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (confidence / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/5">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth="4"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-lg font-black leading-none"
            style={{ fontFamily: 'var(--font-share-tech-mono)', color }}
          >
            {Math.round(confidence)}%
          </span>
          <span 
            className="text-[6px] tracking-widest uppercase opacity-40 mt-0.5"
            style={{ fontFamily: 'var(--font-orbitron)', color }}
          >
            CONFIDENCE
          </span>
        </div>
      </div>
    </div>
  )
}
