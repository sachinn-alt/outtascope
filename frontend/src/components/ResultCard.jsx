import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function ResultCard({ auditResult, result, rateMultiplier }) {
  const [activeTone, setActiveTone] = useState("diplomatic");
  const [copied, setCopied] = useState(false);

  const activeAudit = auditResult || result;

  if (!activeAudit) {
    return (
      <div className="card relative bg-white/60 border-2 border-dashed border-pencil/40 rounded-wobbly-md p-8 shadow-hard-subtle text-center flex flex-col items-center justify-center min-h-[420px]">
        <div className="thumbtack-blue"></div>
        <div className="text-6xl mb-4 transform -rotate-3 select-none">
          📋
        </div>
        <h3 className="font-heading text-2xl font-bold text-pencil mb-2">
          Ready for Scope Analysis
        </h3>
        <p className="font-body text-xl text-pencil/70 max-w-md">
          Fill out the project details on the left, paste the client's message, and click <span className="font-bold text-markerRed">Analyze Scope</span> to generate non-confrontational boundary responses!
        </p>
      </div>
    );
  }

  const {
    infraction_level = "MODERATE",
    creep_score = 65,
    primary_category = "Feature Creep",
    why_out_of_scope = "This request expands beyond agreed deliverables.",
    replies = {},
    change_order = {}
  } = activeAudit;

  // Recalibrate fee with rateMultiplier
  const baseFee = change_order.suggested_fee || 150;
  const calibratedFee = Math.round(baseFee * (rateMultiplier || 1.0));
  const timelineDays = change_order.timeline_extension_days || 3;
  const lineItems = change_order.line_items || [
    "Supplemental feature module development",
    "Regression testing & interface verification",
    "Production asset deployment & sign-off"
  ];

  const currentReplyText = replies[activeTone] || replies.diplomatic || "";

  // Trigger celebration confetti & copy
  const handleCopy = () => {
    navigator.clipboard.writeText(currentReplyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff4d4d', '#2d5da1', '#fff9c4', '#2d2d2d']
    });
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentReplyText)}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Project Scope Update: ${primary_category}`);
    const body = encodeURIComponent(currentReplyText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Export Change Order as Markdown
  const handleDownloadChangeOrder = () => {
    const mdContent = `# SUPPLEMENTARY CHANGE ORDER AGREEMENT
**Date:** ${new Date().toISOString().split('T')[0]}
**Status:** Pending Client Approval
**Severity Category:** ${primary_category} (${infraction_level} - Creep Score: ${creep_score}/100)

---

## 1. Scope Delta Description
${why_out_of_scope}

## 2. Deliverable Line Items
${lineItems.map(item => `- [ ] ${item}`).join('\n')}

## 3. Financial & Schedule Adjustment
- **Supplementary Fee:** $${calibratedFee} USD (Multiplier: ${rateMultiplier}x)
- **Timeline Extension:** +${timelineDays} Business Days

---

