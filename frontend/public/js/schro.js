/**
 * QUANTUMPAWS V2 — HUMAN LAB EDITION
 * Schrö Mascot Component (100% Editable Vector, Chalk-Sketch Blackboard Style)
 */

let schroInstanceCount = 0;

const SchroExpressions = {
  idle: {
    eyes: `
      <!-- Chalk-sketch relaxed eyes -->
      <path d="M30 52 Q37 47 44 51" stroke="#22D3EE" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M58 51 Q65 47 72 52" stroke="#22D3EE" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <circle cx="37" cy="53" r="1.5" fill="#E2E8F0" opacity="0.6"/>
      <circle cx="65" cy="53" r="1.5" fill="#E2E8F0" opacity="0.6"/>
    `,
    mouth: `
      <!-- Hand-drawn wobbly cat smile -->
      <path d="M43 64 Q50 69 57 64" stroke="#E2E8F0" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M50 62 L50 66" stroke="#E2E8F0" stroke-width="1.4" stroke-linecap="round"/>
    `,
    extras: `
      <!-- Subtle chalk purr waves -->
      <path d="M78 48 Q82 44 86 48" stroke="#F1F5F9" stroke-width="1.2" stroke-opacity="0.3" fill="none" stroke-linecap="round"/>
      <path d="M82 42 Q86 38 90 42" stroke="#F1F5F9" stroke-width="1.2" stroke-opacity="0.2" fill="none" stroke-linecap="round"/>
    `,
    bodyPose: 'idle'
  },
  thinking: {
    eyes: `
      <!-- Curious asymmetrical eyes -->
      <ellipse cx="36" cy="51" rx="6.5" ry="6" fill="#22D3EE"/>
      <ellipse cx="37" cy="50" rx="4" ry="4" fill="#090D19"/>
      <circle cx="39" cy="48" r="1.8" fill="#FFFFFF"/>
      <path d="M58 52 Q64 47 71 50" stroke="#22D3EE" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <!-- Chalk brow furrow -->
      <path d="M30 42 L42 45" stroke="#F1F5F9" stroke-width="1.2" stroke-opacity="0.25" stroke-linecap="round"/>
      <path d="M58 45 L70 42" stroke="#F1F5F9" stroke-width="1.2" stroke-opacity="0.25" stroke-linecap="round"/>
    `,
    mouth: `
      <!-- Curious tilted mouth -->
      <path d="M44 65 Q50 63 56 66" stroke="#E2E8F0" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    `,
    extras: `
      <!-- Paw scratched under chin -->
      <path d="M56 74 Q68 70 66 82 Q56 86 52 78 Z" fill="#6D4AFF" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.25"/>
      <!-- Blackboard chalk formula & question mark -->
      <text x="76" y="38" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="16" fill="#FBBF24" opacity="0.9">?</text>
      <text x="68" y="22" font-family="'JetBrains Mono', monospace" font-size="8.5" fill="#22D3EE" opacity="0.6">|ψ⟩ = α|0⟩+β|1⟩</text>
    `,
    bodyPose: 'thinking'
  },
  happy: {
    eyes: `
      <!-- Joyful squinty curves -->
      <path d="M28 52 Q36 43 44 52" stroke="#22D3EE" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M58 52 Q66 43 74 52" stroke="#22D3EE" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    `,
    mouth: `
      <!-- Open cheerful cat grin -->
      <path d="M41 63 Q51 76 61 63" stroke="#F9A8D4" stroke-width="2" fill="rgba(249,168,212,0.35)" stroke-linecap="round"/>
      <path d="M51 61 L51 66" stroke="#E2E8F0" stroke-width="1.2" stroke-linecap="round"/>
    `,
    extras: `
      <!-- Rosy chalk cheek smudges -->
      <circle cx="31" cy="58" r="5.5" fill="rgba(249,168,212,0.4)" filter="blur(0.5px)"/>
      <circle cx="71" cy="58" r="5.5" fill="rgba(249,168,212,0.4)" filter="blur(0.5px)"/>
      <!-- Sparkle marks -->
      <path d="M80 34 L82 30 L84 34 L88 36 L84 38 L82 42 L80 38 L76 36 Z" fill="#FBBF24" opacity="0.75"/>
    `,
    bodyPose: 'happy'
  },
  encouraging: {
    eyes: `
      <!-- Confident wink -->
      <ellipse cx="36" cy="51" rx="6.5" ry="6.5" fill="#22D3EE"/>
      <circle cx="36" cy="50" r="3.5" fill="#090D19"/>
      <circle cx="38" cy="48" r="1.5" fill="#FFFFFF"/>
      <path d="M59 52 Q66 45 73 51" stroke="#22D3EE" stroke-width="2.8" stroke-linecap="round" fill="none"/>
    `,
    mouth: `
      <!-- Encouraging smirk -->
      <path d="M42 63 Q51 72 60 64" stroke="#F9A8D4" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    `,
    extras: `
      <!-- Raised high-paw with chalk star -->
      <path d="M72 68 Q84 62 82 78 Q74 84 70 76 Z" fill="#6D4AFF" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.25"/>
      <text x="76" y="62" font-size="13">👍</text>
      <text x="14" y="38" font-family="'JetBrains Mono', monospace" font-size="9" fill="#A3FF12" font-weight="700">+10 XP</text>
    `,
    bodyPose: 'encouraging'
  },
  excited: {
    eyes: `
      <!-- Hand-drawn star eyes -->
      <path d="M35 44 L37 49 L42 49 L38 52 L40 57 L35 54 L30 57 L32 52 L28 49 L33 49 Z" fill="#FBBF24" stroke="#FFFFFF" stroke-width="0.5"/>
      <path d="M65 44 L67 49 L72 49 L68 52 L70 57 L65 54 L60 57 L62 52 L58 49 L63 49 Z" fill="#FBBF24" stroke="#FFFFFF" stroke-width="0.5"/>
    `,
    mouth: `
      <!-- Big open happy mouth -->
      <path d="M39 63 Q51 82 63 63 Z" fill="rgba(249,168,212,0.5)" stroke="#F9A8D4" stroke-width="2" stroke-linecap="round"/>
    `,
    extras: `
      <circle cx="28" cy="62" r="6" fill="rgba(249,168,212,0.45)"/>
      <circle cx="74" cy="62" r="6" fill="rgba(249,168,212,0.45)"/>
      <!-- Electric quantum lightning doodles -->
      <path d="M78 30 L73 38 L77 39 L71 49" stroke="#A3FF12" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M18 36 L23 44 L19 45 L25 55" stroke="#22D3EE" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <text x="76" y="24" font-size="12" fill="#FBBF24">✨</text>
    `,
    bodyPose: 'excited'
  }
};

