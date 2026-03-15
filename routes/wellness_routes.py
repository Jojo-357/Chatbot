from flask import Blueprint, jsonify, request, session

from database.db import get_db
from services.ai_health_tools import (
    generate_diet_plan,
    get_missing_health_fields,
    predict_health_risk,
)


wellness_bp = Blueprint("wellness", __name__)


def _require_user():
    user_id = session.get("user_id")
    if not user_id:
        return None, (jsonify({"error": "Unauthorized"}), 401)
    return user_id, None


def _get_user_profile(db, user_id):
    return db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()


@wellness_bp.route("/wellness/reminders", methods=["GET", "POST"])
def reminders():
    user_id, error = _require_user()
    if error:
        return error

    db = get_db()

    if request.method == "GET":
        reminders = db.execute(
            """
            SELECT id, medicine_name, dosage, reminder_time, notes
            FROM medicine_reminders
            WHERE user_id = ?
            ORDER BY reminder_time ASC
            """,
            (user_id,),
        ).fetchall()
        db.close()
        return jsonify([dict(reminder) for reminder in reminders])

    data = request.get_json(silent=True) or {}
    medicine_name = data.get("medicine_name", "").strip()
    dosage = data.get("dosage", "").strip()
    reminder_time = data.get("reminder_time", "").strip()
    notes = data.get("notes", "").strip()

    if not medicine_name or not dosage or not reminder_time:
        db.close()
        return jsonify({"error": "Medicine name, dosage, and reminder time are required"}), 400

    db.execute(
        """
        INSERT INTO medicine_reminders (user_id, medicine_name, dosage, reminder_time, notes)
        VALUES (?, ?, ?, ?, ?)
        """,
        (user_id, medicine_name, dosage, reminder_time, notes or None),
    )
    db.commit()
    db.close()

    return jsonify({"status": "saved"})


@wellness_bp.route("/wellness/reminders/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    user_id, error = _require_user()
    if error:
        return error

    db = get_db()
    db.execute(
        "DELETE FROM medicine_reminders WHERE id = ? AND user_id = ?",
        (reminder_id, user_id),
    )
    db.commit()
    db.close()
    return jsonify({"status": "deleted"})


@wellness_bp.route("/wellness/health-insights", methods=["GET", "POST"])
def health_insights():
    user_id, error = _require_user()
    if error:
        return error

    db = get_db()
    user = _get_user_profile(db, user_id)
    reports = db.execute(
        """
        SELECT filename, analysis, created_at
        FROM blood_reports
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_id,),
    ).fetchall()
    if request.method == "GET":
        missing_fields = get_missing_health_fields(user, reports)
        if missing_fields:
            db.close()
            return jsonify(
                {
                    "needs_more_info": True,
                    "missing_fields": missing_fields,
                    "profile": {
                        "age": user["age"],
                        "gender": user["gender"],
                        "medical_conditions": user["medical_conditions"],
                    },
                }
            )

        insights = predict_health_risk(user, reports)
        db.close()
        return jsonify(insights)

    supplemental_data = request.get_json(silent=True) or {}
    insights = predict_health_risk(user, reports, supplemental_data=supplemental_data)
    db.close()
    return jsonify(insights)


@wellness_bp.route("/wellness/diet-plan", methods=["POST"])
def diet_plan():
    user_id, error = _require_user()
    if error:
        return error

    data = request.get_json(silent=True) or {}
    diet_preference = data.get("diet_preference", "").strip() or "Vegetarian"
    dietary_restrictions = data.get("dietary_restrictions", "").strip()

    db = get_db()
    user = _get_user_profile(db, user_id)

    db.execute(
        """
        UPDATE users
        SET diet_preference = ?, dietary_restrictions = ?
        WHERE id = ?
        """,
        (diet_preference, dietary_restrictions or None, user_id),
    )
    db.commit()

    user = _get_user_profile(db, user_id)
    db.close()

    plan = generate_diet_plan(user, diet_preference, dietary_restrictions)
    return jsonify(plan)
