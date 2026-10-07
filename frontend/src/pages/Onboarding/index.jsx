import React, { useState } from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { SchroMascot } from '../../components/Shared/SchroMascot';

export function OnboardingPage() {
  const playerName = useUserStore(s => s.playerName);
  const track = useUserStore(s => s.track);
  const [selected, setSelected] = useState(track);
  const [nameInput, setNameInput] = useState(playerName);

  const tracks = [
    {
      id: 'newbie',
      icon: '📖',
      title: 'Newbie Explorer',
      desc: 'Stories, playful analogies, and interactive visual experiments. No quantum math required!'
    },
    {
      id: 'intermediate',
      icon: '🧩',
      title: 'Intermediate Builder',
      desc: 'Hands-on gate puzzles, circuit composers, and gateway challenges. Level up fast!'
    },
    {
      id: 'advanced',
      icon: '⚛️',
      title: 'Advanced Researcher',
      desc: 'Statevectors, Dirac bra-ket notation, matrix operations, and native Qiskit export.'
    }
  ];

  const handleStart = () => {
    if (nameInput.trim()) {
      userStore.setPlayerName(nameInput.trim());
    }
    userStore.setTrack(selected);
    userStore.unlockBadge('first_qubit');
    userStore.addXP(25);
    userStore.navigate('dashboard');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 24px' }}>
      {/* Intro Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        marginBottom: '40px',
        background: 'var(--surface)',
        border: '1.5px dashed var(--stroke-chalk)',
        borderRadius: 'var(--radius-imperfect)',
        padding: '32px',
        position: 'relative'
      }} className="card-sketch">
        <SchroMascot expression="encouraging" size={140} />
        <div>
          <div className="card-sketch-tag">INITIALIZING QUANTUM LAB SESSION</div>
          <h1 style={{ marginBottom: '12px' }}>
            Welcome to <span style={{ color: 'var(--primary)' }}>QuantumPaws</span>! 🐾
          </h1>
          <p style={{ color: 'var(--text-chalk)', fontSize: '15px', lineHeight: 1.6 }}>
            I'm <strong>Schrö</strong> — your AI quantum mentor, currently existing in a cozy superposition of genius and chaos. 
            Before we enter the lab, let's configure your experiment profile!
          </p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your scientist callsign"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--stroke-chalk)',
                borderRadius: 'var(--radius-imperfect)',
                padding: '10px 16px',
                color: 'var(--text)',
                fontSize: '14px',
                fontFamily: 'var(--font-code)',
                outline: 'none',
                minWidth: '240px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Track Selection Cards */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Choose Your Research Track:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {tracks.map(t => {
            const isSelected = selected === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`card-sketch ${isSelected ? 'tape-cyan' : ''}`}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--stroke-chalk)',
                  boxShadow: isSelected ? 'var(--shadow-grainy), 0 0 24px rgba(109,74,255,0.3)' : 'none',
                  background: isSelected ? 'rgba(109,74,255,0.08)' : 'var(--surface)',
                  transform: isSelected ? 'scale(1.02)' : 'none'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{t.icon}</div>
                <h4 style={{ marginBottom: '8px' }}>{t.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {t.desc}
                </p>
                <div style={{ marginTop: '16px' }}>
                  <span className={`badge ${isSelected ? 'badge-lime' : 'badge-locked'}`}>
                    {isSelected ? '✓ ACTIVE SELECTION' : 'SELECT TRACK'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={handleStart}
          className="btn btn-primary btn-lg"
          style={{ minWidth: '220px' }}
        >
          Enter the Quantum Lab →
        </button>
      </div>
    </div>
  );
}
