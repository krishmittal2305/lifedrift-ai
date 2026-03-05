# LifeDrift OS

> AI-powered student stress prediction and lifestyle optimization platform — styled as a futuristic operating system.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey?logo=flask)](https://flask.palletsprojects.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4.2-orange?logo=scikit-learn)](https://scikit-learn.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Contributions%20Welcome-brightgreen)](docs/CONTRIBUTING.md)

---

## What is LifeDrift OS?

LifeDrift OS is an open-source student wellness intelligence platform. It takes six daily lifestyle inputs — study hours, sleep, GPA, social time, physical activity, and extracurriculars — and uses a trained Random Forest Classifier to predict stress level (Low / Moderate / High) with ~94% accuracy.

The frontend is designed as a cyberpunk "OS shell" with a real-time neural network visualization, radar charts, feature importance matrices, a stress archetype detector, and a prediction audit log.

---

## Screenshots

> The UI renders as a dark, glass-morphism operating system. Navigate via the top taskbar.

| Neural Predictor | Feature Matrix | Radar Analysis |
|---|---|---|
| Input sliders + live neural viz | Feature importance + archetype | Biometric lifestyle axis |

---

## Architecture Overview

```
lifedrift-ai/
├── lifedrift-os/          # Next.js 14 frontend (deployed to Vercel)
│   ├── app/               # App Router pages
│   │   ├── neural/        # Main AI predictor UI
│   │   ├── matrix/        # Feature importance + archetype detector
│   │   ├── radar/         # Radar chart lifestyle analysis
│   │   ├── logs/          # Prediction audit log
│   │   ├── chrono/        # 24h temporal stress planner (WIP)
│   │   └── system/        # OS system info panel
│   ├── api/               # Python Flask serverless API (Vercel)
│   │   ├── index.py       # /api/predict, /api/health, /api/stats
│   │   └── models/        # .pkl model + scaler artifacts
│   ├── components/        # React component library
│   ├── store/             # Zustand global state
│   └── lib/               # Utilities, constants, types
├── backend.py             # Standalone Flask server (local/Docker)
├── app.py                 # Streamlit prototype UI
├── train_model.py         # Model training pipeline
├── student_lifestyle_dataset.csv
├── lifedrift_model.pkl    # Trained RandomForestClassifier
├── scaler.pkl             # StandardScaler artifact
├── Dockerfile.backend     # Docker image for Flask backend
└── Dockerfile.streamlit   # Docker image for Streamlit UI
```

For a full deep-dive, see [Architecture](docs/ARCHITECTURE.md).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| State | Zustand |
| Backend API | Flask 3.0, Flask-CORS, Gunicorn |
| ML | scikit-learn 1.4.2 (RandomForestClassifier), pandas 2.2.2, NumPy 1.26.4 |
| Deployment | Vercel (frontend + serverless Python API) |
| Containerization | Docker (backend + Streamlit) |

---

## Quickstart

### Prerequisites

- Node.js 20+
- Python 3.12
- npm or bun

### 1. Clone the repository

```bash
git clone https://github.com/krishmittal2305/lifedrift-ai.git
cd lifedrift-ai
```

### 2. Train the model (or use pre-trained artifacts)

```bash
pip install -r requirements.txt
python train_model.py
# Outputs: lifedrift_model.pkl, scaler.pkl
```

### 3. Start the Flask backend

```bash
python backend.py
# Runs on http://localhost:5000
```

### 4. Start the Next.js frontend

```bash
cd lifedrift-os
npm install
npm run dev
# Runs on http://localhost:3000
```

### 5. (Optional) Run the Streamlit prototype

```bash
streamlit run app.py
# Runs on http://localhost:8501
```

---

## Running with Docker

```bash
# Flask backend
docker build -f Dockerfile.backend -t lifedrift-backend .
docker run -p 5000:5000 lifedrift-backend

# Streamlit UI
docker build -f Dockerfile.streamlit -t lifedrift-streamlit .
docker run -p 8501:8501 lifedrift-streamlit
```

---

## API Reference

See [API Documentation](docs/API.md) for full endpoint specs.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/predict` | Run stress prediction |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/stats` | Dataset averages |

**Quick example:**

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"study": 8.0, "sleep": 6.0, "social": 2.0, "extra": 1.5, "physical": 1.0, "gpa": 3.2}'
```

```json
{
  "stress_level": "High",
  "confidence": 0.87,
  "probabilities": { "High": 0.87, "Moderate": 0.09, "Low": 0.04 },
  "top_feature": "Study_Hours_Per_Day"
}
```

---

## ML Model

The core model is a **Random Forest Classifier** trained on 2,000+ student lifestyle records.

| Metric | Value |
|--------|-------|
| Algorithm | RandomForestClassifier (n=200, balanced) |
| Accuracy | ~94.2% |
| Features | 6 (study, sleep, GPA, social, physical, extracurricular) |
| Target Classes | Low / Moderate / High |
| Top Predictor | Study Hours (64.5% feature importance) |

See [ML Model Documentation](docs/ML_MODEL.md) for dataset details, training pipeline, and feature importances.

---

## Deployment

The production deployment runs on Vercel with:
- Next.js frontend served as static/SSR pages
- Python Flask API as Vercel serverless functions (`api/index.py`)
- Model artifacts stored in `api/models/`

See [Deployment Guide](docs/DEPLOYMENT.md) for step-by-step Vercel and Docker deployment instructions.

---

## Contributing

LifeDrift OS is open source and contributions are very welcome.

See [Contributing Guide](docs/CONTRIBUTING.md) for how to get started, code style guidelines, and the contribution workflow.

**Good first issues to work on:**
- Implement the Chrono 24h temporal planner
- Add week-on-week trend charts to the Logs page
- Improve model with additional features (screen time, caffeine, etc.)
- Add dark/light theme toggle
- Write unit tests for the prediction pipeline

---

## Project Structure Details

See [Architecture](docs/ARCHITECTURE.md) for a complete breakdown of every directory and key file.

---

## License

MIT License — see [LICENSE](LICENSE).

Free to use, modify, and distribute. Attribution appreciated.

---

## Author

Built by **Krish Mittal** — [github.com/krishmittal2305](https://github.com/krishmittal2305)

---

> "Understand your patterns. Reclaim your balance."
