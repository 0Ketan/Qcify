import React from 'react';

export function StateHistogram({ probabilities = {}, counts = {} }) {
  const entries = Object.entries(probabilities);

  if (entries.length === 0) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-code)',
        fontSize: '13px'
      }}>
        No simulation data yet. Hit "Run Circuit" to observe! ⚛️
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {entries.map(([bitstring, prob]) => {
        const pct = Math.round(prob * 100);
        const count = counts[bitstring] || 0;

        return (
          <div key={bitstring} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-code)',
              fontSize: '13px'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                |{bitstring}⟩
              </span>
              <span style={{ color: 'var(--text-chalk)' }}>
                {pct}% <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({count} shots)</span>
              </span>
            </div>

            {/* Histogram Bar */}
            <div style={{
              height: '18px',
              background: 'var(--surface-raised)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--stroke-chalk)',
              position: 'relative'
            }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 0 12px rgba(34, 211, 238, 0.4)',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