/**
 * Main renderSchro function — produces 100% editable vector chalk-sketch Schrö
 */
function renderSchro(expression = 'happy', size = 120, containerId = null) {
  schroInstanceCount++;
  const uid = `schro-${schroInstanceCount}`;
  const expr = SchroExpressions[expression] || SchroExpressions.happy;
  const haloSize = size * 0.6;

  const wrapper = document.createElement('div');
  wrapper.className = `schro-container schro-${expression} schro-chalk-sketch animate-float`;
  wrapper.id = uid;
  wrapper.style.cssText = `width:${size}px;height:${size * 1.22}px;display:inline-flex;flex-direction:column;align-items:center;position:relative;user-select:none`;

  wrapper.innerHTML = `
    <!-- V2 Hand-drawn Chalk Quantum Halo -->
    <svg width="${haloSize}" height="${haloSize * 0.44}" viewBox="0 0 64 28" style="overflow:visible;flex-shrink:0;margin-bottom:-4px" class="schro-halo-svg">
      <defs>
        <filter id="haloGlow-${uid}" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="chalkWobble-${uid}">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      
      <!-- Wobbly hand-sketched orbit ring -->
      <ellipse cx="32" cy="14" rx="28" ry="9.5" 
        stroke="#22D3EE" stroke-width="1.8" stroke-dasharray="24 1.5 18 1.5"
        fill="none" filter="url(#haloGlow-${uid})" style="animation: chalkWobble 4s ease-in-out infinite"/>
      
      <!-- Chalk highlight stroke (1.5px @ 18% opacity) -->
      <ellipse cx="32" cy="14" rx="28" ry="9.5" 
        stroke="#F1F5F9" stroke-width="1.4" stroke-opacity="0.18"
        fill="none"/>

      <!-- Orbiting Particle 1: Cyan Qubit -->
      <circle r="3.2" fill="#22D3EE" filter="drop-shadow(0 0 4px #22D3EE)">
        <animateTransform attributeName="transform" type="rotate" from="0 32 14" to="360 32 14" dur="2.8s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="60;32;4;32;60" dur="2.8s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="14;5;14;23;14" dur="2.8s" repeatCount="indefinite"/>
      </circle>

      <!-- Orbiting Particle 2: Electric Lime Qubit (Pop Color) -->
      <circle r="2.6" fill="#A3FF12" filter="drop-shadow(0 0 4px #A3FF12)">
        <animateTransform attributeName="transform" type="rotate" from="180 32 14" to="540 32 14" dur="2.8s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="4;32;60;32;4" dur="2.8s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="14;23;14;5;14" dur="2.8s" repeatCount="indefinite"/>
      </circle>
    </svg>

    <!-- V2 100% Vector Chalk-Sketch Cat Body -->
    <svg width="${size}" height="${size * 1.08}" viewBox="0 0 100 120" style="overflow:visible" class="schro-cat-svg">
      <defs>
        <!-- Chalkboard Fur Gradient with human lab dirty violet -->
        <radialGradient id="furGrad-${uid}" cx="48%" cy="42%" r="58%">
          <stop offset="0%" stop-color="#7C5CFF"/>
          <stop offset="70%" stop-color="#6D4AFF"/>
          <stop offset="100%" stop-color="#4C2AB8"/>
        </radialGradient>
        <radialGradient id="bellyGrad-${uid}" cx="50%" cy="52%" r="48%">
          <stop offset="0%" stop-color="#D8B4FE"/>
          <stop offset="100%" stop-color="#A78BFA"/>
        </radialGradient>
        <!-- Chalk outline texture & shadow filter -->
        <filter id="chalkCat-${uid}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#7C5CFF" flood-opacity="0.32"/>
        </filter>
      </defs>

      <!-- Organic Wobbly Tail -->
      <path d="M72 106 Q92 102 96 86 Q100 70 86 68" 
        stroke="url(#furGrad-${uid})" stroke-width="8.5" fill="none" stroke-linecap="round"/>
      <!-- Tail hand-drawn chalk outline -->
      <path d="M72 106 Q92 102 96 86 Q100 70 86 68" 
        stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.18" fill="none" stroke-linecap="round" stroke-dasharray="8 2"/>
      <!-- Tail tip particle -->
      <circle cx="86" cy="68" r="3.2" fill="#22D3EE" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
      </circle>

      <!-- Main Cat Body (Hand-drawn organic curve) -->
      <path d="M22 96 C22 76, 34 74, 50 74 C66 74, 78 76, 78 96 C78 112, 65 116, 50 116 C35 116, 22 112, 22 96 Z"
        fill="url(#furGrad-${uid})" filter="url(#chalkCat-${uid})"/>
      <!-- Body chalk stroke outline (1.5px @ 18% opacity, slight wobble) -->
      <path d="M22 96 C22 76, 34 74, 50 74 C66 74, 78 76, 78 96 C78 112, 65 116, 50 116 C35 116, 22 112, 22 96 Z"
        fill="none" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.18" stroke-linecap="round"/>

      <!-- Cat Belly -->
      <ellipse cx="50" cy="98" rx="15" ry="13" fill="url(#bellyGrad-${uid})" opacity="0.9"/>
      <!-- Belly chalk contour -->
      <path d="M36 96 C36 88, 43 85, 50 85 C57 85, 64 88, 64 96 C64 105, 57 111, 50 111 C43 111, 36 105, 36 96 Z"
        fill="none" stroke="#F1F5F9" stroke-width="1.2" stroke-opacity="0.15" stroke-dasharray="6 2"/>

      <!-- Organic Round Head (Chalk sketched) -->
      <circle cx="50" cy="50" r="31.5" fill="url(#furGrad-${uid})"/>
      <!-- Head chalk stroke outline -->
      <circle cx="50" cy="50" r="31.5" fill="none" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.2"/>

      <!-- Left Ear (Hand-drawn organic polygon) -->
      <path d="M23 28 L13 7 L37 22 Z" fill="#5B21B6"/>
      <path d="M23 28 L13 7 L37 22 Z" fill="none" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.22" stroke-linejoin="round"/>
      <!-- Left Inner Ear with chalk hatching -->
      <path d="M24 25 L17 12 L34 21 Z" fill="#C4B5FD" opacity="0.7"/>
      <line x1="20" y1="18" x2="28" y2="23" stroke="#F1F5F9" stroke-width="1" stroke-opacity="0.2"/>

      <!-- Right Ear -->
      <path d="M77 28 L87 7 L63 22 Z" fill="#5B21B6"/>
      <path d="M77 28 L87 7 L63 22 Z" fill="none" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.22" stroke-linejoin="round"/>
      <!-- Right Inner Ear with chalk hatching -->
      <path d="M76 25 L83 12 L66 21 Z" fill="#C4B5FD" opacity="0.7"/>
      <line x1="80" y1="18" x2="72" y2="23" stroke="#F1F5F9" stroke-width="1" stroke-opacity="0.2"/>

      <!-- Expression Eyes -->
      ${expr.eyes}

      <!-- Chalk Nose -->
      <path d="M47 60 Q50 58 53 60 L50 64 Z" fill="#F9A8D4"/>
      <path d="M47 60 Q50 58 53 60 L50 64 Z" fill="none" stroke="#F1F5F9" stroke-width="1" stroke-opacity="0.3"/>

      <!-- Expression Mouth -->
      ${expr.mouth}

      <!-- Wobbly Chalk Whiskers (Left & Right) -->
      <g stroke="#E2E8F0" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.35">
        <path d="M16 61 Q26 62 37 63"/>
        <path d="M14 66 Q25 66 36 66"/>
        <path d="M17 71 Q27 69 37 68"/>
        <path d="M84 61 Q74 62 63 63"/>
        <path d="M86 66 Q75 66 64 66"/>
        <path d="M83 71 Q73 69 63 68"/>
      </g>

      <!-- Left & Right Paws -->
      <ellipse cx="27" cy="98" rx="8.5" ry="13.5" fill="url(#furGrad-${uid})" transform="rotate(-14 27 98)"/>
      <ellipse cx="27" cy="98" rx="8.5" ry="13.5" fill="none" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.18" transform="rotate(-14 27 98)"/>
      
      <ellipse cx="73" cy="98" rx="8.5" ry="13.5" fill="url(#furGrad-${uid})" transform="rotate(14 73 98)"/>
      <ellipse cx="73" cy="98" rx="8.5" ry="13.5" fill="none" stroke="#F1F5F9" stroke-width="1.5" stroke-opacity="0.18" transform="rotate(14 73 98)"/>

      <!-- Expression Extras (formulas, props, sparkles) -->
      ${expr.extras}
    </svg>
  `;

  if (containerId) {
    const container = document.getElementById(containerId);
    if (container) container.appendChild(wrapper);
  }

  return wrapper;
}

// Shorthand helper
function Schro(expression = 'happy', size = 120) {
  return renderSchro(expression, size);
}

// Insert into DOM element
function insertSchro(elementId, expression = 'happy', size = 120) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';
  el.appendChild(renderSchro(expression, size));
}
