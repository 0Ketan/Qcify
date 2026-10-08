/**
 * QUANTUMPAWS — Profile Page
 */

const PROFILE_BADGES = [
  { icon: '⚛️', label: 'First Qubit', desc: 'Started the journey', earned: true },
  { icon: '🌊', label: 'Wave Rider', desc: 'Learned superposition', earned: true },
  { icon: '🎯', label: 'Superposer', desc: 'Completed Lesson 1', earned: true },
  { icon: '🔮', label: 'Gate Maker', desc: 'Applied first gate', earned: false },
  { icon: '🌀', label: 'Entangler', desc: 'Mastered entanglement', earned: false },
  { icon: '🏆', label: 'Quiz Ace', desc: 'Passed gateway quiz', earned: false },
  { icon: '🚀', label: 'Rocketeer', desc: 'Reached 50% journey', earned: false },
  { icon: '💎', label: 'Quantum Genius', desc: 'Completed all lessons', earned: false },
];

const TOPIC_PROGRESS = [
  { label: 'Superposition', pct: 80, icon: '🌊' },
  { label: 'Qubits & States', pct: 20, icon: '💡' },
  { label: 'Quantum Gates', pct: 0, icon: '🔧' },
  { label: 'Entanglement', pct: 0, icon: '🔗' },
  { label: 'Quantum Circuits', pct: 0, icon: '⚡' },
];

function renderProfile(app) {
  const name = window.QP?.playerName || 'Alex';

  app.innerHTML = `
    ${buildStarsBg()}
    ${buildNavbar('profile')}
    ${buildBottomNav('profile')}

    <div class="profile-layout">
      <!-- Header -->
      <div class="profile-header animate-fade-in">
        <div class="avatar" style="width:120px;height:120px;font-size:60px;
          box-shadow:0 0 32px rgba(124,92,255,0.4),0 0 64px rgba(124,92,255,0.15);
          border:3px solid rgba(124,92,255,0.3)">🐱</div>
        
        <h2>${name}</h2>
        
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:center">
          <div class="badge badge-primary">🐾 Newbie</div>
          <div class="streak-counter">🔥 5 day streak</div>
          <div class="badge badge-success">⚛️ 3 badges earned</div>
        </div>

        <!-- Profile progress -->
        <div style="width:100%;max-width:400px">
          ${createProgressBar(15, 100, 'Journey to Intermediate', false)}
        </div>

        <button class="btn btn-primary btn-md" onclick="shareProfile()">
          🔗 Share Profile
        </button>
      </div>

      <!-- Badges Grid -->
      <div class="section-animate">
        <div class="section-title">🏆 Badge Collection</div>
        <div class="profile-badges-grid" style="margin-bottom:48px">
          ${PROFILE_BADGES.map(b => `
            <div class="profile-badge-card ${b.earned ? 'earned' : ''}">
              <div style="font-size:${b.earned ? '36' : '28'}px;${b.earned ? '' : 'filter:grayscale(1);opacity:0.4'}">
                ${b.earned ? b.icon : '🔒'}
              </div>
              <div style="font-weight:600;font-size:13px;${!b.earned ? 'color:var(--text-muted)' : ''}">
                ${b.earned ? b.label : '???'}
              </div>
              <div class="text-caption text-muted" style="text-align:center">
                ${b.earned ? b.desc : 'Keep learning to unlock'}
              </div>
              ${b.earned ? '<div class="badge badge-earned" style="font-size:10px;margin-top:4px">Earned ✓</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Topic Progress -->
      <div class="section-animate">
        <div class="section-title">📊 Topic Mastery</div>
        <div class="card" style="margin-bottom:48px;display:flex;flex-direction:column;gap:20px">
          ${TOPIC_PROGRESS.map(t => `
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span style="font-weight:500">${t.icon} ${t.label}</span>
                <span class="text-sm ${t.pct > 0 ? 'text-accent' : 'text-muted'}">${t.pct}%</span>
              </div>
              <div class="progress-track" style="height:8px">
                <div class="progress-fill topic-prog" style="width:0%;height:100%;transition:width 1s ease ${Math.random() * 0.3}s"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Stats Row -->
      <div class="section-animate" style="margin-bottom:48px">
        <div class="section-title">📈 Your Stats</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
          ${[
            { val: '5', label: 'Day Streak', icon: '🔥' },
            { val: '3', label: 'Badges', icon: '🏆' },
            { val: '1', label: 'Lessons Done', icon: '📚' },
            { val: '15%', label: 'Journey', icon: '🗺️' },
          ].map(s => `
            <div class="card" style="text-align:center;padding:20px">
              <div style="font-size:28px;margin-bottom:8px">${s.icon}</div>
              <div style="font-family:var(--font-heading);font-size:24px;font-weight:700;color:var(--primary)">${s.val}</div>
              <div class="text-caption text-muted">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="height:80px"></div>
    </div>
  `;

  // Animate topic progress bars
  setTimeout(() => {
    const bars = document.querySelectorAll('.topic-prog');
    TOPIC_PROGRESS.forEach((t, i) => {
      if (bars[i]) bars[i].style.width = t.pct + '%';
    });
    animateProgressBar('prog-fill', 0, 15);
  }, 300);
}

function shareProfile() {
  // Simulate copy to clipboard
  try {
    navigator.clipboard.writeText(`https://quantumpaws.app/profile/${window.QP?.playerName || 'Alex'}`);
  } catch(e) {}
  showToast('Profile link copied! 🔗', 'success');
}
