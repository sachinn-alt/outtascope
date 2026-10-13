import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))
from gemma_engine import GemmaScopeEngine

def test_architectural_overhaul():
    engine = GemmaScopeEngine()
    msg = "I showed this to the board and we want to completely start over with a fresh concept and change the whole structure."
    res = asyncio.run(engine.analyze_scope(msg, "web_dev", 1000.0))
    
    assert res["infraction_level"] == "CRITICAL"
    assert res["creep_score"] >= 80
    assert "Architectural Overhaul" in res["primary_category"]
    assert "diplomatic" in res["replies"]
    assert "boundary" in res["replies"]
    assert "executive" in res["replies"]
    assert res["change_order"]["suggested_fee"] > 0
    assert res["change_order"]["timeline_extension_days"] >= 3

def test_feature_creep():
    engine = GemmaScopeEngine()
    msg = "Hey can we also add a payment gateway, user authentication, and an e-commerce catalog before launch?"
    res = asyncio.run(engine.analyze_scope(msg, "web_dev", 500.0))
    
    assert res["infraction_level"] == "HIGH"
    assert res["creep_score"] >= 75
    assert "Feature Creep" in res["primary_category"]
    assert len(res["change_order"]["line_items"]) >= 1

def test_timeline_compression():
    engine = GemmaScopeEngine()
    msg = "We need all of these revisions delivered by tomorrow morning ASAP or tonight!"
    res = asyncio.run(engine.analyze_scope(msg, "video_edit", 300.0))
    
    assert res["infraction_level"] == "HIGH"
    assert "Timeline Compression" in res["primary_category"]
    assert res["change_order"]["timeline_extension_days"] >= 1

def test_response_tone_formats():
    engine = GemmaScopeEngine()
    msg = "Can you tweak the font sizes and change the button colors?"
    res = asyncio.run(engine.analyze_scope(msg, "graphic_design", 400.0))
    
    for tone in ["diplomatic", "boundary", "executive"]:
        assert tone in res["replies"]
        assert len(res["replies"][tone]) > 20

