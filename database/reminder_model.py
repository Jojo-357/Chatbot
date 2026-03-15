from database.db import get_db


def create_reminder_table():
    db = get_db()

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS medicine_reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            medicine_name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            reminder_time TEXT NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    db.commit()
    db.close()
