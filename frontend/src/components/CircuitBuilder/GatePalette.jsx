import React from 'react';

export const AVAILABLE_GATES = [
  { name: 'H', label: 'Hadamard', desc: 'Creates 50/50 superposition', color: '#7C5CFF' },
  { name: 'X', label: 'Pauli-X', desc: 'Bit flip (NOT gate)', color: '#22D3EE' },
  { name: 'Y', label: 'Pauli-Y', desc: 'Bit & phase flip', color: '#34D399' },
  { name: 'Z', label: 'Pauli-Z', desc: 'Phase flip (π rotation)', color: '#FBBF24' },
  { name: 'S', label: 'Phase (S)', desc: 'π/2 phase rotation', color: '#F472B6' },
  { name: 'T', label: 'T Gate', desc: 'π/4 phase rotation', color: '#A78BFA' },
  { name: 'CNOT', label: 'CNOT', desc: 'Controlled NOT (entanglement)', color: '#E879F9', is2Qubit: true }
];

export function GatePalette({ selectedGate, onSelectGate }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '12px',
      background: 'rgba(20, 27, 45, 0.7)',
      border: '1px dashed var(--stroke-chalk)',
      borderRadius: 'var(--radius-imperfect)'
    }}>
      <span style={{
        fontSize: '11px',
        fontFamily: 'var(--font-code)',
        color: 'var(--text-muted)',
        marginRight: '6px'
      }}>
        PALETTE:
      </span>

      {AVAILABLE_GATES.map(g => {
        const isSelected = selectedGate === g.name;
        return (
          <button
            key={g.name}
            onClick={() => onSelectGate(g.name)}
            title={`${g.label}: ${g.desc}`}
            className="btn btn-sm"
            style={{
              padding: '6px 12px',
              fontFamily: 'var(--font-code)',
              fontWeight: 700,
              fontSize: '13px',
              background: isSelected ? g.color : 'var(--surface-raised)',
              color: isSelected ? '#000' : 'var(--text)',
              border: `1.5px solid ${g.color}`,
              boxShadow: isSelected ? `0 0 16px ${g.color}` : 'none',
              transform: isSelected ? 'scale(1.05)' : 'none'
            }}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}
