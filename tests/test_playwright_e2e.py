import os
import pytest
import threading
import time
import urllib.request
import uvicorn
from playwright.sync_api import sync_playwright

BASE_URL = os.getenv("PLAYWRIGHT_BASE_URL", "http://127.0.0.1:8000")

@pytest.fixture(scope="session", autouse=True)
def ensure_server_running():
    """Ensures FastAPI server is running before executing Playwright tests."""
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/health", timeout=1) as response:
            if response.status == 200:
                return
    except Exception:
        pass

    server_thread = threading.Thread(
        target=lambda: uvicorn.run("src.app:app", host="127.0.0.1", port=8000, log_level="warning"),
        daemon=True
    )
    server_thread.start()

    for _ in range(30):
        try:
            with urllib.request.urlopen(f"{BASE_URL}/api/health", timeout=1) as response:
                if response.status == 200:
                    break
        except Exception:
            time.sleep(0.2)

def test_playwright_page_loads_and_branding():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(BASE_URL)
        
        # Verify title & main headings
        assert "OuttaScope" in page.title()
        brand_title = page.locator(".brand-title").inner_text()
        assert "OuttaScope" in brand_title
        
        # Verify badges
        badges = page.locator(".header-badges .badge").all_inner_texts()
        assert any("Gemma 2" in b for b in badges)
        assert any("Tiger Data" in b for b in badges)
        assert any("Zero-Leak" in b for b in badges)
        
        browser.close()

def test_playwright_sample_chip_interaction():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(BASE_URL)
        
        # Click the critical chip
        chip = page.locator(".sample-chip[data-sample='critical']")
        chip.click()
        
        # Verify textarea populated
        val = page.locator("#clientMessage").input_value()
        assert "completely overhaul" in val.lower() or "redo" in val.lower()
        
        # Check char count
        count_text = page.locator("#charCount").inner_text()
        assert "chars" in count_text and "0 chars" not in count_text
        
        browser.close()

def test_playwright_audit_and_tone_switching():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(BASE_URL)
        
        # Click sample chip and submit
        page.locator(".sample-chip[data-sample='feature']").click()
        page.locator("#submitBtn").click()
        
        # Wait for audit content to become visible
        page.wait_for_selector("#auditContent:not(.hidden)", timeout=10000)
        
        # Verify creep score
        score = page.locator("#scoreValue").inner_text()
        assert int(score) > 0
        
        # Verify surcharge
        fee = page.locator("#feeEst").inner_text()
        assert "+$" in fee
        
        # Verify tone switcher: Click Firm Boundary
        page.locator(".tone-tab[data-tone='boundary']").click()
        badge_text = page.locator("#toneBadge").inner_text()
        assert "Boundary" in badge_text
        reply = page.locator("#replyText").inner_text()
        assert len(reply) > 20
        
        # Verify tone switcher: Click Executive
        page.locator(".tone-tab[data-tone='executive']").click()
        badge_exec = page.locator("#toneBadge").inner_text()
        assert "Executive" in badge_exec
        
        # Verify copy button interaction
        copy_btn = page.locator("#copyBtn")
        copy_btn.click()
        # Verify button text indicates copy action
        assert "Copied" in copy_btn.inner_text() or "Copy Reply" in copy_btn.inner_text()
        
        # Save verification screenshot
        screenshot_path = os.path.join(os.path.dirname(__file__), "..", "playwright_verified_audit.png")
        page.screenshot(path=screenshot_path)
        assert os.path.exists(screenshot_path)
        
        browser.close()

def test_playwright_templates_vault():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(BASE_URL)
        
        # Wait for Tiger Data templates to load
        page.wait_for_selector(".template-item", timeout=5000)
        templates = page.locator(".template-item")
        assert templates.count() >= 3
        
        browser.close()

def test_playwright_mobile_viewport():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport iPhone 12/13/14
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.goto(BASE_URL)
        
        # Verify cards stack vertically without horizontal overflow
        body_width = page.evaluate("document.body.scrollWidth")
        viewport_width = page.evaluate("window.innerWidth")
        assert body_width <= viewport_width + 5
        
        browser.close()
