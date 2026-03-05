import streamlit as st
import pandas as pd
import numpy as np
import pickle
import plotly.express as px
import plotly.graph_objects as go
import seaborn as sns
import matplotlib.pyplot as plt
import os

# Set Page Config
st.set_page_config(
    page_title="LifeDrift Analytics",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load assets
@st.cache_resource
def load_assets():
    model = pickle.load(open('lifedrift_model.pkl', 'rb'))
    scaler = pickle.load(open('scaler.pkl', 'rb'))
    return model, scaler

try:
    model, scaler = load_assets()
except Exception as e:
    st.error(f"Error loading assets: {e}")
    st.stop()

# Sidebar Navigation
page = st.sidebar.selectbox("Navigation", ["🎯 Predictor", "📊 Data Explorer", "🌲 Model Inspector", "📈 Stress Trends", "🔍 What-If Analysis"])

# Feature mapping
CLASS_MAPPING = {0: "High", 1: "Low", 2: "Moderate"}
FEATURE_IMPORTANCES = {
    "Study_Hours_Per_Day": 0.6452,
    "Sleep_Hours_Per_Day": 0.1674,
    "GPA": 0.1103,
    "Physical_Activity_Hours_Per_Day": 0.0419,
    "Social_Hours_Per_Day": 0.0211,
    "Extracurricular_Hours_Per_Day": 0.0141
}

# 🎯 Predictor Page
if page == "🎯 Predictor":
    st.title("🎯 LifeDrift Stress Predictor")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Input Lifestyle Data")
        study = st.slider("Study Hours Per Day", 5.0, 10.0, 7.5)
        extra = st.slider("Extracurricular Hours Per Day", 0.0, 4.0, 2.0)
        sleep = st.slider("Sleep Hours Per Day", 5.0, 10.0, 7.5)
        social = st.slider("Social Hours Per Day", 0.0, 6.0, 2.5)
        physical = st.slider("Physical Activity Hours Per Day", 0.0, 13.0, 4.0)
        gpa = st.slider("GPA", 2.24, 4.0, 3.1)
        
        predict_btn = st.button("Predict Stress Level", use_container_width=True)
    
    with col2:
        if predict_btn:
            input_values = [study, extra, sleep, social, physical, gpa]
            input_scaled = scaler.transform([input_values])
            prediction = model.predict(input_scaled)[0]
            probabilities = model.predict_proba(input_scaled)[0]
            
            stress_level = CLASS_MAPPING[prediction]
            confidence = probabilities[prediction]
            
            st.metric("Predicted Stress Level", stress_level)
            st.write(f"Confidence: {confidence:.2%}")
            
            # Radar Chart
            categories = ['Study', 'Extra', 'Sleep', 'Social', 'Physical', 'GPA (Scaled)']
            # Scale GPA for visualization
            gpa_norm = (gpa - 2.24) / (4.0 - 2.24) * 10 
            values = [study, extra, sleep, social, physical, gpa_norm]
            
            fig = go.Figure()
            fig.add_trace(go.Scatterpolar(
                r=values,
                theta=categories,
                fill='toself',
                line_color='#00ff88'
            ))
            fig.update_layout(
                polar=dict(radialaxis=dict(visible=True, range=[0, 13])),
                showlegend=False,
                title="Lifestyle Balance Radar"
            )
            st.plotly_chart(fig, use_container_width=True)

# 📊 Data Explorer Page
elif page == "📊 Data Explorer":
    st.title("📊 Data Explorer")
    df = pd.read_csv("student_lifestyle_dataset.csv")
    
    st.dataframe(df.head())
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Distributions")
        feat = st.selectbox("Select Feature", df.columns[1:-1])
        fig = px.histogram(df, x=feat, color="Stress_Level", barmode="overlay", color_discrete_sequence=['#ff4b4b', '#00ff88', '#ffaa00'])
        st.plotly_chart(fig, use_container_width=True)
        
    with col2:
        st.subheader("Study Hours vs GPA")
        fig = px.scatter(df, x="Study_Hours_Per_Day", y="GPA", color="Stress_Level", 
                         color_discrete_sequence=['#ffaa00', '#00ff88', '#ff4b4b'],
                         opacity=0.6)
        st.plotly_chart(fig, use_container_width=True)

# 🌲 Model Inspector Page
elif page == "🌲 Model Inspector":
    st.title("🌲 Model Inspector")
    
    # Feature Importance
    imp_df = pd.DataFrame(list(FEATURE_IMPORTANCES.items()), columns=["Feature", "Importance"]).sort_values("Importance", ascending=True)
    fig = px.bar(imp_df, x="Importance", y="Feature", orientation='h', title="Feature Importance (Random Forest)", color_discrete_sequence=['#00ff88'])
    st.plotly_chart(fig, use_container_width=True)
    
    # Confusion Matrix (Mock representation for dashboard)
    st.subheader("Confusion Matrix")
    # In a real app, you'd calculate this from test data, but for dashboard display:
    cm = [[206, 0, 0], [0, 59, 0], [0, 0, 135]]
    labels = ['High', 'Low', 'Moderate']
    fig = px.imshow(cm, x=labels, y=labels, text_auto=True, color_continuous_scale='Greens')
    st.plotly_chart(fig, use_container_width=True)

# 📈 Stress Trends Page
elif page == "📈 Stress Trends":
    st.title("📈 Stress Trends Simulation")
    
    days = st.slider("Simulation Days", 7, 30, 14)
    dates = pd.date_range(end=pd.Timestamp.now(), periods=days)
    
    # Simulate data
    stress_vals = np.random.choice(["Low", "Moderate", "High"], size=days, p=[0.5, 0.3, 0.2])
    trend_df = pd.DataFrame({"Date": dates, "Stress Level": stress_vals})
    
    fig = px.line(trend_df, x="Date", y="Stress Level", markers=True, 
                  category_orders={"Stress Level": ["Low", "Moderate", "High"]},
                  color_discrete_sequence=['#00ff88'])
    st.plotly_chart(fig, use_container_width=True)

# 🔍 What-If Analysis Page
elif page == "🔍 What-If Analysis":
    st.title("🔍 What-If Analysis")
    st.write("Sweep one feature while keeping others constant to see stress probability shifts.")
    
    sweep_feat = st.selectbox("Select Feature to Sweep", ["Study_Hours_Per_Day", "Sleep_Hours_Per_Day", "GPA"])
    
    # Base values
    base_vals = [7.5, 2.0, 7.5, 2.5, 4.0, 3.1]
    feat_idx = ["Study_Hours_Per_Day", "Extracurricular_Hours_Per_Day", "Sleep_Hours_Per_Day", "Social_Hours_Per_Day", "Physical_Activity_Hours_Per_Day", "GPA"].index(sweep_feat)
    
    ranges = {
        "Study_Hours_Per_Day": np.linspace(5, 10, 50),
        "Sleep_Hours_Per_Day": np.linspace(5, 10, 50),
        "GPA": np.linspace(2.24, 4.0, 50)
    }
    
    results = []
    for val in ranges[sweep_feat]:
        temp_vals = base_vals.copy()
        temp_vals[feat_idx] = val
        scaled = scaler.transform([temp_vals])
        probs = model.predict_proba(scaled)[0]
        results.append({
            sweep_feat: val,
            "High": probs[0],
            "Low": probs[1],
            "Moderate": probs[2]
        })
    
    results_df = pd.DataFrame(results).melt(id_vars=[sweep_feat], var_name="Stress Level", value_name="Probability")
    fig = px.line(results_df, x=sweep_feat, y="Probability", color="Stress Level", 
                  color_discrete_sequence=['#ff4b4b', '#00ff88', '#ffaa00'])
    st.plotly_chart(fig, use_container_width=True)
