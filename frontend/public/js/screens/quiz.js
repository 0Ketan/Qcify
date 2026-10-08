/**
 * QUANTUMPAWS — Gateway Quiz Screen
 */

const QUIZ_QUESTIONS = [
  {
    question: "A qubit in superposition is like a coin that is:",
    options: [
      "Permanently fixed to heads",
      "Both heads AND tails simultaneously until measured",
      "A very fast coin that switches between heads and tails",
      "A coin you haven't looked at yet"
    ],
    correct: 1,
    explanation: "Superposition means the qubit genuinely exists in both states at the same time — not just uncertainty. It's a fundamental quantum property!"
  },
  {
    question: "What does the Hadamard (H) gate do?",
    options: [
      "It flips |0⟩ to |1⟩ (like a NOT gate)",
      "It measures the qubit",
      "It creates an equal superposition: (|0⟩ + |1⟩)/√2",
      "It entangles two qubits"
    ],
    correct: 2,
    explanation: "H|0⟩ = (|0⟩ + |1⟩)/√2 — perfectly equal superposition! This is the most common way to initialize a qubit for quantum algorithms."
  },
  {
    question: "When we 'measure' a qubit in superposition, what happens?",
    options: [
      "Nothing — it stays in superposition",
      "It collapses to either |0⟩ or |1⟩ with certain probabilities",
      "It always gives |0⟩",
      "It teleports to another qubit"
    ],
    correct: 1,
    explanation: "Measurement causes 'wavefunction collapse' — the qubit commits to one definite state. The probability depends on the quantum amplitudes (α and β)."
  },
  {
    question: "Quantum entanglement means:",
    options: [
      "Two qubits are physically connected by a wire",
      "Two qubits are both in |0⟩",
      "Measuring one instantly determines the other, regardless of distance",
      "Qubits can time travel"
    ],
    correct: 2,
    explanation: "Entangled qubits share a quantum state — Einstein called it 'spooky action at a distance'. Measuring one instantly collapses the state of both!"
  },
  {
    question: "What makes quantum computers potentially faster than classical ones?",
    options: [
      "They use more transistors",
      "They run at higher temperatures",
      "They can explore many possibilities simultaneously via superposition",
      "They are connected to the internet"
    ],
    correct: 2,
    explanation: "Superposition lets quantum algorithms explore exponentially many states at once. A quantum computer with n qubits can represent 2ⁿ states simultaneously!"
  }
];

let quizState = {
  currentQ: 0,
  answers: [],
  answered: false
};

function renderQuiz(app) {
  quizState = { currentQ: 0, answers: [], answered: false };
  renderQuizQuestion(app);
}

