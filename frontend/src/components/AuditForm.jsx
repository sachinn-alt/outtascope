import React, { useState, useEffect } from 'react';

const PRESETS = [
  {
    sampleKey: "feature",
    label: "Add Flutter App",
    text: "Can you also quickly wrap this into native iOS and Android apps using Flutter by Friday? Shouldn't take long right?",
    type: "web_dev",
    budget: 500,
    agreement: "Build 5 responsive marketing web pages in HTML/Tailwind with a contact form."
  },
  {
    sampleKey: "video",
    label: "10 Extra Video Cuts",
    text: "Loved the draft! Can you make 10 alternative cuts in vertical 9:16 format with different voiceovers and subtitles for TikTok before 9 AM?",
    type: "video_edit",
    budget: 250,
    agreement: "One 60-second landscape YouTube video with 2 rounds of minor pacing revisions."
  },
  {
    sampleKey: "critical",
    label: "Dark Mode + Stripe",
    text: "Hey! Can we completely overhaul the color palette, switch to dark mode, and squeeze in a custom Stripe checkout and user dashboard before tomorrow?",
    type: "web_dev",
    budget: 400,
    agreement: "Frontend landing page redesign with 3 static sections."
  },
  {
    sampleKey: "revision",
    label: "Unlimited Revisions",
    text: "We showed this to our entire marketing team and everyone wants different fonts and layouts. Can you try 5 totally different variations today?",
    type: "graphic_design",
    budget: 300,
    agreement: "1 brand logo concept with up to 2 typography adjustments."
  }
];

