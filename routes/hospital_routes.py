from flask import Blueprint, jsonify, redirect, render_template, request, session, url_for

from services.hospital_finder import find_hospitals


hospital_bp = Blueprint("hospital", __name__)


@hospital_bp.route("/hospitals")
def hospitals():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)

    if lat is None or lon is None:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    try:
        hospitals_data = find_hospitals(lat, lon)
        return jsonify(hospitals_data)
    except Exception as exc:
        return jsonify({"error": f"Hospital search failed: {str(exc)}"}), 500


@hospital_bp.route("/details")
def hospital_details():
    if not session.get("user_id"):
        return redirect(url_for("auth.login"))

    hospital = {
        "name": request.args.get("name", "Hospital"),
        "speciality": request.args.get("speciality", "General"),
        "phone": request.args.get("phone", "N/A"),
        "distance_km": request.args.get("distance_km", "N/A"),
        "lat": request.args.get("lat", ""),
        "lon": request.args.get("lon", ""),
    }

    return render_template("hospital_detail.html", hospital=hospital)
