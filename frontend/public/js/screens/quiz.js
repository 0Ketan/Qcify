/**
 * Qcify — Gateway & Intermediate Quiz Screen
 * Dynamic 8-question generator from 16-question pool (10 Normal, 6 Hard)
 * Ensures every 6-question window contains exactly 2 hard questions.
 */

const NORMAL_QUESTIONS = [
  {
    id: 1,
    level: "normal",
    question: "A qubit is in the state |ψ⟩ = (|0⟩ + |1⟩)/√2. What is the probability of measuring |1⟩?",
    options: ["0%", "25%", "50%", "100%"],
    correct: 2,
    explanation: "Probability is the squared magnitude of the amplitude: (1/√2)² = 1/2 = 50%."
  },
  {
    id: 2,
    level: "normal",
    question: "What is the primary purpose of the Hadamard (H) gate?",
    options: ["Flip |0⟩ to |1⟩", "Create superposition", "Measure a qubit", "Remove entanglement"],
    correct: 1,
    explanation: "H transforms |0⟩ into (|0⟩ + |1⟩)/√2, creating an equal superposition."
  },
  {
    id: 3,
    level: "normal",
    question: "Which gate performs a phase flip?",
    options: ["X gate", "Y gate", "Z gate", "H gate"],
    correct: 2,
    explanation: "The Pauli-Z gate performs |0⟩ → |0⟩ and |1⟩ → −|1⟩."
  },
  {
    id: 4,
    level: "normal",
    question: "Starting with |00⟩, an H gate is applied to qubit 1, followed by a CNOT where qubit 1 is the control and qubit 2 is the target. What is the resulting state?",
    options: ["|00⟩", "(|00⟩ + |11⟩)/√2", "(|01⟩ + |10⟩)/√2", "|11⟩"],
    correct: 1,
    explanation: "H creates superposition on the first qubit, and CNOT correlates the two qubits, producing the Bell state |Φ⁺⟩."
  },
  {
    id: 5,
    level: "normal",
    question: "Which of the following is a fundamental requirement for a valid quantum gate?",
    options: ["It must be irreversible", "It must be nonlinear", "It must be unitary", "It must involve measurement"],
    correct: 2,
    explanation: "Quantum gates are represented by unitary operators, preserving the normalization of quantum states."
  },
  {
    id: 6,
    level: "normal",
    question: "What happens when a qubit in a superposition is measured in the computational basis?",
    options: ["It remains in superposition", "It collapses to a basis state", "It automatically becomes entangled", "It is destroyed"],
    correct: 1,
    explanation: "Measurement produces one of the computational-basis states, |0⟩ or |1⟩, according to their probabilities."
  },
  {
    id: 7,
    level: "normal",
    question: "Which statement best describes quantum entanglement?",
    options: [
      "Two qubits always have identical values",
      "Two quantum systems can have correlations that cannot be described as independent states",
      "Entangled qubits cannot be measured",
      "Entanglement is the same as classical correlation"
    ],
    correct: 1,
    explanation: "An entangled system cannot generally be represented as independent quantum states of its individual qubits."
  },
  {
    id: 8,
    level: "normal",
    question: "Which gate is commonly used to create entanglement when combined with a Hadamard gate?",
    options: ["X gate", "CNOT gate", "Z gate", "T gate"],
    correct: 1,
    explanation: "H creates superposition and CNOT can correlate the qubits, producing an entangled Bell state."
  },
  {
    id: 9,
    level: "normal",
    question: "Why is interference important in quantum algorithms?",
    options: [
      "It converts qubits into classical bits",
      "It can amplify desired amplitudes and suppress unwanted ones",
      "It eliminates measurement",
      "It makes all calculations deterministic"
    ],
    correct: 1,
    explanation: "Quantum algorithms exploit constructive and destructive interference to increase the probability of useful outcomes."
  },
  {
    id: 10,
    level: "normal",
    question: "A qubit is in the state |ψ⟩ = √3/2|0⟩ + 1/2|1⟩. What is the probability of measuring |1⟩?",
    options: ["1/2", "1/4", "3/4", "√3/2"],
    correct: 1,
    explanation: "P(1) = |1/2|² = 1/4 = 25%."
  }
];

