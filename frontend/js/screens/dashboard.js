/**
 * Qcify — Newbie Dashboard
 */

const BADGES_DATA = [
  { icon: '⚛️', label: 'First Qubit', earned: true },
  { icon: '🌊', label: 'Wave Rider', earned: true },
  { icon: '🎯', label: 'Superposer', earned: true },
  { icon: '🔮', label: 'Gate Maker', earned: false },
  { icon: '🌀', label: 'Entangler', earned: false },
  { icon: '🏆', label: 'Quiz Ace', earned: false },
  { icon: '🚀', label: 'Rocket', earned: false },
  { icon: '💎', label: 'Genius', earned: false },
];

const NEWS_DATA = [
  { icon: '⚛️', headline: 'Qubits break coherence record — 1ms at room temp!', time: '2h ago', color: '#7C5CFF' },
  { icon: '🔗', headline: 'New error correction algorithm reduces noise by 60%', time: '5h ago', color: '#22D3EE' },
  { icon: '🌌', headline: 'Entanglement demonstrated across 600km fiber link', time: '1d ago', color: '#34D399' },
];

const ROADMAP_NODES = [
  { id: 1, title: 'Superposition', subtitle: 'The quantum coin flip', status: 'unlocked', icon: '⚛️' },
  { id: 2, title: 'Qubits & States', subtitle: 'Meet the quantum bit', status: 'locked', icon: '💡' },
  { id: 3, title: 'Quantum Gates', subtitle: 'Logic for the quantum world', status: 'locked', icon: '🔧' },
  { id: 4, title: 'Entanglement', subtitle: 'Spooky action at a distance', status: 'locked', icon: '🔗' },
  { id: 5, title: 'Quantum Circuits', subtitle: 'Building quantum programs', status: 'locked', icon: '⚡' },
  { id: 6, title: 'Grover\'s Algorithm', subtitle: 'Quantum search power', status: 'locked', icon: '🔍' },
];

