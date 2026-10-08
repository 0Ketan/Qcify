import React from 'react';
import { AVAILABLE_GATES } from './gates';

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
