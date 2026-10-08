/**
 * Qcify — Quantum Learning Curriculum Engine (Lessons 0–3)
 * 
 * Provides a structured beginner-to-intermediate learning journey:
 * - Lesson 0: "What, Why, and How is Quantum" (Zero-fear, switch vs. coin, CoinFlipSim, Facts & Myths)
 * - Lesson 1: "Transition from Classical to Quantum" (Bit vs Qubit, Gentle Math, 3D Bloch Sphere, Hilbert Space)
 * - Lesson 2: "Quantum Gates, Circuits & Entanglement" (X & H gates, circuit reading, CNOT & Entanglement)
 * - Lesson 3: "Practice Lab: From Visual Composer to Code" (Visual to live Qiskit code, Bell State, Intermediate Unlock)
 */

// =====================================================================
// 1. CURRICULUM REGISTRY & METADATA
// =====================================================================
const CURRICULUM_LESSONS = [
  {
    id: 0,
    title: "What, Why, and How is Quantum",
    tagline: "Zero-fear entry point: light switches, spinning coins, and real-world mysteries",
    badgeTarget: "Qubit Curiosity",
    steps: [
      { id: 0, title: "1. How it Works", name: "Switch vs. Coin" },
      { id: 1, title: "2. Feel It", name: "Interactive Coin Flip" },
      { id: 2, title: "3. Why it Matters", name: "Facts & Myths" },
      { id: 3, title: "4. Intuition Check", name: "Gateway Quiz" }
    ]
  },
  {
    id: 1,
    title: "Transition from Classical to Quantum",
    tagline: "From binary transistors to probability amplitudes & the Bloch Sphere",
    badgeTarget: "Superposition Small Badge",
    steps: [
      { id: 0, title: "1. Bit vs Qubit", name: "State Comparison" },
      { id: 1, title: "2. Gentle Math", name: "Amplitudes & 100%" },
      { id: 2, title: "3. Bloch Sphere", name: "3D State Vector" },
      { id: 3, title: "4. Hilbert Space", name: "Quantum Playground" },
      { id: 4, title: "5. Badge Quiz", name: "Superposition Quiz" }
    ]
  },
  {
    id: 2,
    title: "Quantum Gates, Circuits & Entanglement",
    tagline: "Reading circuit wires, applying Pauli & Hadamard rotations, and two-qubit entanglement",
    badgeTarget: "Single Gates Badge",
    steps: [
      { id: 0, title: "1. Quantum Gates", name: "X and H Rotations" },
      { id: 1, title: "2. Reading Circuits", name: "Wires & Meters" },
      { id: 2, title: "3. Entanglement & CNOT", name: "Correlations without Myths" },
      { id: 3, title: "4. Badge Quiz", name: "Gates & Circuits Quiz" }
    ]
  },
  {
    id: 3,
    title: "Practice Lab: From Visual Composer to Code",
    tagline: "The graduation bridge: visual circuit building live-synced to real Qiskit Python code",
    badgeTarget: "Intermediate Engineer",
    steps: [
      { id: 0, title: "1. Guided Mission", name: "Superposition Lab" },
      { id: 1, title: "2. Visual to Code", name: "Live Qiskit Mirror" },
      { id: 2, title: "3. Code Anatomy", name: "Line-by-Line Breakdown" },
      { id: 3, title: "4. Bell State Challenge", name: "Graduation Mission" },
      { id: 4, title: "5. Graduation", name: "Intermediate Sandbox Unlock" }
    ]
  }
];

// =====================================================================
// 2. CURRICULUM PROGRESSION & STATE PERSISTENCE
// =====================================================================
const CurriculumProgress = {
  STORAGE_KEY: 'qcify_curriculum_progress',

  getState() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading curriculum progress:', e);
    }
    return {
      completedLessons: [],
      unlockedLesson: 0,
      userLevel: 'beginner',
      overallPct: 15
    };
  },

  saveState(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error saving curriculum progress:', e);
    }
  },

  isUnlocked(lessonId) {
    const s = this.getState();
    return lessonId <= (s.unlockedLesson || 0);
  },

  isCompleted(lessonId) {
    const s = this.getState();
    return (s.completedLessons || []).includes(lessonId);
  },

  completeLesson(lessonId) {
    const s = this.getState();
    if (!s.completedLessons.includes(lessonId)) {
      s.completedLessons.push(lessonId);
    }
    s.unlockedLesson = Math.max(s.unlockedLesson || 0, lessonId + 1);

    // Progress updates
    const pctMap = { 0: 25, 1: 50, 2: 75, 3: 100 };
    const newPct = pctMap[lessonId] || 25;
    s.overallPct = Math.max(s.overallPct || 0, newPct);

    if (lessonId >= 3) {
      s.userLevel = 'intermediate';
      sessionStorage.setItem('qp_user_level', 'intermediate');
    }

    this.saveState(s);
    sessionStorage.setItem('qp_progress', String(s.overallPct));
    if (window.QP) window.QP.progress = s.overallPct;

    return s;
  }
};

// =====================================================================
// 3. RUNTIME LESSON STATE
// =====================================================================
let activeLessonId = 0;
let activeStepIndex = 0;

let lessonRuntimeState = {
  // Lesson 0 state
  switchState: 0, // 0 or 1
  switchCoinSpinning: false,
  coinFlipping: false,
  coinState: 'init', // 'init', 'spinning', '0', '1'
  coinHistory: [],
  selectedFact: 0,
  isAudioPlaying: false,
  quiz0Answers: [],

  // Lesson 1 state
  probAlphaSq: 0.5,
  blochTheta: 90, // degrees
  blochPhi: 0,    // degrees
  blochDragging: false,

  // Lesson 2 state
  gate2Selected: 'H',
  circuit2WireGates: ['H'],
  cnotActive: false,

  // Lesson 3 state
  lab3Gates: [{ gate: 'H', qubit: 0 }],
  lab3ActiveHint: 0,
  lab3MissionPassed: false
};

