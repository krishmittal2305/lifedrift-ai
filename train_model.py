import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
df = pd.read_csv("student_lifestyle_dataset.csv")
df = df.drop(columns=["Student_ID"])

# Encode target
le = LabelEncoder()
df["Stress_Level"] = le.fit_transform(df["Stress_Level"])

# Split features and target
X = df.drop("Stress_Level", axis=1)
y = df["Stress_Level"]

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

# Save assets
pickle.dump(model, open("lifedrift_model.pkl", "wb"))
pickle.dump(scaler, open("scaler.pkl", "wb"))

print("Model and Scaler saved successfully.")
print(f"Classes: {list(le.classes_)}")
