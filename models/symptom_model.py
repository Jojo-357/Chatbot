import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("data/Indian-Healthcare-Symptom-Disease-Dataset - Sheet1 (2).csv")

# Fill missing values
df = df.fillna(0)

# Features and labels
X = df.iloc[:, :-1]
y = df.iloc[:, -1]

# Train model
model = RandomForestClassifier(n_estimators=200)

model.fit(X, y)

# Save model
joblib.dump(model, "models/disease_model.pkl")

print("Disease prediction model trained successfully")