// =====================================================================
// 4. MAIN RENDER FUNCTION
// =====================================================================
function renderLesson(app, params = {}) {
  // Parse lesson ID from params
  const reqLesson = params.id !== undefined ? parseInt(params.id) : (params.lesson !== undefined ? parseInt(params.lesson) : 0);
  activeLessonId = isNaN(reqLesson) ? 0 : Math.min(Math.max(reqLesson, 0), 3);

  // Parse step index from params
  const currentDef = CURRICULUM_LESSONS[activeLessonId];
  const reqStep = params.step !== undefined ? parseInt(params.step) : 0;
  activeStepIndex = isNaN(reqStep) ? 0 : Math.min(Math.max(reqStep, 0), currentDef.steps.length - 1);

  // Check lock status
  const isUnlocked = CurriculumProgress.isUnlocked(activeLessonId);

  app.innerHTML = `
    ${buildStarsBg()}
    
    <div class="lesson-layout" style="position:relative;min-height:100vh;display:flex;flex-direction:column">
      
      <!-- Top Fixed Header -->
      <header class="lesson-header" style="position:fixed;top:0;left:0;right:0;background:rgba(20,27,45,0.96);backdrop-filter:blur(14px);border-bottom:1px solid rgba(124,92,255,0.2);z-index:100">
        
        <!-- Top Bar: Navigation & Curriculum Tabs -->
        <div class="lesson-top-bar" style="display:flex;align-items:center;justify-content:space-between;padding:10px 24px;border-bottom:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;gap:10px">
          <div style="display:flex;align-items:center;gap:14px">
            <button class="lesson-back-btn" onclick="navigate('/dashboard')" title="Back to Dashboard" 
              style="font-size:14px;background:none;border:none;color:var(--text-chalk);cursor:pointer;display:flex;align-items:center;gap:6px">
              ← Dashboard
            </button>
            <div style="height:18px;width:1px;background:rgba(255,255,255,0.15)"></div>
            <div style="font-family:var(--font-heading);font-weight:700;font-size:15px;display:flex;align-items:center;gap:8px">
              <span style="color:var(--accent)">Lesson ${activeLessonId} •</span> 
              <span>${currentDef.title}</span>
            </div>
          </div>

          <!-- Curriculum Lesson Selector Pills -->
          <div style="display:flex;align-items:center;gap:6px;overflow-x:auto">
            ${CURRICULUM_LESSONS.map((les) => {
              const unlocked = CurriculumProgress.isUnlocked(les.id);
              const done = CurriculumProgress.isCompleted(les.id);
              const isActive = les.id === activeLessonId;
              return `
                <button onclick="${unlocked ? `navigate('/lesson', { id: ${les.id}, step: 0 })` : `showToast('Complete Lesson ${les.id - 1} first to unlock!', 'default')`}"
                  style="padding:4px 10px;font-size:11px;font-family:var(--font-code);border-radius:6px;border:1px solid ${isActive ? 'var(--primary)' : (unlocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)')};background:${isActive ? 'rgba(124,92,255,0.25)' : (unlocked ? 'rgba(15,23,42,0.6)' : 'rgba(15,23,42,0.3)')};color:${isActive ? '#FFF' : (unlocked ? 'var(--text-chalk)' : 'rgba(148,163,184,0.4)')};cursor:${unlocked ? 'pointer' : 'not-allowed'};display:flex;align-items:center;gap:4px">
                  <span>${done ? '✓' : (unlocked ? 'L' + les.id : '🔒')}</span>
                  <span>L${les.id}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Step Tabs for Active Lesson -->
        <div class="step-tabs" style="display:flex;padding:0 24px;border-bottom:1px solid rgba(241,245,249,0.08);overflow-x:auto">
          ${currentDef.steps.map((st, i) => `
            <button class="step-tab ${i === activeStepIndex ? 'active' : ''}" 
              onclick="navigate('/lesson', { id: ${activeLessonId}, step: ${i} })"
              style="padding:10px 16px;font-size:13px;font-family:var(--font-heading);border-bottom:2px solid ${i === activeStepIndex ? 'var(--primary)' : 'transparent'};background:none;color:${i === activeStepIndex ? '#FFF' : 'var(--text-muted)'};cursor:pointer;white-space:nowrap">
              ${st.title}
            </button>
          `).join('')}
        </div>
        
        <!-- Progress Bar -->
        <div class="lesson-progress-bar progress-track" style="height:3px;border-radius:0">
          <div class="progress-fill" id="lesson-prog" style="width:${((activeStepIndex + 1) / currentDef.steps.length) * 100}%;height:100%;transition:width 0.4s ease"></div>
        </div>
      </header>

      <!-- Main Content Container -->
      <main class="lesson-content" style="position:relative;z-index:10;flex:1;padding-top:140px;padding-bottom:110px;max-width:920px;margin:0 auto;width:100%;padding-left:24px;padding-right:24px">
        <div class="lesson-content-area" id="lesson-body">
          ${!isUnlocked ? renderLockedNotice(activeLessonId) : renderActiveCurriculumStep(activeLessonId, activeStepIndex)}
        </div>
      </main>

      <!-- Fixed Bottom Action Bar -->
      <footer class="lesson-bottom-bar" style="position:fixed;bottom:0;left:0;right:0;height:68px;background:rgba(20,27,45,0.96);backdrop-filter:blur(14px);border-top:1px solid rgba(124,92,255,0.2);display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:100">
        <button class="btn btn-ghost btn-sm" onclick="handleCurriculumPrev()">
          ← ${activeStepIndex > 0 ? 'Previous' : 'Curriculum'}
        </button>
        <div style="display:flex;gap:12px;align-items:center">
          <button class="btn btn-ghost btn-sm" onclick="toggleChatDrawer()">
            🐾 Ask Schrö
          </button>
          <button class="btn btn-primary btn-md" onclick="handleCurriculumNext()">
            ${activeStepIndex < currentDef.steps.length - 1 ? 'Next Step →' : (activeLessonId < 3 ? 'Complete & Next Lesson 🚀' : 'Graduate to Sandbox 🏆')}
          </button>
        </div>
      </footer>
    </div>
  `;

  // Attach post-render interactive handlers
  attachInteractiveStepHandlers(activeLessonId, activeStepIndex);
}

function renderLockedNotice(lessonId) {
  return `
    <div class="card card-sketch" style="text-align:center;padding:48px 24px;max-width:600px;margin:40px auto">
      <div style="font-size:52px;margin-bottom:16px">🔒</div>
      <h2 style="font-family:var(--font-heading);margin-bottom:10px">Lesson ${lessonId} is Locked</h2>
      <p class="text-chalk" style="line-height:1.6;margin-bottom:24px">
        Quantum computing builds layer by layer! To unlock this module, please complete the preceding lessons first.
      </p>
      <button class="btn btn-primary btn-md" onclick="navigate('/lesson', { id: 0, step: 0 })">
        Return to Lesson 0 →
      </button>
    </div>
  `;
}

function handleCurriculumPrev() {
  if (activeStepIndex > 0) {
    navigate('/lesson', { id: activeLessonId, step: activeStepIndex - 1 });
  } else if (activeLessonId > 0) {
    const prevDef = CURRICULUM_LESSONS[activeLessonId - 1];
    navigate('/lesson', { id: activeLessonId - 1, step: prevDef.steps.length - 1 });
  } else {
    navigate('/dashboard');
  }
}

function handleCurriculumNext() {
  const currentDef = CURRICULUM_LESSONS[activeLessonId];
  if (activeStepIndex < currentDef.steps.length - 1) {
    navigate('/lesson', { id: activeLessonId, step: activeStepIndex + 1 });
  } else {
    // End of lesson reached
    if (activeLessonId === 0) {
      CurriculumProgress.completeLesson(0);
      showToast('Lesson 0 Complete! Lesson 1 Unlocked 🔓', 'reward');
      navigate('/lesson', { id: 1, step: 0 });
    } else if (activeLessonId === 1) {
      CurriculumProgress.completeLesson(1);
      showToast('Lesson 1 Complete! Lesson 2 Unlocked 🔓', 'reward');
      navigate('/lesson', { id: 2, step: 0 });
    } else if (activeLessonId === 2) {
      CurriculumProgress.completeLesson(2);
      showToast('Lesson 2 Complete! Practice Lab Unlocked 🔓', 'reward');
      navigate('/lesson', { id: 3, step: 0 });
    } else {
      // Lesson 3 completed!
      CurriculumProgress.completeLesson(3);
      navigate('/sandbox');
    }
  }
}

function renderActiveCurriculumStep(lessonId, stepIndex) {
  switch (lessonId) {
    case 0: return renderLesson0Step(stepIndex);
    case 1: return renderLesson1Step(stepIndex);
    case 2: return renderLesson2Step(stepIndex);
    case 3: return renderLesson3Step(stepIndex);
    default: return renderLesson0Step(stepIndex);
  }
}

// =====================================================================
// 5. LESSON 0: WHAT, WHY, AND HOW IS QUANTUM
// =====================================================================
function renderLesson0Step(step) {
  switch (step) {
    case 0: return renderLesson0_How();
    case 1: return renderLesson0_FeelIt();
    case 2: return renderLesson0_Why();
    case 3: return renderLesson0_Quiz();
    default: return renderLesson0_How();
  }
}

// Step 0: How Does Quantum Work? (Switch vs. Coin Analogy)
function renderLesson0_How() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-primary">LESSON 0 • PART 1</span>
        <span class="text-caption text-muted">Zero-Fear Foundations</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        How Does Quantum Computing Work?
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:28px">
        At its heart, quantum computing isn't magic — it's a completely different way of processing information. 
        To understand why it changes everything, let's contrast a <strong>classical light switch</strong> with a <strong>spinning coin</strong>.
      </p>

      <!-- Classical Switch vs Quantum Coin Interactive Comparison -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
        
        <!-- Left: Classical Light Switch -->
        <div class="card card-sketch" style="padding:24px;border-left:4px solid #64748B">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 style="font-family:var(--font-heading);color:#94A3B8">Classical Switch (Bit)</h3>
            <span id="switch-status-tag" class="badge badge-secondary">OFF = 0</span>
          </div>

          <!-- Switch Visual -->
          <div style="text-align:center;padding:24px 0">
            <button id="lightswitch-toggle-btn" onclick="toggleClassicalSwitch()"
              style="width:80px;height:120px;border-radius:14px;background:#1E293B;border:2px solid #475569;position:relative;cursor:pointer;transition:all 0.3s ease;display:inline-block">
              <div id="switch-lever" style="width:60px;height:50px;background:#94A3B8;border-radius:10px;position:absolute;top:60px;left:8px;box-shadow:0 4px 10px rgba(0,0,0,0.5);transition:all 0.25s ease"></div>
            </button>
            <div id="switch-explainer" style="margin-top:14px;font-family:var(--font-code);font-size:13px;color:#94A3B8">
              State: Deterministic 0 (Off)
            </div>
          </div>

          <p class="text-sm text-chalk" style="line-height:1.6">
            A classical bit is strictly binary. It is either <strong>0 OR 1</strong> at any point in time. There is no middle ground.
          </p>
        </div>

        <!-- Right: Quantum Spinning Coin -->
        <div class="card card-sketch tape-cyan" style="padding:24px;border-left:4px solid var(--accent)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 style="font-family:var(--font-heading);color:var(--accent)">Quantum Coin (Qubit)</h3>
            <span id="coin-status-tag" class="badge badge-accent">RESTING: |0⟩</span>
          </div>

          <!-- Coin Visual -->
          <div style="text-align:center;padding:16px 0">
            <div id="demo-coin" style="width:90px;height:90px;border-radius:50%;margin:0 auto 14px;background:radial-gradient(circle, #7C5CFF 0%, #22D3EE 100%);display:flex;align-items:center;justify-content:center;font-size:32px;font-family:var(--font-heading);font-weight:700;color:#FFF;box-shadow:0 0 20px rgba(124,92,255,0.4);transition:all 0.4s ease">
              |0⟩
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleSpinDemoCoin()">
              💫 Spin / Stop Demo Coin
            </button>
            <div id="coin-explainer" style="margin-top:12px;font-family:var(--font-code);font-size:13px;color:var(--accent)">
              State: Definite Heads |0⟩
            </div>
          </div>

          <p class="text-sm text-chalk" style="line-height:1.6">
            When resting on a table, the coin is flat. But when spinning, it enters a state where <em>both possibilities are in play</em> until observed!
          </p>
        </div>
      </div>

      <!-- Critical Scientific Clarification Alert -->
      <div class="card" style="padding:20px;background:rgba(124,92,255,0.08);border:1px solid rgba(124,92,255,0.3);border-radius:14px;margin-bottom:28px">
        <div style="display:flex;gap:14px;align-items:flex-start">
          <span style="font-size:26px">🔬</span>
          <div>
            <h4 style="color:#C4B5FD;margin-bottom:6px">Crucial Note: The Coin is an Analogy!</h4>
            <p class="text-sm text-chalk" style="line-height:1.6">
              A physical qubit is <strong>not literally a miniature spinning coin</strong>. In reality, a qubit is an atomic-scale quantum system — such as a trapped ion, a photon's polarization, or a superconducting electrical circuit chilled near absolute zero. 
              The coin simply gives us intuition for probability waves before measurement!
            </p>
          </div>
        </div>
      </div>

      <!-- Schrö Guidance Box -->
      <div class="card card-sketch" style="padding:20px;display:flex;gap:16px;align-items:center">
        <span style="font-size:32px">🐾</span>
        <div>
          <h4 style="margin-bottom:4px">Schrö's Tip:</h4>
          <p class="text-sm text-chalk" style="line-height:1.5">
            "Next up, let's actually flick the coin into the air ourselves and see what happens when we catch it! Ready to feel probability?"
          </p>
        </div>
      </div>
    </div>
  `;
}

