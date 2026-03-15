from database.db import get_db


def create_report_table():

    db = get_db()

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS blood_reports (

        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        filename TEXT,
        report_text TEXT,
        analysis TEXT,
        markers_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
        """
    )

    db.commit()