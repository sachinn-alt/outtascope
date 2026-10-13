import os
import sys
import tempfile
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))
from tiger_db import TigerDataStore

def test_database_initialization_and_templates():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_path = tmp.name

    try:
        os.environ["SQLITE_PATH"] = db_path
        store = TigerDataStore()
        
        # Verify default templates seeded
        templates = store.get_templates()
        assert len(templates) >= 3
        assert any(t["category"] == "Diplomatic" for t in templates)
        assert any(t["category"] == "Boundary" for t in templates)

        # Verify saving an audit
        sample_audit = {
            "project_type": "web_dev",
            "budget": 750.0,
            "client_message": "Add a new customer portal please",
            "infraction_level": "HIGH",
            "creep_score": 85,
            "primary_category": "Feature Creep",
            "why_out_of_scope": "Testing scope violation rationale",
            "replies": {"diplomatic": "Hello", "boundary": "Wait", "executive": "Change Order"},
            "change_order": {"suggested_fee": 200, "timeline_extension_days": 3, "line_items": ["Portal"]}
        }
        audit_id = store.save_audit(sample_audit)
        assert audit_id > 0

        # Verify audit retrieval
        history = store.get_recent_audits(5)
        assert len(history) >= 1
        latest = history[0]
        assert latest["id"] == audit_id
        assert latest["budget"] == 750.0
        assert latest["primary_category"] == "Feature Creep"
    finally:
        if os.path.exists(db_path):
            os.remove(db_path)