// Step 1: Feel It (Interactive CoinFlipSim)
function renderLesson0_FeelIt() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-accent">LESSON 0 • PART 2</span>
        <span class="text-caption text-muted">Tactile Experiment</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Feel It: The Quantum Coin Flip Simulator
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:28px">
        Experience the transition from an unmeasured probability wave into a collapsed outcome. 
        Flick the coin into the air, observe the airborne superposition, and stop it to take a measurement!
      </p>

      <!-- Interactive Coin Simulator Arena -->
      <div class="card" style="padding:32px;background:rgba(20,27,45,0.9);border:1px solid rgba(34,211,238,0.3);border-radius:24px;margin-bottom:28px">
        
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:24px">
          <div>
            <h3 style="font-family:var(--font-heading);font-size:18px">🪙 CoinFlipSim 2.0</h3>
            <p class="text-caption text-muted">Click "Flick Coin" to launch, then click "Measure" to collapse</p>
          </div>
          <div id="cfs-state-badge" class="badge badge-primary">STATE: PREPARED IN |0⟩</div>
        </div>

        <!-- Simulation Stage with Visible Hand and Floating Arena -->
        <div style="position:relative;height:240px;background:rgba(15,23,42,0.7);border-radius:18px;border:1px dashed rgba(124,92,255,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;margin-bottom:24px">
          
          <!-- Background Grid / Energy rings -->
          <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(124,92,255,0.15) 1px, transparent 1px);background-size:20px 20px;opacity:0.6"></div>

          <!-- Airborne Coin -->
          <div id="cfs-coin" style="width:105px;height:105px;border-radius:50%;background:radial-gradient(circle, #38BDF8 0%, #0369A1 100%);display:flex;align-items:center;justify-content:center;font-size:38px;font-family:var(--font-heading);font-weight:700;color:#FFF;box-shadow:0 0 24px rgba(56,189,248,0.4);position:relative;z-index:2;transition:all 0.3s ease">
            |0⟩
          </div>

          <!-- Hand Below -->
          <div id="cfs-hand" style="font-size:46px;margin-top:20px;position:relative;z-index:2;transition:transform 0.2s ease">
            🖐️
          </div>

          <!-- Live Particle Sparkles Area -->
          <div id="cfs-particles" style="position:absolute;inset:0;pointer-events:none"></div>
        </div>

        <!-- Simulator Action Buttons -->
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:24px">
          <button id="cfs-flick-btn" class="btn btn-primary btn-md" onclick="flickQuantumCoin()">
            🚀 Flick Coin (Into Superposition)
          </button>
          <button id="cfs-measure-btn" class="btn btn-accent btn-md" disabled onclick="measureQuantumCoin()">
            ✋ Measure / Catch Coin (Collapse)
          </button>
          <button class="btn btn-ghost btn-md" onclick="resetQuantumCoin()">
            🔄 Reset
          </button>
        </div>

        <!-- Schrö Live Reaction Bubble -->
        <div id="cfs-schro-bubble" class="card card-sketch" style="padding:16px 20px;display:flex;gap:16px;align-items:center;background:rgba(15,23,42,0.9)">
          <div id="cfs-schro-avatar" style="font-size:28px">🐾</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:2px">Schrö Observing:</div>
            <div id="cfs-schro-quote" class="text-sm text-chalk" style="line-height:1.5">
              "Give it a spin! Before we talk about qubits, let's get a feel for probability."
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Step 2: Why Quantum Matters (Facts & Myths)
function renderLesson0_Why() {
  const facts = [
    {
      title: "1. Submarine Navigation",
      tag: "GPS-DENIED ENVIRONMENTS",
      icon: "🚢",
      myth: "Can a submarine use satellite GPS while 300 meters underwater?",
      explanation: "Radio and GPS signals cannot penetrate more than a few inches of conductive seawater. Submarines currently navigate with mechanical gyroscopes that slowly drift off-target by nautical miles every day.",
      quantumConnection: "Cold-atom quantum gravimeters measure minuscule gravitational variations caused by mountains and ocean trenches. This gives atomic-scale inertial navigation that never loses accuracy, without ever surfacing!",
      takeaway: "Quantum atomic sensors allow ultra-precise navigation deep underwater without satellites.",
      narration: "Did you know submarines can't use GPS underwater? Quantum gravimeters use cold atoms to navigate by measuring Earth's gravity with atomic precision."
    },
    {
      title: "2. The Caffeine Molecule",
      tag: "MOLECULAR SIMULATION",
      icon: "☕",
      myth: "Why can't the world's fastest supercomputers accurately simulate a single cup of coffee?",
      explanation: "A single caffeine molecule contains just 24 atoms. Yet calculating the quantum energy state of its interacting electrons requires calculating over 10^48 simultaneous quantum variables — more than all the memory in all computers on Earth!",
      quantumConnection: "Because quantum computers use qubits that natively operate on quantum states, they simulate chemical bonds naturally without exponential memory bottlenecks.",
      takeaway: "Quantum computers simulate molecules natively to unlock new life-saving pharmaceuticals and clean energy batteries.",
      narration: "A caffeine molecule has only 24 atoms, but simulating its quantum electrons requires more data than all supercomputers on Earth. Quantum computers solve this naturally!"
    },
    {
      title: "3. Robot Thumb",
      tag: "QUANTUM SENSING",
      icon: "🦾",
      myth: "Can a prosthetic robot hand ever feel textures as sensitively as a human thumb?",
      explanation: "Human fingertips contain thousands of mechanoreceptors sensitive to single-micron textures and subtle electrostatic drag. Traditional silicone robotic sensors lack sensitivity and durability.",
      quantumConnection: "Nitrogen-Vacancy (NV) diamond quantum sensors use the quantum spin of a single atomic defect in diamond to measure nanoscale magnetic fields, temperature fluctuations, and micro-pressures with unprecedented fidelity.",
      takeaway: "Quantum NV sensors bring superhuman tactile sensitivity to prosthetics and surgical robotics.",
      narration: "Diamond NV center quantum sensors use single atomic electron spins to detect micro magnetic fields, giving robotic hands superhuman sense of touch."
    }
  ];

  const curr = facts[lessonRuntimeState.selectedFact || 0];

  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-success">LESSON 0 • PART 3</span>
        <span class="text-caption text-muted">Why Quantum Computing Matters</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Real-World Quantum: Facts & Myths
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:28px">
        Why are scientists and engineers investing billions into quantum technology? Explore three breakthrough areas:
      </p>

      <!-- Topic Selector Tabs -->
      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
        ${facts.map((f, idx) => `
          <button class="btn ${idx === (lessonRuntimeState.selectedFact || 0) ? 'btn-primary' : 'btn-secondary'} btn-sm"
            onclick="selectLessonFact(${idx})">
            <span>${f.icon}</span> ${f.title}
          </button>
        `).join('')}
      </div>

      <!-- Selected Fact Showcase Card -->
      <div class="card" style="padding:32px;background:rgba(20,27,45,0.85);border:1px solid rgba(124,92,255,0.3);border-radius:20px;margin-bottom:28px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="font-size:42px">${curr.icon}</span>
            <div>
              <span class="badge badge-accent font-code" style="font-size:11px">${curr.tag}</span>
              <h2 style="font-family:var(--font-heading);font-size:22px;margin-top:4px">${curr.title}</h2>
            </div>
          </div>
          
          <!-- Audio Narration Controller -->
          <button class="btn btn-secondary btn-sm" onclick="playFactNarration('${encodeURIComponent(curr.narration)}')">
            <span id="fact-audio-icon">🔊</span> Listen to Narration
          </button>
        </div>

        <!-- Myth Question -->
        <div style="padding:16px 20px;background:rgba(239,68,68,0.1);border-left:4px solid #EF4444;border-radius:8px;margin-bottom:20px">
          <div style="font-weight:700;color:#F87171;font-size:13px;margin-bottom:4px">THE CHALLENGE / MYTH:</div>
          <div style="font-size:16px;color:#FFF;font-weight:600">${curr.myth}</div>
        </div>

        <!-- Explanation -->
        <div style="margin-bottom:20px">
          <h4 style="color:#94A3B8;margin-bottom:6px">Why Classical Computers & Sensors Struggle:</h4>
          <p class="text-chalk" style="line-height:1.7;font-size:15px">${curr.explanation}</p>
        </div>

        <!-- Quantum Connection -->
        <div style="margin-bottom:24px;padding:16px 20px;background:rgba(34,211,238,0.08);border-left:4px solid var(--accent);border-radius:8px">
          <h4 style="color:var(--accent);margin-bottom:6px">The Quantum Leap:</h4>
          <p class="text-chalk" style="line-height:1.7;font-size:15px">${curr.quantumConnection}</p>
        </div>

        <!-- Simple Takeaway -->
        <div style="padding:16px 20px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:12px">
          <div style="font-weight:700;color:#34D399;font-size:13px;margin-bottom:2px">💡 KEY TAKEAWAY:</div>
          <div style="font-size:15px;color:#ECFDF5;font-weight:500">${curr.takeaway}</div>
        </div>
      </div>
    </div>
  `;
}

// Step 3: Intuition Check Gateway Quiz
function renderLesson0_Quiz() {
  const questions = [
    {
      q: "When a quantum bit (qubit) is in a superposition, it is most like:",
      options: [
        "A lightswitch permanently turned to OFF",
        "A spinning coin where both possibilities are in play until caught",
        "A broken lightbulb that never turns on"
      ],
      correct: 1,
      explanation: "Exactly! Before measurement, a qubit exists in a superposition of basis states, just like a spinning coin before you look."
    },
    {
      q: "What causes a quantum state to collapse into a definite 0 or 1?",
      options: [
        "Restarting your laptop",
        "Physical observation or measurement",
        "Placing a magnet next to the screen"
      ],
      correct: 1,
      explanation: "Spot on! The act of projective measurement forces the quantum probability wave to collapse into a definite computational outcome."
    },
    {
      q: "Why can't classical supercomputers accurately simulate complex molecules like caffeine?",
      options: [
        "Caffeine has too many kilograms of weight",
        "Simulating interacting electron quantum states requires exponentially growing memory",
        "Classical computers only work on weekends"
      ],
      correct: 1,
      explanation: "Correct! Quantum systems scale exponentially in variables, making them impossible for classical memory, but natural for quantum computers!"
    }
  ];

  return `
    <div class="animate-fade-in" style="max-width:720px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="badge badge-primary">LESSON 0 • PART 4</span>
        <span class="text-caption text-muted">Zero-Math Intuition Check</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:30px;font-weight:700;margin-bottom:8px">
        Gateway Checkpoint: Lesson 0
      </h1>
      <p style="font-size:15px;color:var(--text-chalk);line-height:1.6;margin-bottom:28px">
        Answer these 3 intuitive questions to verify your mental model and unlock Lesson 1!
      </p>

      <div id="l0-quiz-container">
        ${renderLesson0QuizQuestion(0, questions)}
      </div>
    </div>
  `;
}

function renderLesson0QuizQuestion(qIndex, questions) {
  const q = questions[qIndex];
  return `
    <div class="card" style="padding:28px;background:rgba(20,27,45,0.85);border:1px solid rgba(124,92,255,0.3);border-radius:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="text-caption text-accent font-code">QUESTION 0${qIndex + 1} OF 0${questions.length}</span>
        <span class="text-caption text-muted">Pass to Unlock Lesson 1</span>
      </div>

      <div style="font-size:18px;margin-bottom:24px;line-height:1.5;font-weight:600">
        ${q.q}
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn" id="l0-opt-${i}" onclick="selectLesson0Option(${qIndex}, ${i})">
            <span style="font-family:var(--font-code);font-weight:700;color:var(--text-muted)">${String.fromCharCode(65 + i)})</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div id="l0-feedback" class="quiz-explanation-box hidden"></div>

      <div style="display:flex;justify-content:flex-end;margin-top:20px">
        <button id="l0-next-btn" class="btn btn-primary btn-md" disabled onclick="handleLesson0Next(${qIndex})">
          ${qIndex < questions.length - 1 ? 'Next Question →' : 'Submit & Unlock Lesson 1 🔓'}
        </button>
      </div>
    </div>
  `;
}

function selectLesson0Option(qIndex, selectedIndex) {
  const questions = [
    { correct: 1, explanation: "Exactly! Before measurement, a qubit exists in a superposition of basis states, just like a spinning coin before you look." },
    { correct: 1, explanation: "Spot on! The act of projective measurement forces the quantum probability wave to collapse into a definite computational outcome." },
    { correct: 1, explanation: "Correct! Quantum systems scale exponentially in variables, making them impossible for classical memory, but natural for quantum computers!" }
  ];
  const q = questions[qIndex];
  const isCorrect = selectedIndex === q.correct;
  lessonRuntimeState.quiz0Answers[qIndex] = isCorrect;

  const btns = document.querySelectorAll('.quiz-option-btn');
  btns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) btn.classList.add('correct');
    else if (idx === selectedIndex) btn.classList.add('wrong');
  });

  const fb = document.getElementById('l0-feedback');
  if (fb) {
    fb.classList.remove('hidden');
    fb.innerHTML = `
      <div style="font-weight:700;margin-bottom:4px;color:${isCorrect ? '#34D399' : '#EF4444'}">
        ${isCorrect ? '✓ Correct!' : '✗ Not quite.'}
      </div>
      <div>${q.explanation}</div>
    `;
  }

  const nextBtn = document.getElementById('l0-next-btn');
  if (nextBtn) nextBtn.disabled = false;
}

function handleLesson0Next(qIndex) {
  const total = 3;
  if (qIndex < total - 1) {
    const questions = [
      {
        q: "When a quantum bit (qubit) is in a superposition, it is most like:",
        options: ["A lightswitch permanently turned to OFF", "A spinning coin where both possibilities are in play until caught", "A broken lightbulb that never turns on"],
        correct: 1
      },
      {
        q: "What causes a quantum state to collapse into a definite 0 or 1?",
        options: ["Restarting your laptop", "Physical observation or measurement", "Placing a magnet next to the screen"],
        correct: 1
      },
      {
        q: "Why can't classical supercomputers accurately simulate complex molecules like caffeine?",
        options: ["Caffeine has too many kilograms of weight", "Simulating interacting electron quantum states requires exponentially growing memory", "Classical computers only work on weekends"],
        correct: 1
      }
    ];
    const cont = document.getElementById('l0-quiz-container');
    if (cont) cont.innerHTML = renderLesson0QuizQuestion(qIndex + 1, questions);
  } else {
    // Finished Lesson 0!
    CurriculumProgress.completeLesson(0);
    showToast('Congratulations! Lesson 0 Complete! Lesson 1 Unlocked 🚀', 'reward');
    navigate('/lesson', { id: 1, step: 0 });
  }
}

// =====================================================================
// 6. LESSON 1: TRANSITION FROM CLASSICAL TO QUANTUM
// =====================================================================
function renderLesson1Step(step) {
  switch (step) {
    case 0: return renderLesson1_BitVsQubit();
    case 1: return renderLesson1_GentleMath();
    case 2: return renderLesson1_BlochSphere();
    case 3: return renderLesson1_HilbertSpace();
    case 4: return renderLesson1_Quiz();
    default: return renderLesson1_BitVsQubit();
  }
}

// Step 0: Classical Bit vs Qubit
function renderLesson1_BitVsQubit() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-primary">LESSON 1 • STEP 1</span>
        <span class="text-caption text-muted">Visual Quantum Concepts</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Classical Bit vs. Quantum Qubit
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:28px">
        Now we transition from everyday intuition to true quantum mechanics. 
        How do we represent states mathematically without losing our minds?
      </p>

      <!-- Side-by-side comparison grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px">
        <!-- Classical Bit -->
        <div class="card card-sketch" style="padding:24px;border-left:4px solid #64748B">
          <div style="font-size:32px;margin-bottom:10px">💾</div>
          <h3 style="font-family:var(--font-heading);color:#94A3B8;margin-bottom:8px">Classical Bit</h3>
          <p class="text-sm text-chalk" style="line-height:1.6;margin-bottom:14px">
            Can only exist in one of two discrete states: <strong>0</strong> or <strong>1</strong>.
          </p>
          <div class="code-block" style="font-size:13px;margin-bottom:12px">
bit = 0  # Discrete, deterministic
          </div>
          <div class="text-caption text-muted">
            Physically implemented by microscopic transistors storing charge in a capacitor.
          </div>
        </div>

        <!-- Quantum Qubit -->
        <div class="card card-sketch tape-cyan" style="padding:24px;border-left:4px solid var(--accent)">
          <div style="font-size:32px;margin-bottom:10px">⚛️</div>
          <h3 style="font-family:var(--font-heading);color:var(--accent);margin-bottom:8px">Quantum Qubit</h3>
          <p class="text-sm text-chalk" style="line-height:1.6;margin-bottom:14px">
            Represented by computational basis states written in Dirac notation: <strong>|0⟩</strong> and <strong>|1⟩</strong>.
          </p>
          <div class="code-block" style="font-size:13px;margin-bottom:12px">
|ψ⟩ = α|0⟩ + β|1⟩  # Continuous amplitudes
          </div>
          <div class="text-caption text-muted">
            The symbol |⟩ (called a "ket") denotes a normalized state vector in complex Hilbert space.
          </div>
        </div>
      </div>

      <!-- Precision Warning Box -->
      <div class="card" style="padding:20px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:14px;margin-bottom:24px">
        <h4 style="color:#FBBF24;margin-bottom:6px">⚠️ Scientific Reality Check:</h4>
        <p class="text-sm text-chalk" style="line-height:1.6">
          Popular science often says "a qubit is both 0 and 1 at the same time." 
          This is misleading! A qubit is in a <em>definite, single quantum state</em> |ψ⟩ that possesses probability amplitudes to yield 0 or 1 when measured.
        </p>
      </div>
    </div>
  `;
}

