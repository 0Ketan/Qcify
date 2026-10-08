/**
 * QUANTUMPAWS — Lesson Shell (Superposition)
 */

const LESSON_STEPS = ['Hook', 'Story', 'Interact', 'Quiz'];
let currentStep = 0;

function renderLesson(app, params = {}) {
  const stepIndex = params.step ?? 0;
  currentStep = stepIndex;

  app.innerHTML = `
    ${buildStarsBg()}
    
    <!-- Lesson Header -->
    <header class="lesson-header">
      <div class="lesson-top-bar">
        <button class="lesson-back-btn" onclick="navigate('/dashboard')" title="Back to Dashboard">←</button>
        <div class="lesson-title-bar">
          <span class="text-muted text-sm">Lesson 1 •</span> Superposition
        </div>
        <div class="streak-counter">🔥 5</div>
      </div>
      
      <!-- Step Tabs -->
      <div class="step-tabs">
        ${LESSON_STEPS.map((s, i) => `
          <button class="step-tab ${i === stepIndex ? 'active' : ''}" 
            onclick="navigateLesson(${i})"
            ${i > stepIndex + 1 ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}>
            ${s}
          </button>
        `).join('')}
      </div>
      
      <!-- Progress -->
      <div class="lesson-progress-bar progress-track" style="border-radius:0">
        <div class="progress-fill" id="lesson-prog" style="width:${(stepIndex + 1) * 25}%;transition:width 0.6s ease"></div>
      </div>
    </header>

    <!-- Content -->
    <main class="lesson-content">
      <div class="lesson-content-area" id="lesson-body">
        ${renderLessonStep(stepIndex)}
      </div>
    </main>

    <!-- Bottom Bar -->
    <footer class="lesson-bottom-bar">
      <button class="btn btn-ghost btn-md" onclick="navigate('/dashboard')" 
        ${stepIndex === 0 ? 'style="opacity:0.4;pointer-events:none"' : ''}>
        ← Back
      </button>
      <div style="display:flex;gap:12px;align-items:center">
        <button class="btn btn-ghost btn-md" onclick="toggleChatDrawer()">
          💡 Hint (Ask Schrö)
        </button>
        <button class="btn btn-primary btn-lg" onclick="nextLessonStep(${stepIndex})">
          ${stepIndex < LESSON_STEPS.length - 1 ? 'Next →' : 'Complete! 🎉'}
        </button>
      </div>
    </footer>

    ${buildBottomNav('lessons')}
  `;

  // Animate progress bar
  setTimeout(() => {
    const prog = document.getElementById('lesson-prog');
    if (prog) prog.style.width = `${(stepIndex + 1) * 25}%`;
  }, 200);
}

function renderLessonStep(stepIndex) {
  switch(stepIndex) {
    case 0: return renderHookStep();
    case 1: return renderStoryStep();
    case 2: return renderInteractStep();
    case 3: return renderQuizStep_inline();
    default: return renderHookStep();
  }
}

