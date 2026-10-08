/**
 * Qcify — Scalable Quantum Learning Badge Engine
 * 
 * Handles:
 * - Data model for 10 major quantum computing topics
 * - Progression state persistence (localStorage / sessionStorage)
 * - Automatic unlocks:
 *   - Normal Quiz pass -> Small Badge EARNED + Secret Quiz unlocked
 *   - Secret Quiz pass -> Small Badge MASTERED
 *   - All 4 Small Badges Earned -> Main Badge UNLOCKED
 *   - All 4 Small Badges Mastered -> Main Badge SUPERIOR
 * - Custom events & event emitter for UI reactive updates
 */

const BadgesEngine = (function () {
  const STORAGE_KEY = 'Qcify_badges_v2';

  // 10 Major Quantum Computing Topics Definition
  const TOPICS = [
    {
      id: 'topic-01',
      number: 1,
      name: 'Transition from Classical to Quantum',
      tagline: 'Bridging deterministic bits to complex quantum amplitudes',
      description: 'Journey from binary transistors into the probabilistic geometry of state vectors and Hilbert spaces.',
      mainBadge: {
        id: 'quantum-awakening',
        name: 'Quantum Awakening',
        superiorName: 'Quantum Awakening (Superior)',
        description: 'Mastered the foundational transition from classical bits to the multidimensional quantum realm.',
        concept: 'Classical binary 0/1 transforming into radiant quantum state vectors'
      },
      smallBadges: [
        {
          id: 'qubit',
          name: 'Qubit',
          concept: 'The fundamental two-level quantum system |0⟩ and |1⟩',
          normalQuizId: 'quiz-qubit-normal',
          secretQuizId: 'quiz-qubit-secret',
          iconSymbol: '⚛️'
        },
        {
          id: 'superposition',
          name: 'Superposition',
          concept: 'Linear combination of basis states existing before measurement',
          normalQuizId: 'quiz-superposition-normal',
          secretQuizId: 'quiz-superposition-secret',
          iconSymbol: '🌊'
        },
        {
          id: 'bloch-sphere',
          name: 'Bloch Sphere',
          concept: 'Geometric representation of pure qubit states on a unit sphere',
          normalQuizId: 'quiz-bloch-normal',
          secretQuizId: 'quiz-bloch-secret',
          iconSymbol: '🌐'
        },
        {
          id: 'hilbert-space',
          name: 'Hilbert Space',
          concept: 'Complete complex inner product vector space ℋ = ℂ²',
          normalQuizId: 'quiz-hilbert-normal',
          secretQuizId: 'quiz-hilbert-secret',
          iconSymbol: '📐'
        }
      ]
    },
    {
      id: 'topic-02',
      number: 2,
      name: 'Working with Qubits',
      tagline: 'Manipulating quantum states with unitary transformations',
      description: 'Harness single-qubit rotations, multi-qubit entangling gates, and multi-wire circuit diagrams.',
      mainBadge: {
        id: 'quantum-architect',
        name: 'Quantum Architect',
        superiorName: 'Quantum Architect (Superior)',
        description: 'Constructed coherent quantum programs, multi-qubit entanglements, and computational circuits.',
        concept: 'Sophisticated quantum circuit forming an architectural structure around a central quantum core'
      },
      smallBadges: [
        {
          id: 'single-gates',
          name: 'Single Gates',
          concept: 'Unitary single-qubit transformations (Pauli X, Y, Z and Hadamard H)',
          normalQuizId: 'quiz-single-gates-normal',
          secretQuizId: 'quiz-single-gates-secret',
          iconSymbol: '🔲'
        },
        {
          id: 'double-gates',
          name: 'Double Gates',
          concept: 'Controlled two-qubit operations (CNOT, CZ, SWAP)',
          normalQuizId: 'quiz-double-gates-normal',
          secretQuizId: 'quiz-double-gates-secret',
          iconSymbol: '🔗'
        },
        {
          id: 'entanglement',
          name: 'Entanglement',
          concept: 'Non-local quantum correlations and Bell state generation',
          normalQuizId: 'quiz-entanglement-normal',
          secretQuizId: 'quiz-entanglement-secret',
          iconSymbol: '⚡'
        },
        {
          id: 'circuits',
          name: 'Circuits',
          concept: 'Orchestrating multi-qubit register algorithms and projective measurements',
          normalQuizId: 'quiz-circuits-normal',
          secretQuizId: 'quiz-circuits-secret',
          iconSymbol: '⚗️'
        }
      ]
    },
    // Blueprint for future topics 3 to 10 (Scalable Data Model)
    {
      id: 'topic-03',
      number: 3,
      name: 'Quantum Algorithms',
      comingSoon: true,
      tagline: 'Oracles and exponential speedups',
      mainBadge: { id: 'quantum-strategist', name: 'Quantum Strategist', superiorName: 'Quantum Strategist (Superior)' },
      smallBadges: [
        { id: 'deutsch-jozsa', name: 'Deutsch-Jozsa' },
        { id: 'bernstein-vazirani', name: 'Bernstein-Vazirani' },
        { id: 'simons-algo', name: "Simon's Algorithm" },
        { id: 'qft', name: 'Quantum Fourier Transform' }
      ]
    },
    {
      id: 'topic-04',
      number: 4,
      name: 'Quantum Search & Optimization',
      comingSoon: true,
      tagline: 'Quadratic speedups and combinatorial solutions',
      mainBadge: { id: 'quantum-explorer', name: 'Quantum Explorer', superiorName: 'Quantum Explorer (Superior)' },
      smallBadges: [
        { id: 'grover', name: 'Grover Search' },
        { id: 'qpe', name: 'Phase Estimation' },
        { id: 'amplitude-amp', name: 'Amplitude Amplification' },
        { id: 'qaoa', name: 'QAOA' }
      ]
    },
    {
      id: 'topic-05',
      number: 5,
      name: 'Quantum Hardware & Modalities',
      comingSoon: true,
      tagline: 'Physical realizations of cryogenic qubits',
      mainBadge: { id: 'hardware-pioneer', name: 'Hardware Pioneer', superiorName: 'Hardware Pioneer (Superior)' },
      smallBadges: [
        { id: 'transmons', name: 'Superconducting Transmons' },
        { id: 'trapped-ions', name: 'Trapped Ions' },
        { id: 'neutral-atoms', name: 'Neutral Atoms' },
        { id: 'photonic', name: 'Photonic Qubits' }
      ]
    },
    {
      id: 'topic-06',
      number: 6,
      name: 'Quantum Noise & Decoherence',
      comingSoon: true,
      tagline: 'Mastering relaxation and dephasing channels',
      mainBadge: { id: 'decoherence-warden', name: 'Decoherence Warden', superiorName: 'Decoherence Warden (Superior)' },
      smallBadges: [
        { id: 't1-relaxation', name: 'T1 Relaxation' },
        { id: 't2-dephasing', name: 'T2 Dephasing' },
        { id: 'noise-channels', name: 'Noise Channels' },
        { id: 'quantum-fidelity', name: 'Fidelity Metrics' }
      ]
    },
    {
      id: 'topic-07',
      number: 7,
      name: 'Quantum Error Correction',
      comingSoon: true,
      tagline: 'Fault tolerance via topological syndroming',
      mainBadge: { id: 'fault-tolerant-architect', name: 'Fault-Tolerant Architect', superiorName: 'Fault-Tolerant Architect (Superior)' },
      smallBadges: [
        { id: 'bit-flip-code', name: 'Bit-Flip Code' },
        { id: 'phase-flip-code', name: 'Phase-Flip Code' },
        { id: 'shor-code', name: 'Shor 9-Qubit Code' },
        { id: 'surface-code', name: 'Surface Codes' }
      ]
    },
    {
      id: 'topic-08',
      number: 8,
      name: 'Quantum Cryptography & Telecom',
      comingSoon: true,
      tagline: 'Provably secure quantum key distribution',
      mainBadge: { id: 'quantum-sentinel', name: 'Quantum Sentinel', superiorName: 'Quantum Sentinel (Superior)' },
      smallBadges: [
        { id: 'bb84', name: 'BB84 Protocol' },
        { id: 'e91', name: 'E91 Entanglement' },
        { id: 'teleportation', name: 'Quantum Teleportation' },
        { id: 'superdense-coding', name: 'Superdense Coding' }
      ]
    },
    {
      id: 'topic-09',
      number: 9,
      name: 'Quantum Information Theory',
      comingSoon: true,
      tagline: 'Density matrices and non-local thermodynamics',
      mainBadge: { id: 'information-sovereign', name: 'Information Sovereign', superiorName: 'Information Sovereign (Superior)' },
      smallBadges: [
        { id: 'density-matrix', name: 'Density Matrices' },
        { id: 'von-neumann', name: 'Von Neumann Entropy' },
        { id: 'trace-distance', name: 'Trace Distance' },
        { id: 'bell-inequality', name: 'Bell-CHSH Inequality' }
      ]
    },
    {
      id: 'topic-10',
      number: 10,
      name: 'Quantum Supremacy & Frontiers',
      comingSoon: true,
      tagline: 'Beyond classical supercomputing limits',
      mainBadge: { id: 'quantum-master-sovereign', name: 'Quantum Master Sovereign', superiorName: 'Quantum Master Sovereign (Superior)' },
      smallBadges: [
        { id: 'xeb', name: 'Cross-Entropy Benchmarking' },
        { id: 'boson-sampling', name: 'Boson Sampling' },
        { id: 'q-chemistry', name: 'VQE Molecular Chemistry' },
        { id: 'qml', name: 'Quantum Machine Learning' }
      ]
    }
  ];

  // In-memory cache synced with localStorage
  let _stateCache = null;
  const _listeners = [];

  function loadState() {
    if (_stateCache) return _stateCache;

    try {
      const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
               || localStorage.getItem('quantumpaws_badges_v2') || sessionStorage.getItem('quantumpaws_badges_v2');
      if (raw) {
        _stateCache = JSON.parse(raw);
        return _stateCache;
      }
    } catch (e) {
      console.warn('BadgesEngine: error reading localStorage', e);
    }

    // Default starting state
    _stateCache = {
      // Small badges: { earned: boolean, mastered: boolean, normalScore: number, secretScore: number, earnedAt: string, masteredAt: string }
      badges: {},
      // Main badges: { unlocked: boolean, superior: boolean, unlockedAt: string, superiorAt: string }
      mainBadges: {},
      // Quiz attempts history
      attempts: []
    };

    saveState();
    return _stateCache;
  }

  function saveState() {
    if (!_stateCache) return;
    try {
      const dataStr = JSON.stringify(_stateCache);
      localStorage.setItem(STORAGE_KEY, dataStr);
      sessionStorage.setItem(STORAGE_KEY, dataStr);
    } catch (e) {
      console.error('BadgesEngine: error saving state', e);
    }
  }

  function notify(event, payload) {
    _listeners.forEach(fn => {
      try { fn(event, payload); } catch (e) { console.error(e); }
    });
    // Also dispatch on window for global listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('Qcify:badge-update', { detail: { event, payload } }));
    }
  }

  /**
   * Get progress for a small badge
   * Returns: { id, earned, mastered, normalScore, secretScore, status: 'locked'|'earned'|'mastered' }
   */
  function getBadgeProgress(badgeId) {
    const state = loadState();
    const entry = state.badges[badgeId] || {
      earned: false,
      mastered: false,
      normalScore: 0,
      secretScore: 0
    };

    let status = 'locked';
    if (entry.mastered) status = 'mastered';
    else if (entry.earned) status = 'earned';

    return {
      id: badgeId,
      earned: !!entry.earned,
      mastered: !!entry.mastered,
      normalScore: entry.normalScore || 0,
      secretScore: entry.secretScore || 0,
      earnedAt: entry.earnedAt || null,
      masteredAt: entry.masteredAt || null,
      status: status
    };
  }

  /**
   * Get progress for a main badge
   * Returns: { id, unlocked, superior, status: 'locked'|'earned'|'superior' }
   */
  function getMainBadgeProgress(mainBadgeId) {
    const state = loadState();
    const entry = state.mainBadges[mainBadgeId] || {
      unlocked: false,
      superior: false
    };

    let status = 'locked';
    if (entry.superior) status = 'superior';
    else if (entry.unlocked) status = 'earned';

    return {
      id: mainBadgeId,
      unlocked: !!entry.unlocked,
      superior: !!entry.superior,
      unlockedAt: entry.unlockedAt || null,
      superiorAt: entry.superiorAt || null,
      status: status
    };
  }

  /**
   * Get summary for a topic
   */
  function getTopicProgress(topicId) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) return null;

    if (topic.comingSoon) {
      return {
        topic,
        totalBadges: topic.smallBadges.length,
        earnedCount: 0,
        masteredCount: 0,
        mainBadgeStatus: 'locked',
        isComplete: false,
        isMastered: false
      };
    }

    let earnedCount = 0;
    let masteredCount = 0;

    topic.smallBadges.forEach(b => {
      const p = getBadgeProgress(b.id);
      if (p.earned) earnedCount++;
      if (p.mastered) masteredCount++;
    });

    const mainProgress = getMainBadgeProgress(topic.mainBadge.id);

    return {
      topic,
      totalBadges: topic.smallBadges.length,
      earnedCount,
      masteredCount,
      mainBadgeStatus: mainProgress.status,
      isComplete: earnedCount === topic.smallBadges.length,
      isMastered: masteredCount === topic.smallBadges.length
    };
  }

  /**
   * Award Normal Quiz completion
   * If score is passing (>= 75% or correct/total >= 3/4):
   * 1. Awards Small Badge (EARNED)
   * 2. Unlocks Secret Quiz
   * 3. Checks if all small badges in topic are earned -> unlocks Main Badge!
   */
  function recordNormalQuiz(badgeId, correct, total) {
    const state = loadState();
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 75;

    // Log attempt
    state.attempts.push({
      type: 'normal',
      badgeId,
      correct,
      total,
      pct,
      passed,
      timestamp: new Date().toISOString()
    });

    if (!passed) {
      saveState();
      return {
        success: false,
        badgeId,
        pct,
        message: 'Quiz not passed. Keep practicing to unlock this badge!'
      };
    }

    // Prepare entry
    if (!state.badges[badgeId]) {
      state.badges[badgeId] = { earned: false, mastered: false, normalScore: 0, secretScore: 0 };
    }

    const wasAlreadyEarned = state.badges[badgeId].earned;
    state.badges[badgeId].earned = true;
    state.badges[badgeId].normalScore = Math.max(state.badges[badgeId].normalScore || 0, pct);
    if (!state.badges[badgeId].earnedAt) {
      state.badges[badgeId].earnedAt = new Date().toISOString();
    }

    // Check parent topic
    const topic = TOPICS.find(t => t.smallBadges.some(b => b.id === badgeId));
    let mainBadgeUnlockedNow = false;

    if (topic) {
      const allEarned = topic.smallBadges.every(b => {
        return (b.id === badgeId) || (state.badges[b.id] && state.badges[b.id].earned);
      });

      if (allEarned) {
        if (!state.mainBadges[topic.mainBadge.id]) {
          state.mainBadges[topic.mainBadge.id] = { unlocked: false, superior: false };
        }
        if (!state.mainBadges[topic.mainBadge.id].unlocked) {
          state.mainBadges[topic.mainBadge.id].unlocked = true;
          state.mainBadges[topic.mainBadge.id].unlockedAt = new Date().toISOString();
          mainBadgeUnlockedNow = true;
        }
      }
    }

    saveState();

    const result = {
      success: true,
      badgeId,
      newlyEarned: !wasAlreadyEarned,
      secretQuizUnlocked: true,
      mainBadgeUnlocked: mainBadgeUnlockedNow,
      topicId: topic ? topic.id : null,
      mainBadgeId: topic ? topic.mainBadge.id : null
    };

    notify('badge_earned', result);
    if (mainBadgeUnlockedNow) {
      notify('main_badge_unlocked', result);
    }

    return result;
  }

  /**
   * Award Secret Quiz completion
   * If score is passing (>= 75% or correct/total >= 3/4):
   * 1. Upgrades Small Badge to MASTERED
   * 2. Checks if all 4 small badges are mastered -> upgrades Main Badge to SUPERIOR!
   * If fails: Keep badge in EARNED state (no downgrade).
   */
  function recordSecretQuiz(badgeId, correct, total) {
    const state = loadState();
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 75;

    // Log attempt
    state.attempts.push({
      type: 'secret',
      badgeId,
      correct,
      total,
      pct,
      passed,
      timestamp: new Date().toISOString()
    });

    if (!passed) {
      saveState();
      return {
        success: false,
        badgeId,
        pct,
        message: 'Secret challenge not mastered this time. Your badge remains safely EARNED!'
      };
    }

    // Verify badge has actually been earned first!
    if (!state.badges[badgeId] || !state.badges[badgeId].earned) {
      saveState();
      return {
        success: false,
        badgeId,
        pct,
        message: 'Badge must be earned through the foundational quiz before taking the secret challenge!'
      };
    }

    const wasAlreadyMastered = state.badges[badgeId].mastered;
    state.badges[badgeId].earned = true; // Ensure earned is true
    state.badges[badgeId].mastered = true;
    state.badges[badgeId].secretScore = Math.max(state.badges[badgeId].secretScore || 0, pct);
    if (!state.badges[badgeId].masteredAt) {
      state.badges[badgeId].masteredAt = new Date().toISOString();
    }

    // Check parent topic for Superior upgrade
    const topic = TOPICS.find(t => t.smallBadges.some(b => b.id === badgeId));
    let mainBadgeSuperiorNow = false;

    if (topic) {
      const allMastered = topic.smallBadges.every(b => {
        return (b.id === badgeId) || (state.badges[b.id] && state.badges[b.id].mastered);
      });

      if (allMastered) {
        if (!state.mainBadges[topic.mainBadge.id]) {
          state.mainBadges[topic.mainBadge.id] = { unlocked: true, superior: false };
        }
        state.mainBadges[topic.mainBadge.id].unlocked = true;
        if (!state.mainBadges[topic.mainBadge.id].superior) {
          state.mainBadges[topic.mainBadge.id].superior = true;
          state.mainBadges[topic.mainBadge.id].superiorAt = new Date().toISOString();
          mainBadgeSuperiorNow = true;
        }
      }
    }

    saveState();

    const result = {
      success: true,
      badgeId,
      newlyMastered: !wasAlreadyMastered,
      mainBadgeSuperior: mainBadgeSuperiorNow,
      topicId: topic ? topic.id : null,
      mainBadgeId: topic ? topic.mainBadge.id : null
    };

    notify('badge_mastered', result);
    if (mainBadgeSuperiorNow) {
      notify('main_badge_superior', result);
    }

    return result;
  }

  /**
   * Helper to inspect overall global stats
   */
  function getGlobalStats() {
    let totalEarned = 0;
    let totalMastered = 0;
    let totalMain = 0;
    let totalSuperior = 0;

    TOPICS.filter(t => !t.comingSoon).forEach(t => {
      t.smallBadges.forEach(b => {
        const p = getBadgeProgress(b.id);
        if (p.earned) totalEarned++;
        if (p.mastered) totalMastered++;
      });
      const mp = getMainBadgeProgress(t.mainBadge.id);
      if (mp.unlocked) totalMain++;
      if (mp.superior) totalSuperior++;
    });

    return {
      totalEarned,
      totalMastered,
      totalMain,
      totalSuperior,
      totalAvailableSmall: 8,
      totalAvailableMain: 2
    };
  }

  /**
   * Reset all badge progress (for testing / demo / debug)
   */
  function resetAll() {
    _stateCache = {
      badges: {},
      mainBadges: {},
      attempts: []
    };
    saveState();
    notify('reset', {});
  }

  /**
   * Quick-unlock helper for demo/testing
   */
  function debugSetBadge(badgeId, tier) {
    const state = loadState();
    if (!state.badges[badgeId]) {
      state.badges[badgeId] = { earned: false, mastered: false, normalScore: 0, secretScore: 0 };
    }
    if (tier === 'locked') {
      state.badges[badgeId].earned = false;
      state.badges[badgeId].mastered = false;
    } else if (tier === 'earned') {
      state.badges[badgeId].earned = true;
      state.badges[badgeId].mastered = false;
      state.badges[badgeId].normalScore = 100;
    } else if (tier === 'mastered') {
      state.badges[badgeId].earned = true;
      state.badges[badgeId].mastered = true;
      state.badges[badgeId].normalScore = 100;
      state.badges[badgeId].secretScore = 100;
    }

    // Check main badges
    TOPICS.filter(t => !t.comingSoon).forEach(topic => {
      const allEarned = topic.smallBadges.every(b => state.badges[b.id]?.earned);
      const allMastered = topic.smallBadges.every(b => state.badges[b.id]?.mastered);
      if (!state.mainBadges[topic.mainBadge.id]) {
        state.mainBadges[topic.mainBadge.id] = { unlocked: false, superior: false };
      }
      state.mainBadges[topic.mainBadge.id].unlocked = allEarned;
      state.mainBadges[topic.mainBadge.id].superior = allMastered;
    });

    saveState();
    notify('debug_update', { badgeId, tier });
  }

  return {
    TOPICS,
    getBadgeProgress,
    getMainBadgeProgress,
    getTopicProgress,
    recordNormalQuiz,
    recordSecretQuiz,
    getGlobalStats,
    resetAll,
    debugSetBadge,
    subscribe: (fn) => _listeners.push(fn)
  };
})();

// Attach to window
if (typeof window !== 'undefined') {
  window.BadgesEngine = BadgesEngine;
}