// Step 1: Gentle Quantum Math (Amplitudes & 100% Probability)
function renderLesson1_GentleMath() {
  const alphaSq = lessonRuntimeState.probAlphaSq;
  const betaSq = Math.round((1 - alphaSq) * 100) / 100;
  const p0Pct = Math.round(alphaSq * 100);
  const p1Pct = Math.round(betaSq * 100);

  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-accent">LESSON 1 • STEP 2</span>
        <span class="text-caption text-muted">Gentle Quantum Math</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        The Formula of Superposition
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:24px">
        Don't let the symbols scare you! Let's demystify the single most famous equation in quantum computing:
      </p>

      <!-- Big Equation Display -->
      <div class="card" style="padding:28px;text-align:center;background:rgba(20,27,45,0.85);border:1px solid rgba(124,92,255,0.4);border-radius:20px;margin-bottom:28px">
        <div style="font-family:var(--font-heading);font-size:32px;font-weight:700;color:#FFF;letter-spacing:1px;margin-bottom:12px">
          |ψ⟩ = α|0⟩ + β|1⟩
        </div>
        <div style="display:flex;justify-content:center;gap:32px;flex-wrap:wrap;color:var(--text-chalk);font-size:14px">
          <div><strong style="color:var(--accent)">α (alpha):</strong> Amplitude for |0⟩</div>
          <div><strong style="color:#F472B6">β (beta):</strong> Amplitude for |1⟩</div>
        </div>
      </div>

      <!-- Total Probability 100% Rule -->
      <div class="card card-sketch" style="padding:28px;margin-bottom:28px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <h3 style="font-family:var(--font-heading);font-size:18px">The 100% Normalization Rule: |α|² + |β|² = 1</h3>
          <span class="badge badge-success">TOTAL PROBABILITY = 100%</span>
        </div>
        <p class="text-sm text-chalk" style="line-height:1.6;margin-bottom:20px">
          According to the Born Rule, when we square the amplitude magnitudes (|α|² and |β|²), they give the exact measurement probabilities. 
          And because something MUST happen, they always sum to 100%!
        </p>

        <!-- Interactive Probability Slider -->
        <div style="background:rgba(15,23,42,0.6);padding:20px;border-radius:14px;border:1px solid rgba(255,255,255,0.08);margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;font-size:13px;font-family:var(--font-code);margin-bottom:8px">
            <span style="color:var(--accent)">P(|0⟩) = |α|²: ${p0Pct}%</span>
            <span style="color:#F472B6">P(|1⟩) = |β|²: ${p1Pct}%</span>
          </div>

          <input type="range" min="0" max="100" value="${p0Pct}" id="amplitude-slider"
            oninput="handleAmplitudeSlider(this.value)"
            style="width:100%;height:8px;border-radius:4px;accent-color:var(--accent);cursor:pointer;margin-bottom:14px" />

          <!-- Probability Bar -->
          <div style="height:24px;border-radius:8px;overflow:hidden;display:flex;background:#090D19;border:1px solid rgba(255,255,255,0.1)">
            <div id="prob-bar-0" style="width:${p0Pct}%;background:var(--accent);height:100%;transition:width 0.15s ease;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#090D19">
              ${p0Pct >= 15 ? p0Pct + '%' : ''}
            </div>
            <div id="prob-bar-1" style="width:${p1Pct}%;background:#F472B6;height:100%;transition:width 0.15s ease;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#090D19">
              ${p1Pct >= 15 ? p1Pct + '%' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Step 2: Interactive 3D Bloch Sphere
function renderLesson1_BlochSphere() {
  const theta = lessonRuntimeState.blochTheta || 90;
  const phi = lessonRuntimeState.blochPhi || 0;
  
  // Calculate measurement probabilities
  const radTheta = (theta * Math.PI) / 180;
  const p0 = Math.round(Math.pow(Math.cos(radTheta / 2), 2) * 100);
  const p1 = 100 - p0;

  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-primary">LESSON 1 • STEP 3</span>
        <span class="text-caption text-muted">Geometric Quantum State</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        The Interactive Bloch Sphere 🌐
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:24px">
        Every pure single-qubit state corresponds to a point on the surface of a unit sphere called the 
        <strong>Bloch Sphere</strong>. Drag the sliders below to move the quantum state vector!
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;margin-bottom:28px">
        
        <!-- 3D Canvas / Vector View -->
        <div style="position:relative;background:rgba(15,23,42,0.9);border:1px solid rgba(124,92,255,0.3);border-radius:20px;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <svg id="bloch-svg" width="280" height="280" viewBox="-140 -140 280 280" style="overflow:visible">
            <!-- Sphere Outer Glow -->
            <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(124,92,255,0.25)" stroke-width="2"/>
            <circle cx="0" cy="0" r="100" fill="radial-gradient(circle, rgba(124,92,255,0.1) 0%, rgba(15,23,42,0.4) 100%)" />
            
            <!-- Equator Ellipse -->
            <ellipse cx="0" cy="0" rx="100" ry="28" fill="none" stroke="rgba(34,211,238,0.4)" stroke-dasharray="4 4" stroke-width="1.5"/>

            <!-- Axes -->
            <!-- Z Axis (Vertical) -->
            <line x1="0" y1="-120" x2="0" y2="120" stroke="#A78BFA" stroke-width="2"/>
            <text x="8" y="-115" font-family="'JetBrains Mono'" font-size="12" fill="#38BDF8" font-weight="700">|0⟩ (Z+)</text>
            <text x="8" y="125" font-family="'JetBrains Mono'" font-size="12" fill="#F472B6" font-weight="700">|1⟩ (Z-)</text>

            <!-- X Axis -->
            <line x1="-120" y1="20" x2="120" y2="-20" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
            <text x="124" y="-18" font-family="'JetBrains Mono'" font-size="11" fill="rgba(255,255,255,0.6)">|+⟩ (X)</text>

            <!-- State Vector -->
            ${renderBlochVectorSvg(theta, phi)}
          </svg>

          <!-- Current Coordinate readout -->
          <div style="margin-top:14px;font-family:var(--font-code);font-size:12px;color:var(--text-muted)">
            θ = ${theta}° • φ = ${phi}°
          </div>
        </div>

        <!-- Controls & Probabilities -->
        <div class="card" style="padding:24px;background:rgba(20,27,45,0.85);border-radius:18px">
          <h4 style="margin-bottom:16px;font-family:var(--font-heading)">Rotate State Vector</h4>

          <div style="margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;font-family:var(--font-code)">
              <span>Polar Angle (θ):</span>
              <span style="color:var(--accent)">${theta}°</span>
            </div>
            <input type="range" min="0" max="180" value="${theta}" id="bloch-theta-input"
              oninput="handleBlochSlider('theta', this.value)"
              style="width:100%;accent-color:var(--accent);cursor:pointer" />
          </div>

          <div style="margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;font-family:var(--font-code)">
              <span>Azimuthal Angle (φ):</span>
              <span style="color:#C084FC">${phi}°</span>
            </div>
            <input type="range" min="0" max="360" value="${phi}" id="bloch-phi-input"
              oninput="handleBlochSlider('phi', this.value)"
              style="width:100%;accent-color:#C084FC;cursor:pointer" />
          </div>

          <!-- Presets -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
            <button class="btn btn-secondary btn-sm" onclick="setBlochPreset(0, 0)">North |0⟩</button>
            <button class="btn btn-secondary btn-sm" onclick="setBlochPreset(180, 0)">South |1⟩</button>
            <button class="btn btn-primary btn-sm" onclick="setBlochPreset(90, 0)">Equator |+⟩</button>
            <button class="btn btn-secondary btn-sm" onclick="setBlochPreset(90, 180)">Equator |-⟩</button>
          </div>

          <!-- Computed Probabilities -->
          <div style="background:rgba(15,23,42,0.8);padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.06)">
            <div style="font-size:11px;color:var(--text-muted);font-family:var(--font-code);margin-bottom:6px">MEASUREMENT CHANCES:</div>
            <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700">
              <span style="color:#38BDF8">|0⟩: ${p0}%</span>
              <span style="color:#F472B6">|1⟩: ${p1}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBlochVectorSvg(theta, phi) {
  const radTheta = (theta * Math.PI) / 180;
  const radPhi = (phi * Math.PI) / 180;

  // Project 3D sphere point to 2D
  const r = 95;
  const x = r * Math.sin(radTheta) * Math.cos(radPhi);
  const y = -r * Math.cos(radTheta) + 20 * Math.sin(radTheta) * Math.sin(radPhi);

  return `
    <line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#FBBF24" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="6.5" fill="#FBBF24" filter="drop-shadow(0 0 6px #F59E0B)"/>
  `;
}

// Step 3: Hilbert Space Explanation
function renderLesson1_HilbertSpace() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-accent">LESSON 1 • STEP 4</span>
        <span class="text-caption text-muted">The Quantum Playground</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Where Does a Qubit Live? Meet Hilbert Space 📐
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:24px">
        If a classical bit lives strictly in the two-element set {0, 1}, where does a quantum state live?
      </p>

      <div class="card card-sketch" style="padding:28px;margin-bottom:24px">
        <div class="card-sketch-tag">MATHEMATICAL PLAYGROUND</div>
        <h3 style="color:var(--primary);margin-bottom:8px">Hilbert Space (ℋ = ℂ²)</h3>
        <p class="text-chalk" style="line-height:1.7;margin-bottom:16px">
          A Hilbert space is the mathematical vector space where quantum states exist. 
          For a single qubit, it is a two-dimensional complex vector space. Any quantum operation simply rotates the state vector within this space!
        </p>
        <div class="code-block" style="text-align:center;font-size:16px;padding:16px">
|ψ⟩ = c₀|0⟩ + c₁|1⟩   where  c₀, c₁ ∈ ℂ
        </div>
      </div>

      <div class="card" style="padding:20px;background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.25);border-radius:14px">
        <h4 style="color:var(--accent);margin-bottom:6px">Connecting Hilbert Space & the Bloch Sphere:</h4>
        <p class="text-sm text-chalk" style="line-height:1.6">
          Hilbert space actually has 4 real dimensions (2 complex numbers with real and imaginary parts). 
          Because quantum states have a total probability of 1 and their global phase cannot be observed, physicists map pure single-qubit states onto the 3D surface of the Bloch Sphere!
        </p>
      </div>
    </div>
  `;
}

// Step 4: Lesson 1 Checkpoint Quiz
function renderLesson1_Quiz() {
  return renderQuizStep_inline(); // Reuses existing robust badge checkpoint quiz for superposition!
}

// =====================================================================
// 7. LESSON 2: QUANTUM GATES, CIRCUITS & ENTANGLEMENT
// =====================================================================
function renderLesson2Step(step) {
  switch (step) {
    case 0: return renderLesson2_Gates();
    case 1: return renderLesson2_Circuits();
    case 2: return renderLesson2_Entanglement();
    case 3: return renderLesson2_Quiz();
    default: return renderLesson2_Gates();
  }
}

// Step 0: Quantum Gates
function renderLesson2_Gates() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-primary">LESSON 2 • STEP 1</span>
        <span class="text-caption text-muted">Quantum Operations</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Quantum Gates: Rotating the State Vector
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:28px">
        Just as classical computers use AND, OR, and NOT gates to flip bits, quantum computers use 
        <strong>quantum gates</strong> to rotate probability amplitudes!
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px">
        
        <!-- Pauli-X Gate -->
        <div class="card card-sketch" style="padding:24px;border-left:4px solid #EC4899">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="color:#EC4899">Pauli-X Gate</h3>
            <span class="badge badge-secondary">THE QUANTUM NOT</span>
          </div>
          <p class="text-sm text-chalk" style="line-height:1.6;margin-bottom:14px">
            Flips computational basis states:
          </p>
          <div class="code-block" style="font-size:14px;margin-bottom:14px">
X|0⟩ = |1⟩
X|1⟩ = |0⟩
          </div>
          <div class="text-caption text-muted">
            Geometrically, X is a 180° rotation around the X-axis of the Bloch Sphere.
          </div>
        </div>

        <!-- Hadamard Gate -->
        <div class="card card-sketch tape-cyan" style="padding:24px;border-left:4px solid var(--accent)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="color:var(--accent)">Hadamard (H) Gate</h3>
            <span class="badge badge-accent">SUPERPOSITION CREATOR</span>
          </div>
          <p class="text-sm text-chalk" style="line-height:1.6;margin-bottom:14px">
            Creates an equal 50/50 superposition from a basis state:
          </p>
          <div class="code-block" style="font-size:14px;margin-bottom:14px">
H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
H|1⟩ = (|0⟩ - |1⟩)/√2 = |-⟩
          </div>
          <div class="text-caption text-muted">
            Rotates the North or South pole down to the equator of the Bloch Sphere!
          </div>
        </div>
      </div>
    </div>
  `;
}

// Step 1: Reading Circuits
function renderLesson2_Circuits() {
  return renderInteractStep(); // Reuses existing working interactive circuit composer & histogram!
}

// Step 2: Entanglement & CNOT
function renderLesson2_Entanglement() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-accent">LESSON 2 • STEP 3</span>
        <span class="text-caption text-muted">Multi-Qubit Magic</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Entanglement & The CNOT Gate 🔗
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:24px">
        What happens when two qubits interact? In quantum mechanics, they can become <strong>entangled</strong>.
      </p>

      <!-- Accurate Scientific Distinction -->
      <div class="card" style="padding:20px;background:rgba(124,92,255,0.08);border:1px solid rgba(124,92,255,0.3);border-radius:14px;margin-bottom:24px">
        <h4 style="color:#C4B5FD;margin-bottom:6px">Dispelling the Sci-Fi Myth:</h4>
        <p class="text-sm text-chalk" style="line-height:1.6">
          Entanglement does <strong>not</strong> send information faster than light (the No-Signaling Theorem protects causality). 
          Instead, entangled qubits share a joint physical state such that their measurement outcomes are perfectly correlated, even though each individual outcome is completely random!
        </p>
      </div>

      <!-- CNOT Visual Diagram -->
      <div class="card card-sketch" style="padding:28px;margin-bottom:28px">
        <h3 style="margin-bottom:16px;font-family:var(--font-heading)">The Controlled-NOT (CNOT) Gate</h3>
        
        <div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap">
          <!-- Visual Circuit Diagram of CNOT -->
          <div style="background:rgba(15,23,42,0.8);padding:24px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);min-width:240px">
            <div style="display:flex;align-items:center;margin-bottom:28px;position:relative">
              <span style="font-family:var(--font-code);font-size:13px;width:60px">q[0]: ─</span>
              <div style="width:16px;height:16px;border-radius:50%;background:#FFF;box-shadow:0 0 10px #FFF"></div>
              <span style="font-family:var(--font-code);font-size:13px;margin-left:auto">Control (●)</span>
            </div>
            <!-- Connecting Wire -->
            <div style="width:2px;height:32px;background:#FFF;margin-left:67px;margin-top:-24px;margin-bottom:4px"></div>
            <div style="display:flex;align-items:center">
              <span style="font-family:var(--font-code);font-size:13px;width:60px">q[1]: ─</span>
              <div style="width:22px;height:22px;border-radius:50%;border:2px solid #22D3EE;display:flex;align-items:center;justify-content:center;color:#22D3EE;font-weight:700;font-size:14px">⊕</div>
              <span style="font-family:var(--font-code);font-size:13px;margin-left:auto">Target (⊕)</span>
            </div>
          </div>

          <!-- Truth Table -->
          <div style="flex:1">
            <h4 style="color:var(--accent);margin-bottom:8px">CNOT Truth Table:</h4>
            <div class="code-block" style="font-size:13px">
|00⟩ → |00⟩   (Control is 0: target stays 0)
|01⟩ → |01⟩   (Control is 0: target stays 1)
|10⟩ → |11⟩   (Control is 1: target flipped 0→1!)
|11⟩ → |10⟩   (Control is 1: target flipped 1→0!)
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Step 3: Lesson 2 Checkpoint Quiz
function renderLesson2_Quiz() {
  const quizData = BadgeQuizzes.getQuiz('single-gates', 'normal') || {
    questions: [
      {
        question: "Which quantum gate acts as a quantum NOT by flipping |0⟩ to |1⟩?",
        options: ["Hadamard (H)", "Pauli-X", "Phase (Z)", "CNOT"],
        correct: 1,
        explanation: "The Pauli-X gate acts as a bit-flip NOT operation on the computational basis states."
      },
      {
        question: "What does applying a Hadamard gate to |0⟩ produce?",
        options: ["|1⟩", "An equal superposition (|0⟩+|1⟩)/√2", "A classical bit", "Zero probability"],
        correct: 1,
        explanation: "Hadamard transforms basis state |0⟩ into equal superposition state |+⟩."
      }
    ]
  };

  return `
    <div class="animate-fade-in" style="max-width:720px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="badge badge-primary">LESSON 2 • STEP 4</span>
        <span class="text-caption text-muted">Gates & Circuits Checkpoint</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:30px;font-weight:700;margin-bottom:8px">
        Gates & Circuits Knowledge Check
      </h1>
      <p style="font-size:15px;color:var(--text-chalk);line-height:1.6;margin-bottom:28px">
        Confirm your mastery of single-qubit rotations and entangling gates before graduating to the Practice Lab!
      </p>

      <div id="l2-quiz-container">
        ${renderLessonQuizQuestion(0, quizData.questions)}
      </div>
    </div>
  `;
}

// =====================================================================
// 8. LESSON 3: PRACTICE LAB (VISUAL COMPOSER TO CODE)
// =====================================================================
function renderLesson3Step(step) {
  switch (step) {
    case 0: return renderLesson3_GuidedMission();
    case 1: return renderLesson3_VisualToCode();
    case 2: return renderLesson3_CodeAnatomy();
    case 3: return renderLesson3_GraduationChallenge();
    case 4: return renderLesson3_Ceremony();
    default: return renderLesson3_GuidedMission();
  }
}

// Step 0: Guided Superposition Mission
function renderLesson3_GuidedMission() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-primary">LESSON 3 • LAB 1</span>
        <span class="text-caption text-muted">Visual Composer Hands-on</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Guided Mission: Build a Superposition 🚀
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:24px">
        Welcome to your graduation lab! In this mission, you will build an authentic quantum circuit and observe how visual gates translate directly into Python Qiskit code.
      </p>

      <div class="card card-sketch" style="padding:24px;margin-bottom:24px">
        <div class="card-sketch-tag">MISSION OBJECTIVES</div>
        <ol style="margin-left:20px;line-height:1.8;color:var(--text-chalk);font-size:15px">
          <li>Select Qubit wire <strong>q[0]</strong>.</li>
          <li>Apply a <strong>Hadamard (H)</strong> gate.</li>
          <li>Run the circuit simulation.</li>
          <li>Observe the 50/50 measurement distribution!</li>
        </ol>
      </div>

      <!-- Quick Schrö Progressive Hint -->
      <div class="card" style="padding:18px 24px;background:rgba(124,92,255,0.08);border:1px solid rgba(124,92,255,0.3);border-radius:14px;display:flex;align-items:center;gap:16px">
        <span style="font-size:28px">🐾</span>
        <div>
          <strong style="color:var(--accent)">Schrö's Hint:</strong>
          <span class="text-sm text-chalk">
            "Click 'Next Step' to inspect the live Qiskit code panel generated directly from your gates!"
          </span>
        </div>
      </div>
    </div>
  `;
}

// Step 1: Visual Composer to Live Qiskit Code
function renderLesson3_VisualToCode() {
  const code = generateQiskitCode(lessonRuntimeState.lab3Gates);

  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-accent">LESSON 3 • LAB 2</span>
        <span class="text-caption text-muted">Real-Time Qiskit Code Mirror</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Visual Composer → Live Qiskit Python Code
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:24px">
        Every gate placed on the circuit wires corresponds to an exact method call in 
        <strong>Qiskit</strong>, the industry-standard open-source quantum SDK by IBM.
      </p>

      <!-- 2-Column Desktop Grid (Stacks gracefully on mobile) -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px">
        
        <!-- Left Column: Visual Circuit Composer -->
        <div class="card" style="padding:24px;background:rgba(20,27,45,0.85);border:1px solid rgba(124,92,255,0.3);border-radius:18px">
          <h3 style="font-family:var(--font-heading);font-size:16px;margin-bottom:16px">Visual Circuit Wires</h3>
          
          <!-- Wire q[0] -->
          <div style="background:rgba(15,23,42,0.8);border-radius:10px;padding:16px;margin-bottom:14px;position:relative">
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-family:var(--font-code);font-size:12px;color:var(--text-muted)">q[0]: ─</span>
              <div id="lab3-wire-0" style="display:flex;gap:8px">
                ${renderLab3WireGates(0)}
              </div>
              <span style="font-family:var(--font-code);font-size:12px;color:var(--text-muted);margin-left:auto">─[M]─</span>
            </div>
          </div>

          <!-- Wire q[1] -->
          <div style="background:rgba(15,23,42,0.8);border-radius:10px;padding:16px;margin-bottom:20px;position:relative">
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-family:var(--font-code);font-size:12px;color:var(--text-muted)">q[1]: ─</span>
              <div id="lab3-wire-1" style="display:flex;gap:8px">
                ${renderLab3WireGates(1)}
              </div>
              <span style="font-family:var(--font-code);font-size:12px;color:var(--text-muted);margin-left:auto">─[M]─</span>
            </div>
          </div>

          <!-- Gate Palette -->
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-secondary btn-sm" onclick="addLab3Gate('H', 0)">+ H (q0)</button>
            <button class="btn btn-secondary btn-sm" onclick="addLab3Gate('X', 0)">+ X (q0)</button>
            <button class="btn btn-primary btn-sm" onclick="addLab3Gate('CNOT', 0)">+ CNOT (q0→q1)</button>
            <button class="btn btn-ghost btn-sm" onclick="clearLab3Gates()">Clear</button>
          </div>
        </div>

        <!-- Right Column: Live Dynamic Qiskit Code Mirror -->
        <div class="card" style="padding:24px;background:rgba(15,23,42,0.95);border:1px solid rgba(34,211,238,0.3);border-radius:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-family:var(--font-heading);font-size:16px;color:var(--accent)">🐍 Live Python Qiskit Code</h3>
            <span class="badge badge-accent font-code" style="font-size:10px">AUTO-SYNCED</span>
          </div>

          <pre id="lab3-code-display" class="code-block" style="font-size:13px;line-height:1.6;min-height:160px;margin:0">${code}</pre>
        </div>
      </div>
    </div>
  `;
}

function renderLab3WireGates(qubitIndex) {
  const gatesOnWire = lessonRuntimeState.lab3Gates.filter(g => g.qubit === qubitIndex || (g.gate === 'CNOT' && qubitIndex === 1));
  if (gatesOnWire.length === 0) {
    return `<span style="font-size:11px;color:rgba(255,255,255,0.2);font-family:var(--font-code)">empty wire</span>`;
  }
  return gatesOnWire.map(g => {
    if (g.gate === 'CNOT') {
      return qubitIndex === 0 
        ? `<div style="width:24px;height:24px;border-radius:50%;background:#FFF;box-shadow:0 0 8px #FFF" title="CNOT Control"></div>`
        : `<div style="width:26px;height:26px;border-radius:50%;border:2px solid #22D3EE;color:#22D3EE;display:flex;align-items:center;justify-content:center;font-weight:700" title="CNOT Target">⊕</div>`;
    }
    return `
      <div style="padding:4px 10px;background:var(--primary);border:1px solid #C4B5FD;border-radius:6px;font-family:var(--font-code);font-size:12px;font-weight:700;color:#FFF">
        ${g.gate}
      </div>
    `;
  }).join('');
}

function addLab3Gate(gateName, targetQubit) {
  lessonRuntimeState.lab3Gates.push({ gate: gateName, qubit: targetQubit });
  refreshLab3Code();
}

function clearLab3Gates() {
  lessonRuntimeState.lab3Gates = [];
  refreshLab3Code();
}

function refreshLab3Code() {
  const w0 = document.getElementById('lab3-wire-0');
  const w1 = document.getElementById('lab3-wire-1');
  const codeDisp = document.getElementById('lab3-code-display');
  if (w0) w0.innerHTML = renderLab3WireGates(0);
  if (w1) w1.innerHTML = renderLab3WireGates(1);
  if (codeDisp) codeDisp.textContent = generateQiskitCode(lessonRuntimeState.lab3Gates);
}

function generateQiskitCode(gates) {
  let lines = [
    `from qiskit import QuantumCircuit`,
    ``,
    `# Initialize 2-qubit register & 2 classical bits`,
    `qc = QuantumCircuit(2, 2)`
  ];

  gates.forEach(g => {
    if (g.gate === 'H') {
      lines.push(`qc.h(${g.qubit})           # Hadamard gate on q[${g.qubit}]`);
    } else if (g.gate === 'X') {
      lines.push(`qc.x(${g.qubit})           # Pauli-X bit flip on q[${g.qubit}]`);
    } else if (g.gate === 'CNOT') {
      lines.push(`qc.cx(0, 1)        # Controlled-NOT: control q[0], target q[1]`);
    }
  });

  lines.push(`qc.measure([0, 1], [0, 1]) # Measure all qubits`);
  return lines.join('\n');
}

// Step 2: Code Anatomy (Line-by-Line Breakdown)
function renderLesson3_CodeAnatomy() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-primary">LESSON 3 • LAB 3</span>
        <span class="text-caption text-muted">Line-by-Line Explanation</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Code Anatomy: Reading Quantum Programs
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:28px">
        Here is what each line of real Qiskit code actually tells the quantum hardware to do:
      </p>

      <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:28px">
        <div class="card" style="padding:18px;border-left:4px solid var(--primary)">
          <div style="font-family:var(--font-code);font-weight:700;color:#A78BFA;margin-bottom:4px">
            qc = QuantumCircuit(2, 2)
          </div>
          <p class="text-sm text-chalk">
            Allocates a quantum circuit with <strong>2 quantum qubits</strong> and <strong>2 classical bits</strong> to store final measurement outcomes.
          </p>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid var(--accent)">
          <div style="font-family:var(--font-code);font-weight:700;color:var(--accent);margin-bottom:4px">
            qc.h(0)
          </div>
          <p class="text-sm text-chalk">
            Applies a microwave pulse corresponding to the <strong>Hadamard (H) gate</strong> to Qubit 0, transitioning it into an equal superposition.
          </p>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid #F472B6">
          <div style="font-family:var(--font-code);font-weight:700;color:#F472B6;margin-bottom:4px">
            qc.cx(0, 1)
          </div>
          <p class="text-sm text-chalk">
            Executes a <strong>Controlled-X (CNOT)</strong> operation. Qubit 0 acts as the control; if it collapses to 1, it flips Qubit 1!
          </p>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid #10B981">
          <div style="font-family:var(--font-code);font-weight:700;color:#34D399;margin-bottom:4px">
            qc.measure([0, 1], [0, 1])
          </div>
          <p class="text-sm text-chalk">
            Triggers projective measurement across both qubits, converting the fragile quantum states into ordinary classical 0s and 1s.
          </p>
        </div>
      </div>
    </div>
  `;
}

// Step 3: Graduation Challenge (The Bell State)
function renderLesson3_GraduationChallenge() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-success">LESSON 3 • FINAL CHALLENGE</span>
        <span class="text-caption text-muted">Create the Bell State</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;line-height:1.3;margin-bottom:14px">
        Graduation Challenge: Create a Bell State 🌟
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:24px">
        Your final mission before unlocking the full Circuit Sandbox: construct the entangled 
        <strong>Bell State</strong> (|00⟩ + |11⟩)/√2!
      </p>

      <!-- Challenge Instructions Box -->
      <div class="card card-sketch" style="padding:24px;margin-bottom:24px">
        <div class="card-sketch-tag">CHALLENGE PROTOCOL</div>
        <p class="text-chalk" style="line-height:1.7;margin-bottom:14px">
          To entangle two qubits into an Einstein-Podolsky-Rosen (EPR) pair:
        </p>
        <div style="font-family:var(--font-code);font-size:13px;color:var(--accent);margin-bottom:14px">
          Step 1: Apply H to Qubit 0<br/>
          Step 2: Apply CNOT with Control on Qubit 0 and Target on Qubit 1
        </div>

        <div style="display:flex;gap:12px;margin-top:16px">
          <button class="btn btn-primary btn-md" onclick="solveBellChallenge()">
            ⚡ Assemble Bell State Circuit
          </button>
          <button class="btn btn-secondary btn-md" onclick="showNextSchroHint()">
            🐾 Hint Ladder
          </button>
        </div>
      </div>

      <!-- Progressive Hint Bubble -->
      <div id="grad-hint-box" class="card" style="padding:18px;background:rgba(15,23,42,0.8);border:1px solid rgba(124,92,255,0.25);border-radius:12px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:24px">🐾</span>
          <div id="grad-hint-text" class="text-sm text-chalk">
            "Hint 1: Remember the two ingredients of entanglement: first create a superposition, then link the qubits with a controlled gate!"
          </div>
        </div>
      </div>
    </div>
  `;
}

