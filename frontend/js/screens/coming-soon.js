/**
 * Qcify — Coming Soon Screen
 */

function renderComingSoon(app) {
  app.innerHTML = `
    ${buildStarsBg()}
    <div class="coming-soon-layout">
      <!-- Blurred BG Preview -->
      <div class="coming-soon-blur-bg">
        <div style="font-size:120px;opacity:0.3">⚗️</div>
      </div>

      <!-- Glass card -->
      <div class="coming-soon-glass animate-scale-in">
        <div id="coming-schro" style="display:flex;justify-content:center;margin-bottom:24px"></div>

        <h2 style="margin-bottom:8px" class="glow-text">Something Epic is Coming! 🚀</h2>
        <p class="text-muted" style="margin-bottom:32px;font-size:15px;line-height:1.6">
          The Advanced Sandbox is being forged with real quantum backends. 
          Schrö is personally overseeing the construction. 🐾
        </p>

        <!-- Feature bullets -->
        <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:32px;text-align:left">
          ${[
            { icon: '✅', text: 'Drag & drop circuit builder with visual gate palette', color: 'var(--success)' },
            { icon: '✅', text: 'Real backend results from Qiskit, PennyLane & Cirq', color: 'var(--success)' },
            { icon: '✅', text: 'Save & share circuits with your team', color: 'var(--success)' },
          ].map(f => `
            <div style="display:flex;gap:12px;align-items:flex-start">
              <span style="font-size:20px;color:${f.color};flex-shrink:0">${f.icon}</span>
              <span style="font-size:15px;color:var(--text)">${f.text}</span>
            </div>
          `).join('')}
        </div>

        <!-- Email Notify (fake) -->
        <div style="display:flex;gap:8px;margin-bottom:24px">
          <input type="email" class="input" placeholder="your@email.com" id="notify-email" style="flex:1"/>
          <button class="btn btn-primary btn-md" onclick="notifyMe()" style="white-space:nowrap">
            Notify Me 🔔
          </button>
        </div>

        <button class="btn btn-secondary btn-md w-full" onclick="navigate('/dashboard')">
          ← Start as Newbie meanwhile
        </button>
      </div>
    </div>
  `;

  // Insert excited Schrö
  const el = document.getElementById('coming-schro');
  if (el) el.appendChild(renderSchro('excited', 200));
}

function notifyMe() {
  const email = document.getElementById('notify-email')?.value;
  if (email && email.includes('@')) {
    showToast("You're on the list! Schrö will purr-sonally notify you 🐾", 'reward', 4000);
    document.getElementById('notify-email').value = '';
  } else {
    showToast('Please enter a valid email! 📧', 'default', 2000);
  }
}
