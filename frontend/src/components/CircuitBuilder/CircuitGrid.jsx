import React from 'react';
import { userStore } from '../../state/userStore';
import { AVAILABLE_GATES } from './GatePalette';

const TOTAL_STEPS = 5;

export function CircuitGrid({ circuit, selectedGate }) {
  const { numQubits, gates } = circuit;

  const handleCellClick = (qIndex, step) => {
    // Check if there is already a gate at (qIndex, step)
    const existing = gates.find(g => g.target === qIndex && g.step === step);
    if (existing) {
      userStore.removeGate(existing.id);
      userStore.showToast(`Removed ${existing.name} gate`, 'default', 1500);
      return;
    }

    if (!selectedGate) {
      userStore.showToast('Select a gate from the palette above first! 🔮', 'default', 2000);
      return;
    }

    // Add gate
    let control = null;
    if (selectedGate === 'CNOT') {
      // Connect to qubit 0 as control if target is not 0, else 1
      control = qIndex === 0 ? 1 : 0;
    }

    userStore.addGate(selectedGate, qIndex, step, control);
    userStore.showToast(`Placed ${selectedGate} on q[${qIndex}]`, 'lime', 1500);
    userStore.addXP(5);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1.5px dashed var(--stroke-chalk)',
      borderRadius: 'var(--radius-imperfect)',
      padding: '24px',
      overflowX: 'auto',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div className="card-sketch-tag">QUANTUM COMPOSER CANVAS • {numQubits} QUBITS</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => userStore.setNumQubits(Math.max(1, numQubits - 1))}
            className="btn btn-ghost btn-sm"
            disabled={numQubits <= 1}
          >
            - Qubit
          </button>
          <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', alignSelf: 'center', color: 'var(--accent-lime)' }}>
            q[{numQubits}]
          </span>
          <button
            onClick={() => userStore.setNumQubits(Math.min(4, numQubits + 1))}
            className="btn btn-ghost btn-sm"
            disabled={numQubits >= 4}
          >
            + Qubit
          </button>
          <button
            onClick={() => userStore.clearCircuit()}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--error)' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Wire Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>
        {Array.from({ length: numQubits }).map((_, qIdx) => (
          <div
            key={qIdx}
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* Wire Label */}
            <div style={{
              width: '64px',
              fontFamily: 'var(--font-code)',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-chalk)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>q[{qIdx}]</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>|0⟩</span>
            </div>

            {/* Horizontal Copper Wire Line */}
            <div style={{
              position: 'absolute',
              left: '64px',
              right: '20px',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(34,211,238,0.4), rgba(124,92,255,0.4))',
              zIndex: 1
            }} />

            {/* Step Slots */}
            <div style={{
              display: 'flex',
              gap: '24px',
              zIndex: 2,
              marginLeft: '12px'
            }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, stepIdx) => {
                const gate = gates.find(g => g.target === qIdx && g.step === stepIdx);
                const isControl = gates.some(g => g.control === qIdx && g.step === stepIdx);
                const gateDef = gate ? AVAILABLE_GATES.find(ag => ag.name === gate.name) : null;

                return (
                  <div
                    key={stepIdx}
                    onClick={() => handleCellClick(qIdx, stepIdx)}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      background: gate ? (gateDef?.color || 'var(--primary)') : 'rgba(20, 27, 45, 0.9)',
                      border: gate ? '2px solid #FFFFFF' : '1.5px dashed var(--stroke-chalk)',
                      boxShadow: gate ? `0 0 16px ${gateDef?.color || 'var(--primary)'}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-code)',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: gate ? '#000000' : 'var(--text-muted)',
                      transition: 'transform 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {gate ? (
                      gate.name
                    ) : isControl ? (
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#E879F9',
                        boxShadow: '0 0 8px #E879F9'
                      }} />
                    ) : (
                      <span style={{ fontSize: '10px', opacity: 0.35 }}>+</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p style={{
        marginTop: '20px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-code)'
      }}>
        💡 Tip: Click any slot on the wire to place the selected gate. Click an active gate to remove it.
      </p>
    </div>
  );
}