function showNextSchroHint() {
  const hints = [
    "Hint 1: First create a superposition on Qubit 0, then entangle with Qubit 1!",
    "Hint 2: The gate that creates equal superposition is the H (Hadamard) gate.",
    "Hint 3: The gate that entangles two qubits is CNOT (qc.cx(0, 1)).",
    "Solution: Place H on q0, then add CNOT with control q0 and target q1!"
  ];
  lessonRuntimeState.lab3ActiveHint = (lessonRuntimeState.lab3ActiveHint + 1) % hints.length;
  const box = document.getElementById('grad-hint-text');
  if (box) box.textContent = hints[lessonRuntimeState.lab3ActiveHint];
}

function solveBellChallenge() {
  lessonRuntimeState.lab3Gates = [
    { gate: 'H', qubit: 0 },
    { gate: 'CNOT', qubit: 0 }
  ];
  lessonRuntimeState.lab3MissionPassed = true;
  showToast('Bell State Circuit Assembled! Superposition + CNOT = Entanglement! 🌟', 'reward');
  navigate('/lesson', { id: 3, step: 4 });
}

// Step 4: Graduation Ceremony & Intermediate Unlock
function renderLesson3_Ceremony() {
  // Complete curriculum!
  CurriculumProgress.completeLesson(3);

  return `
    <div class="animate-fade-in" style="text-align:center;max-width:700px;margin:32px auto">
      <div style="font-size:64px;margin-bottom:16px;animation:starPop 0.8s ease">🎓🏆</div>
      
      <span class="badge badge-success font-code" style="font-size:12px;margin-bottom:12px">CURRICULUM COMPLETED</span>
      
      <h1 style="font-family:var(--font-heading);font-size:36px;font-weight:700;margin-bottom:12px">
        You are now an Intermediate Quantum Explorer!
      </h1>
      
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:32px">
        You have journeyed from zero-fear intuition (switches and coins) to probability amplitudes, the 3D Bloch Sphere, quantum circuits, and real Qiskit Python code.
      </p>

      <div class="card card-sketch tape-cyan" style="padding:28px;margin-bottom:32px;text-align:left">
        <h3 style="color:var(--accent);margin-bottom:12px">✨ Unlocked Privileges:</h3>
        <ul style="line-height:1.8;color:var(--text-chalk);font-size:14px;margin-left:20px">
          <li><strong>Full Circuit Sandbox Unlocked:</strong> Freely compose multi-gate quantum circuits with Qiskit simulation!</li>
          <li><strong>Intermediate Track Promotion:</strong> Unlocked topic badges for multi-qubit algorithms & error correction.</li>
          <li><strong>Qiskit Code Export:</strong> Generate copy-pasteable Python scripts directly for IBM Quantum systems.</li>
        </ul>
      </div>

      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" onclick="navigate('/sandbox')">
          ⚡ Launch Full Circuit Sandbox →
        </button>
        <button class="btn btn-secondary btn-lg" onclick="navigate('/dashboard')">
          Return to Dashboard
        </button>
      </div>
    </div>
  `;
}

