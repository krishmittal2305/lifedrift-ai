import type { SliderConfig, FeatureImportance } from './types'

export const SLIDER_CONFIGS: SliderConfig[] = [
  { key: 'study',    label: 'Study Hours',         icon: '📚', min: 5,    max: 10,  step: 0.1, avg: 7.5,  unit: 'h' },
  { key: 'extra',    label: 'Extracurricular',      icon: '🎭', min: 0,    max: 4,   step: 0.1, avg: 2.0,  unit: 'h' },
  { key: 'sleep',    label: 'Sleep Hours',          icon: '😴', min: 5,    max: 10,  step: 0.1, avg: 7.5,  unit: 'h' },
  { key: 'social',   label: 'Social Hours',         icon: '💬', min: 0,    max: 6,   step: 0.1, avg: 2.7,  unit: 'h' },
  { key: 'physical', label: 'Physical Activity',    icon: '🏃', min: 0,    max: 13,  step: 0.1, avg: 4.3,  unit: 'h' },
  { key: 'gpa',      label: 'GPA',                  icon: '🎓', min: 2.24, max: 4.0, step: 0.01, avg: 3.11, unit: '' },
]

export const FEATURE_IMPORTANCES: FeatureImportance[] = [
  { feature: 'study',    label: 'Study Hours',      icon: '📚', importance: 0.6452, avgValue: 7.5  },
  { feature: 'sleep',    label: 'Sleep Hours',      icon: '😴', importance: 0.1674, avgValue: 7.5  },
  { feature: 'gpa',      label: 'GPA',              icon: '🎓', importance: 0.1103, avgValue: 3.11 },
  { feature: 'physical', label: 'Physical Activity',icon: '🏃', importance: 0.0419, avgValue: 4.3  },
  { feature: 'social',   label: 'Social Hours',     icon: '💬', importance: 0.0211, avgValue: 2.7  },
  { feature: 'extra',    label: 'Extracurricular',  icon: '🎭', importance: 0.0141, avgValue: 2.0  },
]

export const MOOD_COLORS = {
  Low:      '#00ffd5',
  Moderate: '#ffaa00',
  High:     '#ff2d4b',
}

export const MODULE_META = {
  neural:  { icon: '🧠', label: 'NEURAL',  path: '/neural'  },
  matrix:  { icon: '📊', label: 'MATRIX',  path: '/matrix'  },
  radar:   { icon: '🌐', label: 'RADAR',   path: '/radar'   },
  chrono:  { icon: '📅', label: 'CHRONO',  path: '/chrono'  },
  logs:    { icon: '📜', label: 'LOGS',    path: '/logs'    },
  system:  { icon: '⚙️', label: 'SYSTEM',  path: '/system'  },
}
