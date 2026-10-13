import os
import sys

# Ensure src directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from gemma_engine import GemmaScopeEngine
from tiger_db import TigerDataStore

app = FastAPI(
    title="OuttaScope API",
    description="The Client Scope Creep & Unpaid Revision Shield powered by Gemma 2 & Tiger Data",
    version="1.0.0"
)

engine = GemmaScopeEngine()
db = TigerDataStore()

# Request Models
class AuditRequest(BaseModel):
    client_message: str = Field(..., min_length=5, description="The message, email, or chat text from the client")
    project_type: str = Field(default="web_dev", description="Type of project: web_dev, video_edit, graphic_design, writing, mobile_app")
    budget: float = Field(default=500.0, ge=0, description="Agreed milestone or project fee in USD")

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
async def serve_index():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "OuttaScope API is live. Static frontend initializing."}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "OuttaScope",
        "model": "Gemma 2 (Open-Weight Model)",
        "database": "Tiger Data (PostgreSQL / SQLite fallback)"
    }

@app.post("/api/audit")
async def audit_scope(req: AuditRequest):
    if not req.client_message.strip():
        raise HTTPException(status_code=400, detail="Client message cannot be empty")
    
    # 1. Run Gemma 2 Scope Audit
    audit_result = await engine.analyze_scope(
        client_message=req.client_message,
        project_type=req.project_type,
        agreed_budget=req.budget
    )
    
    # 2. Persist audit to Tiger Data
    audit_data_to_save = {
        **audit_result,
        "project_type": req.project_type,
        "budget": req.budget,
        "client_message": req.client_message
    }
    audit_id = db.save_audit(audit_data_to_save)
    audit_result["audit_id"] = audit_id

    return audit_result

@app.get("/api/history")
async def get_history(limit: int = 10):
    return db.get_recent_audits(limit=limit)

@app.get("/api/templates")
async def get_templates():
    return db.get_templates()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
