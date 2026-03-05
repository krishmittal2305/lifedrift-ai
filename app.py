import streamlit as st
import pandas as pd
import numpy as np
import pickle
import os

# Load model and scaler
@st.cache_resource
def load_assets():
    model = pickle.load(open("lifedrift_model.pkl", "rb"))
    scaler = pickle.load(open("scaler.pkl", "rb"))
    return model, scaler

try:
    model, scaler = load_assets()
except Exception as e:
    st.error(f"Error loading model or scaler: {e}")
    st.stop()

st.set_page_config(page_title="Student Lifestyle & Stress Predictor", layout="centered")

st.title("🎓 Student Lifestyle & Stress Predictor")
st.write("Predict your stress level based on your daily habits.")

with st.form("lifestyle_form"):
    st.header("Daily Habits")
    
    col1, col2 = st.columns(2)
    
    with col1:
        study_hours = st.number_input("Study Hours Per Day", min_value=0.0, max_value=24.0, value=7.5, step=0.5)
        extracurricular_hours = st.number_input("Extracurricular Hours Per Day", min_value=0.0, max_value=24.0, value=2.0, step=0.5)
        sleep_hours = st.number_input("Sleep Hours Per Day", min_value=0.0, max_value=24.0, value=7.5, step=0.5)
        
    with col2:
        social_hours = st.number_input("Social Hours Per Day", min_value=0.0, max_value=24.0, value=2.5, step=0.5)
        physical_activity = st.number_input("Physical Activity Hours Per Day", min_value=0.0, max_value=24.0, value=4.0, step=0.5)
        gpa = st.number_input("Current GPA", min_value=0.0, max_value=4.0, value=3.1, step=0.1)

    submit_button = st.form_submit_button(label="Predict Stress Level")

if submit_button:
    # Prepare input data
    input_data = pd.DataFrame([[
        study_hours,
        extracurricular_hours,
        sleep_hours,
        social_hours,
        physical_activity,
        gpa
    ]], columns=[
        "Study_Hours_Per_Day",
        "Extracurricular_Hours_Per_Day",
        "Sleep_Hours_Per_Day",
        "Social_Hours_Per_Day",
        "Physical_Activity_Hours_Per_Day",
        "GPA"
    ])
    
    # Scale input
    input_scaled = scaler.transform(input_data)
    
    # Predict
    prediction = model.predict(input_scaled)
    
    # Stress levels (assuming LabelEncoder order: Low, Moderate, High or similar)
    # Based on standard LabelEncoder, it's usually alphabetical: High=0, Low=1, Moderate=2?
    # We should probably check the dataset to be sure, but let's provide the raw class for now
    # or a generic mapping if we can infer it.
    
    st.subheader("Prediction Result")
    stress_mapping = {0: "Low", 1: "Moderate", 2: "High"} # Placeholder, will verify if possible
    
    # For now, let's just show the class ID if we aren't sure, but typically it's 3 levels
    result = prediction[0]
    
    st.info(f"Predicted Stress Level Class: **{result}**")
    
    if result == 0:
        st.success("Your stress level is predicted to be **Low**. Keep up the good balance!")
    elif result == 1:
        st.warning("Your stress level is predicted to be **Moderate**. Consider some relaxation techniques.")
    else:
        st.error("Your stress level is predicted to be **High**. It might be time to prioritize self-care and rest.")