export default function AuditForm({ onAudit, isLoading, rateMultiplier, setRateMultiplier, layoutMode = 'wide', onToggleLayout }) {
  const [agreement, setAgreement] = useState("Build 5 responsive marketing web pages with contact form.");
  const [projectType, setProjectType] = useState("web_dev");
  const [budget, setBudget] = useState(500);
  const [clientMessage, setClientMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Web Speech API Voice Dictation
  const handleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge!");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setClientMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setClientMessage(preset.text);
    setAgreement(preset.agreement);
    setProjectType(preset.type);
    setBudget(preset.budget);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientMessage.trim()) return;
    onAudit({
      client_message: clientMessage,
      project_type: projectType,
      budget: parseFloat(budget) || 500,
      agreement: agreement
    });
  };

  const [attachedFileName, setAttachedFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);

    if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setClientMessage(text);
      };
      reader.readAsText(file);
    } else {
      // Mock OCR / Document extraction message
      setClientMessage(prev => prev ? `${prev}\n\n[Extracted from ${file.name}]: Client requested urgent add-on features and mobile overhaul before launch deadline.` : `[Extracted from ${file.name}]: Client requested urgent add-on features and mobile overhaul before launch deadline.`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setClientMessage(event.target.result);
        };
        reader.readAsText(file);
      } else {
        setClientMessage(prev => prev ? `${prev}\n\n[Extracted from ${file.name}]: Client requested urgent add-on features and mobile overhaul before launch deadline.` : `[Extracted from ${file.name}]: Client requested urgent add-on features and mobile overhaul before launch deadline.`);
      }
    }
  };

  return (
    <div className="card relative bg-white border-2 border-pencil rounded-wobbly-md p-6 md:p-8 shadow-hard-lg">
      {/* Tape Strip Accent */}
      <div className="tape-strip"></div>
      <div className="thumbtack-red"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-pencil/20 pb-3 mb-6">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-pencil">
            📝 Scope Audit Worksheet
          </h2>
          <p className="font-body text-base text-pencil/70">
            Paste the revision request to analyze breach severity and create pushback.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onToggleLayout && (
            <button
              type="button"
              id="layoutToggleBtn"
              onClick={() => onToggleLayout(layoutMode === 'wide' ? 'split' : 'wide')}
              className="font-heading text-xs uppercase tracking-wider bg-oldpaper hover:bg-postit px-3 py-1 border-2 border-pencil rounded-wobbly-sm shadow-hard-sm transition-all transform hover:-rotate-1 active:translate-x-0.5"
              title="Toggle between Wide Ledger and Side-by-Side view"
            >
              {layoutMode === 'wide' ? '📑 Side-by-Side' : '📖 Wide Ledger'}
            </button>
          )}
          <span className="hidden sm:inline-block font-heading text-xs uppercase tracking-wider bg-white px-2.5 py-1 border border-pencil rounded-wobbly-sm transform rotate-2 shadow-hard-sm">
            {layoutMode === 'wide' ? 'Dual-Page Ledger' : 'Pencil Draft #1'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two-Column Split Grid: Wider rather than longer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT WING: Contract Scope & Financial Basis */}
          <div className="flex flex-col justify-between space-y-4 bg-[#faf7f2]/70 p-5 rounded-wobbly-sm border-2 border-pencil/20 shadow-hard-subtle">
            <div className="border-b-2 border-pencil/15 pb-2.5 flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-pencil flex items-center gap-1.5">
                <span>📜</span> 1. Agreed Contract Scope & Terms
              </span>
              <span className="font-heading text-xs uppercase bg-white border border-pencil px-2.5 py-0.5 rounded-wobbly-sm shadow-hard-sm">
                Baseline Scope
              </span>
            </div>

            {/* Category & Budget row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="projectType" className="block font-heading text-base font-bold text-pencil mb-1">
                  📌 Project Category
                </label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full font-body text-lg bg-white border-2 border-pencil rounded-wobbly-sm px-3 py-1.5 text-pencil focus:outline-none focus:border-penBlue focus:ring-2 focus:ring-penBlue/20 shadow-hard-sm"
                >
                  <option value="web_dev">Web & Fullstack Development</option>
                  <option value="video_edit">Short-Form & Video Editing</option>
                  <option value="graphic_design">Brand & Graphic Design</option>
                  <option value="mobile_app">Mobile App Development</option>
                  <option value="writing">Content Writing & Copy</option>
                </select>
              </div>

              <div>
                <label htmlFor="budgetInput" className="block font-heading text-base font-bold text-pencil mb-1">
                  💰 Milestone Fee ($ USD)
                </label>
                <input
                  type="number"
                  id="budgetInput"
                  min="0"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full font-body text-lg bg-white border-2 border-pencil rounded-wobbly-sm px-3 py-1.5 text-pencil focus:outline-none focus:border-penBlue focus:ring-2 focus:ring-penBlue/20 shadow-hard-sm"
                  required
                />
              </div>
            </div>

            {/* Agreed Baseline Agreement */}
            <div className="flex-1 flex flex-col">
              <label htmlFor="agreementTerms" className="block font-heading text-base font-bold text-pencil mb-1">
                📜 Agreed Deliverables Basis
              </label>
              <textarea
                id="agreementTerms"
                rows="3"
                value={agreement}
                onChange={(e) => setAgreement(e.target.value)}
                className="flex-1 w-full font-body text-lg bg-white border-2 border-pencil rounded-wobbly-sm p-2.5 text-pencil focus:outline-none focus:border-penBlue focus:ring-2 focus:ring-penBlue/20 shadow-hard-sm"
                placeholder="e.g., 5 static pages, contact form, 2 revision rounds..."
              />
            </div>

            {/* Surcharge Multiplier Slider */}
            <div className="bg-white border-2 border-pencil rounded-wobbly-sm p-3.5 shadow-hard-sm">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="rateMultiplier" className="font-heading text-sm font-bold text-pencil">
                  🎚️ Surcharge Multiplier
                </label>
                <span id="multiplierVal" className="font-heading text-xs font-bold text-markerRed px-2 py-0.5 bg-oldpaper border border-pencil rounded-wobbly-sm shadow-hard-sm">
                  {rateMultiplier.toFixed(1)}x ({rateMultiplier >= 1.5 ? "Rush Urgency" : rateMultiplier >= 1.0 ? "Standard" : "Discount"})
                </span>
              </div>
              <input
                type="range"
                id="rateMultiplier"
                min="0.5"
                max="2.0"
                step="0.1"
                value={rateMultiplier}
                onChange={(e) => setRateMultiplier(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between font-body text-xs text-pencil/60 mt-1">
                <span>0.5x (Discount)</span>
                <span>1.0x (Standard)</span>
                <span>2.0x (Rush)</span>
              </div>
            </div>
          </div>

          {/* RIGHT WING: Incoming Client Revision & Pushback Generation */}
          <div className="flex flex-col justify-between space-y-4 bg-[#faf7f2]/70 p-5 rounded-wobbly-sm border-2 border-pencil/20 shadow-hard-subtle">
            <div className="border-b-2 border-pencil/15 pb-2.5 flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-pencil flex items-center gap-1.5">
                <span>💬</span> 2. Client Demand & Extraction
              </span>
              <span className="font-heading text-xs uppercase bg-postit border border-pencil px-2.5 py-0.5 rounded-wobbly-sm shadow-hard-sm font-bold">
                Audit Target
              </span>
            </div>

            {/* Preset Sample Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-heading text-xs font-bold text-pencil/80">
                  ⚡ Quick Fill Stress Tests:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-sample={p.sampleKey}
                    onClick={() => handleApplyPreset(p)}
                    className="sample-chip font-body text-sm bg-postit text-pencil px-2.5 py-1 border-2 border-pencil rounded-wobbly-sm shadow-hard-sm hover:shadow-hard transform hover:-rotate-1 active:translate-x-0.5 active:translate-y-0.5 transition-all text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Message Input with Dictation & Attach */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="clientMessage" className="font-heading text-base font-bold text-pencil">
                  💬 Client Message / Audio / Brief:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="fileAttachInput"
                    className="hidden"
                    accept=".txt,.md,.pdf,.png,.jpg,.jpeg,.json"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('fileAttachInput').click()}
                    className="font-body text-sm px-2 py-0.5 border-2 border-pencil rounded-wobbly-btn shadow-hard-sm flex items-center gap-1 bg-white hover:bg-oldpaper text-pencil transition-all"
                    title="Attach brief, PDF, or screenshot"
                  >
                    <span>📎</span> Attach
                  </button>
                  <button
                    type="button"
                    id="voiceBtn"
                    onClick={handleVoiceDictation}
                    className={`font-body text-sm px-2 py-0.5 border-2 border-pencil rounded-wobbly-btn shadow-hard-sm flex items-center gap-1 transition-all ${
                      isRecording 
                        ? 'bg-markerRed text-white animate-pulse' 
                        : 'bg-white text-pencil hover:bg-oldpaper'
                    }`}
                    title="Dictate client audio note"
                  >
                    <span className="mic-icon text-xs">🎙️</span> {isRecording ? "Listening..." : "Dictate"}
                  </button>
                  <span id="charCount" className="font-body text-xs text-pencil/60">
                    {clientMessage.length} chars
                  </span>
                </div>
              </div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex-1 flex flex-col relative"
              >
                <textarea
                  id="clientMessage"
                  rows="4"
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  className="flex-1 w-full font-body text-lg bg-white border-2 border-pencil rounded-wobbly-sm p-2.5 text-pencil focus:outline-none focus:border-penBlue focus:ring-2 focus:ring-penBlue/20 shadow-hard-sm"
                  placeholder="Paste client's revision request here or drag & drop a brief..."
                  required
                />
                {attachedFileName && (
                  <div className="mt-1 flex items-center justify-between font-body text-xs bg-postit border border-pencil rounded-wobbly-sm px-2 py-0.5 text-pencil">
                    <span>📄 Attached: {attachedFileName}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFileName("")}
                      className="font-bold text-markerRed hover:underline ml-1"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              id="submitBtn"
              disabled={isLoading}
              className="hand-drawn-btn w-full font-heading text-xl font-bold bg-markerRed text-white border-[3px] border-pencil rounded-wobbly-btn py-3 px-6 shadow-hard hover:bg-[#e03a3a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-rotate-0.5 transition-all mt-auto"
            >
              {isLoading ? (
                <span className="btn-loader flex items-center gap-2">
                  <span className="animate-spin inline-block">✏️</span> Auditing Scope with Gemma 2...
                </span>
              ) : (
                <span className="btn-text flex items-center gap-2">
                  🛡️ Analyze Scope & Generate Pushback
                </span>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
