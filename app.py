from flask import Flask, redirect, render_template, send_from_directory, session, url_for
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

from database.user_model import create_user_table
from database.report_model import create_report_table
from database.reminder_model import create_reminder_table

from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp
from routes.hospital_routes import hospital_bp
from routes.report_routes import report_bp
from routes.wellness_routes import wellness_bp


app = Flask(__name__)
app.config["SECRET_KEY"] = "healthcare-chatbot-secret-key"
CORS(app)

create_user_table()
create_report_table()
create_reminder_table()

app.register_blueprint(chat_bp)
app.register_blueprint(hospital_bp, url_prefix="/hospital")
app.register_blueprint(auth_bp)
app.register_blueprint(report_bp)
app.register_blueprint(wellness_bp)


@app.route("/")
def home():
    if session.get("user_id"):
        return redirect(url_for("dashboard"))
    return redirect(url_for("auth.login"))


@app.route("/dashboard")
def dashboard():
    if not session.get("user_id"):
        return redirect(url_for("auth.login"))
    return render_template("index.html", user_name=session.get("user_name"))


@app.route("/assets/<path:filename>")
def template_asset(filename):
    return send_from_directory("templates", filename)


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
