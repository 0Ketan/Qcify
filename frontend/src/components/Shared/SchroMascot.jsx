import React, { useId } from 'react';

/**
 * QUANTUMPAWS V2 — Schrö Mascot (100% Vector Chalk-Sketch Blackboard Style)
 */
export function SchroMascot({ expression = 'happy', size = 120, className = '' }) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '_');
  const haloSize = size * 0.6;

  // Render expression elements
  const renderExpression = () => {
    switch (expression) {
      case 'idle':
        return (
          <>
            <path d="M30 52 Q37 47 44 51" stroke="#22D3EE" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M58 51 Q65 47 72 52" stroke="#22D3EE" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="37" cy="53" r="1.5" fill="#E2E8F0" opacity="0.6" />
            <circle cx="65" cy="53" r="1.5" fill="#E2E8F0" opacity="0.6" />
            <path d="M43 64 Q50 69 57 64" stroke="#E2E8F0" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M50 62 L50 66" stroke="#E2E8F0" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M78 48 Q82 44 86 48" stroke="#F1F5F9" strokeWidth="1.2" strokeOpacity="0.3" fill="none" strokeLinecap="round" />
          </>
        );

      case 'thinking':
        return (
          <>
            <ellipse cx="36" cy="51" rx="6.5" ry="6" fill="#22D3EE" />
            <ellipse cx="37" cy="50" rx="4" ry="4" fill="#090D19" />
            <circle cx="39" cy="48" r="1.8" fill="#FFFFFF" />
            <path d="M58 52 Q64 47 71 50" stroke="#22D3EE" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M44 65 Q50 63 56 66" stroke="#E2E8F0" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M56 74 Q68 70 66 82 Q56 86 52 78 Z" fill="#6D4AFF" stroke="#F1F5F9" strokeWidth="1.5" strokeOpacity="0.25" />
            <text x="76" y="38" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="16" fill="#FBBF24">?</text>
            <text x="66" y="22" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#22D3EE" opacity="0.8">|ψ⟩=α|0⟩+β|1⟩</text>
          </>
        );

      case 'encouraging':
        return (
          <>
            <ellipse cx="36" cy="51" rx="6.5" ry="6.5" fill="#22D3EE" />
            <circle cx="36" cy="50" r="3.5" fill="#090D19" />
            <circle cx="38" cy="48" r="1.5" fill="#FFFFFF" />
            <path d="M59 52 Q66 45 73 51" stroke="#22D3EE" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M42 63 Q51 72 60 64" stroke="#F9A8D4" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M72 68 Q84 62 82 78 Q74 84 70 76 Z" fill="#6D4AFF" stroke="#F1F5F9" strokeWidth="1.5" strokeOpacity="0.25" />
            <text x="76" y="62" fontSize="13">👍</text>
            <text x="14" y="38" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#A3FF12" fontWeight="700">+10 XP</text>
          </>
        );

      case 'excited':
        return (
          <>
            <path d="M35 44 L37 49 L42 49 L38 52 L40 57 L35 54 L30 57 L32 52 L28 49 L33 49 Z" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="0.5" />
            <path d="M65 44 L67 49 L72 49 L68 52 L70 57 L65 54 L60 57 L62 52 L58 49 L63 49 Z" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="0.5" />
            <path d="M39 63 Q51 82 63 63 Z" fill="rgba(249,168,212,0.5)" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round" />
            <circle cx="28" cy="62" r="6" fill="rgba(249,168,212,0.45)" />
            <circle cx="74" cy="62" r="6" fill="rgba(249,168,212,0.45)" />
            <path d="M78 30 L73 38 L77 39 L71 49" stroke="#A3FF12" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M18 36 L23 44 L19 45 L25 55" stroke="#22D3EE" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <text x="76" y="24" fontSize="12" fill="#FBBF24">✨</text>
          </>
        );

      case 'happy':
      default:
        return (
          <>
            <path d="M28 52 Q36 43 44 52" stroke="#22D3EE" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M58 52 Q66 43 74 52" stroke="#22D3EE" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M41 63 Q51 76 61 63" stroke="#F9A8D4" strokeWidth="2" fill="rgba(249,168,212,0.35)" strokeLinecap="round" />
            <path d="M51 61 L51 66" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="31" cy="58" r="5.5" fill="rgba(249,168,212,0.4)" filter="blur(0.5px)" />
            <circle cx="71" cy="58" r="5.5" fill="rgba(249,168,212,0.4)" filter="blur(0.5px)" />
            <path d="M80 34 L82 30 L84 34 L88 36 L84 38 L82 42 L80 38 L76 36 Z" fill="#FBBF24" opacity="0.75" />
          </>
        );
    }
  };

  return (
    <div
      className={`schro-container schro-${expression} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * 1.22}px`,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
        filter: 'drop-shadow(0 6px 18px rgba(109,74,255,0.25))'
      }}
    >
      {/* V2 Hand-sketched Quantum Halo */}
      <svg
        width={haloSize}
        height={haloSize * 0.44}
        viewBox="0 0 64 28"
        style={{ overflow: 'visible', flexShrink: 0, marginBottom: '-4px' }}
      >
        <ellipse
          cx="32"
          cy="14"
          rx="28"
          ry="9.5"
          stroke="#22D3EE"
          strokeWidth="1.8"
          strokeDasharray="24 1.5 18 1.5"
          fill="none"
          style={{ animation: 'chalkWobble 4s ease-in-out infinite' }}
        />
        <ellipse
          cx="32"
          cy="14"
          rx="28"
          ry="9.5"
          stroke="#F1F5F9"
          strokeWidth="1.4"
          strokeOpacity="0.18"
          fill="none"
        />
        {/* Cyan Qubit Particle */}
        <circle r="3.2" fill="#22D3EE">
          <animateTransform attributeName="transform" type="rotate" from="0 32 14" to="360 32 14" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="cx" values="60;32;4;32;60" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="14;5;14;23;14" dur="2.8s" repeatCount="indefinite" />
        </circle>
        {/* Electric Lime Pop Qubit Particle */}
        <circle r="2.6" fill="#A3FF12">
          <animateTransform attributeName="transform" type="rotate" from="180 32 14" to="540 32 14" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="cx" values="4;32;60;32;4" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="14;23;14;5;14" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* 100% Vector Chalk-Sketch Cat Body */}
      <svg
        width={size}
        height={size * 1.08}
        viewBox="0 0 100 120"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id={`furGrad_${uid}`} cx="48%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="70%" stopColor="#6D4AFF" />
            <stop offset="100%" stopColor="#4C2AB8" />
          </radialGradient>
          <radialGradient id={`bellyGrad_${uid}`} cx="50%" cy="52%" r="48%">
            <stop offset="0%" stopColor="#D8B4FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </radialGradient>
        </defs>

        {/* Tail */}
        <path
          d="M72 106 Q92 102 96 86 Q100 70 86 68"
          stroke={`url(#furGrad_${uid})`}
          strokeWidth="8.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M72 106 Q92 102 96 86 Q100 70 86 68"
          stroke="#F1F5F9"
          strokeWidth="1.5"
          strokeOpacity="0.18"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 2"
        />
        <circle cx="86" cy="68" r="3.2" fill="#22D3EE" opacity="0.8" />

        {/* Body */}
        <path
          d="M22 96 C22 76, 34 74, 50 74 C66 74, 78 76, 78 96 C78 112, 65 116, 50 116 C35 116, 22 112, 22 96 Z"
          fill={`url(#furGrad_${uid})`}
        />
        <path
          d="M22 96 C22 76, 34 74, 50 74 C66 74, 78 76, 78 96 C78 112, 65 116, 50 116 C35 116, 22 112, 22 96 Z"
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="1.5"
          strokeOpacity="0.18"
          strokeLinecap="round"
        />

        {/* Belly */}
        <ellipse cx="50" cy="98" rx="15" ry="13" fill={`url(#bellyGrad_${uid})`} opacity="0.9" />

        {/* Head */}
        <circle cx="50" cy="50" r="31.5" fill={`url(#furGrad_${uid})`} />
        <circle cx="50" cy="50" r="31.5" fill="none" stroke="#F1F5F9" strokeWidth="1.5" strokeOpacity="0.2" />

        {/* Left Ear */}
        <path d="M23 28 L13 7 L37 22 Z" fill="#5B21B6" />
        <path d="M23 28 L13 7 L37 22 Z" fill="none" stroke="#F1F5F9" strokeWidth="1.5" strokeOpacity="0.22" strokeLinejoin="round" />
        <path d="M24 25 L17 12 L34 21 Z" fill="#C4B5FD" opacity="0.7" />

        {/* Right Ear */}
        <path d="M77 28 L87 7 L63 22 Z" fill="#5B21B6" />
        <path d="M77 28 L87 7 L63 22 Z" fill="none" stroke="#F1F5F9" strokeWidth="1.5" strokeOpacity="0.22" strokeLinejoin="round" />
        <path d="M76 25 L83 12 L66 21 Z" fill="#C4B5FD" opacity="0.7" />

        {/* Expression Face Features */}
        {renderExpression()}

        {/* Whiskers */}
        <g stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35">
          <path d="M16 61 Q26 62 37 63" />
          <path d="M14 66 Q25 66 36 66" />
          <path d="M17 71 Q27 69 37 68" />
          <path d="M84 61 Q74 62 63 63" />
          <path d="M86 66 Q75 66 64 66" />
          <path d="M83 71 Q73 69 63 68" />
        </g>

        {/* Paws */}
        <ellipse cx="27" cy="98" rx="8.5" ry="13.5" fill={`url(#furGrad_${uid})`} transform="rotate(-14 27 98)" />
        <ellipse cx="27" cy="98" rx="8.5" ry="13.5" fill="none" stroke="#F1F5F9" strokeWidth="1.5" strokeOpacity="0.18" transform="rotate(-14 27 98)" />
        <ellipse cx="73" cy="98" rx="8.5" ry="13.5" fill={`url(#furGrad_${uid})`} transform="rotate(14 73 98)" />
        <ellipse cx="73" cy="98" rx="8.5" ry="13.5" fill="none" stroke="#F1F5F9" strokeWidth="1.5" strokeOpacity="0.18" transform="rotate(14 73 98)" />
      </svg>
    </div>
  );
}
