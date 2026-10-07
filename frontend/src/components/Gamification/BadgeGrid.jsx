import React from 'react';
import { useUserStore } from '../../state/userStore';

export function BadgeGrid() {
  const badges = useUserStore(s => s.badges);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px'
    }}>
      {badges.map(b => (
        <div
          key={b.id}
          title={b.earned ? `${b.label}: ${b.desc}` : 'Locked — Complete lessons to unlock!'}
          style={{
            aspectRatio: '1',
            borderRadius: 'var(--radius-imperfect)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '8px',
            background: b.earned ? 'rgba(251, 191, 36, 0.12)' : 'rgba(20, 27, 45, 0.4)',
            border: b.earned ? '1.2px dashed var(--reward)' : '1px dashed var(--stroke-chalk)',
            boxShadow: b.earned ? 'var(--shadow-glow-reward)' : 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06) rotate(1deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        >
          <span style={{
            fontSize: '24px',
            filter: b.earned ? 'none' : 'grayscale(1)',
            opacity: b.earned ? 1 : 0.35
          }}>
            {b.earned ? b.icon : '🔒'}
          </span>
          <div style={{
            fontSize: '10px',
            fontFamily: 'var(--font-code)',
            color: b.earned ? 'var(--text-chalk)' : 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.2
          }}>
            {b.earned ? b.label : '???'}
          </div>
        </div>
      ))}
    </div>
  );
}
