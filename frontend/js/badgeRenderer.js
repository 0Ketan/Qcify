/**
 * Qcify — Procedural Quantum Badge SVG Renderer
 * 
 * Generates resolution-independent, vector SVG badges with unified design language:
 * - Geometric cyber-shield/hexagonal frame with metallic chamfers
 * - Quantum energy cores, state vectors, circuit buses, probability interference
 * - Distinct tiers: LOCKED (darkened silhouette), EARNED (vibrant quantum colors),
 *   MASTERED (orbital gyroscopes, energy halos, particle accents)
 * - Main Badges: Integrated composite motifs
 * - Superior Main Badges: Legendary hyper-corona, dual orbital gyros, crown flares
 */

const BadgeRenderer = (function () {

  // Common gradients and defs shared across badges
  function getSharedDefs() {
    return `
      <defs>
        <!-- Metallic Frame Gradients -->
        <linearGradient id="qf-locked" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2D3748" />
          <stop offset="50%" stop-color="#1A202C" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>

        <linearGradient id="qf-earned" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A78BFA" />
          <stop offset="35%" stop-color="#7C5CFF" />
          <stop offset="70%" stop-color="#4C1D95" />
          <stop offset="100%" stop-color="#22D3EE" />
        </linearGradient>

        <linearGradient id="qf-mastered" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#67E8F9" />
          <stop offset="30%" stop-color="#7C5CFF" />
          <stop offset="60%" stop-color="#C084FC" />
          <stop offset="85%" stop-color="#F472B6" />
          <stop offset="100%" stop-color="#FBBF24" />
        </linearGradient>

        <linearGradient id="qf-main-earned" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8" />
          <stop offset="30%" stop-color="#818CF8" />
          <stop offset="70%" stop-color="#6366F1" />
          <stop offset="100%" stop-color="#A855F7" />
        </linearGradient>

        <linearGradient id="qf-superior" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047" />
          <stop offset="25%" stop-color="#F59E0B" />
          <stop offset="50%" stop-color="#EC4899" />
          <stop offset="75%" stop-color="#8B5CF6" />
          <stop offset="100%" stop-color="#06B6D4" />
        </linearGradient>

        <!-- Glow Filters -->
        <filter id="q-glow-subtle" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="q-glow-intense" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="q-glow-superior" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b1" />
          <feGaussianBlur stdDeviation="7" result="b2" />
          <feGaussianBlur stdDeviation="14" result="b3" />
          <feMerge>
            <feMergeNode in="b3" />
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <!-- Base Background Gradients -->
        <radialGradient id="q-bg-locked" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1F2937" />
          <stop offset="100%" stop-color="#0B0F19" />
        </radialGradient>

        <radialGradient id="q-bg-earned" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#2E1065" />
          <stop offset="60%" stop-color="#1E1B4B" />
          <stop offset="100%" stop-color="#090D19" />
        </radialGradient>

        <radialGradient id="q-bg-mastered" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#3B0764" />
          <stop offset="50%" stop-color="#172554" />
          <stop offset="100%" stop-color="#060913" />
        </radialGradient>

        <radialGradient id="q-bg-superior" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#4C1D95" />
          <stop offset="40%" stop-color="#1E1B4B" />
          <stop offset="80%" stop-color="#180B2B" />
          <stop offset="100%" stop-color="#030712" />
        </radialGradient>
      </defs>
    `;
  }

  // Base Shield/Hexagon path generator
  // Centered at (100, 100), radius 78 for small, 82 for main
  function getFramePath(isMain = false) {
    if (isMain) {
      // Octagonal / Rounded Tech Emblem for Main Badges
      return "M 100 16 L 148 30 L 178 72 L 178 128 L 148 170 L 100 184 L 52 170 L 22 128 L 22 72 L 52 30 Z";
    }
    // High-tech curved hexagon for Small Badges
    return "M 100 20 L 165 52 L 165 132 L 100 176 L 35 132 L 35 52 Z";
  }

  function getInnerFramePath(isMain = false) {
    if (isMain) {
      return "M 100 24 L 143 36 L 170 74 L 170 126 L 143 164 L 100 176 L 57 164 L 30 126 L 30 74 L 57 36 Z";
    }
    return "M 100 28 L 157 56 L 157 128 L 100 168 L 43 128 L 43 56 Z";
  }

  // Specific Icon Graphics for Each Badge
  const BADGE_ICONS = {
    // ----------------- TOPIC 1 -----------------
    'qubit': function (tier) {
      const isLocked = tier === 'locked';
      const c1 = isLocked ? '#4B5563' : '#22D3EE';
      const c2 = isLocked ? '#374151' : '#A78BFA';
      const fillSphere = isLocked ? '#1F2937' : 'url(#qubit-sphere)';
      return `
        <defs>
          <radialGradient id="qubit-sphere" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#E0F2FE" />
            <stop offset="30%" stop-color="#38BDF8" />
            <stop offset="70%" stop-color="#0284C7" />
            <stop offset="100%" stop-color="#0C4A6E" />
          </radialGradient>
        </defs>
        <!-- Orbital Rings -->
        <ellipse cx="100" cy="98" rx="42" ry="14" fill="none" stroke="${c2}" stroke-width="1.8" opacity="0.6" transform="rotate(-25 100 98)" />
        <ellipse cx="100" cy="98" rx="42" ry="14" fill="none" stroke="${c1}" stroke-width="1.8" opacity="0.4" transform="rotate(35 100 98)" />
        
        <!-- Central Quantum Sphere -->
        <circle cx="100" cy="98" r="28" fill="${fillSphere}" stroke="${c1}" stroke-width="1.5" />
        
        <!-- Pole Axis -->
        <line x1="100" y1="62" x2="100" y2="134" stroke="${c1}" stroke-width="1.6" stroke-dasharray="3,2" opacity="0.8" />
        
        <!-- |0> and |1> State Bra-Ket Labels -->
        <text x="100" y="58" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${isLocked ? '#6B7280' : '#38BDF8'}">|0⟩</text>
        <text x="100" y="147" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${isLocked ? '#6B7280' : '#A78BFA'}">|1⟩</text>

        <!-- Equator Wave -->
        <path d="M 74 98 Q 100 108 126 98" fill="none" stroke="${c2}" stroke-width="2" />
        <circle cx="112" cy="90" r="3" fill="${c1}" />
      `;
    },

    'superposition': function (tier) {
      const isLocked = tier === 'locked';
      const c1 = isLocked ? '#4B5563' : '#38BDF8';
      const c2 = isLocked ? '#374151' : '#F472B6';
      const c3 = isLocked ? '#4B5563' : '#A78BFA';
      return `
        <!-- Overlapping Coherent Probability Waves -->
        <path d="M 60 98 Q 80 65 100 98 T 140 98" fill="none" stroke="${c1}" stroke-width="2.5" opacity="0.85" />
        <path d="M 60 98 Q 80 131 100 98 T 140 98" fill="none" stroke="${c2}" stroke-width="2.5" opacity="0.85" />
        <path d="M 68 98 Q 84 80 100 98 T 132 98" fill="none" stroke="${c3}" stroke-width="1.8" stroke-dasharray="2,2" opacity="0.7" />

        <!-- Interference Fringes -->
        <circle cx="85" cy="98" r="18" fill="none" stroke="${c1}" stroke-width="1.2" opacity="0.4" />
        <circle cx="115" cy="98" r="18" fill="none" stroke="${c2}" stroke-width="1.2" opacity="0.4" />

        <!-- Superposition Core Node -->
        <circle cx="100" cy="98" r="10" fill="${isLocked ? '#374151' : '#7C5CFF'}" opacity="0.8" />
        <circle cx="100" cy="98" r="5" fill="${isLocked ? '#6B7280' : '#FFFFFF'}" />
        
        <!-- State superposition formula symbols -->
        <text x="76" y="80" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="${c1}">α|0⟩</text>
        <text x="100" y="80" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${c3}">+</text>
        <text x="124" y="80" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="${c2}">β|1⟩</text>

        <!-- State particles -->
        <circle cx="78" cy="116" r="2.5" fill="${c1}" />
        <circle cx="122" cy="116" r="2.5" fill="${c2}" />
      `;
    },

    'bloch-sphere': function (tier) {
      const isLocked = tier === 'locked';
      const cPrimary = isLocked ? '#4B5563' : '#818CF8';
      const cAxes = isLocked ? '#374151' : '#06B6D4';
      const cVector = isLocked ? '#6B7280' : '#F43F5E';
      return `
        <!-- Bloch Sphere 3D Wireframe -->
        <circle cx="100" cy="98" r="34" fill="none" stroke="${cPrimary}" stroke-width="1.8" opacity="0.75" />
        <!-- Equator Ellipse -->
        <ellipse cx="100" cy="98" rx="34" ry="11" fill="none" stroke="${cPrimary}" stroke-width="1.4" stroke-dasharray="3,2" opacity="0.7" />
        <!-- Prime Meridian Ellipse -->
        <ellipse cx="100" cy="98" rx="11" ry="34" fill="none" stroke="${cPrimary}" stroke-width="1.4" stroke-dasharray="3,2" opacity="0.5" />
        
        <!-- Z Axis (Vertical) -->
        <line x1="100" y1="56" x2="100" y2="140" stroke="${cAxes}" stroke-width="1.5" />
        <text x="100" y="52" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="${cAxes}">+Z(|0⟩)</text>
        
        <!-- X Axis (Diagonal forward) -->
        <line x1="100" y1="98" x2="72" y2="124" stroke="${cAxes}" stroke-width="1.5" />
        <text x="68" y="132" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="${cAxes}">+X</text>

        <!-- Y Axis (Horizontal) -->
        <line x1="100" y1="98" x2="138" y2="98" stroke="${cAxes}" stroke-width="1.5" />
        <text x="144" y="101" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="${cAxes}">+Y</text>

        <!-- State Vector Arrow |psi> pointing into upper hemisphere -->
        <line x1="100" y1="98" x2="119" y2="72" stroke="${cVector}" stroke-width="2.5" />
        <polygon points="123,67 115,74 121,79" fill="${cVector}" />
        <circle cx="100" cy="98" r="2.5" fill="${cVector}" />
        <text x="128" y="65" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="${cVector}">|ψ⟩</text>
      `;
    },

    'hilbert-space': function (tier) {
      const isLocked = tier === 'locked';
      const c1 = isLocked ? '#4B5563' : '#C084FC';
      const c2 = isLocked ? '#374151' : '#22D3EE';
      const c3 = isLocked ? '#374151' : '#E879F9';
      return `
        <!-- Multidimensional Geometric Hyperplanes -->
        <!-- Plane A (Isometric Top) -->
        <polygon points="100,58 135,74 100,90 65,74" fill="${isLocked ? '#1F2937' : '#7C5CFF'}" fill-opacity="0.25" stroke="${c1}" stroke-width="1.4" />
        <!-- Plane B (Isometric Left) -->
        <polygon points="65,74 100,90 100,128 65,112" fill="${isLocked ? '#1F2937' : '#22D3EE'}" fill-opacity="0.2" stroke="${c2}" stroke-width="1.4" />
        <!-- Plane C (Isometric Right) -->
        <polygon points="100,90 135,74 135,112 100,128" fill="${isLocked ? '#1F2937' : '#EC4899'}" fill-opacity="0.2" stroke="${c3}" stroke-width="1.4" />

        <!-- Dimension Projection Rays -->
        <line x1="100" y1="90" x2="100" y2="52" stroke="${c1}" stroke-width="2" stroke-dasharray="2,2" />
        <line x1="100" y1="90" x2="52" y2="124" stroke="${c2}" stroke-width="2" stroke-dasharray="2,2" />
        <line x1="100" y1="90" x2="148" y2="124" stroke="${c3}" stroke-width="2" stroke-dasharray="2,2" />

        <!-- Central Quantum State Knot in H space -->
        <circle cx="100" cy="90" r="6" fill="${isLocked ? '#4B5563' : '#FBBF24'}" />
        <circle cx="100" cy="90" r="12" fill="none" stroke="${c1}" stroke-width="1" opacity="0.6" />

        <!-- Mathematical Hilbert Dimension Notation -->
        <text x="100" y="47" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="${c1}">ℋ = ℂ²</text>
        <text x="50" y="137" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="${c2}">⟨u|</text>
        <text x="150" y="137" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="${c3}">|v⟩</text>
      `;
    },

    // --- MAIN BADGE TOPIC 1: Quantum Awakening ---
    'quantum-awakening': function (tier) {
      const isLocked = tier === 'locked';
      const cClassical = isLocked ? '#4B5563' : '#64748B';
      const cQuantum = isLocked ? '#6B7280' : '#38BDF8';
      const cEnergy = isLocked ? '#374151' : '#A855F7';
      const isSuperior = tier === 'superior';

      return `
        <!-- Classical Binary Stream (Left) -->
        <g opacity="0.75">
          <text x="54" y="75" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="${cClassical}">0</text>
          <text x="46" y="98" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="${cClassical}">1</text>
          <text x="56" y="122" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${cClassical}">0</text>
          <line x1="62" y1="95" x2="78" y2="95" stroke="${cClassical}" stroke-width="1.8" stroke-dasharray="3,3" />
        </g>

        <!-- Transformation Gateway (Dissolving Wave) -->
        <path d="M 74 65 C 84 80, 84 115, 74 130" fill="none" stroke="${cEnergy}" stroke-width="2.5" />
        <path d="M 80 68 C 88 82, 88 112, 80 126" fill="none" stroke="${cQuantum}" stroke-width="1.5" opacity="0.7" />

        <!-- Radiant Quantum Awakening Sphere (Right) -->
        <circle cx="118" cy="98" r="26" fill="${isLocked ? '#1F2937' : '#1E1B4B'}" stroke="${cQuantum}" stroke-width="2" />
        <!-- Internal Quantum Core -->
        <circle cx="118" cy="98" r="14" fill="${isLocked ? '#374151' : '#7C5CFF'}" opacity="0.75" />
        <circle cx="118" cy="98" r="6" fill="${isLocked ? '#6B7280' : '#FFFFFF'}" />

        <!-- Probability Halos -->
        <ellipse cx="118" cy="98" rx="34" ry="12" fill="none" stroke="${cQuantum}" stroke-width="1.6" transform="rotate(-30 118 98)" />
        <ellipse cx="118" cy="98" rx="34" ry="12" fill="none" stroke="${cEnergy}" stroke-width="1.4" transform="rotate(40 118 98)" />

        <!-- Transformation Sparkles -->
        <circle cx="86" cy="85" r="2" fill="${cQuantum}" />
        <circle cx="92" cy="110" r="2.5" fill="${cEnergy}" />
        <circle cx="102" cy="72" r="2" fill="${isSuperior ? '#FDE047' : '#FFFFFF'}" />
        <circle cx="138" cy="122" r="2" fill="${cQuantum}" />

        <!-- Evolution Arc -->
        <path d="M 68 55 Q 100 42 135 60" fill="none" stroke="${isSuperior ? '#FDE047' : '#A78BFA'}" stroke-width="1.8" stroke-dasharray="4,2" />
        <polygon points="137,61 130,55 130,64" fill="${isSuperior ? '#FDE047' : '#A78BFA'}" />
      `;
    },

    // ----------------- TOPIC 2 -----------------
    'single-gates': function (tier) {
      const isLocked = tier === 'locked';
      const cWire = isLocked ? '#4B5563' : '#38BDF8';
      const cGate = isLocked ? '#374151' : '#7C5CFF';
      const cText = isLocked ? '#6B7280' : '#FFFFFF';
      return `
        <!-- Single Qubit Quantum Wire -->
        <line x1="44" y1="98" x2="156" y2="98" stroke="${cWire}" stroke-width="2.5" />
        
        <!-- Unitary Gate Box [H] -->
        <rect x="80" y="76" width="40" height="44" rx="8" fill="${cGate}" stroke="${cWire}" stroke-width="2" />
        <text x="100" y="104" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="20" font-weight="700" fill="${cText}">H</text>

        <!-- State Transformation Notation -->
        <text x="56" y="90" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="${cWire}">|0⟩</text>
        <text x="144" y="90" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="${cWire}">|+⟩</text>

        <!-- Quantum Energy Pulse -->
        <circle cx="80" cy="98" r="3" fill="#22D3EE" />
        <circle cx="120" cy="98" r="3" fill="#22D3EE" />
      `;
    },

    'double-gates': function (tier) {
      const isLocked = tier === 'locked';
      const cWire = isLocked ? '#4B5563' : '#38BDF8';
      const cLink = isLocked ? '#374151' : '#A78BFA';
      const cTarget = isLocked ? '#374151' : '#F43F5E';
      return `
        <!-- Dual Qubit Lines -->
        <line x1="44" y1="78" x2="156" y2="78" stroke="${cWire}" stroke-width="2" />
        <line x1="44" y1="118" x2="156" y2="118" stroke="${cWire}" stroke-width="2" />

        <!-- Control Dot on Qubit 0 -->
        <line x1="100" y1="78" x2="100" y2="118" stroke="${cLink}" stroke-width="2.5" />
        <circle cx="100" cy="78" r="6" fill="${cLink}" />

        <!-- Target XOR Circle on Qubit 1 -->
        <circle cx="100" cy="118" r="14" fill="${isLocked ? '#1F2937' : '#4C1D95'}" stroke="${cTarget}" stroke-width="2" />
        <line x1="100" y1="106" x2="100" y2="130" stroke="${cTarget}" stroke-width="2" />
        <line x1="88" y1="118" x2="112" y2="118" stroke="${cTarget}" stroke-width="2" />

        <!-- Line Labels -->
        <text x="52" y="72" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="${cWire}">q₀</text>
        <text x="52" y="132" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="${cWire}">q₁</text>

        <!-- Entanglement Indication Glow -->
        <circle cx="100" cy="98" r="3" fill="${cLink}" opacity="0.8" />
      `;
    },

    'entanglement': function (tier) {
      const isLocked = tier === 'locked';
      const c1 = isLocked ? '#4B5563' : '#06B6D4';
      const c2 = isLocked ? '#4B5563' : '#EC4899';
      const cLink = isLocked ? '#374151' : '#A78BFA';
      return `
        <!-- Two Entangled Quantum Spheres -->
        <circle cx="68" cy="98" r="18" fill="${isLocked ? '#1F2937' : '#0E7490'}" stroke="${c1}" stroke-width="2" />
        <circle cx="68" cy="98" r="8" fill="${isLocked ? '#374151' : '#67E8F9'}" />

        <circle cx="132" cy="98" r="18" fill="${isLocked ? '#1F2937' : '#831843'}" stroke="${c2}" stroke-width="2" />
        <circle cx="132" cy="98" r="8" fill="${isLocked ? '#374151' : '#F472B6'}" />

        <!-- Powerful Helical Quantum Energy Wormhole / Link -->
        <path d="M 78 94 Q 100 80 122 94" fill="none" stroke="${cLink}" stroke-width="2.5" />
        <path d="M 78 102 Q 100 116 122 102" fill="none" stroke="${cLink}" stroke-width="2.5" />
        <path d="M 78 98 L 122 98" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3,2" />

        <!-- Bell State Notation -->
        <text x="100" y="74" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="${cLink}">|Φ⁺⟩</text>

        <!-- Quantum Sparkles on the bridge -->
        <circle cx="92" cy="90" r="2.5" fill="${c1}" />
        <circle cx="108" cy="106" r="2.5" fill="${c2}" />
        <circle cx="100" cy="98" r="3" fill="#FFFFFF" />
      `;
    },

    'circuits': function (tier) {
      const isLocked = tier === 'locked';
      const cWire = isLocked ? '#4B5563' : '#38BDF8';
      const cGate = isLocked ? '#374151' : '#7C5CFF';
      const cMeter = isLocked ? '#374151' : '#10B981';
      return `
        <!-- 3-Qubit Quantum Circuit Lattice -->
        <line x1="42" y1="72" x2="158" y2="72" stroke="${cWire}" stroke-width="1.8" />
        <line x1="42" y1="98" x2="158" y2="98" stroke="${cWire}" stroke-width="1.8" />
        <line x1="42" y1="124" x2="158" y2="124" stroke="${cWire}" stroke-width="1.8" />

        <!-- Gate 1: H on q0 -->
        <rect x="58" y="62" width="20" height="20" rx="4" fill="${cGate}" stroke="${cWire}" stroke-width="1.2" />
        <text x="68" y="76" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="11" font-weight="700" fill="#FFF">H</text>

        <!-- Gate 2: CNOT q0 -> q1 -->
        <line x1="94" y1="72" x2="94" y2="98" stroke="${cGate}" stroke-width="2" />
        <circle cx="94" cy="72" r="3.5" fill="${cGate}" />
        <circle cx="94" cy="98" r="7" fill="none" stroke="${cWire}" stroke-width="1.5" />
        <line x1="94" y1="93" x2="94" y2="103" stroke="${cWire}" stroke-width="1.2" />
        <line x1="89" y1="98" x2="99" y2="98" stroke="${cWire}" stroke-width="1.2" />

        <!-- Gate 3: X on q2 -->
        <rect x="94" y="114" width="20" height="20" rx="4" fill="${cGate}" stroke="${cWire}" stroke-width="1.2" />
        <text x="104" y="128" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="11" font-weight="700" fill="#FFF">X</text>

        <!-- Measurement Block on q0 -->
        <rect x="126" y="62" width="22" height="20" rx="4" fill="${cMeter}" stroke="#059669" stroke-width="1.2" />
        <!-- Meter Arc & Needle -->
        <path d="M 131 75 A 6 6 0 0 1 143 75" fill="none" stroke="#FFF" stroke-width="1" />
        <line x1="137" y1="75" x2="141" y2="69" stroke="#FFF" stroke-width="1.2" />

        <!-- Measurement Block on q1 -->
        <rect x="126" y="88" width="22" height="20" rx="4" fill="${cMeter}" stroke="#059669" stroke-width="1.2" />
        <path d="M 131 101 A 6 6 0 0 1 143 101" fill="none" stroke="#FFF" stroke-width="1" />
        <line x1="137" y1="101" x2="141" y2="95" stroke="#FFF" stroke-width="1.2" />
      `;
    },

    // --- MAIN BADGE TOPIC 2: Quantum Architect ---
    'quantum-architect': function (tier) {
      const isLocked = tier === 'locked';
      const cCircuit = isLocked ? '#4B5563' : '#38BDF8';
      const cMatrix = isLocked ? '#374151' : '#7C5CFF';
      const cCore = isLocked ? '#1F2937' : '#0284C7';
      const isSuperior = tier === 'superior';

      return `
        <!-- Architectural Quantum Circuit Geometry -->
        <!-- Concentric Cyber-Rings -->
        <polygon points="100,50 142,75 142,125 100,150 58,125 58,75" fill="none" stroke="${cMatrix}" stroke-width="1.6" stroke-dasharray="6,3" />
        <polygon points="100,60 132,78 132,122 100,140 68,122 68,78" fill="none" stroke="${cCircuit}" stroke-width="1.4" opacity="0.6" />

        <!-- Multi-Bus Radial Tracks -->
        <line x1="100" y1="46" x2="100" y2="72" stroke="${cCircuit}" stroke-width="2" />
        <line x1="146" y1="72" x2="124" y2="86" stroke="${cCircuit}" stroke-width="2" />
        <line x1="146" y1="128" x2="124" y2="114" stroke="${cCircuit}" stroke-width="2" />
        <line x1="100" y1="154" x2="100" y2="128" stroke="${cCircuit}" stroke-width="2" />
        <line x1="54" y1="128" x2="76" y2="114" stroke="${cCircuit}" stroke-width="2" />
        <line x1="54" y1="72" x2="76" y2="86" stroke="${cCircuit}" stroke-width="2" />

        <!-- Quantum Logic Nodes on Vertices -->
        <circle cx="100" cy="50" r="4" fill="${isSuperior ? '#FDE047' : '#22D3EE'}" />
        <circle cx="142" cy="75" r="4" fill="${cMatrix}" />
        <circle cx="142" cy="125" r="4" fill="${cCircuit}" />
        <circle cx="100" cy="150" r="4" fill="${isSuperior ? '#FDE047' : '#22D3EE'}" />
        <circle cx="58" cy="125" r="4" fill="${cCircuit}" />
        <circle cx="58" cy="75" r="4" fill="${cMatrix}" />

        <!-- Central Hyper-Core Processor -->
        <circle cx="100" cy="100" r="22" fill="${cCore}" stroke="${isSuperior ? '#FDE047' : '#67E8F9'}" stroke-width="2" />
        <circle cx="100" cy="100" r="12" fill="${isLocked ? '#374151' : '#4C1D95'}" />
        
        <!-- Central Unitary Matrix Symbol -->
        <text x="100" y="105" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">U</text>

        <!-- Integrated Circuit Gates -->
        <rect x="74" y="93" width="10" height="14" rx="2" fill="${cMatrix}" stroke="${cCircuit}" stroke-width="1" />
        <rect x="116" y="93" width="10" height="14" rx="2" fill="${cMatrix}" stroke="${cCircuit}" stroke-width="1" />
      `;
    }
  };

  /**
   * Main render method
   * @param {string} badgeId - e.g. 'qubit', 'quantum-awakening'
   * @param {string} tier - 'locked' | 'earned' | 'mastered' | 'superior'
   * @param {object} options - { size: 96, isMain: false, className: '' }
   */
  function renderBadge(badgeId, tier = 'locked', options = {}) {
    const isMain = options.isMain || badgeId.startsWith('quantum-');
    const size = options.size || (isMain ? 120 : 88);
    const className = options.className || '';

    // Validate tier
    let activeTier = tier;
    if (isMain && tier === 'mastered') activeTier = 'superior';
    if (!['locked', 'earned', 'mastered', 'superior'].includes(activeTier)) {
      activeTier = 'locked';
    }

    const isLocked = activeTier === 'locked';
    const isMastered = activeTier === 'mastered';
    const isSuperior = activeTier === 'superior';

    // Frame styling
    let frameStroke = 'url(#qf-locked)';
    let bgFill = 'url(#q-bg-locked)';
    let filterAttr = '';

    if (activeTier === 'earned') {
      frameStroke = isMain ? 'url(#qf-main-earned)' : 'url(#qf-earned)';
      bgFill = 'url(#q-bg-earned)';
      filterAttr = 'filter="url(#q-glow-subtle)"';
    } else if (isMastered) {
      frameStroke = 'url(#qf-mastered)';
      bgFill = 'url(#q-bg-mastered)';
      filterAttr = 'filter="url(#q-glow-intense)"';
    } else if (isSuperior) {
      frameStroke = 'url(#qf-superior)';
      bgFill = 'url(#q-bg-superior)';
      filterAttr = 'filter="url(#q-glow-superior)"';
    }

    // Outer Gyroscope / Orbital Ring for Mastered & Superior
    let orbitalLayer = '';
    if (isMastered) {
      orbitalLayer = `
        <!-- Mastered Orbital Ring -->
        <g class="q-orbital-ring">
          <ellipse cx="100" cy="100" rx="88" ry="34" fill="none" stroke="url(#qf-mastered)" stroke-width="1.8" stroke-dasharray="8,4" opacity="0.85" transform="rotate(-30 100 100)" />
          <circle cx="28" cy="62" r="3" fill="#67E8F9" filter="url(#q-glow-subtle)" />
          <circle cx="172" cy="138" r="3" fill="#F472B6" filter="url(#q-glow-subtle)" />
        </g>
      `;
    } else if (isSuperior) {
      orbitalLayer = `
        <!-- Superior Dual Gyroscopic Corona & Orbital Halo -->
        <g class="q-superior-halo">
          <ellipse cx="100" cy="100" rx="94" ry="40" fill="none" stroke="url(#qf-superior)" stroke-width="2.2" stroke-dasharray="12,6" opacity="0.9" transform="rotate(-35 100 100)" />
          <ellipse cx="100" cy="100" rx="94" ry="40" fill="none" stroke="url(#qf-superior)" stroke-width="2.2" stroke-dasharray="12,6" opacity="0.9" transform="rotate(45 100 100)" />
          
          <!-- Crown Flares / Corona Rays -->
          <polygon points="100,2 104,14 96,14" fill="#FDE047" />
          <polygon points="100,198 104,186 96,186" fill="#06B6D4" />
          <polygon points="2,100 14,104 14,96" fill="#F472B6" />
          <polygon points="198,100 186,104 186,96" fill="#8B5CF6" />

          <!-- Orbiting Quanta -->
          <circle cx="18" cy="46" r="3.5" fill="#FDE047" />
          <circle cx="182" cy="154" r="3.5" fill="#06B6D4" />
          <circle cx="180" cy="46" r="3.5" fill="#EC4899" />
          <circle cx="20" cy="154" r="3.5" fill="#8B5CF6" />
        </g>
      `;
    }

    // Lock Overlay if locked
    let lockOverlay = '';
    if (isLocked) {
      lockOverlay = `
        <!-- Dark Shade -->
        <path d="${getInnerFramePath(isMain)}" fill="#090D19" fill-opacity="0.65" />
        <!-- Lock Icon Silhouette -->
        <g transform="translate(86, 128)" opacity="0.75">
          <rect x="5" y="10" width="18" height="14" rx="3" fill="#4B5563" stroke="#6B7280" stroke-width="1.2" />
          <path d="M 8 10 L 8 6 A 6 6 0 0 1 20 6 L 20 10" fill="none" stroke="#6B7280" stroke-width="1.8" />
          <circle cx="14" cy="16" r="1.5" fill="#111827" />
        </g>
      `;
    }

    // Get specific badge art
    const iconFn = BADGE_ICONS[badgeId] || BADGE_ICONS['qubit'];
    const iconSvg = iconFn(activeTier);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" 
           viewBox="0 0 200 200" 
           width="${size}" 
           height="${size}" 
           class="quantum-badge-svg tier-${activeTier} ${isMain ? 'is-main-badge' : 'is-small-badge'} ${className}"
           data-badge-id="${badgeId}" 
           data-tier="${activeTier}"
           role="img"
           aria-label="${badgeId} Badge (${activeTier})">
        ${getSharedDefs()}
        
        ${orbitalLayer}

        <!-- Outer Frame Shield -->
        <path d="${getFramePath(isMain)}" 
              fill="${bgFill}" 
              stroke="${frameStroke}" 
              stroke-width="${isSuperior ? '3.5' : isMastered ? '3' : '2.2'}" 
              ${filterAttr} />

        <!-- Inner Bevel/Border Accent -->
        <path d="${getInnerFramePath(isMain)}" 
              fill="none" 
              stroke="${isLocked ? '#1F2937' : '#FFFFFF'}" 
              stroke-width="1" 
              opacity="${isLocked ? '0.2' : isSuperior ? '0.5' : '0.25'}" />

        <!-- Central Artwork -->
        <g class="badge-icon-layer" ${isLocked ? 'filter="grayscale(100%) opacity(40%)"' : ''}>
          ${iconSvg}
        </g>

        ${lockOverlay}
      </svg>
    `;
  }

  return {
    render: renderBadge,
    renderSmall: (id, tier, size = 88) => renderBadge(id, tier, { size, isMain: false }),
    renderMain: (id, tier, size = 120) => renderBadge(id, tier, { size, isMain: true })
  };
})();

// Attach to window
if (typeof window !== 'undefined') {
  window.BadgeRenderer = BadgeRenderer;
}
