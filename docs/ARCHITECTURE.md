# Architecture

This document describes the full system architecture of LifeDrift OS.

---

## System Overview

LifeDrift OS is split into three runtime layers:

```
┌─────────────────────────────────────────────────┐
│               Browser (Client)                  │
│   Next.js 14 App Router — React + TypeScript    │
│   Tailwind CSS, Framer Motion, Zustand          │
└────────────────────┬────────────────────────────┘
                     │ HTTP (fetch /api/*)
┌────────────────────▼────────────────────────────┐
│          Serverless Python API (Vercel)          │
│   Flask 3.0 — api/index.py                      │
│   Loads .pkl model + scaler from api/models/    │
└────────────────────┬────────────────────────────┘
                     │ pickle.load()
┌────────────────────▼────────────────────────────┐
│              ML Artifact Layer                   │
│   lifedrift_model.pkl  (RandomForestClassifier) │
│   scaler.pkl            (StandardScaler)        │
└─────────────────────────────────────────────────┘
```

For local development and Docker, the Flask backend runs as a standalone process on port 5000 instead of as a Vercel serverless function.

---

## Repository Layout

```
lifedrift-ai/
│
├── lifedrift-os/                  # Next.js 14 monolith (frontend + serverless API)
│   │
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout — OSShell wrapper, Google Fonts
│   │   ├── page.tsx               # Root redirect → /neural
│   │   ├── globals.css            # CSS custom properties (mood colors, glass, etc.)
│   │   ├── neural/page.tsx        # AI predictor: sliders, neural viz, result panel
│   │   ├── matrix/page.tsx        # Feature importance + stress archetype detector
│   │   ├── radar/page.tsx         # Radar chart lifestyle axis
│   │   ├── logs/page.tsx          # Prediction audit log with filters
│   │   ├── chrono/page.tsx        # 24h temporal planner (stub — contribution welcome)
│   │   └── system/page.tsx        # OS system info panel
│   │
│   ├── api/                       # Vercel Python serverless functions
│   │   ├── index.py               # Flask app: /api/predict, /api/health, /api/stats
│   │   └── models/                # .pkl artifacts bundled with the API
│   │       ├── lifedrift_model.pkl
│   │       ├── scaler.pkl
│   │       └── student_lifestyle_dataset.csv
│   │
│   ├── components/
│   │   ├── os/
│   │   │   └── OSShell.tsx        # Top nav, taskbar, mood-reactive background
│   │   ├── predictor/
│   │   │   ├── LifestyleSlider.tsx
│   │   │   ├── GPAInput.tsx
│   │   │   ├── PredictButton.tsx
│   │   │   ├── ResultPanel.tsx
│   │   │   └── NeuralNetViz.tsx   # Animated SVG neural network
│   │   ├── charts/
│   │   │   ├── RadarChart.tsx     # SVG radar/spider chart
│   │   │   └── ImportanceBars.tsx # Animated feature importance bars
│   │   └── ui/
│   │       └── GlassPanel.tsx     # Reusable glass-morphism card
│   │
│   ├── store/
│   │   └── useOSStore.ts          # Zustand store — sliders, mood, history, toasts
│   │
│   ├── lib/
│   │   ├── predict.ts             # fetch wrapper → /api/predict
│   │   ├── constants.ts           # SLIDER_CONFIGS, MOOD_COLORS, FEATURE_IMPORTANCES
│   │   ├── archetypes.ts          # Stress archetype detection logic
│   │   ├── types.ts               # TypeScript types (StressLevel, Prediction, etc.)
│   │   └── utils.ts               # clsx/tailwind-merge helper
│   │
│   ├── public/                    # Static assets
│   ├── vercel.json                # API rewrites: /api/* → api/index.py
│   ├── .python-version            # Python 3.12 (for Vercel uv)
│   ├── requirements.txt           # Python deps for the serverless API
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend.py                     # Standalone Flask server (local dev / Docker)
├── app.py                         # Streamlit prototype UI
├── dashboard.py                   # Extended Streamlit dashboard
├── fastapi_backend.py             # FastAPI alternative backend (experimental)
├── train_model.py                 # Model training pipeline
├── student_lifestyle_dataset.csv  # Raw dataset (2,000+ records)
├── lifedrift_model.pkl            # Root-level model artifact (for local Flask)
├── scaler.pkl                     # Root-level scaler artifact (for local Flask)
├── Dockerfile.backend             # Docker image for Flask backend
├── Dockerfile.streamlit           # Docker image for Streamlit
└── requirements.txt               # Root Python deps (training + local backend)
```

