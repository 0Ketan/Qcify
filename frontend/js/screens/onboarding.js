/**
 * Qcify — Onboarding Screen
 */

let selectedTrack = null;

function renderOnboarding(app) {
  const name = window.QP?.playerName || 'Explorer';

  app.innerHTML = `
    ${buildStarsBg()}
    <div class="onboarding-screen">
      <!-- Header -->
      <div class="onboarding-header">
        <div class="navbar-logo" onclick="navigate('/login')">
          <span>🐾</span>
          <span>Qc<span style="color:var(--primary)">ify</span></span>
        </div>
        <div class="onboarding-progress-dots">
          <div class="onboarding-dot done"></div>
          <div class="onboarding-dot active"></div>
          <div class="onboarding-dot"></div>
        </div>
        <div style="font-size:13px;color:var(--text-muted)">Step 2 of 3</div>
      </div>

      <!-- Body -->
      <div class="onboarding-body" style="padding-top:100px">
        <!-- Schrö + Bubble row -->
        <div style="display:flex;align-items:flex-start;gap:24px;margin-bottom:40px;max-width:720px">
          <div id="onboard-schro"></div>
          <div style="flex:1;padding-top:20px">
            <div class="mascot-bubble" style="font-size:16px;line-height:1.6">
              Hey <strong>${name}</strong>! 👋 I'm <strong>Schrö</strong> — your quantum guide, simultaneously a genius and a chaos gremlin. 
              How do you want to start your journey?
            </div>
          </div>
        </div>

        <!-- Track Cards -->
        <div class="track-cards-row" id="track-cards">
          <!-- Newbie -->
          <div class="track-card selected" id="track-newbie" onclick="selectTrack('newbie', this)">
            <div class="track-card-icon">📖</div>
            <h3 class="track-card-title">Newbie</h3>
            <p class="track-card-desc">Stories and analogies, step by step. Perfect if quantum is brand new to you.</p>
            <div style="margin-top:16px;display:flex;justify-content:center">
              <div class="badge badge-success" style="font-size:11px">✓ Selected</div>
            </div>
            <div style="margin-top:12px;font-size:28px;animation:floatBob 2s ease-in-out infinite">🐱</div>
          </div>

          <!-- Intermediate -->
          <div class="track-card" id="track-intermediate" onclick="selectTrack('intermediate', this)">
            <div class="track-card-icon">🧩</div>
            <h3 class="track-card-title">Intermediate</h3>
            <p class="track-card-desc">Quizzes and challenges. You know the basics — time to level up!</p>
            <div style="margin-top:16px">
              <button class="btn btn-secondary btn-sm w-full" onclick="event.stopPropagation();navigate('/quiz')">
                Take the quick quiz
              </button>
            </div>
          </div>

          <!-- Advanced -->
          <div class="track-card locked" id="track-advanced" onclick="showLockedToast()">
            <div class="track-card-icon" style="filter:grayscale(0.7)">⚡</div>
            <h3 class="track-card-title" style="color:var(--text-muted)">Advanced</h3>
            <p class="track-card-desc" style="color:var(--locked)">Free sandbox, no hand-holding. Pure quantum power.</p>
            <div style="margin-top:16px">
              <div class="badge badge-locked">🔒 Coming Soon</div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div style="margin-top:48px;display:flex;gap:16px;align-items:center" id="onboard-cta">
          <button class="btn btn-primary btn-lg" onclick="confirmTrack()">
            Start as Newbie →
          </button>
          <button class="btn btn-ghost btn-md" onclick="navigate('/coming-soon')">
            Peek at Advanced 🔮
          </button>
        </div>
      </div>
    </div>
  `;

  // Insert Schrö
  const schroEl = document.getElementById('onboard-schro');
  schroEl.appendChild(renderSchro('encouraging', 120));

  selectedTrack = 'newbie';
}

function selectTrack(track, el) {
  if (el.classList.contains('locked')) {
    showLockedToast();
    return;
  }

  selectedTrack = track;

  // Update card states
  document.querySelectorAll('.track-card:not(.locked)').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');

  // Update CTA
  const cta = document.getElementById('onboard-cta');
  const labels = { newbie: 'Start as Newbie →', intermediate: 'Take the Quiz →' };
  const paths = { newbie: confirmTrack, intermediate: () => navigate('/quiz') };

  const btn = cta.querySelector('.btn-primary');
  if (btn) {
    btn.textContent = labels[track] || 'Continue →';
    btn.onclick = paths[track] || confirmTrack;
  }
}

function showLockedToast() {
  showToast('Advanced mode coming soon! Start with Newbie 💜', 'default');
}

function confirmTrack() {
  const name = window.QP?.playerName || sessionStorage.getItem('qp_name') || 'Explorer';
  const track = selectedTrack || 'newbie';
  window.QP = window.QP || {};
  window.QP.playerName = name;
  window.QP.track = track;
  sessionStorage.setItem('qp_name', name);
  sessionStorage.setItem('qp_track', track);

  showModal(`
    <div style="text-align:center">
      <div id="confirm-schro" style="display:flex;justify-content:center;margin-bottom:24px"></div>
      <h3 style="margin-bottom:12px">Awesome choice, ${name}! ✨</h3>
      <div class="mascot-bubble" style="display:inline-block;text-align:left;margin-bottom:24px;font-size:15px">
        "Awesome choice, ${name}! Let's start with <strong>Superposition</strong> — it's where all the quantum magic begins! ✨"
      </div>
      <button class="btn btn-primary btn-lg w-full" onclick="closeModal();navigate('/dashboard')">
        Begin Journey →
      </button>
    </div>
  `);

  setTimeout(() => {
    const el = document.getElementById('confirm-schro');
    if (el) el.appendChild(renderSchro('excited', 120));
  }, 100);

  setTimeout(() => showToast(`${name} joined the Newbie track! 🎉`, 'reward'), 500);
}
