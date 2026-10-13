import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const FALLBACK_TEMPLATES = [
  {
    id: 1,
    title: "Milestone Deliverable Gate Clause",
    category: "Contract Defense",
    response_text: "Per our agreed milestone agreement, all Phase 1 deliverables must be formally reviewed and approved before any supplementary features or Phase 2 change orders can commence."
  },
  {
    id: 2,
    title: "Major Revision Surcharge Notice",
    category: "Pricing Boundary",
    response_text: "Requests that fundamentally alter approved wireframes, database schemas, or project architecture will be quoted under a formal Change Order at our standard supplemental development rate."
  },
  {
    id: 3,
    title: "Infinite Aesthetic Revision Cap",
    category: "Design Scope",
    response_text: "Our initial project fee covers two (2) rounds of focused cosmetic adjustments. Additional exploratory design variations are billed hourly or via an add-on design sprint package."
  },
  {
    id: 4,
    title: "Late-Stage Timeline Compression Fee",
    category: "Emergency Rush",
    response_text: "Accelerating agreed release deadlines requires rescheduling other studio commitments and incurs an emergency rush surcharge of 50% to guarantee weekend delivery."
  }
];

export default function TemplatesVault({ onInsertClause }) {
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
        } else if (data && data.templates && Array.isArray(data.templates)) {
          setTemplates(data.templates);
        }
      })
      .catch(() => {
        // Fallback already pre-set
      });
  }, []);

  const handleCopyClause = (tpl) => {
    navigator.clipboard.writeText(tpl.response_text);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 1800);

    if (onInsertClause) {
      onInsertClause(tpl.response_text);
    }

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#ff4d4d', '#2d5da1', '#fff9c4']
    });
  };

  const bgColors = ["bg-postit", "bg-[#e0f2fe]", "bg-[#fef08a]", "bg-[#dcfce7]"];
  const tilts = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];

  return (
    <section className="templates-vault mt-14 border-t-2 border-dashed border-pencil/30 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none">📌</span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-pencil">
              Tiger Data Boundary Clause Vault
            </h3>
          </div>
          <p className="font-body text-xl text-pencil/70">
            Battle-tested contract clauses and boundary pushback templates to protect your agreements.
          </p>
        </div>
        <span className="font-heading text-sm bg-white border-2 border-pencil rounded-wobbly-sm px-3 py-1 text-pencil shadow-hard-sm self-start sm:self-auto transform -rotate-1">
          🐯 PostgreSQL / Tiger DB
        </span>
      </div>

      {/* Corkboard Grid (Preserves #templatesGrid, .templates-grid, .template-card, .template-tag for Playwright) */}
      <div id="templatesGrid" className="templates-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tpl, idx) => {
          const bg = bgColors[idx % bgColors.length];
          const tilt = tilts[idx % tilts.length];

          return (
            <div
              key={tpl.id || idx}
              onClick={() => handleCopyClause(tpl)}
              className={`template-card template-item relative ${bg} border-2 border-pencil rounded-wobbly-sm p-5 shadow-hard-sm hover:shadow-hard transform ${tilt} hover:rotate-0 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between`}
            >
              {/* Thumbtack pin */}
              <div className={idx % 2 === 0 ? "thumbtack-red" : "thumbtack-blue"}></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="template-tag font-heading text-xs font-bold uppercase tracking-wider bg-white/90 border border-pencil rounded-wobbly-sm px-2 py-0.5 text-pencil">
                    {tpl.category}
                  </span>
                  <span className="font-body text-xs text-pencil/60">
                    Click to Copy
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-pencil mb-2 leading-snug">
                  {tpl.title}
                </h4>

                <p className="font-body text-base text-pencil/80 leading-relaxed mb-4">
                  "{tpl.response_text}"
                </p>
              </div>

              <div className="pt-2 border-t border-pencil/20 flex items-center justify-between font-body text-sm font-bold text-pencil">
                <span>{copiedId === tpl.id ? "✅ Copied to Clipboard!" : "📋 Insert Clause"}</span>
                <span className="text-pencil/50">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