function renderQuizQuestion(app) {
  const q = QUIZ_QUESTIONS[quizState.currentQ];
  const total = QUIZ_QUESTIONS.length;

  app.innerHTML = `
    ${buildStarsBg()}
    <div class="screen" style="padding-top:24px">
      <!-- Header -->
      <div style="background:rgba(20,27,45,0.9);backdrop-filter:blur(8px);border-bottom:1px solid rgba(124,92,255,0.1);padding:14px 24px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:10">
        <button class="btn btn-ghost btn-sm" onclick="navigate('/onboarding')">← Back</button>
        <div style="font-family:var(--font-heading);font-weight:600">Intermediate Quiz</div>
        <div class="badge badge-primary" style="margin-left:auto">${quizState.currentQ + 1} / ${total}</div>
      </div>

      <div class="quiz-screen">
        <!-- Schrö Thinking -->
        <div id="quiz-schro" style="margin-bottom:24px;display:flex;justify-content:center"></div>

        <!-- Progress Dots -->
        <div class="quiz-progress-dots">
          ${QUIZ_QUESTIONS.map((_, i) => `
            <div class="quiz-dot ${i < quizState.currentQ ? 'done' : i === quizState.currentQ ? 'active' : ''}"></div>
          `).join('')}
        </div>

        <!-- Question Card -->
        <div class="question-card">
          <div class="question-number">Question ${quizState.currentQ + 1} of ${total}</div>
          <div class="question-text">${q.question}</div>
        </div>

        <!-- Options -->
        <div class="quiz-options" id="quiz-opts">
          ${q.options.map((opt, i) => `
            <div class="quiz-option" id="qopt-${i}" onclick="selectAnswer(${i})">
              <div class="quiz-option-key">${['A','B','C','D'][i]}</div>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>

        <!-- Feedback (hidden initially) -->
        <div id="quiz-feedback" style="width:100%;display:none" class="animate-slide-up"></div>

        <!-- Hint -->
        <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="toggleChatDrawer()">
          💡 Ask Schrö for a hint
        </button>
      </div>
    </div>
  `;

  const schroEl = document.getElementById('quiz-schro');
  schroEl.appendChild(renderSchro('thinking', 120));
}

function selectAnswer(idx) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = QUIZ_QUESTIONS[quizState.currentQ];
  const correct = q.correct;
  const isCorrect = idx === correct;

  // Record answer
  quizState.answers.push({ selected: idx, correct: isCorrect });

  // Update option styles
  document.getElementById(`qopt-${idx}`)?.classList.add(isCorrect ? 'correct' : 'incorrect');
  if (!isCorrect) document.getElementById(`qopt-${correct}`)?.classList.add('correct');

  // Swap Schrö expression
  const schroEl = document.getElementById('quiz-schro');
  if (schroEl) {
    schroEl.innerHTML = '';
    schroEl.appendChild(renderSchro(isCorrect ? 'happy' : 'encouraging', 120));
  }

  // Show feedback
  const feedback = document.getElementById('quiz-feedback');
  if (feedback) {
    feedback.style.display = 'block';
    feedback.innerHTML = `
      <div class="card" style="border-color:${isCorrect ? 'var(--success)' : 'var(--primary)'};background:${isCorrect ? 'rgba(52,211,153,0.05)' : 'rgba(124,92,255,0.05)'};width:100%;margin-bottom:16px">
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">
          <span style="font-size:24px">${isCorrect ? '🌟' : '💜'}</span>
          <div>
            <strong style="color:${isCorrect ? 'var(--success)' : 'var(--primary)'}">
              ${isCorrect ? 'Purrfect! 🎉' : 'Almost! Here\'s why...'}
            </strong>
            <p class="text-muted text-sm" style="margin-top:4px">${q.explanation}</p>
          </div>
        </div>
        <button class="btn btn-primary btn-md w-full" onclick="nextQuestion()">
          ${quizState.currentQ < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results 🎊'}
        </button>
      </div>
    `;
  }
}

function nextQuestion() {
  const app = document.getElementById('app');
  quizState.currentQ++;
  quizState.answered = false;

  if (quizState.currentQ < QUIZ_QUESTIONS.length) {
    renderQuizQuestion(app);
  } else {
    renderQuizResults(app);
  }
}

function renderQuizResults(app) {
  const correct = quizState.answers.filter(a => a.correct).length;
  const total = QUIZ_QUESTIONS.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct > 50;
  const strong = pct >= 80;

  app.innerHTML = `
    ${buildStarsBg()}
    <div class="results-layout">
      <div id="results-schro" style="margin-bottom:24px"></div>

      ${passed ? `<div style="font-size:48px;margin-bottom:16px;animation:starPop 0.5s ease">🎉</div>` : ''}

      <h1 class="glow-text" style="margin-bottom:8px">
        ${passed
          ? strong ? 'You\'re incredible! 🚀' : 'Intermediate Unlocked! 🎊'
          : 'Great Start! 💜'
        }
      </h1>

      <p class="text-muted" style="margin-bottom:32px;font-size:17px">
        ${passed
          ? strong
            ? 'You aced the advanced questions too — you might be ready for the deep end!'
            : `${correct}/${total} correct — you know your quantum stuff! Let's dive deeper.`
          : `${correct}/${total} correct — ${window.QP?.playerName || 'Explorer'}, you showed real curiosity! The Newbie track will build your foundation perfectly.`
        }
      </p>

      <!-- Score Card -->
      <div class="card" style="width:100%;max-width:400px;text-align:center;margin-bottom:32px;border-color:${passed ? 'var(--success)' : 'var(--primary)'}">
        <div style="font-size:56px;font-family:var(--font-heading);font-weight:700;color:${passed ? 'var(--success)' : 'var(--primary)'}">
          ${pct}%
        </div>
        <div class="text-muted">${correct} of ${total} questions correct</div>
        <div class="progress-track" style="margin-top:16px">
          <div class="progress-fill" id="result-prog" style="width:0%;background:${passed ? 'linear-gradient(90deg,var(--success),var(--accent))' : 'linear-gradient(90deg,var(--primary),var(--accent))'}"></div>
        </div>
      </div>

      <!-- Sandbox Preview (if passed) -->
      ${passed ? `
        <div class="card" style="width:100%;max-width:400px;border-color:rgba(34,211,238,0.3);background:rgba(34,211,238,0.05);margin-bottom:24px">
          <div style="display:flex;gap:12px;align-items:center">
            <span style="font-size:32px">⚗️</span>
            <div>
              <h4>Sandbox Access Unlocked!</h4>
              <p class="text-sm text-muted">Build real quantum circuits with Qiskit Aer</p>
            </div>
          </div>
          ${strong ? `
            <div class="card" style="margin-top:12px;background:rgba(124,92,255,0.1);border-color:var(--primary)">
              <p class="text-sm" style="margin-bottom:8px">🌟 You aced the advanced ones! Want to try the Advanced Sandbox?</p>
              <div style="display:flex;gap:8px">
                <button class="btn btn-secondary btn-sm" onclick="navigate('/coming-soon')">Try Advanced</button>
                <button class="btn btn-ghost btn-sm" onclick="navigate('/sandbox')">Standard Lab</button>
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- CTA Buttons -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
        ${passed ? `
          <button class="btn btn-primary btn-lg" onclick="navigate('/sandbox')">
            Go to Intermediate Dashboard 🚀
          </button>
        ` : `
          <button class="btn btn-primary btn-lg" onclick="navigate('/dashboard')">
            Start Newbie Journey 💜
          </button>
          <button class="btn btn-ghost btn-md" onclick="renderQuiz(document.getElementById('app'))">
            Try Again
          </button>
        `}
      </div>

      ${!passed ? `
        <p class="text-caption text-muted" style="margin-top:16px">
          Your progress has been saved! You'll be surprised how fast you learn with the right foundation. 🐾
        </p>
      ` : ''}
    </div>
  `;

  // Insert Schrö
  const el = document.getElementById('results-schro');
  if (el) el.appendChild(renderSchro(passed ? 'excited' : 'encouraging', 200));

  // Animate progress
  setTimeout(() => animateProgressBar('result-prog', 0, pct), 400);

  // Confetti if passed
  if (passed) {
    setTimeout(() => launchConfetti(80), 200);
  }
}