---

## Data Flow — Prediction Request

```
User adjusts sliders in /neural
        │
        ▼
useOSStore (Zustand) — slider state updated
        │
User clicks "ANALYZE"
        │
        ▼
predictRemote(sliders)         [lib/predict.ts]
        │
        ▼
POST /api/predict
Body: { study, sleep, social, extra, physical, gpa }
        │
        ▼ (Vercel routes to api/index.py)
Flask route predict()
  → scaler.transform([values])
  → model.predict_proba()
  → returns { stress_level, confidence, probabilities, top_feature }
        │
        ▼
useOSStore.setLastPrediction()
useOSStore.setMood()           → CSS var(--mood) updates globally
useOSStore.addToHistory()
useOSStore.pushToast()
        │
        ▼
ResultPanel renders animated result
OSShell background color transitions to mood color
```

---

## State Management

All UI state lives in a single Zustand store (`store/useOSStore.ts`):

| State Key | Type | Description |
|-----------|------|-------------|
| `sliders` | `SliderState` | Current slider values (study, sleep, social, extra, physical, gpa) |
| `mood` | `StressLevel` | Current mood: `Low` / `Moderate` / `High` |
| `lastPrediction` | `Prediction \| null` | Most recent prediction result |
| `history` | `Prediction[]` | Session prediction log |
| `toasts` | `Toast[]` | Notification queue |

The `mood` drives CSS custom property `--mood` injected on the `<body>`, which causes the entire OS shell background, glow effects, and accent colors to reactively shift.

---

## Mood-Reactive Theme System

```css
/* globals.css */
--mood: var(--stress-low);   /* default: teal */

/* OSShell.tsx injects: */
document.documentElement.style.setProperty('--mood', MOOD_COLORS[mood])
```

| Stress Level | Color |
|---|---|
| Low | `#00ffaa` (teal/green) |
| Moderate | `#ffaa00` (amber) |
| High | `#ff4466` (red) |

---

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Redirects to `/neural` |
| `/neural` | Neural predictor | Main AI prediction interface |
| `/matrix` | Feature matrix | Feature importances + stress archetypes |
| `/radar` | Radar chart | Biometric lifestyle axis visualization |
| `/logs` | Audit log | Session prediction history |
| `/chrono` | Temporal planner | 24h stress planner (stub) |
| `/system` | System info | OS parameters and metadata |

---

## Python API — Flask Serverless

`api/index.py` is deployed as a Vercel serverless Python function. Vercel's build system installs dependencies from `lifedrift-os/requirements.txt` and runs under Python 3.12 using `uv`.

```
vercel.json rewrite:
  /api/* → api/index.py
```

The Flask app is **not** run via `flask run` on Vercel — Vercel uses its own WSGI runner. The `if __name__ == '__main__': app.run(...)` block is only used locally.

---

## Local vs. Production Backends

| Environment | Backend | Port | Notes |
|---|---|---|---|
| Local dev | `backend.py` (Flask) | `5000` | Direct Python process |
| Docker | `Dockerfile.backend` | `5000` | Gunicorn, 4 workers |
| Vercel prod | `api/index.py` (serverless) | N/A | Vercel Python runtime |
| Prototype | `app.py` (Streamlit) | `8501` | Standalone UI |
