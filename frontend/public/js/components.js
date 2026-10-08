/**
 * Qcify — Shared Component Helpers
 */

// ---- TOAST SYSTEM ----
function showToast(message, type = 'default', duration = 3500) {
  const container = document.getElementById('toast-container');
  const icons = { success: '✅', reward: '🏆', error: '❌', default: '⚛️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-size:18px">${icons[type] || icons.default}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- PROGRESS BAR ----
function createProgressBar(current, total, label = '', showMilestones = false) {
  const pct = Math.round((current / total) * 100);
  const milestonePositions = [25, 50, 75, 100];

  return `
    <div class="progress-bar-wrapper">
      ${label ? `<div class="progress-label"><span>${label}</span><span>${pct}%</span></div>` : ''}
      <div class="progress-track" style="position:relative">
        <div class="progress-fill" id="prog-fill" style="width:${pct}%"></div>
        ${showMilestones ? `
          <div class="progress-milestones">
            ${milestonePositions.map(pos => `
              <div class="milestone-dot ${pct >= pos ? 'reached' : ''}" 
                style="position:absolute;left:${pos}%;transform:translateX(-50%) translateY(-50%);top:50%"
                title="${pos}%"></div>
            `).join('')}
          </div>` : ''}
      </div>
    </div>
  `;
}

// Animate progress bar
function animateProgressBar(elementId, fromPct, toPct, duration = 1200) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.style.width = fromPct + '%';
  setTimeout(() => { el.style.width = toPct + '%'; }, 50);
}

// ---- MODAL ----
function showModal(content, onClose) {
  // Remove existing modal
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal animate-scale-in">${content}</div>`;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      if (onClose) onClose();
      closeModal();
    }
  });

  document.body.appendChild(overlay);
}

function closeModal() {
  const m = document.getElementById('modal-overlay');
  if (m) m.remove();
}

// ---- CONFETTI ----
function launchConfetti(count = 60) {
  const colors = ['#7C5CFF', '#22D3EE', '#34D399', '#FBBF24', '#F9A8D4', '#F472B6'];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${1.5 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }, i * 30);
  }
}

// ---- SHAKE ANIMATION ----
function shakeElement(el) {
  el.classList.remove('animate-shake');
  void el.offsetWidth; // reflow
  el.classList.add('animate-shake');
  setTimeout(() => el.classList.remove('animate-shake'), 500);
}

