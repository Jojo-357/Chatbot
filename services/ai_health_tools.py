from functools import lru_cache

from transformers import pipeline

from services.llm_service import generate_llm_output


RISK_LABELS = [
    "low health risk",
    "moderate health risk",
    "high health risk",
    "needs urgent medical review",
]

DIET_GOAL_LABELS = [
    "general wellness",
    "weight management",
    "diabetes friendly",
    "heart friendly",
    "kidney friendly",
    "high protein recovery",
]


@lru_cache(maxsize=1)
def _get_classifier():
    return pipeline("zero-shot-classification", model="facebook/bart-large-mnli")


def _build_profile_summary(user, reports, supplemental_data=None):
    supplemental_data = supplemental_data or {}
    age = user["age"] if user["age"] else supplemental_data.get("age")
    gender = user["gender"] if user["gender"] else supplemental_data.get("gender")
    medical_conditions = user["medical_conditions"] or supplemental_data.get("known_conditions")
    latest_reports = "\n".join(
        f"- {report['filename']}: {report['analysis'][:250]}"
        for report in reports[:3]
    )

    return f"""
Name: {user['name']}
Age: {age}
Blood Type: {user['blood_type']}
Gender: {gender}
Allergies: {user['allergies']}
Medical Conditions: {medical_conditions}
Current Medications: {user['current_medications']}
Diet Preference: {user['diet_preference']}
Dietary Restrictions: {user['dietary_restrictions']}
Supplemental Known Conditions: {supplemental_data.get('known_conditions')}
Smoking Status: {supplemental_data.get('smoker')}
Latest Reports:
{latest_reports if latest_reports else "No blood reports available"}
""".strip()


def get_missing_health_fields(user, reports):
    if reports:
        return []

    missing_fields = []
    if not user["age"]:
        missing_fields.append("age")
    if not user["gender"]:
        missing_fields.append("gender")
    if not user["medical_conditions"]:
        missing_fields.append("known_conditions")
    return missing_fields


def predict_health_risk(user, reports, supplemental_data=None):
    supplemental_data = supplemental_data or {}
    profile_summary = _build_profile_summary(user, reports, supplemental_data=supplemental_data)
    classifier = _get_classifier()
    classification = classifier(profile_summary, RISK_LABELS, multi_label=False)

    top_label = classification["labels"][0]
    top_score = classification["scores"][0]

    score_ranges = {
        "low health risk": 88,
        "moderate health risk": 68,
        "high health risk": 44,
        "needs urgent medical review": 24,
    }

    health_score = score_ranges.get(top_label, 60)
    effective_age = user["age"] or supplemental_data.get("age")
    effective_conditions = user["medical_conditions"] or supplemental_data.get("known_conditions")
    if effective_age:
        try:
            effective_age = int(effective_age)
        except (TypeError, ValueError):
            effective_age = None

    if effective_age and effective_age > 55:
        health_score -= 6
    if effective_conditions:
        health_score -= 8
    if reports:
        health_score -= min(len(reports) * 2, 6)

    health_score = max(1, min(99, health_score))

    summary_prompt = f"""
You are VitaNexis.

User profile summary:
{profile_summary}

Risk classification:
Top label: {top_label}
Confidence: {round(top_score, 3)}
Health score: {health_score}/100

Write:
1. One short risk summary
2. Main reasons affecting the score
3. Two practical health improvement suggestions

Keep it concise.
"""

    summary = generate_llm_output(summary_prompt, temperature=0.2, max_tokens=320)

    return {
        "health_score": health_score,
        "risk_level": top_label,
        "confidence": round(top_score, 3),
        "summary": summary,
    }


def generate_diet_plan(user, diet_preference, dietary_restrictions):
    profile_summary = _build_profile_summary(user, [])
    classifier = _get_classifier()
    goal_result = classifier(profile_summary, DIET_GOAL_LABELS, multi_label=False)
    diet_goal = goal_result["labels"][0]

    plan_prompt = f"""
You are VitaNexis.

Create a 7-day diet plan for this user.

User profile:
{profile_summary}

Selected diet preference:
{diet_preference}

Selected dietary restrictions:
{dietary_restrictions if dietary_restrictions else "None"}

Instructions:
- Respect allergies, medical conditions, and the selected diet preference.
- Keep the meals practical for daily use.
- Provide breakfast, lunch, dinner, and one snack for each day.
- Add a short note if any food should be avoided.
- Optimize the plan for: {diet_goal}

Keep the output structured by day.
"""

    plan = generate_llm_output(plan_prompt, temperature=0.35, max_tokens=800)

    return {
        "diet_goal": diet_goal,
        "plan": plan,
    }