function renderHookStep() {
  return `
    <div class="animate-fade-in">
      <div class="badge badge-primary" style="margin-bottom:16px">Hook</div>
      <h2 style="margin-bottom:16px">What if a coin could be both heads AND tails at once?</h2>
      <p class="text-muted" style="margin-bottom:32px;font-size:17px;line-height:1.7">
        Imagine you flip a coin... but instead of landing, it keeps spinning forever — <em>simultaneously</em> heads and tails.
        That's quantum superposition. And it's not just a metaphor — it's real physics.
      </p>

      <!-- Side-by-side layout -->
      <div class="content-row">
        <div class="content-text">
          <h3>Classical vs Quantum</h3>
          <p class="text-muted" style="margin-top:8px;line-height:1.7">
            A classical bit is either <strong style="color:var(--accent)">0</strong> or <strong style="color:var(--primary)">1</strong>. 
            A quantum bit — a <strong>qubit</strong> — can be both at the same time, thanks to superposition. 
            Only when we <em>measure</em> it does it "choose" a definite state.
          </p>
          <div class="code-block" style="margin-top:16px">
            <span class="code-comment"># Classical bit</span>
bit = <span class="code-number">0</span>  <span class="code-comment"># or 1, never both</span>

<span class="code-comment"># Quantum qubit (Qiskit)</span>
<span class="code-keyword">from</span> qiskit <span class="code-keyword">import</span> QuantumCircuit
qc = QuantumCircuit(<span class="code-number">1</span>)
qc.h(<span class="code-number">0</span>)  <span class="code-comment"># Hadamard gate → superposition!</span>
          </div>
        </div>
        <div class="media-slot" style="height:220px;font-size:64px">
          <div class="media-slot-icon">🌊</div>
          <div class="text-sm">Wave animation placeholder</div>
          <div class="badge badge-locked" style="font-size:10px">Video coming soon</div>
        </div>
      </div>

      <!-- Key concept card -->
      <div class="card" style="margin-top:24px;border-color:rgba(124,92,255,0.3);background:rgba(124,92,255,0.05)">
        <div style="display:flex;gap:16px;align-items:flex-start">
          <span style="font-size:28px">💡</span>
          <div>
            <h4 style="margin-bottom:8px">Key Insight</h4>
            <p class="text-muted">Superposition isn't about <em>uncertainty</em> — the qubit genuinely exists in both states 
            until measurement. This is what gives quantum computers their power: they can explore many solutions simultaneously!</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStoryStep() {
  return `
    <div class="animate-fade-in">
      <div class="badge badge-primary" style="margin-bottom:16px">Story</div>
      <h2 style="margin-bottom:8px">The Tale of Schrö's Magic Coin 🪙</h2>
      <p class="text-muted" style="margin-bottom:32px">An analogy to make superposition click forever</p>

      <!-- Full-width media -->
      <div class="media-slot" style="width:100%;height:280px;margin-bottom:32px">
        <div style="font-size:72px;animation:floatBob 2s ease-in-out infinite">🐱</div>
        <div class="text-sm">Story animation: Schrö & the quantum coin</div>
      </div>

      <div style="max-width:640px;margin:0 auto">
        <div class="card" style="margin-bottom:16px">
          <p style="line-height:1.8">
            🐾 <em>"Long ago, I found a special coin at the quantum physics lab. When I flipped it, something incredible happened..."</em>
          </p>
        </div>

        <div class="card" style="margin-bottom:16px;border-left:3px solid var(--primary)">
          <h4 style="margin-bottom:8px;color:var(--primary)">Act 1: The Spinning Coin</h4>
          <p class="text-muted" style="line-height:1.7">
            While the coin spins through the air, it's in <strong style="color:var(--text)">superposition</strong> — 
            it has some "heads-ness" and some "tails-ness" simultaneously. Mathematically, we write this as:
          </p>
          <div class="code-block" style="margin-top:12px;text-align:center;font-size:15px">
|ψ⟩ = α|0⟩ + β|1⟩
          </div>
          <p class="text-muted text-sm" style="margin-top:8px">
            Where α² + β² = 1 (probabilities must sum to 100%)
          </p>
        </div>

        <div class="card" style="border-left:3px solid var(--accent)">
          <h4 style="margin-bottom:8px;color:var(--accent)">Act 2: The Measurement</h4>
          <p class="text-muted" style="line-height:1.7">
            The moment I look at the coin — it <strong style="color:var(--text)">collapses</strong> to heads OR tails. 
            This is called "wavefunction collapse." The act of measuring forces the quantum system to commit to one state.
          </p>
          <p class="text-muted text-sm" style="margin-top:8px">
            🔮 <em>This is why quantum computers must be kept cold and isolated — any interaction causes premature measurement!</em>
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderInteractStep() {
  return `
    <div class="animate-fade-in">
      <div class="badge badge-accent" style="margin-bottom:16px">Interact</div>
      <h2 style="margin-bottom:8px">Build Your First Quantum Circuit</h2>
      <p class="text-muted" style="margin-bottom:32px">Apply a Hadamard gate and watch superposition happen</p>

      <!-- Circuit Composer Slot -->
      <div class="media-slot accent-border" style="height:300px;margin-bottom:24px;position:relative" id="circuit-slot">
        <div style="font-size:48px">⚗️</div>
        <div class="font-heading" style="font-size:18px">CIRCUIT_SANDBOX_SLOT</div>
        <div class="text-sm text-muted">Circuit Composer (interactive, built by teammate)</div>
        <div class="badge badge-locked" style="position:absolute;top:16px;right:16px">Teammate builds here</div>

        <!-- Interactive demo buttons -->
        <div style="display:flex;gap:12px;margin-top:16px">
          <button class="btn btn-secondary btn-sm" onclick="demoGate('H')">Add H Gate</button>
          <button class="btn btn-secondary btn-sm" onclick="demoGate('X')">Add X Gate</button>
          <button class="btn btn-accent btn-sm" onclick="runCircuit()">▶ Run</button>
        </div>
      </div>

      <!-- Results area -->
      <div style="display:grid;grid-template-columns:1fr 360px;gap:24px">
        <div class="card" style="padding:24px" id="results-slot">
          <h4 style="margin-bottom:16px">📊 RESULTS_SLOT</h4>
          <div style="text-align:center;color:var(--text-muted);padding:32px">
            <div style="font-size:48px;margin-bottom:12px">📈</div>
            <div>Histogram & Bloch sphere appear here after running</div>
          </div>
        </div>
        
        <!-- Theory Panel (locked) -->
        <div class="theory-panel locked">
          <div class="theory-lock-overlay">
            <span style="font-size:32px">🔒</span>
            <h4>Theory Notes</h4>
            <p class="text-sm text-muted text-center">Complete the lesson to unlock detailed theory notes</p>
          </div>
          <h4 style="margin-bottom:12px;filter:blur(4px)">Bloch Sphere Mathematics</h4>
          <p class="text-muted text-sm" style="filter:blur(4px)">
            The Bloch sphere is a geometric representation of the qubit state space...
          </p>
          <div class="code-block" style="margin-top:12px;filter:blur(6px)">|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩</div>
        </div>
      </div>
    </div>
  `;
}

function renderQuizStep_inline() {
  return `
    <div class="animate-fade-in" style="max-width:640px;margin:0 auto">
      <div class="badge badge-success" style="margin-bottom:16px">Quick Check</div>
      <h2 style="margin-bottom:8px">Test Your Understanding</h2>
      <p class="text-muted" style="margin-bottom:32px">Answer this to complete the lesson</p>

      <div class="question-card">
        <div class="question-number">Question 1 of 1</div>
        <div class="question-text">
          What does the Hadamard (H) gate do to a qubit in state |0⟩?
        </div>
      </div>

      <div class="quiz-options">
        ${[
          'Flips it from |0⟩ to |1⟩',
          'Puts it into an equal superposition of |0⟩ and |1⟩',
          'Measures and collapses it to |0⟩',
          'Entangles it with another qubit'
        ].map((opt, i) => `
          <div class="quiz-option" id="lesson-opt-${i}" onclick="selectLessonOption(${i})">
            <div class="quiz-option-key">${['A','B','C','D'][i]}</div>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>

      <div id="lesson-feedback" style="display:none" class="animate-slide-up"></div>
    </div>
  `;
}

let lessonAnswered = false;
function selectLessonOption(idx) {
  if (lessonAnswered) return;
  lessonAnswered = true;
  const correct = 1; // index of correct answer
  const opts = document.querySelectorAll('.quiz-option[id^="lesson-opt"]');

  opts[idx].classList.add(idx === correct ? 'correct' : 'incorrect');
  if (idx !== correct) opts[correct].classList.add('correct');

  const feedback = document.getElementById('lesson-feedback');
  if (feedback) {
    feedback.style.display = 'block';
    feedback.innerHTML = `
      <div class="card" style="border-color:${idx === correct ? 'var(--success)' : 'var(--primary)'};background:${idx === correct ? 'rgba(52,211,153,0.05)' : 'rgba(124,92,255,0.05)'}">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <span style="font-size:24px">${idx === correct ? '✅' : '💜'}</span>
          <div>
            <strong>${idx === correct ? 'Purrfect!' : 'Almost! Here\'s why...'}</strong>
            <p class="text-muted text-sm" style="margin-top:4px">
              The Hadamard gate creates an <strong>equal superposition</strong>: H|0⟩ = (|0⟩ + |1⟩)/√2. 
              This means a 50/50 chance of measuring either state — quantum magic! ⚛️
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

function navigateLesson(stepIndex) {
  lessonAnswered = false;
  navigate('/lesson', { step: stepIndex });
}

function nextLessonStep(currentStep) {
  lessonAnswered = false;
  if (currentStep < LESSON_STEPS.length - 1) {
    navigateLesson(currentStep + 1);
  } else {
    // Lesson complete!
    showLessonCompleteModal();
  }
}

function demoGate(type) {
  const slot = document.getElementById('circuit-slot');
  showToast(`${type} gate added to circuit! ⚛️`, 'default', 2000);
}

function runCircuit() {
  const results = document.getElementById('results-slot');
  if (results) {
    results.innerHTML = `
      <h4 style="margin-bottom:16px">📊 Results</h4>
      <div style="display:flex;gap:8px;align-items:flex-end;height:80px;margin-bottom:16px">
        <div style="width:50px;background:var(--primary);border-radius:4px 4px 0 0;height:${Math.round(Math.random() * 40 + 40)}%;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;font-size:12px;color:white">|0⟩</div>
        <div style="width:50px;background:var(--accent);border-radius:4px 4px 0 0;height:${Math.round(Math.random() * 40 + 40)}%;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;font-size:12px;color:var(--background)">|1⟩</div>
      </div>
      <div class="text-sm text-muted">~50% |0⟩, ~50% |1⟩ — equal superposition! ✨</div>
    `;
  }
  showToast('Circuit executed! Superposition confirmed 🌊', 'success');
}

function showLessonCompleteModal() {
  launchConfetti();

  showModal(`
    <div style="text-align:center">
      <div id="complete-schro" style="display:flex;justify-content:center;margin-bottom:20px"></div>
      <div style="font-size:36px;margin-bottom:8px">🎉</div>
      <h2 style="margin-bottom:8px">Lesson Complete!</h2>
      <p class="text-muted" style="margin-bottom:24px">You've mastered Superposition — Schrö is proud! 🐾</p>

      <!-- Badge earned -->
      <div style="display:flex;justify-content:center;margin-bottom:24px">
        <div class="badge-slot earned" style="width:80px;height:80px;font-size:36px;border-radius:var(--radius-sm)">
          <span>⚛️</span>
          <div class="badge-slot-label">Superposer</div>
        </div>
      </div>

      <!-- Journey progress -->
      <div style="margin-bottom:24px">
        <div class="progress-label"><span>Journey Progress</span><span>15% → 40%</span></div>
        <div class="progress-track">
          <div class="progress-fill" id="complete-prog" style="width:15%"></div>
        </div>
      </div>

      <div style="display:flex;gap:12px">
        <button class="btn btn-ghost btn-md" onclick="closeModal();navigate('/dashboard')">Back to Dashboard</button>
        <button class="btn btn-primary btn-md" style="flex:1" onclick="closeModal();navigate('/dashboard',{progress40:true})">
          Next Lesson → 🚀
        </button>
      </div>
    </div>
  `);

  setTimeout(() => {
    const el = document.getElementById('complete-schro');
    if (el) el.appendChild(renderSchro('excited', 120));
    setTimeout(() => animateProgressBar('complete-prog', 15, 40), 500);
    setTimeout(() => showToast('New badge: Superposition Starter! 🏆', 'reward'), 800);
  }, 100);
}
