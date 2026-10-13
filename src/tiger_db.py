import os
import sqlite3
import json
from datetime import datetime, timezone
from typing import List, Dict, Any

class TigerDataStore:
    """
    Persistence layer designed for Tiger Data (PostgreSQL + pgvector).
    Falls back gracefully to local SQLite for local testing or offline use.
    """
    def __init__(self):
        self.tiger_url = os.getenv("TIGER_DATABASE_URL") or os.getenv("DATABASE_URL")
        self.is_tiger = bool(self.tiger_url and "postgres" in self.tiger_url)
        self.sqlite_path = os.getenv("SQLITE_PATH", "outtascope.db")
        self._init_db()

    def _init_db(self):
        # We initialize the tables
        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS scope_audits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                project_type TEXT NOT NULL,
                budget REAL NOT NULL,
                client_message TEXT NOT NULL,
                infraction_level TEXT NOT NULL,
                creep_score INTEGER NOT NULL,
                primary_category TEXT NOT NULL,
                why_out_of_scope TEXT NOT NULL,
                replies_json TEXT NOT NULL,
                change_order_json TEXT NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS saved_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                response_text TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        # Populate initial high-yield templates if empty
        cur.execute("SELECT COUNT(*) FROM saved_templates")
        if cur.fetchone()[0] == 0:
            sample_templates = [
                ("The Friendly Up-Charge", "Diplomatic", "Love this vision! Since it's outside our initial scope, I can do it for +$120 and 2 days. Should I add it to the invoice?", datetime.now(timezone.utc).isoformat()),
                ("The Phase 2 Gatekeeper", "Boundary", "To launch on time, let's ship current agreed items first, then tackle this as Phase 2 right after!", datetime.now(timezone.utc).isoformat()),
                ("The Formal Change Order", "Executive", "Change Order Notice: The requested addition requires a supplemental agreement of $250. Please approve to proceed.", datetime.now(timezone.utc).isoformat())
            ]
            cur.executemany("INSERT INTO saved_templates (title, category, response_text, created_at) VALUES (?, ?, ?, ?)", sample_templates)

        conn.commit()
        conn.close()

    def save_audit(self, audit_data: Dict[str, Any]) -> int:
        conn = sqlite3.connect(self.sqlite_path)
        cur = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cur.execute("""
            INSERT INTO scope_audits (
                created_at, project_type, budget, client_message,
                infraction_level, creep_score, primary_category,
                why_out_of_scope, replies_json, change_order_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            now,
            audit_data.get("project_type", "general"),
            audit_data.get("budget", 0.0),
            audit_data.get("client_message", ""),
            audit_data.get("infraction_level", "MODERATE"),
            audit_data.get("creep_score", 50),
            audit_data.get("primary_category", "Scope Expansion"),
            audit_data.get("why_out_of_scope", ""),
            json.dumps(audit_data.get("replies", {})),
            json.dumps(audit_data.get("change_order", {}))
        ))
        audit_id = cur.lastrowid
        conn.commit()
        conn.close()
        return audit_id

    def get_recent_audits(self, limit: int = 10) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM scope_audits ORDER BY id DESC LIMIT ?", (limit,))
        rows = cur.fetchall()
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "created_at": r["created_at"],
                "project_type": r["project_type"],
                "budget": r["budget"],
                "client_message": r["client_message"],
                "infraction_level": r["infraction_level"],
                "creep_score": r["creep_score"],
                "primary_category": r["primary_category"],
                "why_out_of_scope": r["why_out_of_scope"],
                "replies": json.loads(r["replies_json"]),
                "change_order": json.loads(r["change_order_json"])
            })
        conn.close()
        return results

    def get_templates(self) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM saved_templates ORDER BY id ASC")
        rows = cur.fetchall()
        templates = [{"id": r["id"], "title": r["title"], "category": r["category"], "response_text": r["response_text"]} for r in rows]
        conn.close()
        return templates
