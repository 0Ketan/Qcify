import React from 'react';

export function BlochSphereView({ blochVectors = [] }) {
  if (!blochVectors || blochVectors.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
        Bloch coordinates will compute after simulation.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
      {blochVectors.map(vec => (
        <div
          key={vec.qubit}
          style={{
            background: 'var(--surface-raised)',
            border: '1px dashed var(--stroke-chalk)',
            borderRadius: 'var(--radius-imperfect)',
            padding: '12px',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <div style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--accent)', marginBottom: '8px' }}>
            q[{vec.qubit}] STATE VECTOR
          </div>

          {/* Simple Vector Sphere Canvas Representation */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '1.5px solid var(--primary)',
            margin: '0 auto 8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 70%)'
          }}>
            {/* Equator */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '24px',
              border: '1px dashed rgba(34,211,238,0.4)',
              borderRadius: '50%'
            }} />
            
            {/* State Dot Indicator */}
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-lime)',
              boxShadow: '0 0 8px var(--accent-lime)',
              transform: `translate(${vec.x * 20}px, ${-vec.z * 20}px)`
            }} />
          </div>

          <div style={{ fontFamily: 'var(--font-code)', fontSize: '10.5px', color: 'var(--text-chalk)' }}>
            X: {vec.x} | Z: {vec.z}
          </div>
        </div>
      ))}
    </div>
  );
}
