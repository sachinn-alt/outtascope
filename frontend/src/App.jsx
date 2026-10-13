import React, { useState } from 'react';
import Header from './components/Header';
import AuditForm from './components/AuditForm';
import ResultCard from './components/ResultCard';
import TemplatesVault from './components/TemplatesVault';
import Footer from './components/Footer';

export default function App() {
  const [auditResult, setAuditResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rateMultiplier, setRateMultiplier] = useState(1.0);
  const [errorMessage, setErrorMessage] = useState("");
  const [recoveredRevenue, setRecoveredRevenue] = useState(() => {
    return parseInt(localStorage.getItem('outtascope_revenue') || '1650', 10);
  });
  const [rescuedHours, setRescuedHours] = useState(() => {
    return parseFloat(localStorage.getItem('outtascope_hours') || '19.5');
  });

  const handleAudit = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setAuditResult(data);

      // Accumulate recovered revenue & rescued hours
      const addedFee = Math.round((data.change_order?.suggested_fee || 150) * rateMultiplier);
      const addedHours = Math.round((data.change_order?.timeline_extension_days || 3) * 2.5);
      setRecoveredRevenue(prev => {
        const next = prev + addedFee;
        localStorage.setItem('outtascope_revenue', next.toString());
        return next;
      });
      setRescuedHours(prev => {
        const next = parseFloat((prev + addedHours).toFixed(1));
        localStorage.setItem('outtascope_hours', next.toString());
        return next;
      });

      // Smooth scroll into results on mobile
      setTimeout(() => {
        const resEl = document.getElementById('resultCard');
        if (resEl && window.innerWidth < 1024) {
          resEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      setErrorMessage(err.message || "Failed to analyze scope. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertClause = (clauseText) => {
    const agreementInput = document.getElementById('agreementTerms');
    if (agreementInput) {
      agreementInput.value = `${agreementInput.value ? agreementInput.value + "\n\n" : ""}${clauseText}`;
      agreementInput.dispatchEvent(new Event('input', { bubbles: true }));
      agreementInput.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-paper text-pencil font-body py-8 px-3 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
      <div className="app-container max-w-6xl mx-auto overflow-hidden">
        <Header recoveredRevenue={recoveredRevenue} rescuedHours={rescuedHours} />

        {errorMessage && (
          <div className="mb-6 bg-[#fee2e2] border-2 border-markerRed text-pencil rounded-wobbly-sm p-4 shadow-hard-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-heading font-bold">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="font-bold text-markerRed hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <AuditForm
            onAudit={handleAudit}
            isLoading={isLoading}
            rateMultiplier={rateMultiplier}
            setRateMultiplier={setRateMultiplier}
          />

          <ResultCard
            auditResult={auditResult}
            rateMultiplier={rateMultiplier}
          />
        </main>

        <TemplatesVault onInsertClause={handleInsertClause} />

        <Footer />
      </div>
    </div>
  );
}