function renderDashboard(app, params = {}) {
  const name = window.QP?.playerName || sessionStorage.getItem('qp_name') || 'Explorer';
  const storedProg = parseInt(sessionStorage.getItem('qp_progress') || (window.QP?.progress ? String(window.QP.progress) : '15'));
  const progressPct = params.progress40 ? Math.max(storedProg, 40) : storedProg;

  const superProg = typeof BadgesEngine !== 'undefined' ? BadgesEngine.getBadgeProgress('superposition') : { earned: false };
  const qubitProg = typeof BadgesEngine !== 'undefined' ? BadgesEngine.getBadgeProgress('qubit') : { earned: false };

  const curState = (typeof CurriculumProgress !== 'undefined') ? CurriculumProgress.getState() : { completedLessons: [], unlockedLesson: 0 };
  const l0Done = (typeof CurriculumProgress !== 'undefined') ? CurriculumProgress.isCompleted(0) : false;
  const l1Done = (typeof CurriculumProgress !== 'undefined') ? CurriculumProgress.isCompleted(1) : false;
  const l2Done = (typeof CurriculumProgress !== 'undefined') ? CurriculumProgress.isCompleted(2) : false;
  const l3Done = (typeof CurriculumProgress !== 'undefined') ? CurriculumProgress.isCompleted(3) : false;

  const isIntermediate = l3Done || sessionStorage.getItem('qp_user_level') === 'intermediate';

  const roadmapNodes = [
    { 
      id: 0, 
      lessonId: 0,
      title: 'Lesson 0: What, Why & How', 
      subtitle: l0Done ? 'Completed! 🌟' : 'Light switches, spinning coins & mysteries', 
      status: 'unlocked', 
      icon: l0Done ? '✅' : '🪙' 
    },
    { 
      id: 1, 
      lessonId: 1,
      title: 'Lesson 1: Classical to Quantum', 
      subtitle: l1Done ? 'Completed! 🌐' : 'Qubits, amplitudes & Bloch Sphere', 
      status: (typeof CurriculumProgress !== 'undefined' ? CurriculumProgress.isUnlocked(1) : l0Done) ? 'unlocked' : 'locked', 
      icon: l1Done ? '✅' : '💡' 
    },
    { 
      id: 2, 
      lessonId: 2,
      title: 'Lesson 2: Gates & Entanglement', 
      subtitle: l2Done ? 'Completed! 🔗' : 'X, H, circuit wires & CNOT', 
      status: (typeof CurriculumProgress !== 'undefined' ? CurriculumProgress.isUnlocked(2) : l1Done) ? 'unlocked' : 'locked', 
      icon: l2Done ? '✅' : '🔧' 
    },
    { 
      id: 3, 
      lessonId: 3,
      title: 'Lesson 3: Lab & Qiskit Code', 
      subtitle: l3Done ? 'Graduated! 🎓' : 'Visual composer to live Python code', 
      status: (typeof CurriculumProgress !== 'undefined' ? CurriculumProgress.isUnlocked(3) : l2Done) ? 'unlocked' : 'locked', 
      icon: l3Done ? '✅' : '⚡' 
    },
    { 
      id: 4, 
      lessonId: null,
      title: 'Circuit Sandbox (Full)', 
      subtitle: l3Done ? 'UNLOCKED! Unlimited Lab 🧪' : 'Unlocks after Lesson 3 graduation', 
      status: l3Done ? 'unlocked' : 'locked', 
      icon: l3Done ? '🔓' : '🔒' 
    }
  ];

  app.innerHTML = `
    ${buildStarsBg()}
    ${buildSidebar('home')}
    ${buildNavbar('home')}
    ${buildBottomNav('home')}

    <div class="dashboard-layout">
      <!-- Main (Spans 8 columns) -->
      <main class="dashboard-main">

        <!-- Greeting -->
        <div class="greeting-row section-animate">
          <div id="dash-schro-sm" style="display:flex;align-items:center;justify-content:center"></div>
          <div class="greeting-text" style="flex:1">
            <div class="card-sketch-tag">LAB NOTE: LOGGED IN AS ${name.toUpperCase()}</div>
            <h2>Hey ${name}! Ready to purr? 🐾</h2>
            <p class="text-muted">You're on fire — keep that quantum curiosity flowing!</p>
          </div>
          <div class="streak-counter" title="Active Quantum Streak">🔥 5 days</div>
        </div>

        <!-- Journey Progress (Span 8 columns with intentional right bleed) -->
        <div class="card card-sketch journey-span-8 section section-animate">
          <div class="card-sketch-tag">EXP. RUNTIME: 84% COHERENCE</div>
          <div class="section-title" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
            <span>🗺️ Journey to Intermediate</span>
            <span style="font-family:var(--font-code);font-size:11px;color:var(--accent-lime);background:rgba(163,255,18,0.1);padding:3px 8px;border-radius:4px;border:1px solid rgba(163,255,18,0.3)">LEVEL 01: QUBIT ROOKIE</span>
          </div>
          ${createProgressBar(progressPct, 100, 'Overall Progress', true)}
          <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
            <div class="badge badge-success">✓ Picked track</div>
            <div class="badge badge-success">✓ Met Schrö</div>
            <div class="badge ${progressPct >= 25 ? 'badge-success' : 'badge-locked'}">
              ${progressPct >= 25 ? '✓' : '○'} First lesson
            </div>
            <div class="badge badge-locked" style="opacity:0.5">○ First quiz</div>
          </div>
        </div>

        <!-- Roadmap -->
        <div class="section section-animate">
          <div class="section-title" style="display:flex;align-items:center;justify-content:space-between">
            <span>🛣️ Your Quantum Roadmap</span>
            <span class="text-caption text-muted" style="font-family:var(--font-code)">TAPED LAB SEQUENCE</span>
          </div>
          <div class="roadmap" id="roadmap">
            ${roadmapNodes.map(node => `
              <div class="roadmap-node" onclick="handleNodeClick(${node.id})" 
                   title="${node.status === 'locked' ? 'Finish previous lesson to unlock' : ''}">
                <div class="node-circle ${node.status}">
                  ${node.status === 'locked' ? '🔒' : node.icon}
                </div>
                <div class="node-info">
                  <div class="node-title ${node.status === 'locked' ? 'text-muted' : ''}">
                    ${node.title}
                    ${node.status === 'unlocked' ? `<span style="font-size:10px;color:var(--accent-lime);margin-left:8px;font-family:var(--font-code);font-weight:700">ACTIVE EXPERIMENT</span>` : ''}
                  </div>
                  <div class="node-subtitle">${node.subtitle}</div>
                  ${node.status === 'unlocked' ? `
                    <button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="event.stopPropagation();handleNodeAction(${node.id})">
                      ${node.lessonId !== null ? `Start Lesson ${node.lessonId} →` : `Open Sandbox →`}
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Locked Features / Sandbox Unlock Banner -->
        <div class="section section-animate">
          <div class="section-title">🔒 Coming as You Progress</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="card card-sketch ${l3Done ? 'tape-cyan' : 'locked'} clickable" onclick="${l3Done ? "navigate('/sandbox')" : 'shakeLockedCard(this)'}">
              <div class="lock-icon">${l3Done ? '🔓' : '🔒'}</div>
              <div style="font-size:28px;margin-bottom:12px;filter:${l3Done ? 'none' : 'grayscale(1)'}">⚗️</div>
              <h4 style="color:${l3Done ? 'var(--accent)' : 'var(--text-muted)'}">Circuit Sandbox</h4>
              <p class="text-sm text-muted">Full multi-qubit interactive composer</p>
              <div class="badge ${l3Done ? 'badge-success' : 'badge-locked'}" style="margin-top:12px">
                ${l3Done ? 'UNLOCKED • INTERMEDIATE' : 'Unlocks after Lesson 3'}
              </div>
            </div>
            <div class="card card-sketch locked clickable tilt-right" onclick="shakeLockedCard(this)">
              <div class="lock-icon">🔒</div>
              <div style="font-size:28px;margin-bottom:12px;filter:grayscale(1)">📐</div>
              <h4 style="color:var(--text-muted)">Advanced Math</h4>
              <p class="text-sm text-muted">Linear algebra & matrix ops</p>
              <div class="badge badge-locked" style="margin-top:12px">Unlocks at Topic 3</div>
            </div>
          </div>
        </div>

      </main>

      <!-- Right Column (Overlaps 16px) -->
      <aside class="dashboard-right">
        <!-- Ask Schrö Card (Taped Lab Note) -->
        <div class="card card-sketch tape-cyan" style="margin-bottom:24px;text-align:center;cursor:pointer"
             onclick="toggleChatDrawer()">
          <div class="card-sketch-tag">ON-CALL AI MENTOR</div>
          <div style="font-size:36px;margin:4px 0 8px">🐾</div>
          <h4>Ask Schrö</h4>
          <p class="text-sm text-muted" style="margin:4px 0 12px">Got a quantum question? Purr right in!</p>
          <button class="btn btn-primary btn-sm w-full">Open Chat ⚛️</button>
        </div>

        <!-- Badges -->
        <div class="section-title" style="display:flex;justify-content:space-between;align-items:center">
          <span style="cursor:pointer" onclick="navigate('/badges')">🏆 Badges</span>
          <span style="font-size:11px;font-family:var(--font-code);color:var(--accent-lime);cursor:pointer" onclick="navigate('/badges')">
            ${(typeof BadgesEngine !== 'undefined' ? BadgesEngine.getGlobalStats().totalEarned : 0)}/8 UNLOCKED →
          </span>
        </div>
        <div class="badges-grid" style="margin-bottom:24px">
          ${(typeof BadgesEngine !== 'undefined'
              ? BadgesEngine.TOPICS.filter(t => !t.comingSoon).flatMap(t => t.smallBadges)
              : BADGES_DATA
            ).map(b => buildBadgeSlot(b)).join('')}
        </div>

        <!-- News (Taped Lab Dispatches) -->
        <div class="section-title">📰 Quantum News</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${NEWS_DATA.map(n => `
            <div class="news-card hover-scale">
              <div class="news-thumb" style="background:rgba(124,92,255,0.12)">${n.icon}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:500;line-height:1.4">${n.headline}</div>
                <div class="text-caption text-muted" style="margin-top:4px;font-family:var(--font-code)">${n.time} • DISPATCH #042</div>
              </div>
            </div>
          `).join('')}
        </div>
      </aside>
    </div>
  `;

  // Insert small Schrö avatar
  const schroEl = document.getElementById('dash-schro-sm');
  schroEl.appendChild(renderSchro('happy', 48));

  // Animate progress bar
  if (isUpdated) {
    setTimeout(() => {
      animateProgressBar('prog-fill', 15, 40);
      showToast('New badge: Superposition Starter! 🏆', 'reward');
    }, 600);
  } else {
    setTimeout(() => animateProgressBar('prog-fill', 0, progressPct), 300);
  }
}

function handleNodeAction(nodeId) {
  if (nodeId >= 0 && nodeId <= 3) {
    navigate('/lesson', { id: nodeId, step: 0 });
  } else if (nodeId === 4) {
    navigate('/sandbox');
  }
}

function handleNodeClick(nodeId) {
  const isUnlocked = (typeof CurriculumProgress !== 'undefined')
    ? (nodeId <= 3 ? CurriculumProgress.isUnlocked(nodeId) : CurriculumProgress.isCompleted(3))
    : (nodeId === 0);

  if (isUnlocked) {
    handleNodeAction(nodeId);
  } else {
    const nodes = document.querySelectorAll('.roadmap-node');
    const node = nodes[nodeId];
    if (node) shakeElement(node);
    showToast(`Complete previous lesson first to unlock! 🔒`, 'default', 2500);
  }
}

function shakeLockedCard(el) {
  shakeElement(el);
  showToast('Complete more lessons to unlock this feature! 💜', 'default', 2500);
}
