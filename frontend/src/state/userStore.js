import { useState, useEffect } from 'react';

/**
 * QUANTUMPAWS — Reactive User State Management Store
 */

const STORAGE_KEY = 'quantumpaws_v2_state';

const initialBadges = [
  { id: 'first_qubit', icon: '⚛️', label: 'First Qubit', desc: 'Entered the quantum realm', earned: true },
  { id: 'wave_rider', icon: '🌊', label: 'Wave Rider', desc: 'Mastered superposition', earned: true },
  { id: 'superposer', icon: '🎯', label: 'Superposer', desc: '50/50 probability coin flip', earned: true },
  { id: 'gate_maker', icon: '🔮', label: 'Gate Maker', desc: 'Assembled first quantum circuit', earned: false },
  { id: 'entangler', icon: '🌀', label: 'Entangler', desc: 'Created Bell State |Φ⁺⟩', earned: false },
  { id: 'quiz_ace', icon: '🏆', label: 'Quiz Ace', desc: 'Passed the Gateway Quiz', earned: false },
  { id: 'rocket', icon: '🚀', label: 'Quantum Leap', desc: 'Reached Intermediate track', earned: false },
  { id: 'matrix_cat', icon: '💎', label: 'Schrö Master', desc: '100% coherence achieved', earned: false },
];

function loadPersistedState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

const defaultState = {
  playerName: 'Alex',
  track: 'newbie', // 'newbie' | 'intermediate' | 'advanced'
  level: 1,
  xp: 140,
  streakDays: 5,
  overallProgress: 25,
  currentRoute: 'dashboard', // 'onboarding' | 'dashboard' | 'lesson' | 'sandbox'
  
  // Badges
  badges: initialBadges,

  // Mascot & Chat
  schroExpression: 'happy', // 'idle' | 'thinking' | 'happy' | 'encouraging' | 'excited'
  isChatOpen: false,
  chatMessages: [
    { role: 'assistant', content: "Meowdy! 🐾 I'm Schrö, your quantum companion in superposition! What quantum mysteries shall we unravel today?" }
  ],
  hasUnreadNudge: true,
  currentNudge: "You haven't tried the H gate yet! 🔮",

  // Quantum Sandbox Circuit State
  circuit: {
    numQubits: 2,
    gates: [
      { id: 'g1', name: 'H', target: 0, control: null, step: 0 },
      { id: 'g2', name: 'CNOT', target: 1, control: 0, step: 1 }
    ],
    backend: 'qiskit_aer',
    shots: 1024,
    results: {
      probabilities: { '00': 0.5, '11': 0.5 },
      counts: { '00': 512, '11': 512 },
      blochVectors: [
        { qubit: 0, x: 0, y: 0, z: 0 },
        { qubit: 1, x: 0, y: 0, z: 0 }
      ]
    }
  },

  // Active Lesson
  lessonProgress: {
    step: 0,
    totalSteps: 5,
    selectedOption: null,
    isCorrect: null
  },

  // Notification Toasts
  toasts: []
};

// In-memory state singleton
let state = loadPersistedState() || defaultState;
const listeners = new Set();

function notify() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
  listeners.forEach(fn => fn(state));
}

export const userStore = {
  getState: () => state,

  setState: (updater) => {
    state = typeof updater === 'function' ? { ...state, ...updater(state) } : { ...state, ...updater };
    notify();
  },

  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Actions
  setPlayerName: (name) => {
    userStore.setState({ playerName: name });
  },

  setTrack: (track) => {
    userStore.setState({ track });
  },

  navigate: (route) => {
    userStore.setState({ currentRoute: route });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  addXP: (amount) => {
    userStore.setState(s => {
      const newXP = s.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { xp: newXP, level: newLevel };
    });
    userStore.showToast(`+${amount} XP Earned! ⚡`, 'lime');
  },

  unlockBadge: (badgeId) => {
    userStore.setState(s => ({
      badges: s.badges.map(b => b.id === badgeId ? { ...b, earned: true } : b)
    }));
    const badge = state.badges.find(b => b.id === badgeId);
    if (badge) {
      userStore.showToast(`New Badge Unlocked: ${badge.label} 🏆`, 'reward');
    }
  },

  // Mascot Chat
  toggleChat: () => {
    userStore.setState(s => ({ isChatOpen: !s.isChatOpen, hasUnreadNudge: false }));
  },

  setSchroExpression: (expr) => {
    userStore.setState({ schroExpression: expr });
  },

  addChatMessage: (msg) => {
    userStore.setState(s => ({
      chatMessages: [...s.chatMessages, msg]
    }));
  },

  // Circuit actions
  setNumQubits: (n) => {
    userStore.setState(s => ({
      circuit: {
        ...s.circuit,
        numQubits: n,
        gates: s.circuit.gates.filter(g => g.target < n && (g.control === null || g.control < n))
      }
    }));
  },

  addGate: (gateName, target, step, control = null) => {
    userStore.setState(s => {
      // Remove any existing gate at this exact target and step
      const filtered = s.circuit.gates.filter(g => !(g.target === target && g.step === step));
      const newGate = {
        id: `g_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: gateName,
        target,
        step,
        control
      };
      return {
        circuit: {
          ...s.circuit,
          gates: [...filtered, newGate]
        }
      };
    });
  },

  removeGate: (gateId) => {
    userStore.setState(s => ({
      circuit: {
        ...s.circuit,
        gates: s.circuit.gates.filter(g => g.id !== gateId)
      }
    }));
  },

  clearCircuit: () => {
    userStore.setState(s => ({
      circuit: {
        ...s.circuit,
        gates: []
      }
    }));
  },

  setCircuitResults: (results) => {
    userStore.setState(s => ({
      circuit: {
        ...s.circuit,
        results
      }
    }));
  },

  // Toast System
  showToast: (message, type = 'default', duration = 3000) => {
    const id = Date.now() + Math.random();
    userStore.setState(s => ({
      toasts: [...s.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      userStore.setState(s => ({
        toasts: s.toasts.filter(t => t.id !== id)
      }));
    }, duration);
  }
};

/**
 * Custom React hook for subscribing to store changes
 */
export function useUserStore(selector = s => s) {
  const [storeState, setStoreState] = useState(() => selector(userStore.getState()));

  useEffect(() => {
    const unsubscribe = userStore.subscribe(newState => {
      setStoreState(selector(newState));
    });
    return unsubscribe;
  }, [selector]);

  return storeState;
}
