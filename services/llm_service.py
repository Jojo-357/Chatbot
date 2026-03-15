import os
from functools import lru_cache

from groq import Groq

from models.symptom_extractor import extract_symptoms
from services.hospital_finder import find_hospitals
from services.medical_search import medical_search


GENERAL_EXAM_QUESTIONS = [
    "Do you have yellow eyes or yellow skin, dark urine, pale stools, or unusual itching?",
    "Do you have any swelling in the legs, face, abdomen, joints, or anywhere else in the body?",
    "Do you have chest pain, shortness of breath, wheezing, fast heartbeat, or dizziness?",
    "Do you have vomiting, diarrhea, constipation, burning urination, blood in urine or stools, or severe stomach pain?",
    "Have you noticed weight loss, loss of appetite, unusual tiredness, dehydration, or trouble sleeping?",
    "Do you have fever, rash, recent infection, sick contact, outside food exposure, travel, or any recent trigger?",
]

SYMPTOM_HINTS = [
    "fever",
    "cough",
    "cold",
    "pain",
    "headache",
    "vomiting",
    "nausea",
    "fatigue",
    "diarrhea",
    "dizziness",
    "breathless",
    "breathing",
    "rash",
    "swelling",
    "chills",
    "infection",
]

INFORMATION_HINTS = [
    "diet",
    "food",
    "eat",
    "nutrition",
    "meal",
    "protein",
    "calorie",
    "vitamin",
    "healthy",
    "exercise",
    "hydration",
    "sleep",
    "weight loss",
    "weight gain",
    "what is",
    "how to",
    "can i",
    "should i",
]


@lru_cache(maxsize=1)
def _get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)


def _complete_prompt(prompt, temperature=0.2, max_tokens=500):
    client = _get_client()
    if not client:
        return "Chat model is not configured. Please set GROQ_API_KEY in your .env file."

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return completion.choices[0].message.content
    except Exception:
        return "I could not reach the language model right now. Please try again."


def generate_llm_output(prompt, temperature=0.2, max_tokens=500):
    return _complete_prompt(prompt, temperature=temperature, max_tokens=max_tokens)


def classify_question(question):
    lowered = question.lower()
    symptoms = extract_symptoms(question)

    if symptoms or any(hint in lowered for hint in SYMPTOM_HINTS):
        return "symptom_check"

    if any(hint in lowered for hint in INFORMATION_HINTS):
        return "general_health"

    return "general_health"


def should_start_general_exam(question):
    return classify_question(question) == "symptom_check"


def get_general_exam_questions():
    return GENERAL_EXAM_QUESTIONS


def _get_hospital_context(lat=None, lon=None, limit=3):
    try:
        if lat is None or lon is None:
            return ""

        hospitals = find_hospitals(lat, lon)
        hospital_lines = []
        for hospital in hospitals[:limit]:
            name = hospital.get("name", "Hospital")
            distance = hospital.get("distance_km", "?")
            hospital_lines.append(f"{name} - {distance} km away")

        return "\n".join(hospital_lines)
    except Exception:
        return ""


def _get_medical_context(question, symptoms):
    try:
        search_query = ", ".join(symptoms) if symptoms else question
        return "\n".join(medical_search(search_query))
    except Exception:
        return ""


def ask_general_health(question, lat=None, lon=None):
    hospital_context = _get_hospital_context(lat, lon)
    web_context = _get_medical_context(question, [])

    prompt = f"""
You are VitaNexis, a healthcare assistant.

User question:
{question}

Medical context:
{web_context if web_context else "No extra medical search results available."}

Nearby hospitals:
{hospital_context if hospital_context else "Location not available."}

Instructions:
- Answer the user directly and clearly.
- Do not diagnose unless the user is explicitly describing symptoms.
- If the user is asking about diet, food, exercise, lifestyle, or a general health topic, stay educational and practical.
- Keep the tone concise and helpful.
- Mention nearby hospitals only if relevant.
"""

    return _complete_prompt(prompt, temperature=0.25, max_tokens=420)


def ask_symptom_assessment(initial_message, exam_answers, lat=None, lon=None):
    symptoms = extract_symptoms(initial_message)
    hospital_context = _get_hospital_context(lat, lon)
    web_context = _get_medical_context(initial_message, symptoms)
    exam_context = "\n".join(
        f"Q{i + 1}: {question}\nA{i + 1}: {answer}"
        for i, (question, answer) in enumerate(exam_answers)
    )

    prompt = f"""
You are VitaNexis, a healthcare assistant.

Initial symptom message:
{initial_message}

Detected symptoms:
{', '.join(symptoms) if symptoms else "Not clearly detected"}

General examination answers:
{exam_context}

Medical knowledge from trusted medical sources:
{web_context if web_context else "No medical search results available"}

Nearby hospitals:
{hospital_context if hospital_context else "Location not available"}

Instructions:
1. Give the 3 most likely possibilities with approximate likelihood percentages.
2. Explain the reasoning using the user's symptoms and examination answers.
3. Give practical next steps and safe home advice where appropriate.
4. Clearly mention red-flag symptoms that need urgent care.
5. Recommend nearby hospitals if symptoms sound significant.

Rules:
- Do NOT make a definitive diagnosis.
- Use simple language.
- Keep the answer structured and concise.

Response format:

Possible Conditions:
- Condition (percentage)
- Condition (percentage)
- Condition (percentage)

Why This Fits:
...

Next Steps:
...

Urgent Warning Signs:
...

Nearby Hospitals:
...
"""

    return _complete_prompt(prompt, temperature=0.2, max_tokens=520)


def analyze_blood_report_with_chat_model(report_text, markers):
    marker_lines = "\n".join(
        f"- {name}: {value}" for name, value in sorted((markers or {}).items())
    )

    prompt = f"""
You are VitaNexis, a healthcare assistant.

This is a blood report summary for analysis.

Extracted markers:
{marker_lines if marker_lines else "No structured markers could be extracted automatically."}

Report text:
{report_text if report_text else "No readable report text was extracted."}

Instructions:
1. Identify the important findings from the report.
2. Mention which values may be abnormal or notable.
3. Explain what those findings may suggest in simple language.
4. Give safe follow-up advice and what to discuss with a doctor.
5. If the text quality is poor or incomplete, say so clearly.

Rules:
- Do not make a definitive diagnosis.
- Keep the explanation practical and concise.
"""

    return _complete_prompt(prompt, temperature=0.2, max_tokens=500)
