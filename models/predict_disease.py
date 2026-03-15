import pandas as pd
import joblib

model = joblib.load("models/disease_model.pkl")

columns = pd.read_csv(
    "data/Indian-Healthcare-Symptom-Disease-Dataset - Sheet1 (2).csv"
).columns[:-1]


def predict_disease(symptoms):

    input_vector = [0] * len(columns)

    for symptom in symptoms:
        if symptom in columns:
            index = list(columns).index(symptom)
            input_vector[index] = 1

    prediction = model.predict([input_vector])[0]

    return prediction