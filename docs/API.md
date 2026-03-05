# API Reference

This document covers all HTTP endpoints exposed by the LifeDrift OS Python backend.

The API is implemented in Flask and deployed in two modes:
- **Vercel (production):** `api/index.py` as a serverless function, accessible at `https://<your-deployment>.vercel.app/api/*`
- **Local / Docker:** `backend.py` running on `http://localhost:5000`

---

## Base URLs

| Environment | Base URL |
|---|---|
| Production (Vercel) | `https://<your-vercel-domain>.vercel.app` |
| Local Flask | `http://localhost:5000` |
| Docker | `http://localhost:5000` |

---

## Authentication

No authentication is required. The API is public.

---

## Endpoints

### `POST /api/predict` (Vercel) / `POST /predict` (local)

Run stress level prediction from lifestyle inputs.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**

| Field | Type | Required | Range | Description |
|-------|------|----------|-------|-------------|
| `study` | `float` | Yes | 0–24 | Study hours per day |
| `sleep` | `float` | Yes | 0–24 | Sleep hours per day |
| `social` | `float` | Yes | 0–24 | Social hours per day |
| `extra` | `float` | Yes | 0–24 | Extracurricular hours per day |
| `physical` | `float` | Yes | 0–24 | Physical activity hours per day |
| `gpa` | `float` | Yes | 0.0–4.0 | Current GPA |

**Example:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "study": 8.0,
    "sleep": 5.5,
    "social": 1.0,
    "extra": 1.0,
    "physical": 0.5,
    "gpa": 3.6
  }'
```

#### Response

**200 OK:**
```json
{
  "stress_level": "High",
  "confidence": 0.87,
  "probabilities": {
    "High": 0.87,
    "Moderate": 0.09,
    "Low": 0.04
  },
  "top_feature": "Study_Hours_Per_Day"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `stress_level` | `string` | Predicted class: `"Low"`, `"Moderate"`, or `"High"` |
| `confidence` | `float` | Model confidence for predicted class (0.0–1.0) |
| `probabilities` | `object` | Probability for each class |
| `top_feature` | `string` | The feature with highest importance |

**400 Bad Request** — missing field:
```json
{
  "error": "Missing field: sleep"
}
```

**400 Bad Request** — no body:
```json
{
  "error": "No input data provided"
}
```

**500 Internal Server Error** — model error:
```json
{
  "error": "<exception message>"
}
```

---

### `GET /api/health` (Vercel) / `GET /health` (local)

Health check — confirms the API is running and the model is loaded.

#### Request

```bash
curl http://localhost:5000/health
```

#### Response

**200 OK:**
```json
{
  "status": "ok",
  "model": "lifedrift_model.pkl"
}
```

---

### `GET /api/stats` (Vercel) / `GET /stats` (local)

Returns mean values for each feature from the training dataset. Used by the frontend Matrix page to display dataset averages.

#### Request

```bash
curl http://localhost:5000/stats
```

#### Response

**200 OK:**
```json
{
  "Study_Hours_Per_Day": 7.52,
  "Extracurricular_Hours_Per_Day": 3.52,
  "Sleep_Hours_Per_Day": 7.01,
  "Social_Hours_Per_Day": 4.99,
  "Physical_Activity_Hours_Per_Day": 2.99,
  "GPA": 2.55
}
```

**500 Internal Server Error** — if CSV is missing:
```json
{
  "error": "<exception message>"
}
```

---

## Class Mapping

The model uses `sklearn.LabelEncoder`, which encodes labels alphabetically:

| Encoded Value | Stress Level |
|---|---|
| `0` | `High` |
| `1` | `Low` |
| `2` | `Moderate` |

The API maps these back to human-readable labels before returning.

---

## CORS

All endpoints have CORS enabled via `flask-cors` with `origins="*"`. In production, you may want to restrict this to your frontend domain.

---

## Frontend Integration

The Next.js frontend calls the API via `lib/predict.ts`:

```typescript
// lib/predict.ts
export async function predictRemote(sliders: SliderState) {
  const res = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      study: sliders.study,
      sleep: sliders.sleep,
      social: sliders.social,
      extra: sliders.extra,
      physical: sliders.physical,
      gpa: sliders.gpa,
    }),
  })
  return res.json()
}
```

The `/api/predict` path is rewritten by Vercel to `api/index.py` via `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.py" }
  ]
}
```
