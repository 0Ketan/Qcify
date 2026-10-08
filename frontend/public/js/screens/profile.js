/**
 * Qcify — Profile & Quantum Badge Collection
 * 
 * Features:
 * - Real live badge progression powered by BadgesEngine & BadgeRenderer
 * - Dynamic Topic Showcases (Topic 1: Transition from Classical to Quantum, Topic 2: Working with Qubits)
 * - Scalable blueprint for Topics 3-10
 * - Interactive Normal & Secret Quizzes with live modal executions
 */

function renderProfile(app, params = {}) {
  const name = window.QP?.playerName || sessionStorage.getItem('qp_name') || 'Explorer';
  const stats = BadgesEngine.getGlobalStats();

  // Calculate overall mastery percentage
  const totalEarnable = stats.totalAvailableSmall + stats.totalAvailableMain;
  const totalUnlocked = stats.totalEarned + stats.totalMain;
  const overallPct = Math.round((totalUnlocked / totalEarnable) * 100);

  app.innerHTML = `
    ${buildStarsBg()}
    ${buildNavbar('profile')}
    ${buildBottomNav('profile')}

    <div class="profile-layout badges-screen-layout">
      <!-- Header -->
      <div class="profile-header animate-fade-in" style="margin-bottom:36px">
        <div class="avatar" style="width:110px;height:110px;font-size:54px;
          box-shadow:0 0 32px rgba(124,92,255,0.4),0 0 64px rgba(124,92,255,0.15);
          border:3px solid rgba(124,92,255,0.3)">🐱</div>
        
        <h2 style="margin-top:12px">${name}</h2>
        
        <div class="badges-stat-ribbon">
          <div class="stat-pill">🐾 Quantum Scholar</div>
          <div class="stat-pill earned-pill">
            <span>⚛️</span>
            <strong>${stats.totalEarned}/8</strong> Badges Earned
          </div>
          <div class="stat-pill mastered-pill">
            <span>✨</span>
            <strong>${stats.totalMastered}/8</strong> Mastered
          </div>
          <div class="stat-pill" style="border-color:rgba(251,191,36,0.4);color:#FBBF24">
            <span>👑</span>
            <strong>${stats.totalSuperior}</strong> Superior Main Badges
          </div>
        </div>

        <!-- Progress to Complete Quantum Mastery -->
        <div style="width:100%;max-width:440px;margin-top:16px">
          ${createProgressBar(overallPct, 100, `Quantum Mastery Progress (${overallPct}%)`, false)}
        </div>

        <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;justify-content:center">
          <button class="btn btn-primary btn-sm" onclick="shareProfile()">
            🔗 Share Achievements
          </button>
          <button class="btn btn-ghost btn-sm" onclick="debugResetBadgesPrompt()">
            🔄 Reset Badges (Test)
          </button>
          <button class="btn btn-secondary btn-sm" onclick="logoutUser()">
            🚪 Log Out
          </button>
        </div>
      </div>

      <!-- Live Quantum Badge Collection -->
      <div class="section-animate">
        <div class="badges-hero" style="margin-bottom:32px">
          <h1>🏆 Quantum Badge Collection</h1>
          <p>
            Pass <strong>Normal Quizzes</strong> to earn topic badges and reveal <strong>Secret Quizzes</strong>.
            Pass the Secret Quizzes to achieve <strong>Mastery</strong> and awaken <strong>Superior Main Badges</strong>.
          </p>
        </div>

        <!-- Render Current Active Topics (Topic 1 & 2) -->
        ${BadgesEngine.TOPICS.filter(t => !t.comingSoon).map(topic => renderTopicShowcase(topic)).join('')}

        <!-- Topics 3 to 10: Future Quantum Horizons Drawer -->
        <div class="card" style="margin-top:48px;padding:32px;background:rgba(15,23,42,0.6);border:1px dashed rgba(124,92,255,0.25);border-radius:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:20px">
            <div>
              <div class="topic-number-badge" style="display:inline-block;margin-bottom:6px">EXPANSION TOPICS 3 – 10</div>
              <h3 style="font-family:var(--font-heading)">Upcoming Frontiers in Quantum Computing</h3>
              <p class="text-sm text-muted" style="margin-top:4px">
                Scalable badge slots prepared for Algorithms, Error Correction, Cryptography, and Frontiers.
              </p>
            </div>
            <div class="badge badge-locked">8 Topics Coming Soon</div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:14px">
            ${BadgesEngine.TOPICS.filter(t => t.comingSoon).map(t => `
              <div class="card" style="padding:16px;background:rgba(20,27,45,0.5);border-color:rgba(255,255,255,0.06);opacity:0.75">
                <div style="font-size:11px;font-family:var(--font-code);color:var(--text-muted)">TOPIC ${t.number < 10 ? '0' + t.number : t.number}</div>
                <div style="font-weight:600;font-size:14px;color:var(--text);margin:4px 0">${t.name}</div>
                <div class="text-caption text-muted">${t.tagline}</div>
                <div style="margin-top:10px;font-size:11px;color:var(--accent);font-family:var(--font-code)">
                  Emblem: ${t.mainBadge.name}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div style="height:60px"></div>
    </div>
  `;

  // Animate progress bar
  setTimeout(() => {
    animateProgressBar('prog-fill', 0, overallPct);
  }, 250);
}

/**
 * Builds a complete showcase card for a Topic
 */
function renderTopicShowcase(topic) {
  const tProg = BadgesEngine.getTopicProgress(topic.id);
  const mainBadge = topic.mainBadge;
  const mainProg = BadgesEngine.getMainBadgeProgress(mainBadge.id);

  const isSuperior = mainProg.status === 'superior';
  const isMainUnlocked = mainProg.status === 'earned' || isSuperior;

  return `
    <div class="topic-showcase-card animate-fade-in" id="topic-card-${topic.id}">
      <!-- Topic Header -->
      <div class="topic-header-bar">
        <div class="topic-title-group">
          <h2>
            <span class="topic-number-badge">TOPIC 0${topic.number}</span>
            <span>${topic.name}</span>
          </h2>
          <div class="topic-tagline">${topic.tagline}</div>
        </div>

        <div class="topic-counters">
          <div class="counter-badge ${tProg.earnedCount === 4 ? 'complete' : ''}">
            ${tProg.earnedCount} / 4 Badges Earned
          </div>
          <div class="counter-badge ${tProg.masteredCount === 4 ? 'complete' : ''}" style="${tProg.masteredCount > 0 ? 'border-color:rgba(244,114,182,0.4);color:#F472B6' : ''}">
            ${tProg.masteredCount} / 4 Mastered
          </div>
        </div>
      </div>

      <!-- Grid Layout: Left Main Emblem, Right 4 Small Badges -->
      <div class="topic-emblem-layout">
        <!-- Main Badge Emblem -->
        <div class="main-badge-box ${isSuperior ? 'is-superior' : ''}" onclick="BadgeModal.openDetails('${mainBadge.id}', true)">
          ${BadgeRenderer.renderMain(mainBadge.id, mainProg.status, 140)}

          <div class="main-badge-label">
            ${isSuperior ? mainBadge.superiorName : mainBadge.name}
          </div>

          <div class="main-badge-tier-tag tier-${mainProg.status}-tag">
            ${isSuperior ? '👑 SUPERIOR EMBLEM' : isMainUnlocked ? '✓ UNLOCKED' : '🔒 ALL 4 BADGES REQ.'}
          </div>

          <div class="text-caption text-muted" style="margin-top:8px;font-size:11px">
            ${isSuperior
              ? '★ Highest Quantum Rarity achieved!'
              : isMainUnlocked
                ? 'Master all 4 small badges to elevate to Superior'
                : 'Earn all 4 small badges below to activate'
            }
          </div>
        </div>

        <!-- 4 Small Badges Grid -->
        <div class="small-badges-grid">
          ${topic.smallBadges.map(badge => {
            const bProg = BadgesEngine.getBadgeProgress(badge.id);
            const isEarned = bProg.earned;
            const isMastered = bProg.mastered;

            return `
              <div class="small-badge-item ${isMastered ? 'is-mastered' : isEarned ? 'is-earned' : ''}"
                   onclick="BadgeModal.openDetails('${badge.id}', false)">
                
                ${BadgeRenderer.renderSmall(badge.id, bProg.status, 84)}

                <div class="small-badge-name">${badge.name}</div>
                <div class="small-badge-concept">${badge.concept}</div>

                <div class="badge-actions-row" onclick="event.stopPropagation()">
                  ${!isEarned ? `
                    <button class="btn-badge-action btn-take-quiz" onclick="BadgeModal.openQuiz('${badge.id}', 'normal')">
                      🚀 Take Quiz
                    </button>
                  ` : !isMastered ? `
                    <button class="btn-badge-action btn-secret-quiz" onclick="BadgeModal.openQuiz('${badge.id}', 'secret')">
                      ⚡ Secret Quiz 🔓
                    </button>
                  ` : `
                    <div class="btn-badge-action btn-mastered-tag">
                      ✨ Mastered ✓
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// Dedicated route renderer for /badges
function renderBadgesScreen(app, params = {}) {
  renderProfile(app, params);
}

function shareProfile() {
  const name = window.QP?.playerName || sessionStorage.getItem('qp_name') || 'Explorer';
  const stats = BadgesEngine.getGlobalStats();
  const text = `I've earned ${stats.totalEarned}/8 badges and ${stats.totalMastered} masteries on Qcify! 🐾⚛️`;
  try {
    navigator.clipboard.writeText(text);
    showToast('Badge collection summary copied! 🔗', 'success');
  } catch(e) {
    showToast(text, 'reward', 4000);
  }
}

function debugResetBadgesPrompt() {
  if (confirm('Reset all quantum badge progress back to locked state for testing?')) {
    BadgesEngine.resetAll();
    showToast('Badge progress reset! 🔄', 'default');
    const app = document.getElementById('app');
    if (app) renderProfile(app);
  }
}

// Attach reactive listener so UI auto-refreshes when badges are awarded
if (typeof window !== 'undefined') {
  window.addEventListener('Qcify:badge-update', () => {
    if (Router && (Router.currentScreen === '/profile' || Router.currentScreen === '/badges')) {
      const app = document.getElementById('app');
      if (app) renderProfile(app);
    }
  });
}
