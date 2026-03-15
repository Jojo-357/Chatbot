import pandas as pd

df = pd.read_csv(
    "data/Indian-Healthcare-Symptom-Disease-Dataset - Sheet1 (2).csv"
)


def predict_diseases(symptoms):

    disease_scores = {}

    for symptom in symptoms:

        matches = df[
            df["Symptom"].str.lower().str.contains(symptom.lower(), na=False)
        ]

        for diseases in matches["Possible Diseases"]:

            for disease in diseases.split(","):

                disease = disease.strip()

                if disease not in disease_scores:
                    disease_scores[disease] = 0

                disease_scores[disease] += 1

    if not disease_scores:
        return []

    total = sum(disease_scores.values())

    disease_probabilities = []

    for disease, score in disease_scores.items():

        probability = round((score / total) * 100, 1)

        disease_probabilities.append((disease, probability))

    disease_probabilities.sort(
        key=lambda x: x[1],
        reverse=True
    )

    return disease_probabilities[:3]