// =====================================================================
// 9. INTERACTIVE CONTROLLER ACTIONS & HELPERS
// =====================================================================
function toggleClassicalSwitch() {
  const current = lessonRuntimeState.switchState || 0;
  const next = current === 0 ? 1 : 0;
  lessonRuntimeState.switchState = next;

  const lever = document.getElementById('switch-lever');
  const btn = document.getElementById('lightswitch-toggle-btn');
  const tag = document.getElementById('switch-status-tag');
  const exp = document.getElementById('switch-explainer');

  if (lever && btn) {
    if (next === 1) {
      lever.style.top = '10px';
      lever.style.background = '#38BDF8';
      btn.style.borderColor = '#38BDF8';
      btn.style.boxShadow = '0 0 16px rgba(56,189,248,0.4)';
      if (tag) { tag.textContent = 'ON = 1'; tag.className = 'badge badge-primary'; }
      if (exp) exp.textContent = 'State: Deterministic 1 (On)';
    } else {
      lever.style.top = '60px';
      lever.style.background = '#94A3B8';
      btn.style.borderColor = '#475569';
      btn.style.boxShadow = 'none';
      if (tag) { tag.textContent = 'OFF = 0'; tag.className = 'badge badge-secondary'; }
      if (exp) exp.textContent = 'State: Deterministic 0 (Off)';
    }
  }
}