## 4. Sign-off
**Freelancer Signature:** ______________________
**Client Signature:**     ______________________
`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Change_Order_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Severity color styles
  const isCritical = infraction_level === "CRITICAL" || creep_score >= 80;
  const isHigh = infraction_level === "HIGH" || creep_score >= 60;
  const stampBg = isCritical ? "bg-markerRed text-white" : isHigh ? "bg-postit text-pencil" : "bg-[#dcfce7] text-pencil";

  return (
    <div id="resultCard" className="card relative bg-white border-2 border-pencil rounded-wobbly-md p-6 md:p-8 shadow-hard-lg">
      <div className="tape-strip"></div>
      <div className="thumbtack-blue"></div>

      <div id="auditContent">
        {/* Header & Severity Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-pencil/20 pb-4 mb-6">
          <div>
            <span className="font-heading text-xs uppercase tracking-wider text-pencil/60">
              Audit Verdict
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-pencil">
              🚨 Scope Creep Diagnosis
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Stamp Badge */}
            <div
              id="infractionBadge"
              className={`font-heading text-lg font-bold px-3 py-1 border-2 border-pencil rounded-wobbly-badge shadow-hard-sm transform rotate-2 ${stampBg}`}
            >
              {infraction_level} ALERT
            </div>
            <span
              id="categoryTag"
              className="font-body text-base font-bold bg-[#faf7f2] border-2 border-pencil rounded-wobbly-sm px-2.5 py-1 text-pencil shadow-hard-sm"
            >
              {primary_category}
            </span>
          </div>
        </div>

        {/* Creep Meter Graphic */}
        <div className="bg-[#faf7f2] border-2 border-pencil rounded-wobbly-sm p-4 mb-6 shadow-hard-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-heading text-base font-bold text-pencil">
              📊 Scope Expansion Meter:
            </span>
            <div className="flex items-center gap-2">
              <span
                id="creepScoreVal"
                className="font-heading text-xl font-bold text-markerRed px-2 py-0.5 bg-white border border-pencil rounded-wobbly-sm shadow-hard-sm"
              >
                <span id="scoreValue">{creep_score}</span> / 100
              </span>
            </div>
          </div>
          <div className="w-full h-5 bg-oldpaper border-2 border-pencil rounded-wobbly-sm overflow-hidden p-0.5">
            <div
              id="creepMeterFill"
              className="h-full bg-markerRed border-r-2 border-pencil rounded-wobbly-sm transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, creep_score))}%` }}
            ></div>
          </div>
          <div className="flex justify-between font-body text-xs text-pencil/60 mt-1">
            <span>0 (Agreed Milestone)</span>
            <span>50 (Scope Creep)</span>
            <span>100 (Unpaid Architectural Spiral)</span>
          </div>
        </div>

        {/* Tiger Data Historical Precedent Callout */}
        {activeAudit.precedent && activeAudit.precedent.has_precedent && (
          <div className="bg-[#f0fdf4] border-2 border-pencil rounded-wobbly-sm p-3.5 mb-6 shadow-hard-sm transform rotate-0.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading font-bold text-base text-pencil flex items-center gap-1.5">
                <span>🐯</span> Tiger Data Precedent ({activeAudit.precedent.similarity_pct}% Semantic Match)
              </span>
              <span className="font-heading text-xs bg-white border border-pencil rounded-wobbly-sm px-2 py-0.5 text-markerRed font-bold shadow-hard-sm">
                Past Fee: +${activeAudit.precedent.past_fee}
              </span>
            </div>
            <p className="font-body text-base text-pencil/80">
              Similar {activeAudit.precedent.matched_category} detected in your historical audits:
              <span className="italic font-bold text-pencil"> "{activeAudit.precedent.past_message_snippet}"</span>
            </p>
          </div>
        )}

        {/* Contractual Justification Callout */}
        <div className="bg-postit border-2 border-pencil rounded-wobbly-sm p-4 mb-6 shadow-hard-sm transform -rotate-0.5">
          <div className="font-heading text-base font-bold text-pencil flex items-center gap-1.5 mb-1">
            <span>⚖️</span> Why This Violates Baseline Scope:
          </div>
          <p id="whyOutOfScope" className="font-body text-xl text-pencil leading-relaxed">
            {why_out_of_scope}
          </p>
        </div>

        {/* Client Red-Flag Risk Radar Card */}
        <div className="bg-[#fff1f2] border-2 border-pencil rounded-wobbly-sm p-4 mb-6 shadow-hard-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚩</span>
              <h4 className="font-heading text-lg font-bold text-pencil">
                Client Scope Risk Radar
              </h4>
            </div>
            <div className="font-heading text-xl font-bold bg-white text-markerRed border-2 border-markerRed rounded-wobbly-badge px-3 py-0.5 shadow-hard-sm transform rotate-2">
              Grade: {creep_score >= 80 ? "F (Critical)" : creep_score >= 65 ? "D (High Risk)" : creep_score >= 45 ? "C (Warning)" : "B (Manageable)"}
            </div>
          </div>
          <ul className="font-body text-base space-y-1 text-pencil/90 pl-1">
            <li className="flex items-center gap-2">
              <span className="text-markerRed font-bold">⚠️</span> {creep_score >= 70 ? "Unbounded revision escalation without budget allocation" : "Incremental task expansion outside signed deliverables"}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-markerRed font-bold">⚠️</span> {infraction_level === "CRITICAL" ? "Timeline compression violates milestone delivery schedule" : "Requires supplementary architectural sign-off"}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pencil font-bold">💡</span> <span className="font-bold">Recommendation:</span> Do not start unpaid work. Dispatch the diplomatic or change order pushback below immediately.
            </li>
          </ul>
        </div>

        {/* Split Grid for Pushback Response + Change Order Invoice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Wing: Pushback Tone Selector & Dispatch Bar */}
          <div className="flex flex-col space-y-3">
            {/* Tone Selection Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading text-base font-bold text-pencil">
                  💬 Choose Response Tone:
                </span>
                <span
                  id="toneBadge"
                  className="font-heading text-xs font-bold bg-white border border-pencil rounded-wobbly-sm px-2 py-0.5 shadow-hard-sm"
                >
                  {activeTone === "boundary" ? "Firm Boundary" : activeTone === "executive" ? "Executive Change Order" : "Diplomatic"}
                </span>
              </div>
              <div className="tone-tabs flex flex-wrap gap-2">
                {[
                  { id: "diplomatic", label: "🟢 Diplomatic & Warm" },
                  { id: "boundary", label: "🟡 Firm Boundary" },
                  { id: "executive", label: "🔴 Executive Change Order" }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    data-tone={t.id}
                    onClick={() => setActiveTone(t.id)}
                    className={`tone-tab font-body text-base px-3 py-1.5 border-2 border-pencil rounded-wobbly-btn transition-all ${
                      activeTone === t.id
                        ? 'bg-pencil text-white shadow-hard-sm transform -translate-y-0.5'
                        : 'bg-white text-pencil hover:bg-oldpaper shadow-hard-sm'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Box */}
            <div className="relative">
              <div
                id="responseBox"
                className="font-body text-lg text-pencil bg-[#faf7f2] border-2 border-pencil rounded-wobbly-sm p-3.5 min-h-[140px] whitespace-pre-wrap shadow-hard-sm leading-relaxed"
              >
                <div id="replyText">{currentReplyText}</div>
              </div>
            </div>

            {/* Direct Action Dispatch Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                id="copyBtn"
                onClick={handleCopy}
                className="hand-drawn-btn font-heading text-sm font-bold bg-white hover:bg-postit text-pencil border-2 border-pencil rounded-wobbly-btn px-3.5 py-1.5 shadow-hard-sm flex items-center gap-1.5"
              >
                {copied ? "✅ Copied!" : "📋 Copy Reply"}
              </button>
              <button
                type="button"
                id="whatsappBtn"
                onClick={handleWhatsApp}
                className="hand-drawn-btn font-heading text-sm font-bold bg-[#dcfce7] hover:bg-[#bbf7d0] text-pencil border-2 border-pencil rounded-wobbly-btn px-3.5 py-1.5 shadow-hard-sm flex items-center gap-1.5"
                title="Open in WhatsApp directly"
              >
                <span>📲</span> Open in WhatsApp
              </button>
              <button
                type="button"
                id="emailBtn"
                onClick={handleEmail}
                className="hand-drawn-btn font-heading text-sm font-bold bg-[#e0f2fe] hover:bg-[#bae6fd] text-pencil border-2 border-pencil rounded-wobbly-btn px-3.5 py-1.5 shadow-hard-sm flex items-center gap-1.5"
                title="Open in Email client directly"
              >
                <span>✉️</span> Open in Email
              </button>
            </div>
          </div>

          {/* Right Wing: Change Order Mini-Invoice (Legal Pad Style) */}
          <div className="change-order-card lined-paper border-2 border-pencil rounded-wobbly-sm p-5 shadow-hard-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-pencil pb-3 mb-3">
              <div>
                <h4 className="font-heading text-xl font-bold text-pencil">
                  📑 Supplementary Change Order Summary
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span id="coFee" className="font-heading text-xl font-bold text-markerRed">
                    <span id="feeEst">+${calibratedFee} USD</span>
                  </span>
                  <span id="coTimeline" className="font-body text-base bg-white border border-pencil rounded-wobbly-sm px-2 py-0.5 text-pencil">
                    +{timelineDays} Business Days
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="downloadCoBtn"
                onClick={handleDownloadChangeOrder}
                className="hand-drawn-btn font-heading text-sm font-bold bg-penBlue text-white border-2 border-pencil rounded-wobbly-btn px-3.5 py-1.5 shadow-hard-sm hover:bg-[#23497e] flex items-center gap-1 self-start sm:self-auto"
                title="Download formal Markdown Change Order"
              >
                ⬇️ Export (.md)
              </button>
            </div>

            <ul id="lineItemsList" className="space-y-1 font-body text-base text-pencil/90 pl-1">
              {lineItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-pencil font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
