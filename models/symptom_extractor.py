symptom_keywords = [
    "fever",
    "cough",
    "joint pain",
    "vomiting",
    "headache",
    "fatigue",
    "nausea",
    "diarrhea",
    "chills",
]

def extract_symptoms(text):

    detected = []

    for symptom in symptom_keywords:

        if symptom in text.lower():
            detected.append(symptom)

    return detected