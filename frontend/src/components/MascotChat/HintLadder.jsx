import React, { useState } from 'react';
import { api } from '../../services/api';
import { userStore } from '../../state/userStore';

export function HintLadder({ topic = 'superposition' }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [hints, setHints] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchHint = async (stepToFetch) => {
    setLoading(true);
    try {
      const res = await api.getHint(topic, stepToFetch);
      setHints(prev => ({ ...prev, [stepToFetch]: res.hint }));
      if (res.expression) {
        userStore.setSchroExpression(res.expression);
      }
      if (stepToFetch >= 3) {
        userStore.addXP(15);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const unlockNext = (step) => {
    setCurrentStep(step);
    fetchHint(step);
  };

  return (
    <div style={{
      background: 'rgba(20, 27, 45, 0.75)',
      border: '1px dashed var(--stroke-chalk)',
      borderRadius: 'var(--radius-imperfect)',
      padding: '12px 14px',
      margin: '12px 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && !hints[1]) fetchHint(1);
          }}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--reward)', padding: 0 }}
        >
          💡 {isOpen ? 'Hide Hint Ladder' : 'Open Hint Ladder (Progressive)'}
        </button>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-code)', color: 'var(--text-muted)' }}>
          TOPIC: {topic.toUpperCase()}
        </span>
      </div>

      {isOpen && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Step 1 */}
          <div style={{
            padding: '8px 12px',
            background: 'var(--surface-raised)',
            borderRadius: '6px',
            fontSize: '13px',
            borderLeft: '3px solid var(--accent)'
          }}>
            {hints[1] || 'Thinking about probability waves...'}
          </div>

          {/* Step 2 */}
          {currentStep >= 2 ? (
            <div style={{
              padding: '8px 12px',
              background: 'var(--surface-raised)',
              borderRadius: '6px',
              fontSize: '13px',
              borderLeft: '3px solid var(--primary)'
            }}>
              {hints[2] || (loading ? 'Consulting wave equation...' : 'Fetching Hint 2...')}
            </div>
          ) : (
            <button
              onClick={() => unlockNext(2)}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px' }}
            >
              🔓 Unlock Hint 2 (Dig Deeper)
            </button>
          )}

          {/* Step 3 */}
          {currentStep >= 3 ? (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(163, 255, 18, 0.1)',
              border: '1px dashed var(--accent-lime)',
              borderRadius: '6px',
              fontSize: '13px',
              color: 'var(--text)'
            }}>
              {hints[3] || 'Fetching Full Answer...'}
            </div>
          ) : (
            currentStep >= 2 && (
              <button
                onClick={() => unlockNext(3)}
                disabled={loading}
                className="btn btn-accent btn-sm"
                style={{ fontSize: '12px' }}
              >
                ✨ Show Full Solution (+15 XP)
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
