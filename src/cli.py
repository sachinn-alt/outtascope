import argparse
import asyncio
import sys
import os
import json

# Force UTF-8 stdout on Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure src directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from gemma_engine import GemmaScopeEngine
from tiger_db import TigerDataStore

def print_banner():
    print("""
\033[1;36m====================================================================
 🛡️  OUTTASCOPE CLI — Client Scope Creep & Revision Shield
 Powered by Gemma 2 (Open Weights) & Tiger Data
====================================================================\033[0m
""")

async def run_audit(message: str, project_type: str, budget: float, export_path: str = None):
    print_banner()
    print(f"\033[1;33m[*] Auditing Message:\033[0m \"{message[:80]}...\"")
    print(f"\033[1;33m[*] Service Niche:\033[0m {project_type} | \033[1;33m[*] Base Milestone:\033[0m ${budget:.2f}\n")

    engine = GemmaScopeEngine()
    db = TigerDataStore()

    result = await engine.analyze_scope(message, project_type, budget)

    # Persist
    audit_data = {
        **result,
        "project_type": project_type,
        "budget": budget,
        "client_message": message
    }
    audit_id = db.save_audit(audit_data)

    # Styling outputs
    level = result["infraction_level"]
    color_code = "\033[1;32m" if level == "MILD" else "\033[1;33m" if level == "MODERATE" else "\033[1;31m"

    print(f"--------------------------------------------------------------------")
    print(f"  CREEP SEVERITY SCORE : {color_code}{result['creep_score']} / 100 ({level})\033[0m")
    print(f"  PRIMARY CATEGORY     : \033[1;37m{result['primary_category']}\033[0m")
    print(f"  SUGGESTED SURCHARGE  : \033[1;32m+${result['change_order']['suggested_fee']:.2f}\033[0m")
    print(f"  SCHEDULE ADJUSTMENT  : \033[1;36m+{result['change_order']['timeline_extension_days']} Business Days\033[0m")
    print(f"--------------------------------------------------------------------\n")

    print("\033[1m[📋 SCOPE ASSESSMENT]\033[0m")
    print(result["why_out_of_scope"] + "\n")

    print("\033[1;32m[🟢 1. DIPLOMATIC & COLLABORATIVE REPLY]\033[0m")
    print(result["replies"]["diplomatic"] + "\n")

    print("\033[1;33m[🟡 2. FIRM BOUNDARY REPLY]\033[0m")
    print(result["replies"]["boundary"] + "\n")

    print("\033[1;31m[🔴 3. EXECUTIVE FORMAL CHANGE ORDER]\033[0m")
    print(result["replies"]["executive"] + "\n")

    if export_path:
        export_change_order(result, export_path, audit_id, budget, project_type)
        print(f"\033[1;32m[✓] Change order exported successfully to: {export_path}\033[0m")

def export_change_order(result: dict, path: str, audit_id: int, budget: float, project_type: str):
    fee = result["change_order"]["suggested_fee"]
    days = result["change_order"]["timeline_extension_days"]
    line_items = result["change_order"]["line_items"]
    
    doc = f"""# 📑 FORMAL CHANGE ORDER & SCOPE ADDENDUM
**Document ID:** CO-{audit_id:04d}  
**Date:** {import_datetime().date().isoformat()}  
**Original Deliverable Budget:** ${budget:.2f}  
**Project Category:** {project_type.replace('_', ' ').title()}  

---

### 1. Scope Delta Description
The client has requested modifications beyond the agreed-upon statement of work:
> **Category:** {result['primary_category']}  
> **Severity:** {result['infraction_level']} (Creep Index: {result['creep_score']}/100)  

### 2. Contractual Justification
{result['why_out_of_scope']}

### 3. Add-on Deliverables & Fee Allocation
| Deliverable Item | Estimated Workdays | Line-Item Fee |
| :--- | :---: | :---: |
"""
    for item in line_items:
        doc += f"| {item} | +{days} days | ${fee:.2f} |\n"

    doc += f"""
**Total Supplemental Surcharge:** **${fee:.2f} USD**  
**Schedule Extension:** **+{days} Business Days**  

---
### 4. Client Acceptance & Authorization
By confirming this Change Order, the client agrees to the updated milestone invoice and timeline.

*Client Signature:* __________________________  
*Date:* __________________________  
"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(doc)

def import_datetime():
    from datetime import datetime
    return datetime.utcnow()

def list_templates():
    print_banner()
    db = TigerDataStore()
    templates = db.get_templates()
    print(f"\033[1mFound {len(templates)} Canned Boundary Templates in Tiger Data Vault:\033[0m\n")
    for t in templates:
        print(f"[{t['id']}] \033[1;36m{t['title']}\033[0m ({t['category']})")
        print(f"    \"{t['response_text']}\"\n")

def list_history():
    print_banner()
    db = TigerDataStore()
    history = db.get_recent_audits(10)
    print(f"\033[1mRecent Audits ({len(history)} records):\033[0m\n")
    for h in history:
        print(f"• [ID: {h['id']}] {h['created_at'][:19]} | {h['project_type']} | Score: {h['creep_score']}/100 ({h['infraction_level']}) | +${h['change_order'].get('suggested_fee', 0)}")
        print(f"  Snippet: \"{h['client_message'][:60]}...\"\n")

def main():
    parser = argparse.ArgumentParser(description="OuttaScope CLI — Client Scope Creep & Revision Shield")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Audit command
    audit_parser = subparsers.add_parser("audit", help="Audit a client revision message")
    audit_parser.add_argument("message", type=str, help="Client message, email, or WhatsApp text")
    audit_parser.add_argument("--type", type=str, default="web_dev", choices=["web_dev", "video_edit", "graphic_design", "copywriting", "automation"], help="Service niche")
    audit_parser.add_argument("--budget", type=float, default=500.0, help="Milestone budget in USD")
    audit_parser.add_argument("--export", type=str, default=None, help="File path to export formal Change Order Markdown")

    # Templates command
    subparsers.add_parser("templates", help="List saved boundary templates from Tiger Data")

    # History command
    subparsers.add_parser("history", help="List recent scope audits")

    args = parser.parse_args()

    if args.command == "audit":
        asyncio.run(run_audit(args.message, args.type, args.budget, args.export))
    elif args.command == "templates":
        list_templates()
    elif args.command == "history":
        list_history()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