function toggleSpinDemoCoin() {
  const isSpinning = !lessonRuntimeState.switchCoinSpinning;
  lessonRuntimeState.switchCoinSpinning = isSpinning;

  const coin = document.getElementById('demo-coin');
  const tag = document.getElementById('coin-status-tag');
  const exp = document.getElementById('coin-explainer');

  if (!coin) return;

  if (isSpinning) {
    coin.textContent = '|ψ⟩';
    coin.style.animation = 'coinSpinContinuous 0.6s linear infinite';
    coin.style.boxShadow = '0 0 32px rgba(124,92,255,0.7)';
    if (tag) { tag.textContent = 'SPINNING: |+⟩'; tag.className = 'badge badge-accent'; }
    if (exp) exp.textContent = 'State: Superposition (|0⟩ + |1⟩)/√2';
  } else {
    const outcome = Math.random() > 0.5 ? '0' : '1';
    coin.textContent = `|${outcome}⟩`;
    coin.style.animation = 'none';
    coin.style.boxShadow = '0 0 20px rgba(56,189,248,0.4)';
    if (tag) { tag.textContent = `RESTING: |${outcome}⟩`; tag.className = 'badge badge-primary'; }
    if (exp) exp.textContent = `State: Definite Classical |${outcome}⟩`;
  }
}

function flickQuantumCoin() {
  const coin = document.getElementById('cfs-coin');
  const hand = document.getElementById('cfs-hand');
  const flickBtn = document.getElementById('cfs-flick-btn');
  const measureBtn = document.getElementById('cfs-measure-btn');
  const badge = document.getElementById('cfs-state-badge');
  const quote = document.getElementById('cfs-schro-quote');

  if (!coin || !flickBtn) return;

  lessonRuntimeState.coinFlipping = true;
  lessonRuntimeState.coinState = 'spinning';

  // Animate hand flick
  if (hand) hand.style.animation = 'handFlick 0.4s ease';

  // Animate coin launch
  coin.textContent = '|ψ⟩';
  coin.style.background = 'radial-gradient(circle, #7C5CFF 0%, #22D3EE 100%)';
  coin.style.boxShadow = '0 0 35px rgba(124,92,255,0.8)';
  coin.style.animation = 'coinFlip3D 0.8s ease, coinSpinContinuous 0.5s linear infinite 0.8s';

  flickBtn.disabled = true;
  if (measureBtn) measureBtn.disabled = false;

  if (badge) {
    badge.textContent = 'STATE: AIRBORNE SUPERPOSITION |ψ⟩';
    badge.className = 'badge badge-accent';
  }

  if (quote) {
    quote.textContent = "Look at it spin! While it's airborne, neither Heads nor Tails is chosen yet!";
  }
}

function measureQuantumCoin() {
  const coin = document.getElementById('cfs-coin');
  const hand = document.getElementById('cfs-hand');
  const flickBtn = document.getElementById('cfs-flick-btn');
  const measureBtn = document.getElementById('cfs-measure-btn');
  const badge = document.getElementById('cfs-state-badge');
  const quote = document.getElementById('cfs-schro-quote');

  if (!coin) return;

  const outcome = Math.random() > 0.5 ? '0' : '1';
  lessonRuntimeState.coinState = outcome;
  lessonRuntimeState.coinFlipping = false;

  // Flash measurement collapse
  coin.style.animation = 'measurementFlash 0.5s ease';
  coin.textContent = `|${outcome}⟩`;
  coin.style.background = outcome === '0' 
    ? 'radial-gradient(circle, #38BDF8 0%, #0369A1 100%)' 
    : 'radial-gradient(circle, #EC4899 0%, #9D174D 100%)';

  if (hand) hand.textContent = '🫳'; // Catch hand

  if (flickBtn) flickBtn.disabled = false;
  if (measureBtn) measureBtn.disabled = true;

  if (badge) {
    badge.textContent = `COLLAPSED: |${outcome}⟩ (${outcome === '0' ? 'HEADS' : 'TAILS'})`;
    badge.className = 'badge badge-primary';
  }

  if (quote) {
    quote.textContent = "That's the key idea: before we check, we don't know which side we'll see. The observation forced it into a single classical outcome!";
  }

  showToast(`Measurement collapsed coin to |${outcome}⟩! 🎲`, 'success');
}

function resetQuantumCoin() {
  const coin = document.getElementById('cfs-coin');
  const hand = document.getElementById('cfs-hand');
  const flickBtn = document.getElementById('cfs-flick-btn');
  const measureBtn = document.getElementById('cfs-measure-btn');
  const badge = document.getElementById('cfs-state-badge');
  const quote = document.getElementById('cfs-schro-quote');

  lessonRuntimeState.coinState = 'init';
  lessonRuntimeState.coinFlipping = false;

  if (coin) {
    coin.textContent = '|0⟩';
    coin.style.background = 'radial-gradient(circle, #38BDF8 0%, #0369A1 100%)';
    coin.style.boxShadow = '0 0 20px rgba(56,189,248,0.4)';
    coin.style.animation = 'none';
  }

  if (hand) hand.textContent = '🖐️';
  if (flickBtn) flickBtn.disabled = false;
  if (measureBtn) measureBtn.disabled = true;

  if (badge) {
    badge.textContent = 'STATE: PREPARED IN |0⟩';
    badge.className = 'badge badge-primary';
  }

  if (quote) {
    quote.textContent = 'Give it a spin! Before we talk about qubits, let\'s get a feel for probability.';
  }
}

function selectLessonFact(factIndex) {
  lessonRuntimeState.selectedFact = factIndex;
  const body = document.getElementById('lesson-body');
  if (body) body.innerHTML = renderLesson0_Why();
}

function playFactNarration(encodedText) {
  const text = decodeURIComponent(encodedText);
  if ('speechSynthesis' in window) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      showToast('Narration stopped', 'default');
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.1;
    window.speechSynthesis.speak(utter);
    showToast('Playing quantum audio narration... 🔊', 'default');
  } else {
    showToast(text, 'default', 4000);
  }
}

function handleAmplitudeSlider(val) {
  const p0 = parseInt(val);
  const p1 = 100 - p0;
  lessonRuntimeState.probAlphaSq = p0 / 100;

  const bar0 = document.getElementById('prob-bar-0');
  const bar1 = document.getElementById('prob-bar-1');
  if (bar0 && bar1) {
    bar0.style.width = `${p0}%`;
    bar0.textContent = p0 >= 15 ? `${p0}%` : '';
    bar1.style.width = `${p1}%`;
    bar1.textContent = p1 >= 15 ? `${p1}%` : '';
  }
}

function handleBlochSlider(param, val) {
  if (param === 'theta') lessonRuntimeState.blochTheta = parseInt(val);
  if (param === 'phi') lessonRuntimeState.blochPhi = parseInt(val);

  const body = document.getElementById('lesson-body');
  if (body) body.innerHTML = renderLesson1_BlochSphere();
}

function setBlochPreset(theta, phi) {
  lessonRuntimeState.blochTheta = theta;
  lessonRuntimeState.blochPhi = phi;

  const body = document.getElementById('lesson-body');
  if (body) body.innerHTML = renderLesson1_BlochSphere();
}

function attachInteractiveStepHandlers(lessonId, stepIndex) {
  // Progress bar animation
  setTimeout(() => {
    const prog = document.getElementById('lesson-prog');
    const currentDef = CURRICULUM_LESSONS[lessonId];
    if (prog && currentDef) {
      prog.style.width = `${((stepIndex + 1) / currentDef.steps.length) * 100}%`;
    }
  }, 80);
}

// =====================================================================
// 10. REUSABLE CIRCUIT EXPERIMENT & BADGE CHECKPOINT QUIZ
// =====================================================================
let interactiveLessonState = {
  activeGate: 'H',
  qubitState: 'superposition',
  quizAnswers: [],
  quizIndex: 0
};

