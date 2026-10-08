/**
 * Qcify — Badge Modal & Unlock Animation Engine
 * 
 * Handles:
 * - Interactive Quiz Runner for Normal & Secret Quizzes
 * - Badge Inspection Details Modal
 * - Web Audio API Synthetic Quantum Chime (Futuristic sound fx)
 * - Canvas Particle Burst Ceremony for Unlocks & Superior Evolutions
 */

const BadgeModal = (function () {

  // ---- Synthesized Quantum Audio Engine ----
  function playQuantumSound(type = 'chime') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'chime' || type === 'earn') {
        // Multi-frequency harmonic crystal chime
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.08);

          gain.gain.setValueAtTime(0, now + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.15, now + i * 0.08 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 1.0);
        });
      } else if (type === 'mastered') {
        // Ascending harmonic shimmer
        const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.06);

          gain.gain.setValueAtTime(0, now + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.18, now + i * 0.06 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 1.3);
        });
      } else if (type === 'superior') {
        // Epic power chord sweep
        const baseFreqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5];
        baseFreqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.05);
          osc.frequency.exponentialRampToValueAtTime(f * 1.5, now + 1.5);

          gain.gain.setValueAtTime(0, now + i * 0.05);
          gain.gain.linearRampToValueAtTime(0.2, now + i * 0.05 + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.05);
          osc.stop(now + 2.1);
        });
      }
    } catch (e) {
      // Audio autoplay policy or unavailable - silent fallback
    }
  }

  // ---- Particle Canvas Burst ----
  function createParticleBurst(canvas, colorScheme = 'cyan-purple') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.offsetWidth || 500);
    const height = (canvas.height = canvas.offsetHeight || 500);

    const particles = [];
    const count = 55;

    let palette = ['#22D3EE', '#7C5CFF', '#A78BFA', '#38BDF8', '#FFFFFF'];
    if (colorScheme === 'mastered') {
      palette = ['#EC4899', '#8B5CF6', '#F472B6', '#C084FC', '#FBBF24', '#FFFFFF'];
    } else if (colorScheme === 'superior') {
      palette = ['#FDE047', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6', '#FFFFFF'];
    }

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02
      });
    }

    let animId;
    function render() {
      ctx.clearRect(0, 0, width, height);
      let alive = 0;

      particles.forEach(p => {
        if (p.alpha > 0) {
          alive++;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive > 0) {
        animId = requestAnimationFrame(render);
      }
    }

    render();
  }

  // Remove existing modal if any
  function closeModal() {
    const existing = document.getElementById('quantum-badge-modal-root');
    if (existing) {
      existing.remove();
    }
  }

  // ---- Open Quiz Runner ----
  function openQuiz(badgeId, type = 'normal') {
    closeModal();

    const quizData = BadgeQuizzes.getQuiz(badgeId, type);
    if (!quizData) {
      console.error('Quiz not found for:', badgeId, type);
      return;
    }

    // Access control: Secret Quiz requires foundational badge to be EARNED first
    if (type === 'secret') {
      const prog = BadgesEngine.getBadgeProgress(badgeId);
      if (!prog || !prog.earned) {
        if (typeof showToast === 'function') {
          showToast('🔒 Secret Challenge is locked! Pass the foundational quiz first.', 'default', 3500);
        }
        return;
      }
    }

    // Find badge info
    let badgeMeta = null;
    let topicMeta = null;
    BadgesEngine.TOPICS.forEach(t => {
      const found = t.smallBadges.find(b => b.id === badgeId);
      if (found) {
        badgeMeta = found;
        topicMeta = t;
      }
    });

    if (!badgeMeta) return;

    let currentIndex = 0;
    let userAnswers = [];
    let isAnswerSubmitted = false;

    const modalRoot = document.createElement('div');
    modalRoot.id = 'quantum-badge-modal-root';
    modalRoot.className = 'badge-modal-backdrop';

    function renderQuestion() {
      const q = quizData.questions[currentIndex];
      const total = quizData.questions.length;
      const isLast = currentIndex === total - 1;

      modalRoot.innerHTML = `
        <div class="badge-modal-container">
          <button class="badge-modal-close-btn" onclick="BadgeModal.closeModal()">✕</button>

          <div class="quiz-modal-body">
            <!-- Header -->
            <div class="quiz-modal-header">
              <div class="quiz-badge-info">
                ${BadgeRenderer.renderSmall(badgeId, 'earned', 48)}
                <div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="quiz-type-tag ${type === 'secret' ? 'quiz-type-secret' : 'quiz-type-normal'}">
                      ${type === 'secret' ? '⚡ SECRET CHALLENGE' : '⚛️ FOUNDATIONAL QUIZ'}
                    </span>
                    <span class="text-caption text-muted">${topicMeta.name}</span>
                  </div>
                  <h3 style="margin-top:4px;font-family:var(--font-heading)">${badgeMeta.name} — ${quizData.title}</h3>
                </div>
              </div>

              <!-- Progress bar -->
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <span class="text-caption text-muted">Question ${currentIndex + 1} of ${total}</span>
                <span class="text-caption font-code text-accent">${Math.round(((currentIndex) / total) * 100)}% Complete</span>
              </div>
              <div class="progress-track" style="height:6px">
                <div class="progress-fill" style="width:${((currentIndex + 1) / total) * 100}%;height:100%"></div>
              </div>
            </div>

            <!-- Question Box -->
            <div class="quiz-question-box">
              <div class="quiz-question-text">${q.question}</div>

              <div class="quiz-options-list" id="quiz-options-list">
                ${q.options.map((opt, i) => `
                  <button class="quiz-option-btn" data-index="${i}" onclick="BadgeModal._selectOption(${i})">
                    <span style="font-family:var(--font-code);font-weight:700;color:var(--text-muted)">${String.fromCharCode(65 + i)})</span>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>

              <div id="quiz-feedback-box" class="quiz-explanation-box hidden"></div>
            </div>

            <!-- Footer Navigation -->
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div class="text-caption text-muted">Pass criteria: ≥75% correct</div>
              <button id="quiz-next-btn" class="btn btn-primary btn-md" disabled onclick="BadgeModal._handleNext()">
                ${isLast ? 'Complete & Score 🏁' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      `;

      isAnswerSubmitted = false;
    }

    // Handlers exposed to BadgeModal internal routing
    BadgeModal._selectOption = function (selectedIndex) {
      if (isAnswerSubmitted) return;
      isAnswerSubmitted = true;

      const q = quizData.questions[currentIndex];
      const isCorrect = selectedIndex === q.correct;
      userAnswers[currentIndex] = { selected: selectedIndex, isCorrect };

      const btns = modalRoot.querySelectorAll('.quiz-option-btn');
      btns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correct) {
          btn.classList.add('correct');
        } else if (idx === selectedIndex) {
          btn.classList.add('wrong');
        }
      });

      const feedbackBox = modalRoot.querySelector('#quiz-feedback-box');
      if (feedbackBox) {
        feedbackBox.classList.remove('hidden');
        feedbackBox.innerHTML = `
          <div style="font-weight:700;margin-bottom:4px;color:${isCorrect ? '#34D399' : '#EF4444'}">
            ${isCorrect ? '✓ Correct!' : '✗ Not quite.'}
          </div>
          <div>${q.explanation}</div>
        `;
      }

      const nextBtn = modalRoot.querySelector('#quiz-next-btn');
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    };

    BadgeModal._handleNext = function () {
      if (currentIndex < quizData.questions.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        // Complete Quiz
        finishQuiz();
      }
    };

    function finishQuiz() {
      const total = quizData.questions.length;
      const correct = userAnswers.filter(a => a && a.isCorrect).length;
      const pct = Math.round((correct / total) * 100);
      const passed = pct >= 75;

      let result = null;
      if (type === 'normal') {
        result = BadgesEngine.recordNormalQuiz(badgeId, correct, total);
      } else {
        result = BadgesEngine.recordSecretQuiz(badgeId, correct, total);
      }

      if (passed) {
        // Show Unlock Celebration Modal!
        openCelebration({
          badgeId,
          type,
          correct,
          total,
          pct,
          badgeMeta,
          topicMeta,
          engineResult: result
        });
      } else {
        // Failed attempt modal
        renderFailModal(correct, total, pct);
      }
    }

    function renderFailModal(correct, total, pct) {
      modalRoot.innerHTML = `
        <div class="badge-modal-container">
          <button class="badge-modal-close-btn" onclick="BadgeModal.closeModal()">✕</button>
          <div class="quiz-modal-body" style="text-align:center;padding:40px 32px">
            <div style="font-size:48px;margin-bottom:12px">🐱🐾</div>
            <h2 style="font-family:var(--font-heading);margin-bottom:8px">Almost There, Scientist!</h2>
            <p class="text-muted" style="margin-bottom:24px">
              You scored <strong>${correct}/${total} (${pct}%)</strong>. A score of 75% or higher is required to ${type === 'secret' ? 'master this badge' : 'unlock this badge'}.
            </p>

            <div class="card" style="margin-bottom:24px;border-color:rgba(124,92,255,0.3)">
              <div style="font-size:14px;color:var(--text-chalk);font-style:italic">
                "In quantum mechanics, observation takes repeated measurements. Don't worry, your existing badges are completely safe! Review the concepts and give it another try."
              </div>
              <div style="margin-top:8px;font-size:12px;font-weight:600;color:var(--accent)">— Schrö</div>
            </div>

            <div style="display:flex;gap:12px;justify-content:center">
              <button class="btn btn-primary btn-md" onclick="BadgeModal.openQuiz('${badgeId}', '${type}')">
                🔄 Try Again
              </button>
              <button class="btn btn-secondary btn-md" onclick="BadgeModal.closeModal()">
                Back to Collection
              </button>
            </div>
          </div>
        </div>
      `;
    }

    renderQuestion();
    document.body.appendChild(modalRoot);
  }

  // ---- Open Unlock Celebration ----
  function openCelebration(data) {
    closeModal();

    const { badgeId, type, badgeMeta, topicMeta, engineResult } = data;
    const isSecret = type === 'secret';
    const isMastered = isSecret;
    const isMainUnlocked = engineResult?.mainBadgeUnlocked;
    const isMainSuperior = engineResult?.mainBadgeSuperior;

    // Trigger synthetic audio
    if (isMainSuperior) {
      playQuantumSound('superior');
    } else if (isMastered || isMainUnlocked) {
      playQuantumSound('mastered');
    } else {
      playQuantumSound('earn');
    }

    const modalRoot = document.createElement('div');
    modalRoot.id = 'quantum-badge-modal-root';
    modalRoot.className = 'badge-modal-backdrop';

    const targetTier = isMastered ? 'mastered' : 'earned';

    let headerTitle = 'Small Badge Earned!';
    let subTitle = `You've unlocked the <strong>${badgeMeta.name}</strong> achievement badge.`;
    if (isMastered) {
      headerTitle = 'Badge Mastered! ✨';
      subTitle = `Incredible! You have elevated <strong>${badgeMeta.name}</strong> to the <strong>MASTERED</strong> tier.`;
    }

    modalRoot.innerHTML = `
      <div class="badge-modal-container celebration-modal">
        <canvas class="particles-canvas" id="celebration-particles"></canvas>
        <div class="celebration-burst"></div>
        <button class="badge-modal-close-btn" onclick="BadgeModal.closeModal()">✕</button>

        <div style="position:relative;z-index:2">
          <!-- Celebration Badge Hero -->
          <div class="celebration-badge-hero">
            ${BadgeRenderer.renderSmall(badgeId, targetTier, 140)}
          </div>

          <div class="celebration-title">${headerTitle}</div>
          <p class="celebration-tagline">${subTitle}</p>

          ${!isMastered ? `
            <div class="secret-unlock-banner">
              <span>🔓</span>
              <span>SECRET CHALLENGE UNLOCKED FOR ${badgeMeta.name.toUpperCase()}!</span>
            </div>
          ` : ''}

          <!-- Main Badge Progression Notification -->
          ${isMainUnlocked ? `
            <div style="background:rgba(56, 189, 248, 0.15);border:1px solid rgba(56,189,248,0.4);border-radius:12px;padding:12px;margin-bottom:20px">
              <div style="font-weight:700;color:#38BDF8;font-size:14px">🏆 MAIN BADGE UNLOCKED: ${topicMeta.mainBadge.name}!</div>
              <div style="font-size:12px;color:var(--text-chalk);margin-top:2px">All 4 small badges in ${topicMeta.name} have been earned!</div>
            </div>
          ` : ''}

          ${isMainSuperior ? `
            <div style="background:linear-gradient(90deg, rgba(251,191,36,0.25), rgba(236,72,153,0.25));border:1px solid rgba(251,191,36,0.6);border-radius:12px;padding:14px;margin-bottom:20px;box-shadow:0 0 20px rgba(251,191,36,0.2)">
              <div style="font-weight:700;color:#FDE047;font-size:15px">👑 SUPERIOR MAIN BADGE ACHIEVED: ${topicMeta.mainBadge.name}!</div>
              <div style="font-size:12px;color:var(--text-chalk);margin-top:2px">Ultimate Mastery: All 4 small badges in this topic are now MASTERED!</div>
            </div>
          ` : ''}

          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${!isMastered ? `
              <button class="btn btn-badge-action btn-secret-quiz" style="width:auto;padding:10px 20px;font-size:14px" onclick="BadgeModal.openQuiz('${badgeId}', 'secret')">
                ⚡ Take Secret Challenge Now
              </button>
            ` : ''}
            <button class="btn btn-primary btn-md" onclick="BadgeModal.closeModal(); if (window.renderProfile) window.renderProfile(document.getElementById('app'));">
              View in Badge Collection →
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalRoot);

    // Run particles
    setTimeout(() => {
      const canvas = document.getElementById('celebration-particles');
      createParticleBurst(canvas, isMainSuperior ? 'superior' : isMastered ? 'mastered' : 'cyan-purple');
    }, 50);
  }

  // ---- Open Badge Details Modal ----
  function openDetails(badgeId, isMain = false) {
    closeModal();

    let topicMeta = null;
    let badgeMeta = null;

    if (isMain) {
      topicMeta = BadgesEngine.TOPICS.find(t => t.mainBadge.id === badgeId);
      if (!topicMeta) return;
      badgeMeta = topicMeta.mainBadge;
    } else {
      BadgesEngine.TOPICS.forEach(t => {
        const found = t.smallBadges.find(b => b.id === badgeId);
        if (found) {
          badgeMeta = found;
          topicMeta = t;
        }
      });
      if (!badgeMeta) return;
    }

    const modalRoot = document.createElement('div');
    modalRoot.id = 'quantum-badge-modal-root';
    modalRoot.className = 'badge-modal-backdrop';

    if (isMain) {
      const progress = BadgesEngine.getMainBadgeProgress(badgeId);
      const topicProg = BadgesEngine.getTopicProgress(topicMeta.id);

      modalRoot.innerHTML = `
        <div class="badge-modal-container">
          <button class="badge-modal-close-btn" onclick="BadgeModal.closeModal()">✕</button>
          <div class="quiz-modal-body" style="text-align:center;padding:36px 28px">
            <div>
              ${BadgeRenderer.renderMain(badgeId, progress.status, 150)}
            </div>

            <div style="margin-top:16px">
              <span class="main-badge-tier-tag tier-${progress.status}-tag">
                ${progress.status === 'superior' ? '👑 SUPERIOR MAIN BADGE' : progress.status === 'earned' ? '✓ UNLOCKED' : '🔒 LOCKED'}
              </span>
            </div>

            <h2 style="font-family:var(--font-heading);margin-top:12px;margin-bottom:6px">${badgeMeta.name}</h2>
            <div class="text-caption text-muted" style="margin-bottom:16px">${topicMeta.name} (Topic ${topicMeta.number})</div>

            <p style="font-size:14px;color:var(--text-chalk);margin-bottom:20px;line-height:1.6">
              ${badgeMeta.description || badgeMeta.concept}
            </p>

            <!-- Topic Small Badge Progress -->
            <div class="card" style="text-align:left;margin-bottom:24px;border-color:rgba(124,92,255,0.25)">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="font-weight:600;font-size:13px">Topic Progression</span>
                <span class="font-code text-accent text-sm">${topicProg.earnedCount}/4 Badges • ${topicProg.masteredCount}/4 Mastered</span>
              </div>
              <div class="progress-track" style="height:8px;margin-bottom:12px">
                <div class="progress-fill" style="width:${(topicProg.earnedCount / 4) * 100}%;height:100%"></div>
              </div>
              <div class="text-caption text-muted">
                ${progress.status === 'superior'
                  ? 'All 4 badges have been mastered! This Main Badge has reached its ultimate Superior state.'
                  : progress.status === 'earned'
                    ? 'Main badge unlocked! Master all 4 small badges via Secret Quizzes to ascend to SUPERIOR tier.'
                    : 'Earn all 4 small topic badges by passing their Normal Quizzes to unlock this Main Badge.'
                }
              </div>
            </div>

            <button class="btn btn-primary btn-md w-full" onclick="BadgeModal.closeModal()">
              Close
            </button>
          </div>
        </div>
      `;
    } else {
      const progress = BadgesEngine.getBadgeProgress(badgeId);

      modalRoot.innerHTML = `
        <div class="badge-modal-container">
          <button class="badge-modal-close-btn" onclick="BadgeModal.closeModal()">✕</button>
          <div class="quiz-modal-body" style="text-align:center;padding:36px 28px">
            <div>
              ${BadgeRenderer.renderSmall(badgeId, progress.status, 130)}
            </div>

            <div style="margin-top:14px">
              <span class="main-badge-tier-tag tier-${progress.status}-tag">
                ${progress.status.toUpperCase()}
              </span>
            </div>

            <h2 style="font-family:var(--font-heading);margin-top:10px;margin-bottom:4px">${badgeMeta.name}</h2>
            <div class="text-caption text-muted" style="margin-bottom:16px">${topicMeta.name}</div>

            <p style="font-size:14px;color:var(--text-chalk);margin-bottom:24px;line-height:1.6">
              ${badgeMeta.concept}
            </p>

            <!-- Action buttons depending on state -->
            <div style="display:flex;flex-direction:column;gap:10px">
              ${progress.status === 'locked' ? `
                <button class="btn btn-badge-action btn-take-quiz" style="padding:12px;font-size:14px" onclick="BadgeModal.openQuiz('${badgeId}', 'normal')">
                  🚀 Take Normal Quiz (Unlock Badge)
                </button>
              ` : progress.status === 'earned' ? `
                <button class="btn btn-badge-action btn-secret-quiz" style="padding:12px;font-size:14px" onclick="BadgeModal.openQuiz('${badgeId}', 'secret')">
                  ⚡ Take Secret Quiz (Elevate to Mastered)
                </button>
                <button class="btn btn-ghost btn-sm" onclick="BadgeModal.openQuiz('${badgeId}', 'normal')">
                  🔄 Retake Normal Quiz
                </button>
              ` : `
                <div class="btn-badge-action btn-mastered-tag" style="padding:10px;font-size:13px">
                  ✓ Mastered Tier Achieved
                </div>
                <button class="btn btn-ghost btn-sm" onclick="BadgeModal.openQuiz('${badgeId}', 'secret')">
                  🔄 Retake Secret Challenge
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }

    document.body.appendChild(modalRoot);
  }

  return {
    openQuiz,
    openDetails,
    openCelebration,
    closeModal,
    playQuantumSound
  };
})();

// Attach to window
if (typeof window !== 'undefined') {
  window.BadgeModal = BadgeModal;
}
