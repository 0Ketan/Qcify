import React from 'react';
import { useUserStore, userStore } from '../../state/userStore';

export function Navbar() {
  const currentRoute = useUserStore(s => s.currentRoute);
  const streakDays = useUserStore(s => s.streakDays);
  const xp = useUserStore(s => s.xp);
  const hasUnreadNudge = useUserStore(s => s.hasUnreadNudge);
  const isChatOpen = useUserStore(s => s.isChatOpen);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'lesson', label: 'Lessons' },
    { id: 'sandbox', label: 'Sandbox' },
    { id: 'onboarding', label: 'Onboarding' }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      background: 'rgba(9, 13, 25, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px dashed var(--stroke-chalk)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => userStore.navigate('dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          fontFamily: 'var(--font-heading)',
          fontSize: '22px',
          fontWeight: 700
        }}
      >
        <span style={{ fontSize: '26px' }}>🐾</span>
        <span>
          Quantum<span style={{ color: 'var(--primary)' }}>Paws</span>
        </span>
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--font-code)',
          color: 'var(--accent-lime)',
          background: 'rgba(163,255,18,0.1)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid rgba(163,255,18,0.3)'
        }}>
          HUMAN LAB V2
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{ display: 'flex', gap: '8px' }}>
        {navLinks.map(link => {
          const isActive = currentRoute === link.id;
          return (
            <button
              key={link.id}
              onClick={() => userStore.navigate(link.id)}
              className="btn btn-ghost btn-sm"
              style={{
                color: isActive ? 'var(--text)' : 'var(--text-chalk)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                borderRadius: '4px',
                fontWeight: isActive ? 600 : 400
              }}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Streak Counter */}
        <div className="streak-counter" title="Active Quantum Learning Streak">
          🔥 {streakDays} days
        </div>

        {/* XP Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(124, 92, 255, 0.12)',
          border: '1px solid rgba(124, 92, 255, 0.35)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 14px',
          fontSize: '13px',
          fontFamily: 'var(--font-code)',
          fontWeight: 700,
          color: 'var(--text)'
        }}>
          ⚡ <span style={{ color: 'var(--accent-lime)' }}>{xp}</span> XP
        </div>

        {/* Mascot Chat Toggle Button */}
        <button
          onClick={() => userStore.toggleChat()}
          className="btn btn-primary btn-sm"
          style={{ position: 'relative' }}
          title="Open Schrö AI Mentor Chat"
        >
          <span>🐱 Ask Schrö</span>
          {hasUnreadNudge && !isChatOpen && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-lime)',
              boxShadow: '0 0 8px var(--accent-lime)'
            }} />
          )}
        </button>
      </div>
    </header>
  );
}
