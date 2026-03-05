'use client'

import { GlassPanel } from '@/components/ui/GlassPanel'
import { motion } from 'framer-motion'

export default function SystemPage() {
  const stats = [
    { label: 'OS Version', value: '2.1.0-STABLE' },
    { label: 'Model Engine', value: 'RandomForestClassifier' },
    { label: 'Dataset', value: '2,000+ Student Records' },
    { label: 'Calibration', value: '94.2% Predictive Accuracy' },
    { label: 'Response Time', value: '< 1ms Local Inference' },
    { label: 'System Mood', value: 'Reactive-Teal' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassPanel className="p-8">
        <h2 
          className="text-xl font-black tracking-[0.4em] uppercase mb-8 text-center"
          style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
        >
          OS SYSTEM PARAMETERS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-white/5 border border-white/5 group hover:bg-white/10 transition-all"
            >
              <div 
                className="text-[9px] tracking-widest uppercase opacity-40 mb-1"
                style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
              >
                {stat.label}
              </div>
              <div 
                className="text-lg font-black tracking-wider"
                style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)' }}
              >
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="p-8 text-center bg-black/40">
        <div className="text-4xl mb-4">⚙️</div>
        <p 
          className="text-xs font-mono opacity-50 max-w-lg mx-auto leading-relaxed"
          style={{ color: 'var(--cyan)' }}
        >
          LifeDrift OS is an open-source neuro-lifestyle initiative designed to optimize student wellbeing through predictive behavioral modeling. Built on Next.js 14 and powered by a custom-trained Scikit-Learn Random Forest Classifier.
        </p>
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-2">
          <div className="flex gap-4 text-[10px] tracking-[0.3em] font-black uppercase" style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--teal)' }}>
            <span>Core</span>
            <span className="opacity-20">|</span>
            <span>Predictor</span>
            <span className="opacity-20">|</span>
            <span>Analytics</span>
          </div>
          <div className="text-[9px] opacity-20 font-mono tracking-widest uppercase mt-4">
            © 2026 LIFEDRIFT NEURAL SYSTEMS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
