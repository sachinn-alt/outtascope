document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const auditForm = document.getElementById('auditForm');
  const projectTypeSelect = document.getElementById('projectType');
  const budgetInput = document.getElementById('budget');
  const clientMessageInput = document.getElementById('clientMessage');
  const charCount = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  
  const emptyState = document.getElementById('emptyState');
  const auditContent = document.getElementById('auditContent');
  
  const scoreValue = document.getElementById('scoreValue');
  const scoreCircle = document.querySelector('.score-circle');
  const infractionTag = document.getElementById('infractionTag');
  const categoryTitle = document.getElementById('categoryTitle');
  const feeEst = document.getElementById('feeEst');
  const whyOutOfScope = document.getElementById('whyOutOfScope');
  
  const toneTabs = document.querySelectorAll('.tone-tab');
  const toneBadge = document.getElementById('toneBadge');
  const replyText = document.getElementById('replyText');
  const copyBtn = document.getElementById('copyBtn');
  
  const coTimeline = document.getElementById('coTimeline');
  const lineItemsList = document.getElementById('lineItemsList');
  const templatesGrid = document.getElementById('templatesGrid');
  const sampleChips = document.querySelectorAll('.sample-chip');

  // State
  let currentAudit = null;
  let activeTone = 'diplomatic';

  // Sample Scenarios
  const sampleMessages = {
    critical: "Hey, loved the initial homepage draft! But our marketing director wants us to completely overhaul the theme to dark mode, rebuild the navigation, and add a custom customer dashboard by 9 AM tomorrow morning. It shouldn't take too long right?",
    feature: "Hi! Quick update: before we launch the portfolio site, can we also quickly integrate a full Stripe subscription checkout, user accounts, and a blog system? Just squeeze that in with our current milestone!",
    loop: "Hey, I don't really 'feel' the vibe of these 3 video cuts. Can you try 8 more entirely different edits with new music tracks and font styles? Keep testing and send them over tonight!"
  };

  // Sample Chips Click
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.sample;
      if (sampleMessages[type]) {
        clientMessageInput.value = sampleMessages[type];
        updateCharCount();
        clientMessageInput.focus();
      }
    });
  });

  // Character Count
  function updateCharCount() {
    const len = clientMessageInput.value.length;
    charCount.textContent = `${len} chars`;
  }
  clientMessageInput.addEventListener('input', updateCharCount);

  // Form Submit
  auditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = clientMessageInput.value.trim();
    if (!message) return;

    const payload = {
      client_message: message,
      project_type: projectTypeSelect.value,
      budget: parseFloat(budgetInput.value) || 500
    };

    // UI Loading state
    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoader.hidden = false;

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Audit failed to process');
      }

      currentAudit = await res.json();
      renderAudit(currentAudit);
    } catch (err) {
      alert('Error running audit: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoader.hidden = true;
    }
  });

  // Render Audit Results
  function renderAudit(data) {
    emptyState.classList.add('hidden');
    auditContent.classList.remove('hidden');

    // Score & Level Styling
    scoreValue.textContent = data.creep_score;
    categoryTitle.textContent = data.primary_category;
    feeEst.textContent = `+$${data.change_order?.suggested_fee || 150}`;
    whyOutOfScope.textContent = data.why_out_of_scope;

    // Infraction Tag
    infractionTag.textContent = `${data.infraction_level} INFRACTION`;
    infractionTag.className = 'tag';
    
    // Circle Color
    scoreCircle.style.borderColor = '';
    scoreCircle.style.background = '';
    scoreCircle.style.boxShadow = '';

    if (data.infraction_level === 'CRITICAL') {
      infractionTag.classList.add('tag-critical');
      scoreCircle.style.borderColor = 'var(--color-critical)';
      scoreCircle.style.background = 'var(--color-critical-bg)';
      scoreCircle.style.boxShadow = '0 0 20px rgba(244, 63, 94, 0.35)';
    } else if (data.infraction_level === 'HIGH') {
      infractionTag.classList.add('tag-high');
      scoreCircle.style.borderColor = 'var(--color-high)';
      scoreCircle.style.background = 'var(--color-high-bg)';
      scoreCircle.style.boxShadow = '0 0 20px rgba(251, 146, 60, 0.35)';
    } else if (data.infraction_level === 'MODERATE') {
      infractionTag.classList.add('tag-moderate');
      scoreCircle.style.borderColor = 'var(--color-moderate)';
      scoreCircle.style.background = 'var(--color-moderate-bg)';
      scoreCircle.style.boxShadow = '0 0 20px rgba(250, 204, 21, 0.35)';
    } else {
      infractionTag.classList.add('tag-mild');
      scoreCircle.style.borderColor = 'var(--color-mild)';
      scoreCircle.style.background = 'var(--color-mild-bg)';
      scoreCircle.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.35)';
    }

    // Change Order Meta
    const days = data.change_order?.timeline_extension_days || 2;
    coTimeline.textContent = `+${days} Business Days`;

    // Line items
    lineItemsList.innerHTML = '';
    const items = data.change_order?.line_items || ['Supplemental client revision request'];
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      lineItemsList.appendChild(li);
    });

    // Default to Diplomatic reply
    activeTone = 'diplomatic';
    updateToneDisplay();
  }

  // Tone Switching
  toneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      toneTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTone = tab.dataset.tone;
      updateToneDisplay();
    });
  });

  function updateToneDisplay() {
    if (!currentAudit || !currentAudit.replies) return;

    const toneNames = {
      diplomatic: '🟢 Diplomatic & Collaborative Response',
      boundary: '🟡 Firm Boundary-Setting Response',
      executive: '🔴 Executive Formal Change Order'
    };

    toneBadge.textContent = toneNames[activeTone] || 'Pushback Response';
    replyText.textContent = currentAudit.replies[activeTone] || 'No response generated for this tone.';

    // Reset copy button
    copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copy Reply';
    copyBtn.classList.remove('copied');
  }

  // Copy to Clipboard
  copyBtn.addEventListener('click', async () => {
    const textToCopy = replyText.textContent;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      copyBtn.innerHTML = '<span class="copy-icon">✅</span> Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copy Reply';
        copyBtn.classList.remove('copied');
      }, 2500);
    } catch (err) {
      alert('Could not copy to clipboard.');
    }
  });

  // Load Saved Boundary Templates (Tiger Data Vault)
  async function loadTemplates() {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) {
        const templates = await res.json();
        templatesGrid.innerHTML = '';
        templates.forEach(tpl => {
          const card = document.createElement('div');
          card.className = 'template-item';
          card.innerHTML = `
            <div class="template-top">
              <span class="template-title">${escapeHtml(tpl.title)}</span>
              <span class="badge badge-gemma">${escapeHtml(tpl.category)}</span>
            </div>
            <p class="template-body">"${escapeHtml(tpl.response_text)}"</p>
            <button type="button" class="template-copy-btn">📋 Quick Copy</button>
          `;

          const tplCopy = card.querySelector('.template-copy-btn');
          tplCopy.addEventListener('click', async () => {
            await navigator.clipboard.writeText(tpl.response_text);
            tplCopy.textContent = '✅ Copied!';
            setTimeout(() => { tplCopy.textContent = '📋 Quick Copy'; }, 2000);
          });

          templatesGrid.appendChild(card);
        });
      }
    } catch (e) {
      console.warn('Could not load templates', e);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initial load
  loadTemplates();
});
