from fastapi import FastAPI, HTTPException, Request, BackgroundTask
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Literal
import pickle
import pandas as pd
import numpy as np
import sqlite3
from contextlib import asynccontextmanager
import time

class LifestyleInput(BaseModel):
    study: float = Field(..., ge=5.0, le=10.0)
    extra: float = Field(..., ge=0.0, le=4.0)
    sleep: float = Field(..., ge=5.0, le=10.0)
    social: float = Field(..., ge=0.0, le=6.0)
    physical: float = Field(..., ge=0.0, le=13.0)
    gpa: float = Field(..., ge=2.24, le=4.0)

class PredictionResponse(BaseModel):
    stress_level: Literal["Low", "Moderate", "High"]
    probabilities: Dict[str, float]
    confidence: float
    top_contributing_factor: str
    recommendations: List[str]

# Assets
model = None
scaler = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, scaler
    with open('lifedrift_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    
    # Initialize DB
    conn = sqlite3.connect('student_predictions.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS predictions 
                      (timestamp TEXT, input TEXT, prediction TEXT, confidence REAL)''')
    conn.commit()
    conn.close()
    yield

app = FastAPI(title="LifeDrift API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def log_prediction(payload: dict, result: str, confidence: float):
    conn = sqlite3.connect('student_predictions.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO predictions VALUES (?, ?, ?, ?)", 
                   (time.ctime(), str(payload), result, confidence))
    conn.commit()
    conn.close()

def get_recommendations(input: LifestyleInput, stress_level: str) -> List[str]:
    recs = []
    if stress_level == "High":
        recs.append("Prioritize sleep and aim for at least 8 hours tonight.")
        recs.append("Reduce extracurricular load until stress levels stabilize.")
        recs.append("Incorporate 15 minutes of mindfulness meditation.")
    elif stress_level == "Moderate":
        recs.append("Try to balance social hours with study blocks.")
        recs.append("A quick walk could help improve your focus.")
    else:
        recs.append("Keep up the great routine! You have a healthy balance.")
    
    if input.study > 9:
        recs.append("Break down your study sessions to avoid burnout.")
    return recs

CLASS_MAPPING = {0: "High", 1: "Low", 2: "Moderate"}

@app.post("/api/v1/predict", response_model=PredictionResponse)
async def predict(data: LifestyleInput, background_tasks: BackgroundTask):
    input_values = [[data.study, data.extra, data.sleep, data.social, data.physical, data.gpa]]
    input_scaled = scaler.transform(input_values)
    
    prediction = model.predict(input_scaled)[0]
    probabilities = model.predict_proba(input_scaled)[0]
    
    stress_level = CLASS_MAPPING[prediction]
    confidence = float(probabilities[prediction])
    
    # Probabilities dict
    prob_dict = {CLASS_MAPPING[i]: float(probabilities[i]) for i in range(3)}
    
    recommendations = get_recommendations(data, stress_level)
    
    background_tasks.add_task(log_prediction, data.dict(), stress_level, confidence)
    
    return {
        "stress_level": stress_level,
        "probabilities": prob_dict,
        "confidence": confidence,
        "top_contributing_factor": "Study_Hours_Per_Day",
        "recommendations": recommendations
    }

@app.get("/api/v1/health")
async def health():
    return {"status": "ok", "model": "lifedrift_model.pkl"}

@app.get("/api/v1/model/info")
async def model_info():
    return {
        "algorithm": "RandomForestClassifier",
        "features": ["Study", "Extra", "Sleep", "Social", "Physical", "GPA"],
        "importances": {
            "Study_Hours_Per_Day": 0.6452,
            "Sleep_Hours_Per_Day": 0.1674,
            "GPA": 0.1103
        }
    }

@app.post("/api/v1/batch")
async def batch_predict(inputs: List[LifestyleInput]):
    if len(inputs) > 50:
        raise HTTPException(status_code=400, detail="Batch size limit is 50")
    
    results = []
    for data in inputs:
        input_values = [[data.study, data.extra, data.sleep, data.social, data.physical, data.gpa]]
        input_scaled = scaler.transform(input_values)
        prediction = model.predict(input_scaled)[0]
        results.append(CLASS_MAPPING[prediction])
    return {"predictions": results}

@app.get("/api/v1/stats")
async def stats():
    df = pd.read_csv("student_lifestyle_dataset.csv")
    return df.drop(columns=["Student_ID", "Stress_Level"]).mean().to_dict()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
