import React, { useState } from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { SchroMascot } from '../../components/Shared/SchroMascot';

export function OnboardingPage() {
  const currentName = useUserStore(s => s.playerName);
  const currentTrack = useUserStore(s => s.track);

  // 2-Step Flow: Step 1 = Callsign/Name, Step 2 = Level/Track Selection
  const [step, setStep] = useState(1);
  const [nameInput, setNameInput] = useState(currentName || '');
  const [selectedTrack, setSelectedTrack] = useState(currentTrack || 'newbie');
  const [nameError, setNameError] = useState('');

  const quickPicks = [
    'Marie Curie',
    'Erwin Schrödinger',
    'Richard Feynman',
    'Ada Lovelace',
    'Niels Bohr',
    'Max Planck'
  ];

  const tracks = [
    {
      id: 'newbie',
      levelNumber: 1,
      badgeTitle: 'LEVEL 1 • BEGINNER',
      icon: '🌊',
      title: 'Newbie Explorer',
      tagline: 'Zero Math • Intuitive Analogies & Stories',
      desc: 'Explore quantum weirdness with cat superpositions, coin flips, and visual wave interference. No complex linear algebra required!',
      starterReward: 'Wave Rider Badge 🌊 + 50 XP',
      features: [
        '🐱 Schrödinger\'s cat paradox & superposition',
        '🪙 Quantum coin flips & measurement collapse',
        '🔮 Visual state sphere & probability bar graphs'
      ],
      themeColor: 'var(--accent-lime)'
    },
    {
      id: 'intermediate',
      levelNumber: 2,
      badgeTitle: 'LEVEL 2 • PRACTITIONER',
      icon: '🧩',
      title: 'Intermediate Builder',
      tagline: 'Quantum Gates & Interactive Circuit Composition',
      desc: 'Step into circuit design with Hadamard (H), Pauli (X/Y/Z), Phase (S/T), and 2-qubit CNOT gates. Solve gateway quantum puzzles!',
      starterReward: 'Gate Maker Badge 🔮 + 100 XP',
      features: [
        '⚡ Compose multi-qubit circuits (2 to 5 qubits)',
        '🌀 Create entangled Bell States |Φ⁺⟩',
        '📊 Real-time measurement shots histogram & counts'
      ],
      themeColor: 'var(--accent)'
    },
    {
      id: 'advanced',
      levelNumber: 3,
      badgeTitle: 'LEVEL 3 • RESEARCHER',
      icon: '⚛️',
      title: 'Advanced Researcher',
      tagline: 'Dirac Notation, Statevectors & Native Qiskit',
      desc: 'Master the rigorous mathematics: bra-ket notation |ψ⟩, unitary transformation matrices, Bloch sphere angles (θ, φ), and export to Qiskit Python.',
      starterReward: 'Schrö Master Badge 💎 + 150 XP',
      features: [
        '📐 Single-qubit Bloch vector expectation values (⟨X⟩, ⟨Y⟩, ⟨Z⟩)',
        '🧮 Complex amplitude statevectors & density matrices',
        '🐍 Native Qiskit Python code & OpenQASM export'
      ],
      themeColor: 'var(--primary)'
    }
  ];

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (!nameInput.trim()) {
      setNameError('Please enter a scientist callsign to proceed');
      return;
    }
    setNameError('');
    userStore.setPlayerName(nameInput.trim());
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    userStore.completeOnboarding({
      name: nameInput.trim() || 'Cadet',
      track: selectedTrack
    });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '32px auto', padding: '0 24px' }}>
      {/* 2-Step Progress Indicator Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '16px 24px',
        background: 'var(--surface)',
        border: '1px dashed var(--stroke-chalk)',
        borderRadius: 'var(--radius-imperfect)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Step 1 Pill */}
          <div 
            onClick={() => step === 2 && setStep(1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: step === 2 ? 'pointer' : 'default',
              opacity: step === 1 ? 1 : 0.7,
              transition: 'var(--transition)'
            }}
          >
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'var(--font-code)',
              background: step === 1 ? 'var(--primary)' : 'rgba(163, 255, 18, 0.2)',
              color: step === 1 ? '#fff' : 'var(--accent-lime)',
              border: step === 1 ? '1px solid var(--primary-dirty)' : '1px solid var(--accent-lime)'
            }}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span style={{
              fontWeight: step === 1 ? 700 : 500,
              fontSize: '14px',
              color: step === 1 ? 'var(--text)' : 'var(--text-chalk)'
            }}>
              1. Scientist Identity
            </span>
          </div>

          {/* Divider line */}
          <div style={{
            width: '32px',
            height: '1px',
            background: 'var(--stroke-chalk)',
            display: 'inline-block'
          }} />

          {/* Step 2 Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: step === 2 ? 1 : 0.5,
            transition: 'var(--transition)'
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'var(--font-code)',
              background: step === 2 ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
              color: step === 2 ? '#fff' : 'var(--text-muted)',
              border: step === 2 ? '1px solid var(--primary-dirty)' : '1px solid var(--stroke-chalk)'
            }}>
              2
            </span>
            <span style={{
              fontWeight: step === 2 ? 700 : 500,
              fontSize: '14px',
              color: step === 2 ? 'var(--text)' : 'var(--text-muted)'
            }}>
              2. Choose Level & Track
            </span>
          </div>
        </div>

        <span className="badge badge-lime font-code" style={{ fontSize: '11px' }}>
          {step === 1 ? 'PAGE 1 OF 2' : 'PAGE 2 OF 2'}
        </span>
      </div>

      {/* ============================================================ */}
      {/* PAGE 1: NAME & SCIENTIST CALLSIGN */}
      {/* ============================================================ */}
      {step === 1 && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {/* Hero Welcome Card */}
          <div 
            className="card-sketch"
            style={{
              padding: '36px',
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(260px, 0.8fr)',
              gap: '32px',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div>
              <div className="card-sketch-tag">LAB PROTOCOL • INITIAL INDUCTION</div>
              <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>
                Welcome to <span style={{ color: 'var(--primary)' }}>QuantumPaws</span>! 🐾
              </h1>
              <p style={{ color: 'var(--text-chalk)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                I'm <strong>Schrö</strong> — your AI quantum feline existing in a cozy superposition of genius and curiosity!
                Before we open the quantum computer doors, what should we print on your <strong>Scientist ID Badge</strong>?
              </p>

              {/* Input Form */}
              <form onSubmit={handleNextStep}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontFamily: 'var(--font-code)',
                  color: 'var(--accent)',
                  marginBottom: '8px',
                  fontWeight: 600
                }}>
                  SCIENTIST CALLSIGN / NAME:
                </label>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="Enter your name or alias..."
                    autoFocus
                    maxLength={32}
                    style={{
                      width: '100%',
                      background: 'var(--surface-raised)',
                      border: nameError ? '1.5px solid var(--error)' : '1.5px solid var(--stroke-chalk)',
                      borderRadius: 'var(--radius-imperfect)',
                      padding: '14px 44px 14px 18px',
                      color: 'var(--text)',
                      fontSize: '16px',
                      fontFamily: 'var(--font-code)',
                      outline: 'none',
                      boxShadow: nameInput ? '0 0 16px rgba(124, 92, 255, 0.25)' : 'none',
                      transition: 'var(--transition)'
                    }}
                  />
                  {nameInput && (
                    <button
                      type="button"
                      onClick={() => setNameInput('')}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {nameError && (
                  <div style={{
                    color: 'var(--error)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-code)',
                    marginBottom: '16px'
                  }}>
                    ⚠️ {nameError}
                  </div>
                )}

                {/* Quick Pick Scientist Chips */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Or pick a famous quantum pioneer:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {quickPicks.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setNameInput(p);
                          setNameError('');
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: nameInput === p ? '1px solid var(--accent-lime)' : '1px dashed var(--stroke-chalk)',
                          background: nameInput === p ? 'rgba(163, 255, 18, 0.12)' : 'rgba(255,255,255,0.03)',
                          color: nameInput === p ? 'var(--accent-lime)' : 'var(--text-chalk)'
                        }}
                      >
                        + {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 1 Next Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '16px',
                    boxShadow: nameInput.trim() ? 'var(--shadow-glow)' : 'none',
                    opacity: nameInput.trim() ? 1 : 0.65
                  }}
                >
                  Continue to Step 2: Choose Level ➔
                </button>
              </form>
            </div>

            {/* Right: Interactive Holographic ID Badge Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  background: 'linear-gradient(145deg, #18223d 0%, #0d1322 100%)',
                  border: '1.5px solid rgba(124, 92, 255, 0.5)',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(124, 92, 255, 0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Holographic Lanyard Slot */}
                <div style={{
                  width: '40px',
                  height: '6px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  margin: '0 auto 16px auto'
                }} />

                {/* Badge Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px dashed rgba(255,255,255,0.15)',
                  paddingBottom: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '18px' }}>🐾</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>QUANTUMPAWS</span>
                  </div>
                  <span className="badge badge-lime" style={{ fontSize: '9px', padding: '2px 6px' }}>
                    ACTIVE
                  </span>
                </div>

                {/* Mascot Avatar */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'inline-block', position: 'relative' }}>
                    <SchroMascot expression={nameInput.trim() ? 'excited' : 'encouraging'} size={110} />
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      background: 'var(--accent-lime)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid var(--surface)'
                    }} title="Superposition Coherence: 100%" />
                  </div>
                </div>

                {/* Live Name Preview */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-code)',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                  }}>
                    RESEARCHER CALLSIGN
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: nameInput.trim() ? 'var(--text)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-heading)',
                    minHeight: '26px'
                  }}>
                    {nameInput.trim() || 'Cadet [Your Name]'}
                  </div>
                </div>

                {/* Badge Specs Footer */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-code)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-chalk)'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>CLEARANCE:</span> LVL 1
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>COHERENCE:</span> 100%
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                ▲ Live Holographic Badge Preview
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 2: CHOOSE QUANTUM LEVEL & TRACK */}
      {/* ============================================================ */}
      {step === 2 && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {/* Step 2 Header */}
          <div style={{
            background: 'var(--surface)',
            border: '1.5px dashed var(--stroke-chalk)',
            borderRadius: 'var(--radius-imperfect)',
            padding: '28px 32px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }} className="card-sketch">
            <SchroMascot expression="thinking" size={100} />
            <div>
              <div className="card-sketch-tag">EXPERIENCE CALIBRATION • STEP 2</div>
              <h2 style={{ marginBottom: '8px' }}>
                Welcome, Scientist <span style={{ color: 'var(--accent-lime)' }}>{nameInput.trim() || 'Cadet'}</span>! 🧪
              </h2>
              <p style={{ color: 'var(--text-chalk)', fontSize: '14px', lineHeight: 1.6 }}>
                Select your starting experience level. Schrö will calibrate explanation depth, mathematical rigor, and simulation puzzles to match your pace.
              </p>
            </div>
          </div>

          {/* 3 Level Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '36px'
          }}>
            {tracks.map(t => {
              const isSelected = selectedTrack === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`card-sketch ${isSelected ? 'tape-cyan' : ''}`}
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? t.themeColor : 'var(--stroke-chalk)',
                    boxShadow: isSelected ? `0 0 24px rgba(124, 92, 255, 0.3), 0 8px 32px rgba(0,0,0,0.5)` : 'none',
                    background: isSelected ? 'rgba(124, 92, 255, 0.08)' : 'var(--surface)',
                    transform: isSelected ? 'translateY(-4px)' : 'none',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px'
                  }}
                >
                  {/* Card Top Pill */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '36px' }}>{t.icon}</span>
                    <span 
                      className={`badge ${isSelected ? 'badge-lime' : 'badge-locked'}`}
                      style={{ fontSize: '10px' }}
                    >
                      {t.badgeTitle}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', marginBottom: '4px', color: 'var(--text)' }}>
                    {t.title}
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-code)',
                    color: isSelected ? t.themeColor : 'var(--text-muted)',
                    marginBottom: '12px',
                    fontWeight: 600
                  }}>
                    {t.tagline}
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-chalk)', lineHeight: 1.5, marginBottom: '20px' }}>
                    {t.desc}
                  </p>

                  {/* Feature Bullets */}
                  <div style={{
                    background: 'var(--surface-raised)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '20px',
                    flex: 1
                  }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-code)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      WHAT'S INCLUDED:
                    </div>
                    {t.features.map((f, i) => (
                      <div key={i} style={{ fontSize: '12px', color: 'var(--text-chalk)', marginBottom: '6px', lineHeight: 1.4 }}>
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Reward Pill */}
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-code)',
                    color: 'var(--reward)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>🎁 Reward:</span>
                    <span>{t.starterReward}</span>
                  </div>

                  {/* Selection Button */}
                  <button
                    type="button"
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 700
                    }}
                  >
                    {isSelected ? '✓ SELECTED LEVEL' : 'CHOOSE THIS TRACK'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Step 2 Navigation Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px dashed var(--stroke-chalk)'
          }}>
            <button
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-secondary btn-lg"
              style={{ minWidth: '180px' }}
            >
              ← Back to Name
            </button>

            <button
              onClick={handleComplete}
              className="btn btn-primary btn-lg"
              style={{
                minWidth: '240px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              Launch Quantum Lab 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
