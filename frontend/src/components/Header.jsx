import React from 'react';

export default function Header() {
  return (
    <header className="app-header mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b-2 border-dashed border-pencil/30 relative">
      {/* Tape decoration */}
      <div className="tape-strip-left hidden md:block"></div>

      <div>
        <div className="flex items-center gap-3">
          <span className="text-4xl transform -rotate-6 inline-block select-none filter drop-shadow">
            🛡️
          </span>
          <h1 className="brand-title font-heading text-4xl md:text-5xl font-bold tracking-tight text-pencil flex items-center gap-2">
            OuttaScope
            <span className="text-sm font-body font-normal bg-markerRed text-white px-2 py-0.5 rounded-wobbly-sm transform rotate-3 shadow-hard-sm">
              v1.0 Sketchpad
            </span>
          </h1>
        </div>
        <p className="font-body text-xl md:text-2xl text-pencil/80 mt-1 max-w-xl">
          The Client Scope Creep & Unpaid Revision Shield for Freelancers
        </p>
      </div>

      {/* Tilted Sticky Badges (Preserves .header-badges .badge for Playwright) */}
      <div className="header-badges flex flex-wrap gap-2.5 items-center">
        <span className="badge font-body text-base font-bold bg-white text-pencil px-3 py-1 border-2 border-pencil rounded-wobbly-badge shadow-hard-sm transform -rotate-2 hover:rotate-0 transition-transform">
          ⚡ Gemma 2 AI
        </span>
        <span className="badge font-body text-base font-bold bg-postit text-pencil px-3 py-1 border-2 border-pencil rounded-wobbly-badge shadow-hard-sm transform rotate-1 hover:rotate-0 transition-transform">
          🐯 Tiger Data Vault
        </span>
        <span className="badge font-body text-base font-bold bg-[#e0f2fe] text-pencil px-3 py-1 border-2 border-pencil rounded-wobbly-badge shadow-hard-sm transform -rotate-1 hover:rotate-0 transition-transform">
          🔒 Zero-Leak Privacy
        </span>
        <span className="badge font-body text-base font-bold bg-[#dcfce7] text-pencil px-3 py-1 border-2 border-pencil rounded-wobbly-badge shadow-hard-sm transform rotate-2 hover:rotate-0 transition-transform">
          🏷️ 100% Free
        </span>
      </div>
    </header>
  );
}
