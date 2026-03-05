from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model and scaler
try:
    with open('lifedrift_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    print("Model and Scaler loaded successfully.")
except Exception as e:
    print(f"Error loading assets: {e}")

# Mapping classes to labels (LabelEncoder order: High=0, Low=1, Moderate=2)
CLASS_MAPPING = {0: "High", 1: "Low", 2: "Moderate"}

FEATURE_NAMES = [
    "Study_Hours_Per_Day",
    "Extracurricular_Hours_Per_Day",
    "Sleep_Hours_Per_Day",
    "Social_Hours_Per_Day",
    "Physical_Activity_Hours_Per_Day",
    "GPA"
]

FEATURE_IMPORTANCES = {
    "Study_Hours_Per_Day": 0.6452,
    "Sleep_Hours_Per_Day": 0.1674,
    "GPA": 0.1103,
    "Physical_Activity_Hours_Per_Day": 0.0419,
    "Social_Hours_Per_Day": 0.0211,
    "Extracurricular_Hours_Per_Day": 0.0141
}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Validate inputs
    required_fields = ["study", "extra", "sleep", "social", "physical", "gpa"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        # Prepare input data in correct order
        input_values = [
            float(data["study"]),
            float(data["extra"]),
            float(data["sleep"]),
            float(data["social"]),
            float(data["physical"]),
            float(data["gpa"])
        ]
        
        # Scale input
        input_scaled = scaler.transform([input_values])
        
        # Prediction
        prediction = model.predict(input_scaled)[0]
        probabilities = model.predict_proba(input_scaled)[0]
        
        # Format response
        prob_dict = {CLASS_MAPPING[i]: float(probabilities[i]) for i in range(len(probabilities))}
        stress_level = CLASS_MAPPING[prediction]
        confidence = float(probabilities[prediction])
        
        # Find top feature (using provided importance)
        top_feature = max(FEATURE_IMPORTANCES, key=FEATURE_IMPORTANCES.get)

        return jsonify({
            "stress_level": stress_level,
            "probabilities": prob_dict,
            "top_feature": top_feature,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": "lifedrift_model.pkl"})

@app.route('/stats', methods=['GET'])
def stats():
    try:
        df = pd.read_csv("student_lifestyle_dataset.csv")
        averages = df.drop(columns=["Student_ID", "Stress_Level"]).mean().to_dict()
        return jsonify(averages)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