const HARD_QUESTIONS = [
  {
    id: 11,
    level: "hard",
    question: "A quantum state is given by |ψ⟩ = (|0⟩ + i|1⟩)/√2. What is the probability of measuring |0⟩?",
    options: ["0", "1/4", "1/2", "1"],
    correct: 2,
    explanation: "The amplitude of |0⟩ is 1/√2, so its probability is |1/√2|² = 1/2. The i affects phase, not probability."
  },
  {
    id: 12,
    level: "hard",
    question: "Consider the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. If the first qubit is measured and the result is 1, what happens to the second qubit?",
    options: ["It must be 0", "It must be 1", "It remains randomly 0 or 1", "It becomes |+⟩"],
    correct: 1,
    explanation: "In this Bell state, measurements of both qubits in the computational basis are perfectly correlated."
  },
  {
    id: 13,
    level: "hard",
    question: "Which statement about global phase is correct?",
    options: [
      "|ψ⟩ and e^{iφ}|ψ⟩ always produce different measurement probabilities",
      "A global phase changes the physical state",
      "A global phase has no observable effect on an isolated quantum state",
      "A global phase destroys superposition"
    ],
    correct: 2,
    explanation: "Multiplying the entire state by the same phase factor does not change observable measurement probabilities."
  },
  {
    id: 14,
    level: "hard",
    question: "Grover's algorithm searches an unstructured database containing N items. Approximately how many oracle queries are required for a high probability of finding the marked item?",
    options: ["O(log N)", "O(N)", "O(√N)", "O(N²)"],
    correct: 2,
    explanation: "Grover's algorithm provides a quadratic speedup, reducing the search complexity from approximately O(N) to O(√N)."
  },
  {
    id: 15,
    level: "hard",
    question: "A qubit starts in |0⟩. An H gate is applied twice. What is the final state?",
    options: ["|0⟩", "|1⟩", "(|0⟩ + |1⟩)/√2", "A mixed state"],
    correct: 0,
    explanation: "The Hadamard gate is self-inverse: H² = I. Therefore, applying H twice returns the original state: |0⟩."
  },
  {
    id: 16,
    level: "hard",
    question: "Consider the quantum state:\n\n|ψ⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2\n\nWhich statement is correct?",
    options: [
      "The state is entangled",
      "The state can be written as |+⟩ ⊗ |+⟩ and is therefore separable",
      "The state represents only |11⟩",
      "The state cannot be normalized"
    ],
    correct: 1,
    explanation: "Since |+⟩ = (|0⟩ + |1⟩)/√2, |+⟩ ⊗ |+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2. Therefore, the state is separable, not entangled."
  }
];

let quizQuestions = [];
let quizState = {
  currentQ: 0,
  answers: [],
  answered: false
};

/**
 * Generates 8 questions dynamically:
 * - 6 Hard questions pool + 10 Normal questions pool
 * - Shuffled on every quiz run
 * - Enforces that every 6-question window contains exactly 2 hard questions
 */
function generateQuizQuestions() {
  const shuffledNormal = [...NORMAL_QUESTIONS].sort(() => Math.random() - 0.5);
  const shuffledHard = [...HARD_QUESTIONS].sort(() => Math.random() - 0.5);

  const isHard = new Array(8).fill(false);

  // Pick 2 random distinct positions in the first 6 slots (0..5)
  const slots = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5).slice(0, 2);
  slots.forEach(idx => isHard[idx] = true);

  // Maintain periodic boundary so any 6-question sliding window [0..5], [1..6], [2..7] has exactly 2 hard questions
  isHard[6] = isHard[0];
  isHard[7] = isHard[1];

  let normalIdx = 0;
  let hardIdx = 0;
  const selected = [];

  for (let i = 0; i < 8; i++) {
    if (isHard[i]) {
      selected.push({ ...shuffledHard[hardIdx++] });
    } else {
      selected.push({ ...shuffledNormal[normalIdx++] });
    }
  }

  return selected;
}

function renderQuiz(app) {
  quizQuestions = generateQuizQuestions();
  quizState = { currentQ: 0, answers: [], answered: false };
  renderQuizQuestion(app);
}

function renderQuizQuestion(app) {
  const q = quizQuestions[quizState.currentQ];
  const total = quizQuestions.length;
  const isHard = q.level === 'hard';

  app.innerHTML = `
    ${buildStarsBg()}
    <div class="screen" style="padding-top:24px">
      <!-- Header -->
      <div style="background:rgba(20,27,45,0.9);backdrop-filter:blur(8px);border-bottom:1px solid rgba(124,92,255,0.1);padding:14px 24px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:10">
        <button class="btn btn-ghost btn-sm" onclick="navigate('/onboarding')">← Back</button>
        <div style="font-family:var(--font-heading);font-weight:600">Intermediate Gateway Quiz</div>
        <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
          ${isHard 
            ? `<span class="badge" style="background:rgba(239,68,68,0.15);color:#F87171;border:1px solid rgba(239,68,68,0.3);font-size:11px">🔴 Hard Challenge</span>` 
            : `<span class="badge" style="background:rgba(52,211,153,0.12);color:#34D399;border:1px solid rgba(52,211,153,0.25);font-size:11px">🟢 Intermediate</span>`
          }
          <div class="badge badge-primary font-code">${quizState.currentQ + 1} / ${total}</div>
        </div>
      </div>

      <div class="quiz-screen">
        <!-- Schrö Thinking -->
        <div id="quiz-schro" style="margin-bottom:24px;display:flex;justify-content:center"></div>

        <!-- Progress Dots (8 questions) -->
        <div class="quiz-progress-dots">
          ${quizQuestions.map((_, i) => `
            <div class="quiz-dot ${i < quizState.currentQ ? 'done' : i === quizState.currentQ ? 'active' : ''}"></div>
          `).join('')}
        </div>

        <!-- Question Card -->
        <div class="question-card" style="border-left: 3px solid ${isHard ? '#EF4444' : 'var(--primary)'}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div class="question-number">Question ${quizState.currentQ + 1} of ${total}</div>
            <div style="font-size:11px;font-family:var(--font-code);color:var(--text-muted)">
              ${isHard ? 'Hard Level' : 'Intermediate Level'}
            </div>
          </div>
          <div class="question-text" style="white-space:pre-line">${q.question}</div>
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
  if (schroEl) {
    schroEl.appendChild(renderSchro('thinking', 120));
  }
}

function selectAnswer(idx) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizQuestions[quizState.currentQ];
  const correct = q.correct;
  const isCorrect = idx === correct;

  // Record answer
  quizState.answers.push({ selected: idx, correct: isCorrect, level: q.level });

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
          ${quizState.currentQ < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎊'}
        </button>
      </div>
    `;
  }
}