function renderInteractStep() {
  return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="badge badge-accent">LESSON 2 • CIRCUIT EXPERIMENT</span>
        <span class="text-caption text-muted">Hands-On Circuit Composer</span>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:700;margin-bottom:12px">
        Build & Measure a Quantum Circuit 🔬
      </h1>
      <p style="font-size:16px;color:var(--text-chalk);line-height:1.7;margin-bottom:28px">
        Execute your quantum operations! Apply a <strong>Hadamard (H) Gate</strong> or <strong>Pauli-X</strong> to turn |0⟩ into state combinations, then collapse it using a projective measurement meter.
      </p>

      <!-- Working Quantum Circuit Simulator -->
      <div class="card" style="padding:28px;background:rgba(20,27,45,0.85);border:1px solid rgba(34,211,238,0.3);border-radius:20px;margin-bottom:28px">
        <!-- Circuit Diagram Wire -->
        <div style="background:rgba(15,23,42,0.8);border:1px solid rgba(124,92,255,0.25);border-radius:14px;padding:24px;margin-bottom:24px">
          <div class="text-caption text-muted" style="margin-bottom:14px;font-family:var(--font-code)">QUANTUM REGISTER: Q[0]</div>
          
          <div style="display:flex;align-items:center;gap:16px;position:relative">
            <!-- Wire Line -->
            <div style="position:absolute;left:0;right:0;height:2px;background:rgba(56,189,248,0.4);z-index:1"></div>

            <!-- Initial state -->
            <div style="position:relative;z-index:2;background:#1E2943;border:1px solid #38BDF8;padding:8px 14px;border-radius:8px;font-family:var(--font-code);font-weight:700;font-size:14px;color:#38BDF8">
              |0⟩
            </div>

            <!-- Gate Slot -->
            <div id="circuit-gate-slot" style="position:relative;z-index:2;margin-left:48px;background:var(--primary);border:2px solid #A78BFA;width:52px;height:52px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:22px;font-weight:700;color:#FFF;box-shadow:0 0 16px rgba(124,92,255,0.5)">
              H
            </div>

            <!-- Measurement Meter Slot -->
            <div style="position:relative;z-index:2;margin-left:auto;background:#059669;border:2px solid #34D399;width:52px;height:52px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#FFF;box-shadow:0 0 16px rgba(16,185,129,0.4)">
              ⏱️
            </div>
          </div>
        </div>

        <!-- Action Controls -->
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px">
          <button class="btn btn-secondary btn-sm" onclick="applyLessonGate('H')">
            Apply Hadamard [H]
          </button>
          <button class="btn btn-secondary btn-sm" onclick="applyLessonGate('X')">
            Apply Pauli-NOT [X]
          </button>
          <button class="btn btn-secondary btn-sm" onclick="applyLessonGate('reset')">
            Reset to |0⟩
          </button>
          <button class="btn btn-primary btn-md" style="margin-left:auto" onclick="runLessonSimulation()">
            ▶ Run & Measure 100 Shots
          </button>
        </div>

        <!-- Simulation Results Histogram -->
        <div id="interactive-results-box" style="background:rgba(15,23,42,0.9);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.08)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h4 style="font-family:var(--font-heading);font-size:15px">📊 Measurement Histogram (100 Shots)</h4>
            <span id="hist-tag" class="text-caption text-accent font-code">SIMULATOR READY</span>
          </div>

          <div style="display:flex;gap:24px;align-items:flex-end;height:120px;padding:0 24px;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1)">
            <!-- Bar 0 -->
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end">
              <span id="bar-0-val" style="font-size:12px;font-family:var(--font-code);color:#38BDF8;margin-bottom:4px">50%</span>
              <div id="bar-0" style="width:100%;max-width:80px;background:var(--primary);border-radius:6px 6px 0 0;height:50%;transition:height 0.6s ease"></div>
              <span style="font-size:12px;font-family:var(--font-code);margin-top:6px">State |0⟩</span>
            </div>

            <!-- Bar 1 -->
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end">
              <span id="bar-1-val" style="font-size:12px;font-family:var(--font-code);color:#22D3EE;margin-bottom:4px">50%</span>
              <div id="bar-1" style="width:100%;max-width:80px;background:var(--accent);border-radius:6px 6px 0 0;height:50%;transition:height 0.6s ease"></div>
              <span style="font-size:12px;font-family:var(--font-code);margin-top:6px">State |1⟩</span>
            </div>
          </div>

          <div id="hist-explanation" class="text-caption text-muted" style="text-align:center">
            With the Hadamard gate applied, 100 projective measurements yield approximately 50% |0⟩ and 50% |1⟩, confirming coherent quantum superposition!
          </div>
        </div>
      </div>
    </div>
  `;
}

function applyLessonGate(gate) {
  const gateSlot = document.getElementById('circuit-gate-slot');
  if (!gateSlot) return;

  if (gate === 'reset') {
    gateSlot.textContent = 'I';
    gateSlot.style.background = '#3B4252';
    interactiveLessonState.activeGate = 'I';
    showToast('Reset circuit to identity state |0⟩', 'default');
  } else {
    gateSlot.textContent = gate;
    gateSlot.style.background = gate === 'H' ? 'var(--primary)' : '#EC4899';
    interactiveLessonState.activeGate = gate;
    showToast(`Added ${gate} gate to circuit!`, 'success');
  }
}

function runLessonSimulation() {
  const bar0 = document.getElementById('bar-0');
  const bar1 = document.getElementById('bar-1');
  const val0 = document.getElementById('bar-0-val');
  const val1 = document.getElementById('bar-1-val');
  const histTag = document.getElementById('hist-tag');
  const histExp = document.getElementById('hist-explanation');
  if (!bar0 || !bar1) return;

  if (interactiveLessonState.activeGate === 'H') {
    const count0 = Math.floor(46 + Math.random() * 9);
    const count1 = 100 - count0;
    bar0.style.height = `${count0}%`;
    bar1.style.height = `${count1}%`;
    val0.textContent = `${count0}%`;
    val1.textContent = `${count1}%`;
    histTag.textContent = 'SUPERPOSITION CONFIRMED ✨';
    histExp.textContent = `Measured ${count0} shots in |0⟩ and ${count1} shots in |1⟩. Notice the equal split caused by Hadamard superposition!`;
    showToast('Circuit executed! Superposition verified 🌊', 'reward');
  } else if (interactiveLessonState.activeGate === 'X') {
    bar0.style.height = '0%';
    bar1.style.height = '100%';
    val0.textContent = '0%';
    val1.textContent = '100%';
    histTag.textContent = 'DETERMINISTIC |1⟩';
    histExp.textContent = 'Pauli-X flipped the state from |0⟩ to |1⟩. All 100 shots collapsed to |1⟩ with 100% certainty.';
    showToast('Pauli-X inverted qubit to |1⟩', 'default');
  } else {
    bar0.style.height = '100%';
    bar1.style.height = '0%';
    val0.textContent = '100%';
    val1.textContent = '0%';
    histTag.textContent = 'DETERMINISTIC |0⟩';
    histExp.textContent = 'Identity gate left the qubit in ground state |0⟩.';
  }
}

function renderQuizStep_inline() {
  const quizData = (typeof BadgeQuizzes !== 'undefined' && BadgeQuizzes.getQuiz) ? BadgeQuizzes.getQuiz('superposition', 'normal') : null;
  const questions = quizData ? quizData.questions : [
    {
      question: "What mathematical entity represents a pure qubit state in standard Dirac notation?",
      options: ["A real wave equation", "A normalized unit vector |ψ⟩ = α|0⟩ + β|1⟩ in ℂ²", "A classical bit array", "A scalar"],
      correct: 1,
      explanation: "A pure qubit is defined as a normalized unit vector in a two-dimensional complex Hilbert space."
    }
  ];
  interactiveLessonState.quizAnswers = [];
  interactiveLessonState.quizIndex = 0;

  return `
    <div class="animate-fade-in" style="max-width:720px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:10px">
          <span class="badge badge-success">STAGE 4: BADGE CHECKPOINT</span>
          <span class="text-caption text-muted">Pass ≥ 75% to earn badge</span>
        </div>
        <div class="stat-pill earned-pill" style="padding:4px 12px;font-size:11px">
          🏆 UNLOCKS: Superposition Small Badge
        </div>
      </div>

      <h1 style="font-family:var(--font-heading);font-size:30px;font-weight:700;margin-bottom:8px">
        Superposition Checkpoint Quiz
      </h1>
      <p style="font-size:15px;color:var(--text-chalk);line-height:1.6;margin-bottom:28px">
        Prove your mastery of probability waves and the Hadamard gate. Passing this quiz will award the official 
        <strong>Superposition Small Badge</strong> and unveil its <strong>Secret Quiz Challenge</strong>!
      </p>

      <div id="lesson-quiz-container">
        ${renderLessonQuizQuestion(0, questions)}
      </div>
    </div>
  `;
}

function renderLessonQuizQuestion(qIndex, questions) {
  if (!questions || !questions[qIndex]) {
    return `<div>Error loading quiz questions.</div>`;
  }

  const q = questions[qIndex];
  const total = questions.length;

  return `
    <div class="quiz-question-box" style="padding:28px;background:rgba(20,27,45,0.85);border:1px solid rgba(124,92,255,0.3);border-radius:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="text-caption text-accent font-code">QUESTION 0${qIndex + 1} OF 0${total}</span>
        <span class="text-caption text-muted">Curriculum Checkpoint</span>
      </div>

      <div class="quiz-question-text" style="font-size:18px;margin-bottom:24px;line-height:1.5">
        ${q.question}
      </div>

      <div class="quiz-options-list" style="display:flex;flex-direction:column;gap:12px">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn" id="lq-opt-${i}" onclick="selectLessonQuizOption(${qIndex}, ${i})">
            <span style="font-family:var(--font-code);font-weight:700;color:var(--text-muted)">${String.fromCharCode(65 + i)})</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div id="lesson-quiz-feedback" class="quiz-explanation-box hidden" style="margin-top:20px"></div>

      <div style="margin-top:24px;display:flex;justify-content:flex-end">
        <button id="lq-next-btn" class="btn btn-primary btn-md" disabled onclick="handleLessonQuizNext(${qIndex})">
          ${qIndex < total - 1 ? 'Next Question →' : 'Submit & Claim Badge 🏆'}
        </button>
      </div>
    </div>
  `;
}

function selectLessonQuizOption(qIndex, selectedIndex) {
  const badgeId = activeLessonId === 2 ? 'single-gates' : 'superposition';
  const quizData = (typeof BadgeQuizzes !== 'undefined' && BadgeQuizzes.getQuiz) ? BadgeQuizzes.getQuiz(badgeId, 'normal') : null;
  const q = quizData && quizData.questions ? quizData.questions[qIndex] : { correct: 1, explanation: "Correct answer!" };
  const isCorrect = selectedIndex === q.correct;

  interactiveLessonState.quizAnswers[qIndex] = { selected: selectedIndex, isCorrect };

  const btns = document.querySelectorAll('.quiz-option-btn');
  btns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) {
      btn.classList.add('correct');
    } else if (idx === selectedIndex) {
      btn.classList.add('wrong');
    }
  });

  const feedbackBox = document.getElementById('lesson-quiz-feedback');
  if (feedbackBox) {
    feedbackBox.classList.remove('hidden');
    feedbackBox.innerHTML = `
      <div style="font-weight:700;margin-bottom:4px;color:${isCorrect ? '#34D399' : '#EF4444'}">
        ${isCorrect ? '✓ Correct!' : '✗ Not quite.'}
      </div>
      <div>${q.explanation}</div>
    `;
  }

  const nextBtn = document.getElementById('lq-next-btn');
  if (nextBtn) {
    nextBtn.disabled = false;
  }
}

function handleLessonQuizNext(qIndex) {
  const badgeId = activeLessonId === 2 ? 'single-gates' : 'superposition';
  const quizData = (typeof BadgeQuizzes !== 'undefined' && BadgeQuizzes.getQuiz) ? BadgeQuizzes.getQuiz(badgeId, 'normal') : null;
  const questions = quizData ? quizData.questions : [];

  if (qIndex < questions.length - 1) {
    const container = document.getElementById('lesson-quiz-container') || document.getElementById('l2-quiz-container');
    if (container) {
      container.innerHTML = renderLessonQuizQuestion(qIndex + 1, questions);
    }
  } else {
    finishLessonQuiz();
  }
}

function finishLessonQuiz() {
  const badgeId = activeLessonId === 2 ? 'single-gates' : 'superposition';
  const quizData = (typeof BadgeQuizzes !== 'undefined' && BadgeQuizzes.getQuiz) ? BadgeQuizzes.getQuiz(badgeId, 'normal') : null;
  const questions = quizData ? quizData.questions : [{ correct: 1 }];
  const total = questions.length;
  const correct = interactiveLessonState.quizAnswers.filter(a => a && a.isCorrect).length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 66;

  if (passed) {
    if (typeof BadgesEngine !== 'undefined' && BadgesEngine.recordNormalQuiz) {
      BadgesEngine.recordNormalQuiz(badgeId, correct, total);
    }
    CurriculumProgress.completeLesson(activeLessonId);

    // If celebration modal is available, open it
    if (typeof BadgeModal !== 'undefined' && BadgeModal.openCelebration) {
      let badgeMeta = null;
      let topicMeta = null;
      if (typeof BadgesEngine !== 'undefined') {
        BadgesEngine.TOPICS.forEach(t => {
          const found = t.smallBadges.find(b => b.id === badgeId);
          if (found) { badgeMeta = found; topicMeta = t; }
        });
      }

      BadgeModal.openCelebration({
        badgeId,
        type: 'normal',
        correct,
        total,
        pct,
        badgeMeta,
        topicMeta,
        engineResult: { newlyEarned: true }
      });
    } else {
      showToast(`Congratulations! You passed with ${pct}%! 🏆`, 'reward');
    }

    // Advance to next lesson after modal
    setTimeout(() => {
      if (activeLessonId < 3) {
        navigate('/lesson', { id: activeLessonId + 1, step: 0 });
      } else {
        navigate('/sandbox');
      }
    }, 1500);
  } else {
    const container = document.getElementById('lesson-quiz-container') || document.getElementById('l2-quiz-container');
    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align:center;padding:36px;border-color:rgba(239,68,68,0.4)">
          <div style="font-size:44px;margin-bottom:12px">🐱🐾</div>
          <h2 style="font-family:var(--font-heading);margin-bottom:8px">Almost There!</h2>
          <p class="text-muted" style="margin-bottom:20px">
            You scored <strong>${correct}/${total} (${pct}%)</strong>. Review the lesson steps and try again!
          </p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button class="btn btn-primary btn-md" onclick="navigate('/lesson', { id: ${activeLessonId}, step: 0 })">
              🔄 Review Lesson Steps
            </button>
          </div>
        </div>
      `;
    }
  }
}
