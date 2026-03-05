'use client'

import { useOSStore } from '@/store/useOSStore'
import { predictRemote } from '@/lib/predict'
import { SLIDER_CONFIGS, MOOD_COLORS } from '@/lib/constants'
import { LifestyleSlider } from '@/components/predictor/LifestyleSlider'
import { GPAInput } from '@/components/predictor/GPAInput'
import { PredictButton } from '@/components/predictor/PredictButton'
import { ResultPanel } from '@/components/predictor/ResultPanel'
import { NeuralNetViz } from '@/components/predictor/NeuralNetViz'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NeuralPage() {
  const { sliders, setSlider, setMood, setLastPrediction, addToHistory, pushToast, lastPrediction } = useOSStore()
  const [predicting, setPredicting] = useState(false)

  const handlePredict = async () => {
    setPredicting(true)
    await new Promise((r) => setTimeout(r, 850)) // neural animation time

    const result = await predictRemote(sliders)
    const prediction = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level: result.level,
      confidence: result.confidence,
      probabilities: result.probabilities,
      inputs: { ...sliders },
    }

    setLastPrediction(prediction)
    addToHistory(prediction)
    setMood(result.level)
    setPredicting(false)

    const toastMap = {
      Low:      { type: 'success' as const, title: '✓ OPTIMAL PROFILE', message: result.topFactor },
      Moderate: { type: 'warning' as const, title: '⚠ MODERATE STRESS', message: result.topFactor },
      High:     { type: 'critical' as const, title: '⚠ CRITICAL STRESS DETECTED', message: result.topFactor },
    }
    pushToast(toastMap[result.level])
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 max-w-7xl mx-auto">
      {/* LEFT: Input Terminal */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full mood-glow" style={{ background: 'var(--mood)' }} />
          <h2
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
          >
            Neural Input Terminal
          </h2>
        </div>
        <p
          className="text-[10px] tracking-widest uppercase mb-6 opacity-50"
          style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)' }}
        >
          Configure Lifestyle Parameters
        </p>

        <div className="space-y-5">
          {SLIDER_CONFIGS.filter((c) => c.key !== 'gpa').map((config) => (
            <LifestyleSlider
              key={config.key}
              config={config}
              value={sliders[config.key as keyof typeof sliders] as number}
              onChange={(v) => setSlider(config.key as keyof typeof sliders, v)}
            />
          ))}

          <GPAInput
            value={sliders.gpa}
            onChange={(v) => setSlider('gpa', v)}
          />
        </div>

        <PredictButton onClick={handlePredict} loading={predicting} />
      </GlassPanel>

      {/* RIGHT: Neural Visualization + Results */}
      <div className="flex flex-col gap-5">
        <GlassPanel className="p-6 flex-shrink-0">
          <div className="text-center mb-3">
            <span
              className="text-[9px] tracking-[0.25em] uppercase opacity-50"
              style={{ fontFamily: 'var(--font-orbitron)', color: 'var(--cyan)' }}
            >
              Neural Network Activity
            </span>
          </div>
          <NeuralNetViz predicting={predicting} result={lastPrediction?.level} />
        </GlassPanel>

        <AnimatePresence>
          {lastPrediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResultPanel prediction={lastPrediction} />
            </motion.div>
          )}
        </AnimatePresence>

        {!lastPrediction && (
          <GlassPanel className="p-8 flex flex-col items-center justify-center text-center gap-3 flex-1" style={{ minHeight: 200 }}>
            <div className="text-3xl opacity-30">🧠</div>
            <p
              className="text-[10px] tracking-widest opacity-30"
              style={{ fontFamily: 'var(--font-share-tech-mono)', color: 'var(--cyan)' }}
            >
              AWAITING NEURAL ANALYSIS...
            </p>
            <div
              className="w-1.5 h-4"
              style={{ background: 'var(--cyan)', opacity: 0.4, animation: 'blink 1s infinite' }}
            />
          </GlassPanel>
        )}
      </div>
    </div>
  )
}
