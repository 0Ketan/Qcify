import React from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { SchroMascot } from '../Shared/SchroMascot';

export function FloatingSchro() {
  const isChatOpen = useUserStore(s => s.isChatOpen);
  const schroExpression = useUserStore(s => s.schroExpression);
  const hasUnreadNudge = useUserStore(s => s.hasUnreadNudge);
  const currentNudge = useUserStore(s => s.currentNudge);

  if (isChatOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '28px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px',
      zIndex: 150
    }}>
      {/* Proactive Speech Bubble Nudge */}
      {hasUnreadNudge && (
        <div style={{
          background: 'var(--surface-raised)',
          border: '1.5px dashed var(--stroke-chalk)',
          borderRadius: 'var(--radius-imperfect)',
          padding: '10px 14px',
          maxWidth: '240px',
          fontSize: '12.5px',
          color: 'var(--text)',
          boxShadow: 'var(--shadow-grainy)',
          position: 'relative',
          animation: 'slideUp 0.3s ease'
        }}>
          <span>{currentNudge}</span>
          <button
            onClick={() => userStore.setState({ hasUnreadNudge: false })}
            style={{
              position: 'absolute',
              top: '2px',
              right: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Mascot Button */}
      <div
        onClick={() => userStore.toggleChat()}
        style={{
          cursor: 'pointer',
          padding: '6px',
          background: 'rgba(20, 27, 45, 0.85)',
          border: '1.5px dashed var(--stroke-chalk)',
          borderRadius: '50%',
          boxShadow: 'var(--shadow-grainy)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
      >
        <SchroMascot expression={schroExpression} size={54} />
      </div>
    </div>
  );
}
