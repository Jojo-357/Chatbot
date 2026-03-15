from flask import Blueprint, request, jsonify, session
from database.db import get_db
from services.blood_report_analyzer import analyze_blood_report
from services.trend_analysis import analyze_trends

import json
import os
import uuid

report_bp = Blueprint("reports", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@report_bp.route("/analyze-report", methods=["POST"])
def analyze_report():
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file or not file.filename:
        return jsonify({"error": "Select a report file"}), 400

    save = request.form.get("save") == "true"

    safe_name = os.path.basename(file.filename)
    if not safe_name.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF reports are supported right now"}), 400

    stored_name = f"{uuid.uuid4().hex}.pdf"
    filepath = os.path.join(UPLOAD_FOLDER, stored_name)
    file.save(filepath)

    report_text, markers, analysis = analyze_blood_report(filepath)

    db = get_db()

    previous = db.execute(
        "SELECT markers_json FROM blood_reports WHERE user_id=? ORDER BY created_at DESC LIMIT 5",
        (session.get("user_id"),),
    ).fetchall()

    trend_text = analyze_trends(previous, markers)

    full_analysis = analysis + "\n\nTrend Analysis:\n" + trend_text

    if save:

        db.execute(
            "INSERT INTO blood_reports (user_id, filename, report_text, analysis, markers_json) VALUES (?,?,?,?,?)",
            (
                session.get("user_id"),
                safe_name,
                report_text,
                full_analysis,
                json.dumps(markers),
            ),
        )

        db.commit()

    return jsonify(
        {
            "analysis": full_analysis,
            "markers": markers,
        }
    )
