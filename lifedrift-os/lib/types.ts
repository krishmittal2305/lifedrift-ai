export type StressLevel = 'Low' | 'Moderate' | 'High'
export type SliderValues = Record<string, number>
export type ModuleId = 'neural' | 'matrix' | 'radar' | 'chrono' | 'logs' | 'system'

export interface SliderConfig {
  key: string
  label: string
  icon: string
  min: number
  max: number
  step: number
  avg: number         // dataset average
  unit: string
}

export interface Archetype {
  id: string
  name: string
  emoji: string
  description: string
  color: string
}

export interface FeatureImportance {
  feature: string
  label: string
  icon: string
  importance: number  // 0–1
  avgValue: number
}
