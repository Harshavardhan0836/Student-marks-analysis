# db_loader.py
import os
import sqlite3
import pandas as pd
from datetime import datetime

# --- 🕒 Dynamic DB path based on today's date ---
today = datetime.now().strftime("%d-%m-%Y")
DB_PATH = os.path.join("output", f"student_results_{today}.db")

# Expected canonical column names we'll use in the app:
CANONICAL_COLS = {
    "department": "Department",
    "dept": "Department",
    "year": "Year",
    "semester": "Semester",
    "student_name": "Student_Name",
    "studentname": "Student_Name",
    "university_seat_number": "University_Seat_Number",
    "university seat number": "University_Seat_Number",
    "universityseatnumber": "University_Seat_Number",
    "grand_total_marks": "Grand_Total_Marks",
    "grand total marks": "Grand_Total_Marks",
    "grandtotalmarks": "Grand_Total_Marks",
    "total_marks": "Grand_Total_Marks",
    "total marks": "Grand_Total_Marks"
}

_cached_df = None


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    new_cols = {}
    for col in df.columns:
        key = col.strip().lower().replace(" ", "_")
        if key in CANONICAL_COLS:
            new_cols[col] = CANONICAL_COLS[key]
        else:
            key2 = key.replace("_", "")
            if key2 in CANONICAL_COLS:
                new_cols[col] = CANONICAL_COLS[key2]
            else:
                new_cols[col] = col.strip().replace(" ", "_")
    df = df.rename(columns=new_cols)
    return df


def load_data(force_reload: bool = False) -> pd.DataFrame:
    """
    Load the results table from the SQLite DB into a pandas DataFrame and cache it.
    Automatically looks for a DB named student_results_<date>.db.
    """
    global _cached_df
    if _cached_df is not None and not force_reload:
        return _cached_df

    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database not found at {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    try:
        possible_tables = ["results", "result", "student_results", "result_sheet"]
        table = None

        for t in possible_tables:
            cursor = conn.execute(
                f"SELECT name FROM sqlite_master WHERE type='table' AND name='{t}'"
            ).fetchone()
            if cursor:
                table = t
                break

        if table is None:
            rows = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
            if not rows:
                raise RuntimeError("No tables found in the database.")
            table = rows[0][0]

        df = pd.read_sql_query(f"SELECT * FROM {table}", conn)
        df = _normalize_columns(df)

        for required in [
            "Department",
            "Year",
            "Semester",
            "Student_Name",
            "University_Seat_Number",
            "Grand_Total_Marks",
        ]:
            if required not in df.columns:
                df[required] = pd.NA

        df["Year"] = df["Year"].astype(str).fillna("Unknown")
        df["Semester"] = df["Semester"].astype(str).fillna("Unknown")
        df["Department"] = df["Department"].astype(str).fillna("Unknown")
        df["Grand_Total_Marks"] = pd.to_numeric(df["Grand_Total_Marks"], errors="coerce").fillna(0).astype(int)

        _cached_df = df
        return _cached_df

    finally:
        conn.close()
