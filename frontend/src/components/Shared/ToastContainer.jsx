import React from 'react';
import { useUserStore } from '../../state/userStore';

export function ToastContainer() {
  const toasts = useUserStore(s => s.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 99999,
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let borderColor = 'var(--primary)';
        let shadow = 'var(--shadow-grainy)';
        if (toast.type === 'lime') {
          borderColor = 'var(--accent-lime)';
          shadow = 'var(--shadow-glow-lime)';
        } else if (toast.type === 'reward') {
          borderColor = 'var(--reward)';
          shadow = 'var(--shadow-glow-reward)';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: 'var(--surface-raised)',
              border: `1.5px dashed ${borderColor}`,
              borderRadius: 'var(--radius-imperfect)',
              padding: '12px 18px',
              color: 'var(--text)',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: shadow,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              pointerEvents: 'auto',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
