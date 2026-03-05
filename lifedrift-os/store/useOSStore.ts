import { create } from 'zustand'

export type StressLevel = 'Low' | 'Moderate' | 'High'
export type ModuleId = 'neural' | 'matrix' | 'radar' | 'chrono' | 'logs' | 'system'

export type SliderValues = Record<string, number>

export interface Prediction {
  id: string
  timestamp: Date
  level: StressLevel
  confidence: number
  probabilities: Record<StressLevel, number>
  inputs: SliderValues
}

export interface Toast {
  id: string
  type: 'success' | 'warning' | 'critical' | 'info'
  title: string
  message: string
}

interface OSStore {
  // Boot
  booted: boolean
  setBooted: (v: boolean) => void

  // Active module
  activeModule: ModuleId
  setActiveModule: (m: ModuleId) => void

  // Stress mood
  mood: StressLevel
  setMood: (m: StressLevel) => void

  // Slider state (shared across predictor + other modules)
  sliders: SliderValues
  setSlider: (key: keyof SliderValues, val: number) => void
  resetSliders: () => void

  // Last prediction
  lastPrediction: Prediction | null
  setLastPrediction: (p: Prediction) => void

  // History
  history: Prediction[]
  addToHistory: (p: Prediction) => void
  clearHistory: () => void

  // Toasts
  toasts: Toast[]
  pushToast: (t: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  // Command palette
  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void

  // Session timer
  sessionStart: number
}

const DEFAULT_SLIDERS: SliderValues = {
  study: 7.5, extra: 2.0, sleep: 7.5,
  social: 2.7, physical: 4.3, gpa: 3.11
}

export const useOSStore = create<OSStore>((set, get) => ({
  booted: false,
  setBooted: (v) => set({ booted: v }),

  activeModule: 'neural',
  setActiveModule: (m) => set({ activeModule: m }),

  mood: 'Low',
  setMood: (m) => {
    set({ mood: m })
    // Update CSS variable for OS-wide mood color
    const colors: Record<StressLevel, string> = {
      Low: '#00ffd5', Moderate: '#ffaa00', High: '#ff2d4b'
    }
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--mood', colors[m])
    }
  },

  sliders: DEFAULT_SLIDERS,
  setSlider: (key, val) =>
    set((s) => ({ sliders: { ...s.sliders, [key]: val } })),
  resetSliders: () => set({ sliders: DEFAULT_SLIDERS }),

  lastPrediction: null,
  setLastPrediction: (p) => set({ lastPrediction: p }),

  history: [],
  addToHistory: (p) =>
    set((s) => ({ history: [p, ...s.history].slice(0, 50) })),
  clearHistory: () => set({ history: [] }),

  toasts: [],
  pushToast: (t) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => get().removeToast(id), 5000)
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  paletteOpen: false,
  setPaletteOpen: (v) => set({ paletteOpen: v }),

  sessionStart: Date.now(),
}))
