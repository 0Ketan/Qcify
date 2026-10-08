/**
 * QUANTUMPAWS — Login Screen
 */

function renderLogin(app) {
  app.innerHTML = `
    ${buildStarsBg()}
    <main class="screen screen-centered" id="login-screen">
      <div class="login-card">
        <div class="login-logo">
          <span class="logo-paw">🐾</span>
          <div class="logo-name">
            <span class="font-heading" style="color:var(--text)">Quantum</span><span class="font-heading" style="color:var(--primary)">Paws</span>
          </div>
          <span style="font-size:24px">⚛️</span>
        </div>

        <div id="login-schro" style="display:flex;justify-content:center;margin-bottom:32px"></div>

        <p class="login-tagline">
          Learn quantum computing the fun way — with Schrö, your AI cat companion who's been in superposition since forever. 🌀
        </p>

        <div style="margin-bottom:20px">
          <input type="text" class="input" id="player-name" placeholder="Your name (no password needed!)" 
            style="text-align:center;font-size:18px;padding:16px"
            onkeydown="if(event.key==='Enter')handleLogin()"/>
        </div>

        <button class="btn btn-primary btn-lg w-full" id="login-btn" onclick="handleLogin()">
          Let's go →
        </button>

        <p class="text-caption text-muted" style="margin-top:20px">
          No account needed • Free • No quantum physics degree required 😸
        </p>
      </div>
    </main>
  `;

  // Insert Schrö
  const schroEl = document.getElementById('login-schro');
  schroEl.appendChild(renderSchro('happy', 120));

  // Focus input
  setTimeout(() => document.getElementById('player-name')?.focus(), 100);
}

function handleLogin() {
  const nameInput = document.getElementById('player-name');
  const name = nameInput?.value.trim();

  if (!name) {
    shakeElement(nameInput);
    nameInput.style.borderColor = 'var(--error)';
    setTimeout(() => nameInput.style.borderColor = '', 1000);
    return;
  }

  // Store name
  window.QP = window.QP || {};
  window.QP.playerName = name;
  sessionStorage.setItem('qp_name', name);

  // Animate button
  const btn = document.getElementById('login-btn');
  btn.innerHTML = `<div class="spinner"></div> Entering the quantum realm...`;
  btn.disabled = true;

  setTimeout(() => navigate('/onboarding'), 1000);
}
