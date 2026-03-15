from flask import Blueprint, jsonify, request, session

from services.llm_service import (
    ask_general_health,
    ask_symptom_assessment,
    get_general_exam_questions,
    should_start_general_exam,
)

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    user_message = data.get("message", "")
    lat = data.get("lat")
    lon = data.get("lon")

    exam_state = session.get("exam_state")

    if exam_state and exam_state.get("active"):
        question_index = exam_state.get("question_index", 0)
        answers = exam_state.get("answers", [])
        questions = get_general_exam_questions()

        if question_index < len(questions):
            answers.append((questions[question_index], user_message))
            question_index += 1

        if question_index < len(questions):
            exam_state["answers"] = answers
            exam_state["question_index"] = question_index
            session["exam_state"] = exam_state
            response = f"General examination {question_index + 1}/{len(questions)}: {questions[question_index]}"
            return jsonify({"response": response})

        response = ask_symptom_assessment(
            exam_state.get("initial_message", ""),
            answers,
            lat,
            lon,
        )
        session.pop("exam_state", None)
        return jsonify({"response": response})

    if should_start_general_exam(user_message):
        questions = get_general_exam_questions()
        session["exam_state"] = {
            "active": True,
            "initial_message": user_message,
            "question_index": 0,
            "answers": [],
        }
        response = (
            "I need a short general examination before I estimate what this may be.\n\n"
            f"General examination 1/{len(questions)}: {questions[0]}"
        )
        return jsonify({"response": response})

    response = ask_general_health(user_message, lat, lon)

    return jsonify({"response": response})
