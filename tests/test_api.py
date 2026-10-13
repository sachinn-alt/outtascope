import os
import sys
import pytest
from starlette.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))
from app import app

client = TestClient(app)

def test_health_check_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Gemma 2" in data["model"]
    assert "Tiger Data" in data["database"]

def test_get_templates_endpoint():
    res = client.get("/api/templates")
    assert res.status_code == 200
    templates = res.json()
    assert isinstance(templates, list)
    assert len(templates) > 0

def test_audit_scope_success():
    payload = {
        "client_message": "Hey loved the draft, but can we also add a full Stripe payment gateway and customer dashboard by tonight?",
        "project_type": "web_dev",
        "budget": 600.0
    }
    res = client.post("/api/audit", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "infraction_level" in data
    assert "creep_score" in data
    assert data["creep_score"] > 0
    assert "replies" in data
    assert "diplomatic" in data["replies"]
    assert "change_order" in data
    assert data["change_order"]["suggested_fee"] > 0
    assert "audit_id" in data

def test_audit_scope_validation_error():
    # Empty message should fail validation
    payload = {
        "client_message": "   ",
        "project_type": "web_dev",
        "budget": 500.0
    }
    res = client.post("/api/audit", json=payload)
    assert res.status_code in [400, 422]

def test_get_history_endpoint():
    res = client.get("/api/history?limit=5")
    assert res.status_code == 200
    history = res.json()
    assert isinstance(history, list)