// ---- SIDEBAR BUILDER ----
function buildSidebar(activeItem = 'home') {
  const items = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/dashboard' },
    { id: 'journey', icon: '🗺️', label: 'Journey', path: '/dashboard' },
    { id: 'lessons', icon: '📚', label: 'Lessons', path: '/lesson' },
    { id: 'sandbox', icon: '⚗️', label: 'Sandbox', path: '/sandbox' },
    { id: 'badges', icon: '🏆', label: 'Badges', path: '/badges' },
    { id: 'profile', icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const playerName = window.QP?.playerName || sessionStorage.getItem('qp_name') || 'Explorer';
  const playerTrack = (window.QP?.track || sessionStorage.getItem('qp_track') || 'Newbie');
  const trackCapitalized = playerTrack.charAt(0).toUpperCase() + playerTrack.slice(1);

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span>🐾</span>
        <span>Qc<span style="color:var(--primary)">ify</span></span>
      </div>
      <nav class="sidebar-nav">
        ${items.map(item => `
          <a class="sidebar-link ${item.id === activeItem ? 'active' : ''}" 
             onclick="navigate('${item.path}')" href="javascript:void(0)">
            <span class="link-icon">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div style="margin-top:auto;padding-top:24px;border-top:1px solid rgba(124,92,255,0.1)">
        <div class="sidebar-link" onclick="navigate('/profile')" style="cursor:pointer">
          <span class="link-icon">🐱</span>
          <span style="font-size:12px;color:var(--text-muted)">${playerName} • ${trackCapitalized}</span>
        </div>
      </div>
    </aside>
  `;
}

// ---- LOGOUT HELPER ----
function logoutUser() {
  sessionStorage.removeItem('qp_name');
  sessionStorage.removeItem('qp_track');
  sessionStorage.removeItem('qp_progress');
  if (window.QP) {
    window.QP.playerName = null;
    window.QP.track = 'newbie';
    window.QP.progress = 15;
  }
  showToast('Logged out safely. See you soon! 🐾', 'default');
  setTimeout(() => navigate('/login'), 300);
}

// ---- NAVBAR BUILDER ----
function buildNavbar(activeItem = '') {
  return `
    <nav class="navbar">
      <a class="navbar-logo" onclick="navigate('/dashboard')" href="javascript:void(0)">
        <span>🐾</span>
        <span>Qc<span style="color:var(--primary)">ify</span></span>
      </a>
      <div class="navbar-menu">
        <a class="nav-link ${activeItem === 'home' ? 'active' : ''}" onclick="navigate('/dashboard')">Home</a>
        <a class="nav-link ${activeItem === 'lessons' ? 'active' : ''}" onclick="navigate('/lesson')">Lessons</a>
        <a class="nav-link ${activeItem === 'sandbox' ? 'active' : ''}" onclick="navigate('/sandbox')">Sandbox</a>
        <a class="nav-link ${activeItem === 'badges' ? 'active' : ''}" onclick="navigate('/badges')">Badges</a>
        <a class="nav-link ${activeItem === 'profile' ? 'active' : ''}" onclick="navigate('/profile')">Profile</a>
      </div>
      <div class="navbar-right">
        <div class="streak-counter" title="Quantum Day Streak">🔥 5</div>
        <div class="avatar" style="width:36px;height:36px;font-size:18px;cursor:pointer" onclick="navigate('/profile')" title="View Profile">🐱</div>
      </div>
    </nav>
  `;
}

// ---- BOTTOM NAV (Mobile) ----
function buildBottomNav(active = 'home') {
  const items = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/dashboard' },
    { id: 'lessons', icon: '📚', label: 'Learn', path: '/lesson' },
    { id: 'sandbox', icon: '⚗️', label: 'Lab', path: '/sandbox' },
    { id: 'badges', icon: '🏆', label: 'Badges', path: '/badges' },
    { id: 'profile', icon: '👤', label: 'Profile', path: '/profile' },
  ];
  return `
    <nav class="bottom-nav">
      ${items.map(i => `
        <div class="bottom-nav-item ${i.id === active ? 'active' : ''}" onclick="navigate('${i.path}')">
          <span class="nav-icon">${i.icon}</span>
          <span>${i.label}</span>
        </div>
      `).join('')}
    </nav>
  `;
}

// ---- BADGE SLOT (Tactile Lab Badges) ----
function buildBadgeSlot(badge) {
  if (typeof BadgeRenderer !== 'undefined' && badge.id) {
    const prog = typeof BadgesEngine !== 'undefined' ? BadgesEngine.getBadgeProgress(badge.id) : { status: badge.earned ? 'earned' : 'locked' };
    const tier = prog.status;
    return `
      <div class="badge-slot ${tier !== 'locked' ? 'earned' : 'unearned'}" 
           title="${badge.name || badge.label} (${tier.toUpperCase()})"
           style="cursor:pointer;padding:6px;display:flex;flex-direction:column;align-items:center"
           onclick="BadgeModal.openDetails('${badge.id}', false)">
        ${BadgeRenderer.renderSmall(badge.id, tier, 42)}
        <div class="badge-slot-label" style="font-size:10px;margin-top:2px;max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${tier !== 'locked' ? (badge.name || badge.label) : '???'}
        </div>
      </div>
    `;
  }

  if (badge.earned) {
    return `
      <div class="badge-slot earned" title="${badge.label}">
        <span style="font-size:24px">${badge.icon}</span>
        <div class="badge-slot-label">${badge.label}</div>
      </div>
    `;
  }
  return `
    <div class="badge-slot unearned" title="Locked">
      <span style="font-size:24px;filter:grayscale(1);opacity:0.35">🔒</span>
      <div class="badge-slot-label" style="font-size:9px;color:var(--text-muted)">???</div>
    </div>
  `;
}

// ---- STARS BG ----
function buildStarsBg() {
  return `<div class="bg-stars" aria-hidden="true"></div>`;
}