function nextQuestion() {
  const app = document.getElementById('app');
  quizState.currentQ++;
  quizState.answered = false;

  if (quizState.currentQ < quizQuestions.length) {
    renderQuizQuestion(app);
  } else {
    renderQuizResults(app);
  }
}

function renderQuizResults(app) {
  const correct = quizState.answers.filter(a => a.correct).length;
  const total = quizQuestions.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 60; // 5 out of 8 is 62.5%
  const strong = pct >= 80; // 7 out of 8 is 87.5%

  if (passed) {
    if (window.QP) window.QP.track = 'intermediate';
    sessionStorage.setItem('qp_track', 'intermediate');
  }

  app.innerHTML = `
    ${buildStarsBg()}
    <div class="results-layout">
      <div id="results-schro" style="margin-bottom:24px"></div>

      ${passed ? `<div style="font-size:48px;margin-bottom:16px;animation:starPop 0.5s ease">🎉</div>` : ''}

      <h1 class="glow-text" style="margin-bottom:8px">
        ${passed
          ? strong ? 'Quantum Mastery! 🚀' : 'Intermediate Track Unlocked! 🎊'
          : 'Great Effort! 💜'
        }
      </h1>

      <p class="text-muted" style="margin-bottom:32px;font-size:17px">
        ${passed
          ? strong
            ? `Spectacular! You scored ${correct}/${total} (${pct}%), mastering both core and challenge problems. You're ready for advanced circuits!`
            : `Awesome job! You scored ${correct}/${total} (${pct}%) and qualified for the Intermediate Track!`
          : `You scored ${correct}/${total} (${pct}%). ${window.QP?.playerName || 'Scientist'}, quantum mechanics takes practice! Let's build your foundation in Newbie mode.`
        }
      </p>

      <!-- Score Card -->
      <div class="card" style="width:100%;max-width:400px;text-align:center;margin-bottom:32px;border-color:${passed ? 'var(--success)' : 'var(--primary)'}">
        <div style="font-size:56px;font-family:var(--font-heading);font-weight:700;color:${passed ? 'var(--success)' : 'var(--primary)'}">
          ${pct}%
        </div>
        <div class="text-muted text-sm" style="margin-top:4px">${correct} of ${total} Questions Correct</div>
        <div style="margin-top:16px;display:flex;justify-content:center;gap:8px">
          <span class="badge ${passed ? 'badge-success' : 'badge-primary'}">
            ${passed ? '✓ PASSED GATEWAY' : 'NEEDS PRACTICE'}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
        ${passed ? `
          <button class="btn btn-primary btn-lg" onclick="navigate('/dashboard')">
            Enter Intermediate Lab →
          </button>
          <button class="btn btn-secondary btn-md" onclick="navigate('/sandbox')">
            Open Circuit Sandbox ⚗️
          </button>
        ` : `
          <button class="btn btn-primary btn-lg" onclick="renderQuiz(document.getElementById('app'))">
            🔄 Retake Quiz (New Questions)
          </button>
          <button class="btn btn-secondary btn-md" onclick="navigate('/dashboard')">
            Start as Newbie →
          </button>
        `}
      </div>
    </div>
  `;

  // Insert Schrö
  const schroEl = document.getElementById('results-schro');
  if (schroEl) {
    schroEl.appendChild(renderSchro(passed ? 'excited' : 'encouraging', 140));
  }

  // Toast
  if (passed) {
    setTimeout(() => showToast('Intermediate Track Unlocked! 🏆', 'reward'), 400);
  }
}
