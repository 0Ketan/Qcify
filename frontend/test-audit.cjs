/**
 * COMPREHENSIVE AUTOMATED AUDIT SUITE FOR QCIFY
 * Tests all application subsystems: Routing, State, Badges, Quizzes, SVG, APIs
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
    failures.push({ testName, details });
  }
}

// Setup Browser Environment Mocks
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};
global.sessionStorage = global.localStorage;
global.window = {
  localStorage: global.localStorage,
  sessionStorage: global.sessionStorage,
  location: { hash: '#/login' },
  history: { pushState: () => {} },
  scrollTo: () => {},
  dispatchEvent: () => {},
  addEventListener: () => {}
};
global.document = {
  getElementById: () => ({ classList: { add: () => {}, remove: () => {} }, style: {} }),
  createElement: () => ({ classList: { add: () => {}, remove: () => {} }, style: {}, appendChild: () => {} }),
  body: { appendChild: () => {} },
  addEventListener: () => {}
};
global.CustomEvent = class { constructor(type, opt) { this.type = type; this.detail = opt?.detail; } };

function loadScript(filePath) {
  const code = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  vm.runInThisContext(code);
}

// ---------------------------------------------------------------------
// TEST SUITE 1: BADGE ENGINE AUDIT
// ---------------------------------------------------------------------
console.log('\n==================================================');
console.log('TEST SUITE 1: BADGES ENGINE & PROGRESSION SYSTEM');
console.log('==================================================');

loadScript('js/badgeRenderer.js');
loadScript('js/badges.js');
loadScript('js/badgeQuizzes.js');

// Reset state
BadgesEngine.resetAll();

// 1.1 Verify topics configuration
assert(BadgesEngine.TOPICS.length === 10, '10 Topics configured in BadgesEngine');
assert(BadgesEngine.TOPICS.filter(t => !t.comingSoon).length === 2, 'Exactly 2 active topics (Topics 1 and 2)');
assert(BadgesEngine.TOPICS.filter(t => t.comingSoon).length === 8, 'Exactly 8 future expansion topics');

// 1.2 Verify all small badges in topic 1 and 2
const t1 = BadgesEngine.TOPICS[0];
const t2 = BadgesEngine.TOPICS[1];
assert(t1.smallBadges.length === 4, 'Topic 1 has 4 small badges');
assert(t2.smallBadges.length === 4, 'Topic 2 has 4 small badges');

// 1.3 Verify Initial Locked state
const initStats = BadgesEngine.getGlobalStats();
assert(initStats.totalEarned === 0, 'Initial total earned is 0');
assert(initStats.totalMastered === 0, 'Initial total mastered is 0');
assert(initStats.totalMain === 0, 'Initial main badges unlocked is 0');
assert(initStats.totalSuperior === 0, 'Initial superior badges is 0');

// 1.4 Failing normal quiz doesn't award badge
const fail1 = BadgesEngine.recordNormalQuiz('qubit', 1, 4); // 25% < 75%
assert(!fail1.success, 'Failing normal quiz returns success: false');
assert(!BadgesEngine.getBadgeProgress('qubit').earned, 'Failed badge remains locked');

// 1.5 Passing normal quiz awards badge and unlocks secret quiz
const pass1 = BadgesEngine.recordNormalQuiz('qubit', 3, 3); // 100%
assert(pass1.success, 'Passing normal quiz returns success: true');
assert(pass1.newlyEarned, 'Badge marked newlyEarned');
assert(pass1.secretQuizUnlocked, 'Secret quiz marked unlocked');
assert(BadgesEngine.getBadgeProgress('qubit').earned, 'Badge progress shows earned: true');
assert(!BadgesEngine.getBadgeProgress('qubit').mastered, 'Badge progress not yet mastered');

// 1.6 Failing secret quiz does NOT downgrade badge
const secFail = BadgesEngine.recordSecretQuiz('qubit', 1, 3); // 33% < 75%
assert(!secFail.success, 'Failing secret quiz returns success: false');
assert(BadgesEngine.getBadgeProgress('qubit').earned, 'Badge STILL has earned: true after secret failure');
assert(!BadgesEngine.getBadgeProgress('qubit').mastered, 'Badge not mastered after failed secret quiz');

// 1.7 Passing secret quiz upgrades badge to MASTERED
const secPass = BadgesEngine.recordSecretQuiz('qubit', 3, 3); // 100%
assert(secPass.success, 'Passing secret quiz returns success: true');
assert(secPass.newlyMastered, 'Badge marked newlyMastered');
assert(BadgesEngine.getBadgeProgress('qubit').mastered, 'Badge progress shows mastered: true');

// 1.8 Main badge unlock requires all 4 badges earned
BadgesEngine.recordNormalQuiz('superposition', 3, 3);
BadgesEngine.recordNormalQuiz('bloch-sphere', 3, 3);
assert(!BadgesEngine.getMainBadgeProgress('quantum-awakening').unlocked, 'Main badge still locked with 3/4 badges earned');

const fourthEarned = BadgesEngine.recordNormalQuiz('hilbert-space', 3, 3);
assert(fourthEarned.mainBadgeUnlocked, '4th badge earned unlocks Main Badge');
assert(BadgesEngine.getMainBadgeProgress('quantum-awakening').unlocked, 'Main badge status shows unlocked');
assert(!BadgesEngine.getMainBadgeProgress('quantum-awakening').superior, 'Main badge not yet superior');

// 1.9 Superior Main badge requires all 4 badges mastered
BadgesEngine.recordSecretQuiz('superposition', 3, 3);
BadgesEngine.recordSecretQuiz('bloch-sphere', 3, 3);
assert(!BadgesEngine.getMainBadgeProgress('quantum-awakening').superior, 'Main badge still not superior with 3/4 mastered');

const fourthMastered = BadgesEngine.recordSecretQuiz('hilbert-space', 3, 3);
assert(fourthMastered.mainBadgeSuperior, '4th badge mastered unlocks Superior Main Badge');
assert(BadgesEngine.getMainBadgeProgress('quantum-awakening').superior, 'Main badge status shows superior: true');

// 1.10 Order Invariance Test: Topic 2 completed in reverse order (circuits -> entanglement -> double-gates -> single-gates)
BadgesEngine.recordNormalQuiz('circuits', 3, 3);
BadgesEngine.recordNormalQuiz('entanglement', 3, 3);
BadgesEngine.recordNormalQuiz('double-gates', 3, 3);
assert(!BadgesEngine.getMainBadgeProgress('quantum-architect').unlocked, 'Topic 2 main badge locked before last badge');
const t2Main = BadgesEngine.recordNormalQuiz('single-gates', 3, 3);
assert(t2Main.mainBadgeUnlocked, 'Topic 2 main badge unlocks regardless of badge completion order');

// 1.11 Duplicate Submissions Safety
const dupRes = BadgesEngine.recordNormalQuiz('single-gates', 3, 3);
assert(dupRes.success, 'Duplicate passing quiz still returns success');
assert(!dupRes.newlyEarned, 'Duplicate passing quiz does NOT flag newlyEarned again');

// ---------------------------------------------------------------------
// TEST SUITE 2: QUIZ SYSTEM AUDIT
// ---------------------------------------------------------------------
console.log('\n==================================================');
console.log('TEST SUITE 2: QUIZ REPOSITORY & GENERATOR');
console.log('==================================================');

// 2.1 Verify all 8 badges have both normal and secret quizzes with >= 3 questions each
const allSmallBadgeIds = ['qubit', 'superposition', 'bloch-sphere', 'hilbert-space', 'single-gates', 'double-gates', 'entanglement', 'circuits'];
allSmallBadgeIds.forEach(id => {
  const norm = BadgeQuizzes.getQuiz(id, 'normal');
  const sec = BadgeQuizzes.getQuiz(id, 'secret');
  assert(norm && norm.questions.length >= 3, `Badge ${id} has normal quiz with >=3 questions`);
  assert(sec && sec.questions.length >= 3, `Badge ${id} has secret quiz with >=3 questions`);
  norm.questions.forEach((q, idx) => {
    assert(q.options.length >= 4, `Normal quiz ${id} Q${idx+1} has 4 options`);
    assert(q.correct >= 0 && q.correct < q.options.length, `Normal quiz ${id} Q${idx+1} has valid correct answer index`);
    assert(typeof q.explanation === 'string' && q.explanation.length > 10, `Normal quiz ${id} Q${idx+1} has explanation`);
  });
  sec.questions.forEach((q, idx) => {
    assert(q.options.length >= 4, `Secret quiz ${id} Q${idx+1} has 4 options`);
    assert(q.correct >= 0 && q.correct < q.options.length, `Secret quiz ${id} Q${idx+1} has valid correct answer index`);
    assert(typeof q.explanation === 'string' && q.explanation.length > 10, `Secret quiz ${id} Q${idx+1} has explanation`);
  });
});

// 2.2 Test quiz screen question generator: sliding window rule
loadScript('js/screens/quiz.js');
for (let run = 1; run <= 10; run++) {
  const generated = generateQuizQuestions();
  assert(generated.length === 8, `Run ${run}: Generated quiz contains 8 questions`);
  
  // Check sliding windows of size 6: [0..5], [1..6], [2..7]
  for (let w = 0; w <= 2; w++) {
    const windowQuestions = generated.slice(w, w + 6);
    const hardCount = windowQuestions.filter(q => q.level === 'hard').length;
    assert(hardCount === 2, `Run ${run} Window [${w}..${w+5}]: Contains exactly 2 hard questions (got ${hardCount})`);
  }
}

// ---------------------------------------------------------------------
// TEST SUITE 3: SVG BADGE RENDERING AUDIT
// ---------------------------------------------------------------------
console.log('\n==================================================');
console.log('TEST SUITE 3: PROCEDURAL SVG BADGE RENDERING');
console.log('==================================================');

allSmallBadgeIds.forEach(id => {
  ['locked', 'earned', 'mastered'].forEach(tier => {
    const svg = BadgeRenderer.renderSmall(id, tier, 80).trim();
    assert(svg.startsWith('<svg') && svg.endsWith('</svg>'), `Small Badge ${id} (${tier}) renders valid root SVG tags`);
    assert(svg.includes(`data-badge-id="${id}"`), `Small Badge ${id} (${tier}) includes data-badge-id`);
    assert(svg.includes(`data-tier="${tier}"`), `Small Badge ${id} (${tier}) includes data-tier`);
  });
});

['quantum-awakening', 'quantum-architect'].forEach(mainId => {
  ['locked', 'earned', 'superior'].forEach(tier => {
    const svg = BadgeRenderer.renderMain(mainId, tier, 140).trim();
    assert(svg.startsWith('<svg') && svg.endsWith('</svg>'), `Main Badge ${mainId} (${tier}) renders valid root SVG tags`);
    assert(svg.includes('is-main-badge'), `Main Badge ${mainId} (${tier}) includes is-main-badge class`);
  });
});

// ---------------------------------------------------------------------
// TEST SUITE 4: BACKEND FASTAPI & QISKIT RUNNER AUDIT
// ---------------------------------------------------------------------
console.log('\n==================================================');
console.log('TEST SUITE 4: BACKEND API ENDPOINTS & QUANTUM SIMULATOR');
console.log('==================================================');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch(e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    req.end();
  });
}

async function runApiTests() {
  try {
    // 4.1 Health Check
    const health = await request({ host: '127.0.0.1', port: 8000, path: '/health', method: 'GET' });
    assert(health.statusCode === 200, 'GET /health returns HTTP 200');
    assert(health.body.status === 'healthy', 'Health check status is healthy');

    // 4.2 Mascot Status
    const mascot = await request({ host: '127.0.0.1', port: 8000, path: '/api/mascot/status', method: 'GET' });
    assert(mascot.statusCode === 200, 'GET /api/mascot/status returns HTTP 200');
    assert(mascot.body.name === 'Schrö', 'Mascot name is Schrö');

    // 4.3 Mascot Hints
    const hints = await request({ host: '127.0.0.1', port: 8000, path: '/api/mascot/hints/superposition?step=1', method: 'GET' });
    assert(hints.statusCode === 200, 'GET /api/mascot/hints/superposition returns HTTP 200');
    assert(typeof hints.body.hint === 'string', 'Hint response contains string hint');

    // 4.4 Mascot Chat (offline fallback)
    const chat = await request({
      host: '127.0.0.1',
      port: 8000,
      path: '/api/mascot/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { message: 'What is superposition?', context: 'lesson' });
    assert(chat.statusCode === 200, 'POST /api/mascot/chat returns HTTP 200');
    assert(chat.body.reply.length > 20, 'Schrö reply is pedagogical and descriptive');

    // 4.5 Circuit Simulation: Single Qubit Hadamard (Superposition)
    const simH = await request({
      host: '127.0.0.1',
      port: 8000,
      path: '/api/circuit/simulate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      num_qubits: 1,
      gates: [{ name: 'H', target: 0, step: 0 }],
      shots: 1000
    });
    assert(simH.statusCode === 200, 'POST /api/circuit/simulate (H gate) returns HTTP 200');
    assert(simH.body.probabilities['0'] === 0.5 && simH.body.probabilities['1'] === 0.5, 'Hadamard produces exact 50/50 probabilities (0.5 / 0.5)');
    assert(simH.body.bloch_vectors && simH.body.bloch_vectors.length === 1, 'Bloch vector returned for qubit 0');

    // 4.6 Circuit Simulation: Pauli-X Deterministic Bit Flip
    const simX = await request({
      host: '127.0.0.1',
      port: 8000,
      path: '/api/circuit/simulate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      num_qubits: 1,
      gates: [{ name: 'X', target: 0, step: 0 }],
      shots: 1000
    });
    assert(simX.statusCode === 200, 'POST /api/circuit/simulate (X gate) returns HTTP 200');
    assert(simX.body.probabilities['1'] === 1.0, 'Pauli-X produces deterministic 100% |1⟩');

    // 4.7 Circuit Simulation: 2-Qubit Bell State |Φ⁺⟩ (H on q0 + CNOT q0->q1)
    const simBell = await request({
      host: '127.0.0.1',
      port: 8000,
      path: '/api/circuit/simulate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      num_qubits: 2,
      gates: [
        { name: 'H', target: 0, step: 0 },
        { name: 'CNOT', target: 1, control: 0, step: 1 }
      ],
      shots: 1000
    });
    assert(simBell.statusCode === 200, 'POST /api/circuit/simulate (Bell State) returns HTTP 200');
    assert(simBell.body.probabilities['00'] === 0.5 && simBell.body.probabilities['11'] === 0.5, 'Bell State yields 50% |00⟩ and 50% |11⟩ entangled correlation');
    assert(!simBell.body.probabilities['01'] && !simBell.body.probabilities['10'], 'Bell State has 0% probability for |01⟩ and |10⟩');

    // 4.8 Preset Circuits
    const preset = await request({ host: '127.0.0.1', port: 8000, path: '/api/circuit/presets/bell_state', method: 'GET' });
    assert(preset.statusCode === 200, 'GET /api/circuit/presets/bell_state returns HTTP 200');
    assert(preset.body.num_qubits === 2, 'Bell state preset has 2 qubits');

  } catch(err) {
    assert(false, 'API Endpoints Test Execution', err.message);
  }

  // =====================================================================
  // TEST SUITE 5: QUANTUM CURRICULUM LESSONS 0-3 AUDIT
  // =====================================================================
  console.log('\n==================================================');
  console.log('TEST SUITE 5: QUANTUM LEARNING CURRICULUM (LESSONS 0–3)');
  console.log('==================================================');

  try {
    global.buildStarsBg = () => '<div class="stars"></div>';
    global.navigate = (p, opt) => {};
    global.showToast = (msg, type) => {};

    loadScript('js/screens/lesson.js');
    loadScript('js/screens/sandbox.js');

    // 5.1 Curriculum Registry
    assert(typeof CURRICULUM_LESSONS !== 'undefined', 'CURRICULUM_LESSONS defined');
    assert(CURRICULUM_LESSONS.length === 4, 'Exactly 4 curriculum lessons registered (Lessons 0, 1, 2, 3)');
    assert(CURRICULUM_LESSONS[0].title === 'What, Why, and How is Quantum', 'Lesson 0 title matches specification');
    assert(CURRICULUM_LESSONS[0].steps.length === 4, 'Lesson 0 contains 4 structured steps (How, Feel It, Why, Quiz)');
    assert(CURRICULUM_LESSONS[1].title === 'Transition from Classical to Quantum', 'Lesson 1 title matches specification');
    assert(CURRICULUM_LESSONS[1].steps.length === 5, 'Lesson 1 contains 5 structured steps (Bit vs Qubit, Math, Bloch Sphere, Hilbert, Quiz)');
    assert(CURRICULUM_LESSONS[2].title === 'Quantum Gates, Circuits & Entanglement', 'Lesson 2 title matches specification');
    assert(CURRICULUM_LESSONS[2].steps.length === 4, 'Lesson 2 contains 4 structured steps (Gates, Circuits, Entanglement, Quiz)');
    assert(CURRICULUM_LESSONS[3].title === 'Practice Lab: From Visual Composer to Code', 'Lesson 3 title matches specification');
    assert(CURRICULUM_LESSONS[3].steps.length === 5, 'Lesson 3 contains 5 structured steps (Mission, Visual Code, Anatomy, Challenge, Ceremony)');

    // 5.2 Progression State Transitions
    localStorage.clear();
    sessionStorage.clear();
    assert(CurriculumProgress.isUnlocked(0) === true, 'Lesson 0 is unlocked by default for new learner');
    assert(CurriculumProgress.isUnlocked(1) === false, 'Lesson 1 is initially locked for new learner');
    assert(CurriculumProgress.isUnlocked(2) === false, 'Lesson 2 is initially locked');
    assert(CurriculumProgress.isUnlocked(3) === false, 'Lesson 3 is initially locked');

    // Progress through Lesson 0
    CurriculumProgress.completeLesson(0);
    assert(CurriculumProgress.isCompleted(0) === true, 'Lesson 0 marked as completed');
    assert(CurriculumProgress.isUnlocked(1) === true, 'Lesson 1 is now unlocked after completing Lesson 0');
    assert(sessionStorage.getItem('qp_progress') === '25', 'Curriculum progress updated to 25%');

    // Progress through Lesson 1
    CurriculumProgress.completeLesson(1);
    assert(CurriculumProgress.isCompleted(1) === true, 'Lesson 1 marked as completed');
    assert(CurriculumProgress.isUnlocked(2) === true, 'Lesson 2 is now unlocked after completing Lesson 1');
    assert(sessionStorage.getItem('qp_progress') === '50', 'Curriculum progress updated to 50%');

    // Progress through Lesson 2
    CurriculumProgress.completeLesson(2);
    assert(CurriculumProgress.isCompleted(2) === true, 'Lesson 2 marked as completed');
    assert(CurriculumProgress.isUnlocked(3) === true, 'Lesson 3 is now unlocked after completing Lesson 2');
    assert(sessionStorage.getItem('qp_progress') === '75', 'Curriculum progress updated to 75%');

    // Progress through Lesson 3 (Graduation!)
    CurriculumProgress.completeLesson(3);
    assert(CurriculumProgress.isCompleted(3) === true, 'Lesson 3 marked as completed');
    assert(CurriculumProgress.getState().userLevel === 'intermediate', 'Learner successfully promoted to INTERMEDIATE level');
    assert(sessionStorage.getItem('qp_user_level') === 'intermediate', 'Intermediate status persisted in sessionStorage');
    assert(sessionStorage.getItem('qp_progress') === '100', 'Curriculum progress reaches 100%');

    // 5.3 Live Qiskit Code Generation
    const sampleGates = [
      { gate: 'H', qubit: 0 },
      { gate: 'CNOT', qubit: 0 }
    ];
    const generatedCode = generateQiskitCode(sampleGates);
    assert(generatedCode.includes('from qiskit import QuantumCircuit'), 'Generated Qiskit code imports QuantumCircuit');
    assert(generatedCode.includes('qc = QuantumCircuit(2, 2)'), 'Generated code initializes 2-qubit register');
    assert(generatedCode.includes('qc.h(0)'), 'Generated code contains Hadamard call qc.h(0)');
    assert(generatedCode.includes('qc.cx(0, 1)'), 'Generated code contains CNOT call qc.cx(0, 1)');
    assert(generatedCode.includes('qc.measure([0, 1], [0, 1])'), 'Generated code measures quantum states');

    // 5.4 Sandbox Qiskit Code Generator
    const sandboxCode = generateSandboxQiskitCode(['H', 'X', 'CNOT']);
    assert(sandboxCode.includes('qc.h(0)'), 'Sandbox code generator handles H gate');
    assert(sandboxCode.includes('qc.x(0)'), 'Sandbox code generator handles X gate');
    assert(sandboxCode.includes('qc.cx(0, 1)'), 'Sandbox code generator handles CNOT gate');

    // 5.5 Rendering safety across all lessons and steps
    const mockApp = { innerHTML: '' };
    [0, 1, 2, 3].forEach(lesId => {
      renderLesson(mockApp, { id: lesId, step: 0 });
      assert(mockApp.innerHTML.length > 50, `Lesson ${lesId} Step 0 renders markup without crashing`);
    });

  } catch(err) {
    assert(false, 'Curriculum Lessons Test Execution', err.message);
  }

  // Final Summary
  console.log('\n==================================================');
  console.log(`AUDIT TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  if (failedTests > 0) {
    console.error(`FAILED TESTS: ${failedTests}`);
    failures.forEach(f => console.error(`  - ${f.testName}: ${f.details}`));
  } else {
    console.log('🎉 ALL AUTOMATED TESTS PASSED CLEANLY!');
  }
  console.log('==================================================\n');
}

runApiTests();
