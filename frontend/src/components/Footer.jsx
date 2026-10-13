import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t-2 border-dashed border-pencil/30 text-center font-body text-lg text-pencil/70 pb-12">
      <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
        <a
          href="https://github.com/sachinn-alt/outtascope"
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading font-bold text-pencil hover:text-markerRed underline decoration-wavy decoration-markerRed transition-colors"
        >
          🐙 View GitHub Repository
        </a>
        <span>•</span>
        <a
          href="https://dev.to/challenges/hacktoberfest-week2-2026-10-12"
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading font-bold text-pencil hover:text-penBlue underline decoration-wavy decoration-penBlue transition-colors"
        >
          🎃 Hacktoberfest 2026 Week 2 Entry
        </a>
        <span>•</span>
        <span className="bg-white border border-pencil px-2.5 py-0.5 rounded-wobbly-sm shadow-hard-sm">
          🔒 Zero-Leak Privacy via Google Gemma 2
        </span>
      </div>

      <p className="font-body text-base text-pencil/60">
        Handcrafted for freelancers, developers, video editors, and designers battling unpaid revisions. Free & Open Source under MIT License.
      </p>
    </footer>
  );
}
