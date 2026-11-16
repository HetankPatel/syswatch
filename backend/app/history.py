import sqlite3
from datetime import datetime, timezone
from pathlib import Path


DB_PATH = Path(__file__).resolve().parent.parent / "syswatch.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS metric_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                cpu_percent REAL NOT NULL,
                memory_percent REAL NOT NULL,
                disk_percent REAL NOT NULL
            )
            """
        )


def save_metrics(metrics):
    timestamp = datetime.now(timezone.utc).isoformat()

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO metric_history (
                timestamp,
                cpu_percent,
                memory_percent,
                disk_percent
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                timestamp,
                metrics["cpu_percent"],
                metrics["memory_percent"],
                metrics["disk_percent"],
            ),
        )

        connection.execute(
            """
            DELETE FROM metric_history
            WHERE id NOT IN (
                SELECT id
                FROM metric_history
                ORDER BY id DESC
                LIMIT 500
            )
            """
        )

    return timestamp


def get_metric_history(limit=60):
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                timestamp,
                cpu_percent,
                memory_percent,
                disk_percent
            FROM metric_history
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    return [dict(row) for row in reversed(rows)]
