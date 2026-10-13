# 🎨 Design Specification & UI Architecture (DESIGN.md)
## OuttaScope — Client Scope Creep & Revision Shield

- **Document Version:** 1.0.0
- **Status:** Active
- **Target Audience:** Freelance developers, video editors, designers, and creators

---

## 1. Design Philosophy: "Confidence Under Pressure"

When a client sends a demanding revision message at odd hours, the freelancer experiences immediate emotional friction: guilt, anxiety, and fear of confrontation. 

The design of **OuttaScope** is intentionally crafted to counteract this anxiety:
1. **Calm, High-Status Authority:** A dark, ambient, glassmorphic aesthetic inspired by premium IDEs and legal fintech consoles.
2. **Objective Metrics:** The **Creep Meter (0–100)** converts subjective feelings of frustration into hard, objective contractual data.
3. **Low-Cognitive-Load Action:** One-click sample triggers, clear tone switches, and instant copy buttons reduce the time from panic to a sent reply to under 10 seconds.

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Color Palette

```
Background Primary:      #0a0d14  (Deep void navy)
Card Surface:           rgba(18, 24, 38, 0.75) with blur(16px)
Card Surface Hover:     rgba(26, 34, 52, 0.85)
Input Surface:          rgba(13, 17, 28, 0.85)
Border Default:         rgba(255, 255, 255, 0.08)
Border Highlight:       rgba(99, 102, 241, 0.40)
```

#### Severity Status Tokens:
- 🚨 **CRITICAL (80–100):** `#f43f5e` (Rose/Crimson) — Substantial architectural overhaul or complete rework.
- 🟠 **HIGH (60–79):** `#fb923c` (Vibrant Orange) — New unbudgeted features or rush deadlines.
- 🟡 **MODERATE (40–59):** `#facc15` (Amber Gold) — Unscheduled revision expansion or aesthetic loops.
- 🟢 **MILD (0–39):** `#10b981` (Emerald Green) — Minor adjustments within normal deliverable boundaries.

### 2.2 Typography System

- **Primary UI Typeface:** `Plus Jakarta Sans` (Google Fonts)
  - Headings: 700 / 800 weight, tight tracking (`-0.03em`).
  - Body: 400 / 500 weight, line-height `1.6`.
- **Monospace & Numbers:** `JetBrains Mono`
  - Used for Creep Meter values, budget figures, and line-item add-ons.

---

## 3. Information Architecture & Wireframe Layout

The desktop interface uses a balanced **Split-View Workbench**:

```
+-----------------------------------------------------------------------------------+
|  [🛡️ OuttaScope]  Client Scope Creep Shield    [Gemma 2] [Tiger Data] [Zero Leak] |
+-----------------------------------------------------------------------------------+
|                                        |                                          |
|  LEFT: INPUT WORKBENCH                 |  RIGHT: LIVE AUDIT DASHBOARD             |
|  - Service Niche (Web, Video, Design)  |  - Creep Score Gauge (e.g., 85/100)      |
|  - Agreed Milestone Budget ($)         |  - Infraction Tag (CRITICAL OVERHAUL)    |
|  - Sample Toxic Message Chips (3)      |  - Recommended Add-on Badge (+$175)      |
|  - Client Message Textarea             |  - Scope Breach Assessment               |
|  - [🛡️ Analyze Scope & Generate Push]   |  - Tone Tabs: [Diplomatic][Boundary][Exec]|
|                                        |  - Active Response Card with [Copy Btn]  |
|                                        |  - Change Order Mini-Invoice Line Items  |
|                                        |                                          |
+-----------------------------------------------------------------------------------+
|  BOTTOM: TIGER DATA CANNED BOUNDARY TEMPLATES VAULT                               |
|  [The Friendly Up-Charge]      [The Phase 2 Gatekeeper]      [Formal Change Order]|
+-----------------------------------------------------------------------------------+
```

---

## 4. Component Design Specifications

### 4.1 Ambient Glow Atmosphere
Three blurred radial gradient orbs (`--orb-1`, `--orb-2`, `--orb-3`) sit in the background layer at 15–20% opacity. They create a soft, cinematic depth without distracting from text readability.

### 4.2 The Creep Meter Gauge
- A circular badge with a glowing perimeter matching the infraction severity color.
- Numbers animate smoothly from 0 to the calculated score.
- Paired with an uppercase pill tag (`CRITICAL INFRACTION`) to eliminate ambiguity.

### 4.3 Multi-Tone Pushback Switcher
Segmented control with 3 tabs:
1. `🟢 Diplomatic & Collaborative`: Warm, relationship-preserving, proposes an add-on quote.
2. `🟡 Firm Boundary`: Politely holds the line to finish current milestone first.
3. `🔴 Executive Change Order`: Objective contractual notice for agencies and enterprise clients.

### 4.4 One-Click Copy Feedback Loop
- Default State: `📋 Copy Reply` with soft border.
- Hover State: Violet highlight glow.
- Clicked State: Micro-interaction toggles to `✅ Copied!` with emerald green border for 2.5 seconds.

---

## 5. Responsive Behavior

| Breakpoint | Layout Adjustment |
| :--- | :--- |
| **Desktop (> 900px)** | Side-by-side 2-column split view (50% input / 50% results). |
| **Tablet (600px – 900px)** | Stacked single-column view with full-width cards. |
| **Mobile (< 600px)** | Stacked form fields, wrap chip buttons, scrollable tone tabs. |

---

## 6. Accessibility & Usability (WCAG AA Compliance)

- **Contrast Ratios:** White text (`#f8fafc`) on dark surfaces (`#0a0d14` / `#121826`) exceeds a **12:1 contrast ratio** (surpassing the 4.5:1 AA requirement).
- **Semantic HTML:** Proper heading hierarchy (`<h1>` through `<h4>`), form labels linked to input IDs, and `role="tablist"` for tone controls.
- **Keyboard Navigation:** Full tab-order focus styling with 3px glowing focus rings.
