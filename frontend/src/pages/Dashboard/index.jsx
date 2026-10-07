import React from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { SchroMascot } from '../../components/Shared/SchroMascot';
import { BadgeGrid } from '../../components/Gamification/BadgeGrid';

const ROADMAP_NODES = [
  { id: 1, title: 'Superposition & Coin Flips', subtitle: 'Linear combinations and wave functions', status: 'unlocked', icon: '⚛️', route: 'lesson' },
  { id: 2, title: 'Qubits & Bloch Sphere', subtitle: 'Geometrical representation of states', status: 'unlocked', icon: '🌐', route: 'sandbox' },
  { id: 3, title: 'Hadamard & Pauli Gates', subtitle: 'The core unitary transformations', status: 'unlocked', icon: '🔧', route: 'sandbox' },
  { id: 4, title: 'Quantum Entanglement', subtitle: 'Spooky action and Bell States |Φ⁺⟩', status: 'locked', icon: '🔗' },
  { id: 5, title: 'Quantum Circuit Synthesis', subtitle: 'Constructing multi-qubit algorithms', status: 'locked', icon: '⚡' },
  { id: 6, title: "Grover's Quantum Search", subtitle: 'Quadratic speedup in database search', status: 'locked', icon: '🔍' }
];

const DISPATCH_NEWS = [
  { icon: '⚛️', headline: 'Coherence times surpass 1ms at room temperature', time: '2h ago' },
  { icon: '🔗', headline: 'Fault-tolerant topological qubits demonstrated in lab', time: '5h ago' },
  { icon: '🌌', headline: 'Fiber-optic entanglement link stretched across 600km', time: '1d ago' }
];

export function DashboardPage() {
  const playerName = useUserStore(s => s.playerName);
  const overallProgress = useUserStore(s => s.overallProgress);
  const streakDays = useUserStore(s => s.streakDays);

  const handleNodeClick = (node) => {
    if (node.status === 'locked') {
      userStore.showToast('Finish previous experiments to unlock this node! 🔒', 'default', 2000);
      return;
    }
    if (node.route) {
      userStore.navigate(node.route);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '24px',
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '24px 32px 64px 32px',
      position: 'relative'
    }}>
      {/* Main Column (Spans 8 Columns) */}
      <main style={{ gridColumn: '1 / span 8', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Greeting Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: 'var(--surface)',
          border: '1.5px dashed var(--stroke-chalk)',
          borderRadius: 'var(--radius-imperfect)',
          padding: '20px 24px',
          position: 'relative'
        }} className="card-sketch">
          <SchroMascot expression="happy" size={72} />
          <div style={{ flex: 1 }}>
            <div className="card-sketch-tag">LAB SCIENTIST LOGGED IN: {playerName.toUpperCase()}</div>
            <h2>Hey {playerName}! Ready to experiment? 🐾</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Your quantum curiosity is burning bright — let's advance toward Intermediate Level!
            </p>
          </div>
          <div className="streak-counter">🔥 {streakDays} days</div>
        </div>

        {/* Journey Progress (Spanning full 8 columns with subtle bleed) */}
        <div className="card-sketch" style={{
          background: 'var(--surface)',
          padding: '24px',
          position: 'relative'
        }}>
          <div className="card-sketch-tag">EXP. RUNTIME: 84% COHERENCE</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3>🗺️ Journey to Intermediate</h3>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              color: 'var(--accent-lime)',
              background: 'rgba(163,255,18,0.1)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(163,255,18,0.3)'
            }}>
              OVERALL PROGRESS: {overallProgress}%
            </span>
          </div>

          {/* Striped Hazard Progress Bar */}
          <div className="progress-bar-wrapper">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            <span className="badge badge-success">✓ Picked track</span>
            <span className="badge badge-success">✓ Met Schrö</span>
            <span className="badge badge-lime">⚡ Active in Superposition</span>
            <span className="badge badge-locked">○ Gateway quiz</span>
          </div>
        </div>

        {/* Quantum Roadmap */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3>🛣️ Quantum Experiment Roadmap</h3>
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--text-muted)' }}>
              TAPED LAB SEQUENCE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ROADMAP_NODES.map(node => {
              const isUnlocked = node.status === 'unlocked';
              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`card-sketch ${isUnlocked ? 'tape-cyan' : ''}`}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    opacity: isUnlocked ? 1 : 0.5,
                    borderStyle: isUnlocked ? 'dashed' : 'solid'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isUnlocked ? 'rgba(34,211,238,0.15)' : 'var(--surface-raised)',
                    border: `1.5px solid ${isUnlocked ? 'var(--accent)' : 'var(--locked)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: isUnlocked ? '0 0 12px rgba(34,211,238,0.3)' : 'none'
                  }}>
                    {isUnlocked ? node.icon : '🔒'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {node.title}
                      {isUnlocked && (
                        <span style={{ fontSize: '10px', color: 'var(--accent-lime)', fontFamily: 'var(--font-code)' }}>
                          READY
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{node.subtitle}</div>
                  </div>

                  {isUnlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        userStore.navigate(node.route);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      Enter Lab →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Right Column (Deliberate 16px Overlap Bento Layout) */}
      <aside style={{
        gridColumn: '9 / span 4',
        marginLeft: '-16px', // Pro designer deliberate 16px overlap!
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        zIndex: 5
      }}>
        {/* Ask Schrö Taped Card */}
        <div
          onClick={() => userStore.toggleChat()}
          className="card-sketch tape-cyan"
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '24px',
            background: 'var(--surface)'
          }}
        >
          <div className="card-sketch-tag">ON-CALL AI MENTOR</div>
          <div style={{ fontSize: '40px', margin: '8px 0' }}>🐾</div>
          <h4 style={{ marginBottom: '4px' }}>Ask Schrö</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Need a hint or a cat analogy? I'm always observing!
          </p>
          <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            Open Chat ⚛️
          </button>
        </div>

        {/* Badges Cabinet */}
        <div className="card-sketch" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ margin: 0 }}>🏆 Lab Badges</h4>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-code)', color: 'var(--accent-lime)' }}>
              3 / 8 EARNED
            </span>
          </div>
          <BadgeGrid />
        </div>

        {/* Quantum News Dispatches */}
        <div className="card-sketch" style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '14px' }}>📰 Quantum Dispatches</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DISPATCH_NEWS.map((n, idx) => (
              <div
                key={idx}
                className="hover-scale"
                style={{
                  padding: '10px 12px',
                  background: 'var(--surface-raised)',
                  border: '1px dashed var(--stroke-chalk)',
                  borderRadius: 'var(--radius-imperfect)',
                  display: 'flex',
                  gap: '10px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '20px' }}>{n.icon}</div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 500, lineHeight: 1.4 }}>
                    {n.headline}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-code)', marginTop: '4px' }}>
                    {n.time} • DISPATCH #042
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
