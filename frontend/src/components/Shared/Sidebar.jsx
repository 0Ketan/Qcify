import React from 'react';
import { useUserStore, userStore } from '../../state/userStore';

export function Sidebar() {
  const currentRoute = useUserStore(s => s.currentRoute);
  const playerName = useUserStore(s => s.playerName);
  const level = useUserStore(s => s.level);
  const track = useUserStore(s => s.track);

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Lab Dashboard' },
    { id: 'lesson', icon: '📚', label: 'Quantum Lessons' },
    { id: 'sandbox', icon: '⚗️', label: 'Circuit Sandbox' },
    { id: 'onboarding', icon: '🗺️', label: 'Tracks & Skills' }
  ];

  return (
    <aside style={{
      width: '260px',
      position: 'fixed',
      left: 0,
      top: '72px',
      bottom: 0,
      background: 'rgba(9, 13, 25, 0.95)',
      borderRight: '1px dashed var(--stroke-chalk)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 90
    }}>
      <div className="card-sketch-tag" style={{ marginBottom: '16px' }}>LAB STATION: EXP-001</div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map(item => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => userStore.navigate(item.id)}
              className="btn btn-ghost"
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-imperfect)',
                background: isActive ? 'rgba(124, 92, 255, 0.15)' : 'transparent',
                border: isActive ? '1px dashed var(--primary)' : '1px solid transparent',
                color: isActive ? 'var(--text)' : 'var(--text-chalk)',
                fontWeight: isActive ? 600 : 400
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Status Card */}
      <div style={{
        marginTop: 'auto',
        padding: '16px',
        background: 'var(--surface)',
        border: '1px dashed var(--stroke-chalk)',
        borderRadius: 'var(--radius-imperfect)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🐱
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {playerName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-lime)', fontFamily: 'var(--font-code)' }}>
              LVL {level} • {track.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
