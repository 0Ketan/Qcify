import React, { useState } from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { SchroMascot } from '../../components/Shared/SchroMascot';

const QUIZ_QUESTIONS = [
  {
    q: "A qubit in superposition is like a coin that is:",
    options: [
      "Permanently fixed to Heads",
      "Spinning on the table — both Heads AND Tails until caught",
      "Stuck in a vending machine"
    ],
    answer: 1,
    explanation: "Correct! Before measurement, a qubit exists as a linear combination of |0⟩ and |1⟩!"
  },
  {
    q: "Which quantum gate creates an equal 50/50 superposition from |0⟩?",
    options: [
      "H (Hadamard) Gate",
      "X (NOT) Gate",
      "Z (Phase) Gate"
    ],
    answer: 0,
    explanation: "Spot on! The Hadamard gate H transforms |0⟩ into (|0⟩+|1⟩)/√2!"
  },
  {
    q: "What causes the wave function to collapse into a single definite classical state?",
    options: [
      "Cooling the chip to absolute zero",
      "Observation or measurement",
      "Restarting the computer"
    ],
    answer: 1,
    explanation: "Bingo! The act of observation forces the superposition into either 0 or 1!"
  }
];

export function NewbieJourneyPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0: story, 1: coin demo, 2: quiz, 3: success
  const [coinState, setCoinState] = useState('0'); // '0' | '1' | 'superposition'
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Quiz State
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const triggerHadamard = () => {
    setIsFlipping(true);
    setCoinState('superposition');
    userStore.setSchroExpression('excited');
    setTimeout(() => {
      setIsFlipping(false);
    }, 1200);
  };

  const measureCoin = () => {
    const outcome = Math.random() > 0.5 ? '0' : '1';
    setCoinState(outcome);
    userStore.setSchroExpression(outcome === '0' ? 'happy' : 'encouraging');
    userStore.showToast(`Measurement collapsed state to: |${outcome}⟩!`, 'lime', 2000);
  };

  const handleQuizAnswer = (optIndex) => {
    if (showAnswer) return;
    setSelectedOpt(optIndex);
    setShowAnswer(true);

    const isCorrect = optIndex === QUIZ_QUESTIONS[qIndex].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      userStore.addXP(20);
      userStore.setSchroExpression('happy');
    } else {
      userStore.setSchroExpression('thinking');
    }
  };

  const nextQuestion = () => {
    if (qIndex + 1 < QUIZ_QUESTIONS.length) {
      setQIndex(q => q + 1);
      setSelectedOpt(null);
      setShowAnswer(false);
    } else {
      // Completed Quiz
      setCurrentStep(3);
      userStore.unlockBadge('superposer');
      userStore.unlockBadge('quiz_ace');
      userStore.addXP(50);
      userStore.setState({ overallProgress: 40 });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 24px' }}>
      {/* Lesson Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => userStore.navigate('dashboard')}
          className="btn btn-ghost btn-sm"
        >
          ← Back to Dashboard
        </button>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'var(--accent-lime)' }}>
          MODULE 01: SUPERPOSITION & WAVEFUNCTIONS
        </span>
      </div>

      {/* Step 0: Conceptual Story */}
      {currentStep === 0 && (
        <div className="card-sketch" style={{ padding: '36px' }}>
          <div className="card-sketch-tag">STORY ANALOGY: ERWIN'S SPINNING COIN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '24px' }}>
            <SchroMascot expression="encouraging" size={110} />
            <div>
              <h2 style={{ marginBottom: '8px' }}>The Magic of Superposition 🌀</h2>
              <p style={{ color: 'var(--text-chalk)', fontSize: '15px', lineHeight: 1.6 }}>
                In classical computers, everything is made of <strong>bits</strong>: light switches that are strictly OFF (0) or ON (1).
                A quantum bit, or <strong>qubit</strong>, plays by different rules.
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--surface-raised)',
            border: '1px dashed var(--stroke-chalk)',
            borderRadius: 'var(--radius-imperfect)',
            padding: '20px',
            marginBottom: '28px',
            lineHeight: 1.6
          }}>
            <h4 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Think of a Spinning Coin</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-chalk)' }}>
              Resting on a table, a coin is definitely Heads (|0⟩) or Tails (|1⟩). But flick it into a blur!
              While spinning, is it Heads or Tails? <strong>It is in a continuous superposition of both states at once!</strong>
              Only when you slam your hand down to observe it does it collapse into a definite state.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button onClick={() => setCurrentStep(1)} className="btn btn-primary btn-md">
              Try the Interactive Coin Lab →
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Interactive Hadamard Coin Lab */}
      {currentStep === 1 && (
        <div className="card-sketch tape-cyan" style={{ padding: '36px' }}>
          <div className="card-sketch-tag">LAB EXPERIMENT: THE HADAMARD (H) GATE</div>
          <h2>Apply the Quantum Coin Flip 🔮</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Use the H gate to place qubit q[0] into an equal superposition, then measure it to trigger wave function collapse!
          </p>

          {/* Interactive Coin Visualization */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px',
            background: 'var(--surface-raised)',
            border: '1.5px dashed var(--stroke-chalk)',
            borderRadius: 'var(--radius-imperfect)',
            marginBottom: '28px'
          }}>
            {/* Coin Graphic */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: coinState === 'superposition'
                ? 'conic-gradient(from 0deg, var(--primary), var(--accent), var(--accent-lime), var(--primary))'
                : (coinState === '0' ? 'linear-gradient(135deg, #22D3EE, #0284C7)' : 'linear-gradient(135deg, #7C5CFF, #4338CA)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 700,
              color: '#FFFFFF',
              boxShadow: coinState === 'superposition' ? '0 0 28px rgba(34,211,238,0.6)' : 'var(--shadow-grainy)',
              animation: isFlipping ? 'chalkWobble 0.2s infinite' : 'floatBob 3s ease-in-out infinite',
              marginBottom: '16px'
            }}>
              {coinState === 'superposition' ? '|ψ⟩' : (coinState === '0' ? '|0⟩' : '|1⟩')}
            </div>

            <div style={{ fontFamily: 'var(--font-code)', fontSize: '14px', marginBottom: '20px' }}>
              Current State:{' '}
              <span style={{ color: 'var(--accent-lime)', fontWeight: 700 }}>
                {coinState === 'superposition' ? '(|0⟩ + |1⟩) / √2' : `|${coinState}⟩ (Definite Classical)`}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={triggerHadamard} className="btn btn-primary btn-md">
                ⚡ Apply H Gate (Superpose)
              </button>
              <button
                onClick={measureCoin}
                disabled={coinState !== 'superposition'}
                className="btn btn-accent btn-md"
              >
                👁️ Measure Qubit (Collapse)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setCurrentStep(0)} className="btn btn-ghost btn-sm">
              ← Back
            </button>
            <button onClick={() => setCurrentStep(2)} className="btn btn-primary btn-md">
              Take Gateway Quiz →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Gateway Quiz */}
      {currentStep === 2 && (
        <div className="card-sketch" style={{ padding: '36px' }}>
          <div className="card-sketch-tag">
            GATEWAY QUIZ • QUESTION {qIndex + 1} OF {QUIZ_QUESTIONS.length}
          </div>
          <h3 style={{ marginBottom: '20px' }}>{QUIZ_QUESTIONS[qIndex].q}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {QUIZ_QUESTIONS[qIndex].options.map((opt, oIdx) => {
              let btnStyle = {
                justifyContent: 'flex-start',
                padding: '14px 18px',
                textAlign: 'left',
                border: '1px dashed var(--stroke-chalk)',
                borderRadius: 'var(--radius-imperfect)',
                background: 'var(--surface-raised)',
                color: 'var(--text)'
              };

              if (showAnswer) {
                if (oIdx === QUIZ_QUESTIONS[qIndex].answer) {
                  btnStyle.background = 'rgba(52, 211, 153, 0.2)';
                  btnStyle.border = '1.5px solid var(--success)';
                } else if (oIdx === selectedOpt) {
                  btnStyle.background = 'rgba(239, 68, 68, 0.2)';
                  btnStyle.border = '1.5px solid var(--error)';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleQuizAnswer(oIdx)}
                  className="btn hover-scale"
                  style={btnStyle}
                >
                  <span style={{ fontFamily: 'var(--font-code)', marginRight: '10px', color: 'var(--accent)' }}>
                    [{String.fromCharCode(65 + oIdx)}]
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div style={{
              padding: '16px',
              background: 'rgba(20, 27, 45, 0.9)',
              border: '1px dashed var(--stroke-chalk)',
              borderRadius: 'var(--radius-imperfect)',
              marginBottom: '20px'
            }}>
              <p style={{ color: selectedOpt === QUIZ_QUESTIONS[qIndex].answer ? 'var(--success)' : 'var(--reward)', fontWeight: 600 }}>
                {QUIZ_QUESTIONS[qIndex].explanation}
              </p>
            </div>
          )}

          {showAnswer && (
            <div style={{ textAlign: 'right' }}>
              <button onClick={nextQuestion} className="btn btn-primary btn-md">
                {qIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'Complete Module 🏆'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Success Screen */}
      {currentStep === 3 && (
        <div className="card-sketch tape-cyan" style={{ padding: '40px', textAlign: 'center' }}>
          <SchroMascot expression="excited" size={140} />
          <h2 style={{ marginTop: '16px', marginBottom: '8px' }}>
            Congratulations, Quantum Explorer! 🏆
          </h2>
          <p style={{ color: 'var(--text-chalk)', fontSize: '15px', maxWidth: '540px', margin: '0 auto 24px' }}>
            You mastered superposition, collapsed wave functions, and aced the gateway challenge! 
            You scored {score}/{QUIZ_QUESTIONS.length} and earned <strong>+50 XP</strong>!
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => userStore.navigate('sandbox')}
              className="btn btn-primary btn-md"
            >
              Compose Circuits in Sandbox ⚗️
            </button>
            <button
              onClick={() => userStore.navigate('dashboard')}
              className="btn btn-secondary btn-md"
            >
              Return to Dashboard 🗺️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
