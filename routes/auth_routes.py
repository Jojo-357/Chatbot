import hashlib

from flask import (
    Blueprint,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash

from database.db import get_db

auth_bp = Blueprint("auth", __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def hash_password_secure(password):
    return generate_password_hash(password)


def password_matches(stored_password, provided_password):
    if not stored_password:
        return False

    if stored_password.startswith("pbkdf2:") or stored_password.startswith("scrypt:"):
        return check_password_hash(stored_password, provided_password)

    return stored_password == hash_password(provided_password)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        if session.get("user_id"):
            return redirect(url_for("dashboard"))
        return render_template("login.html")

    name = request.form.get("name", "").strip()
    password = request.form.get("password", "")

    if not name or not password:
        flash("Enter both name and password.", "error")
        return redirect(url_for("auth.login"))

    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE name = ?",
        (name,),
    ).fetchone()

    if not user or not password_matches(user["password"], password):
        db.close()
        flash("Wrong username or password.", "error")
        return redirect(url_for("auth.login"))

    if not (user["password"].startswith("pbkdf2:") or user["password"].startswith("scrypt:")):
        db.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            (hash_password_secure(password), user["id"]),
        )
        db.commit()

    db.close()

    session["user_id"] = user["id"]
    session["user_name"] = user["name"]
    return redirect(url_for("dashboard"))


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")

    form_data = {
        "name": request.form.get("name", "").strip(),
        "email": request.form.get("email", "").strip(),
        "password": request.form.get("password", ""),
        "age": request.form.get("age", "").strip(),
        "dob": request.form.get("dob", "").strip(),
        "blood_type": request.form.get("blood_type", "").strip(),
        "gender": request.form.get("gender", "").strip(),
        "phone": request.form.get("phone", "").strip(),
        "address": request.form.get("address", "").strip(),
        "emergency_contact_name": request.form.get("emergency_contact_name", "").strip(),
        "emergency_contact_phone": request.form.get("emergency_contact_phone", "").strip(),
        "allergies": request.form.get("allergies", "").strip(),
        "medical_conditions": request.form.get("medical_conditions", "").strip(),
        "current_medications": request.form.get("current_medications", "").strip(),
    }

    if not form_data["name"] or not form_data["password"]:
        flash("Name and password are required.", "error")
        return redirect(url_for("auth.register"))

    db = get_db()

    try:
        db.execute(
            """
            INSERT INTO users (
                name, email, password, age, dob, blood_type, gender, phone, address,
                emergency_contact_name, emergency_contact_phone, allergies,
                medical_conditions, current_medications
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                form_data["name"],
                form_data["email"] or None,
                hash_password_secure(form_data["password"]),
                int(form_data["age"]) if form_data["age"] else None,
                form_data["dob"] or None,
                form_data["blood_type"] or None,
                form_data["gender"] or None,
                form_data["phone"] or None,
                form_data["address"] or None,
                form_data["emergency_contact_name"] or None,
                form_data["emergency_contact_phone"] or None,
                form_data["allergies"] or None,
                form_data["medical_conditions"] or None,
                form_data["current_medications"] or None,
            ),
        )
        db.commit()
    except Exception:
        db.close()
        flash("That user name or email already exists.", "error")
        return redirect(url_for("auth.register"))

    db.close()
    flash("Registration complete. Please log in.", "success")
    return redirect(url_for("auth.login"))


@auth_bp.route("/records", methods=["POST"])
def records():
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    password = data.get("password", "")

    if not password:
        return jsonify({"error": "Password is required"}), 400

    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE id = ?",
        (session["user_id"],),
    ).fetchone()

    if not user or not password_matches(user["password"], password):
        db.close()
        return jsonify({"error": "Incorrect password"}), 403

    reports = db.execute(
        """
        SELECT filename, analysis, created_at
        FROM blood_reports
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (session["user_id"],),
    ).fetchall()
    db.close()

    profile = {
        "name": user["name"],
        "email": user["email"],
        "age": user["age"],
        "dob": user["dob"],
        "blood_type": user["blood_type"],
        "gender": user["gender"],
        "phone": user["phone"],
        "emergency_contact_name": user["emergency_contact_name"],
        "emergency_contact_phone": user["emergency_contact_phone"],
        "allergies": user["allergies"],
        "medical_conditions": user["medical_conditions"],
        "current_medications": user["current_medications"],
        "diet_preference": user["diet_preference"],
        "dietary_restrictions": user["dietary_restrictions"],
    }

    report_data = [
        {
            "filename": report["filename"],
            "analysis": report["analysis"],
            "created_at": report["created_at"],
        }
        for report in reports
    ]

    return jsonify({"profile": profile, "reports": report_data})


@auth_bp.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for("auth.login"))
