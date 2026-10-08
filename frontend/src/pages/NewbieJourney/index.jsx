import React, { useState } from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { SimulationBoundary } from '../../simulations/SimulationBoundary';
import { CoinFlipSim } from '../../simulations/CoinFlipSim';
import superpositionIntro from '../../assets/superposition_intro.mp4';

const LESSON_STEPS = [
  { id: 'video1', type: 'video', src: superpositionIntro, title: 'How a Quantum Computer Thinks' },
  { id: 'sim', type: 'simulation' },
  { id: 'video2', type: 'video', src: '/assets/lesson0_facts.mp4', title: 'Why Quantum? 3 Real-World Facts' }
];

export function NewbieJourneyPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const playerName = useUserStore(s => s.playerName);

  const currentStep = LESSON_STEPS[stepIndex];

  const goNext = () => {
    if (stepIndex + 1 < LESSON_STEPS.length) {
      setStepIndex(stepIndex + 1);
    } else {
      userStore.unlockBadge('superposer');
      userStore.addXP(50);
      userStore.setState({ overallProgress: 40 });
      userStore.navigate('dashboard');
    }
  };

  const handleVideoError = () => {
    console.warn("Video failed to load, falling back...");
    goNext(); // Auto-skip if video is missing
  };

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => userStore.navigate('dashboard')} className="btn btn-ghost btn-sm">
          ← Back to Dashboard
        </button>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'var(--accent-lime)' }}>
          LESSON 0: WHAT, WHY, AND HOW IS QUANTUM
        </span>
      </div>

      {currentStep.type === 'video' && (
        <div className="card-sketch" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-sketch-tag">EXPLAINER VIDEO</div>
          <h2>{currentStep.title}</h2>
          
          <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
            <video 
              controls 
              autoPlay 
              style={{ width: '100%', display: 'block' }}
              onError={handleVideoError}
            >
              <source src={currentStep.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button 
              onClick={() => stepIndex > 0 ? setStepIndex(stepIndex - 1) : userStore.navigate('dashboard')} 
              className="btn btn-ghost btn-sm"
            >
              ← Back
            </button>
            <button onClick={goNext} className="btn btn-primary btn-md">
              {stepIndex + 1 < LESSON_STEPS.length ? 'Continue →' : 'Complete Module 🏆'}
            </button>
          </div>
        </div>
      )}

      {currentStep.type === 'simulation' && (
        <div className="card-sketch tape-cyan" style={{ padding: '36px', paddingBottom: '28px', overflow: 'visible' }}>
          <div className="card-sketch-tag">INTERACTIVE LAB: QUANTUM THUMB FLIP</div>
          <h2>Apply the Quantum Coin Flip 🔮</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Time to try it yourself! Put the coin into superposition and trigger a wave function collapse!
          </p>

          <SimulationBoundary>
            <CoinFlipSim 
              playerName={playerName} 
              onComplete={goNext}
              onXpEarned={(xp) => userStore.addXP(xp)}
            />
          </SimulationBoundary>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button onClick={() => setStepIndex(stepIndex - 1)} className="btn btn-ghost btn-sm">
              ← Back
            </button>
            <button onClick={goNext} className="btn btn-primary btn-md">
              Continue to Video 2 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
