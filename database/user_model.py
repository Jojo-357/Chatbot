from database.db import get_db


USER_COLUMNS = {
    "name": "TEXT NOT NULL UNIQUE",
    "email": "TEXT UNIQUE",
    "password": "TEXT NOT NULL",
    "age": "INTEGER",
    "dob": "TEXT",
    "blood_type": "TEXT",
    "gender": "TEXT",
    "phone": "TEXT",
    "address": "TEXT",
    "emergency_contact_name": "TEXT",
    "emergency_contact_phone": "TEXT",
    "allergies": "TEXT",
    "medical_conditions": "TEXT",
    "current_medications": "TEXT",
    "diet_preference": "TEXT",
    "dietary_restrictions": "TEXT",
}


def create_user_table():
    db = get_db()

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            email TEXT UNIQUE,
            password TEXT NOT NULL,
            age INTEGER,
            dob TEXT,
            blood_type TEXT,
            gender TEXT,
            phone TEXT,
            address TEXT,
            emergency_contact_name TEXT,
            emergency_contact_phone TEXT,
            allergies TEXT,
            medical_conditions TEXT,
            current_medications TEXT,
            diet_preference TEXT,
            dietary_restrictions TEXT
        )
        """
    )

    existing_columns = {
        row["name"] for row in db.execute("PRAGMA table_info(users)").fetchall()
    }

    for column_name, column_type in USER_COLUMNS.items():
        if column_name not in existing_columns:
            db.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")

    db.commit()
    db.close()
