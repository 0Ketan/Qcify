import React, { useState, useEffect, useRef } from 'react';
import { SpeakingSchro } from './SpeakingSchro';

export function CoinFlipSim({
  playerName = "Scientist",
  onComplete = () => {},
  onXpEarned = () => {}
}) {
  const [phase, setPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [outcome, setOutcome] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [stats, setStats] = useState({ flips: 0, heads: 0, tails: 0, wins: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'airborne') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            clearInterval(timerRef.current);
            autoCollapse();
            return 0.0;
          }
          return prev - 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const flip5050 = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 2 === 0 ? 'HEADS' : 'TAILS';
  };

  const autoCollapse = () => {
    const result = flip5050();
    setOutcome(result);
    setUserChoice(null);
    setPhase('collapsed');
    const isWin = false; // no choice was made
    setStats(prev => ({
      flips: prev.flips + 1,
      heads: prev.heads + (result === 'HEADS' ? 1 : 0),
      tails: prev.tails + (result === 'TAILS' ? 1 : 0),
      wins: prev.wins + (isWin ? 1 : 0)
    }));
  };

  const flipCoin = () => {
    setPhase('airborne');
    setTimeLeft(5.0);
    setUserChoice(null);
    setOutcome(null);
  };

  const callCoin = (choice) => {
    if (phase !== 'airborne') return;
    clearInterval(timerRef.current);
    const result = flip5050();
    setOutcome(result);
    setUserChoice(choice);
    setPhase('collapsed');
    const isWin = choice === result;
    setStats(prev => ({
      flips: prev.flips + 1,
      heads: prev.heads + (result === 'HEADS' ? 1 : 0),
      tails: prev.tails + (result === 'TAILS' ? 1 : 0),
      wins: prev.wins + (isWin ? 1 : 0)
    }));
    if (isWin) onXpEarned(20);
  };

  const getMascotText = () => {
    if (phase === 'idle') {
      return `Flip the coin yourself, ${playerName}! Right now it's lying flat—just like a normal computer switch stuck on 0 or 1.`;
    } else if (phase === 'airborne') {
      return `Look at it spin! While it's spinning in a blur, it holds BOTH possibilities at once! Quick—call Heads or Tails before the timer runs out!`;
    } else if (phase === 'collapsed') {
      if (userChoice === outcome) {
        return `🎉 Congrats, ${playerName}! You called ${userChoice} and won the 50/50 toss! The spinning blur only picked a single side the moment you stopped it. Welcome to Quantum Computing!`;
      } else if (userChoice === null) {
        return `⏱️ Time's up! The coin landed on ${outcome}. Because a spinning coin is a true 50/50 blur, nobody can predict which side it picks until it stops. Congrats on your first step into Quantum Computing!`;
      } else {
        return `😅 Tough luck! You called ${userChoice}, but the 50/50 toss landed on ${outcome}! Because a spinning coin is a true 50/50 blur, nobody can predict which side it picks until it stops. Congrats on your first step into Quantum Computing!`;
      }
    }
    return "";
  };

  return (
    <div className="coin-flip-sim">
      <style>{`
        .coin-flip-sim {
          position: relative;
          background: #0b0d17;
          border: 1px solid #1a1e36;
          border-radius: 12px;
          padding: 24px;
          padding-bottom: 28px;
          height: auto;
          overflow: visible;
          color: white;
          font-family: sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .sim-stage {
          position: relative;
          width: 100%;
          max-width: 640px;
          height: 360px;
          margin: 0 auto;
          border: 1px solid #1e293b;
          border-radius: 8px;
          background: radial-gradient(circle at 50% 70%, #1e293b, #0b0d17 80%);
          overflow: hidden;
        }

        .top-zone {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 92%;
          pointer-events: none;
        }

        .status-badge {
          background: rgba(0,0,0,0.6);
          border: 1px solid #334155;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 0.05em;
          color: #00f5d4;
          text-align: center;
          pointer-events: auto;
          max-width: 96%;
          white-space: normal;
          word-break: break-word;
          line-height: 1.3;
        }

        .timer-bar-container {
          width: 100%;
          max-width: 500px;
          height: 8px;
          background: #1e293b;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 8px;
          pointer-events: auto;
        }

        .timer-bar {
          height: 100%;
          background: #00f5d4;
          transition: width 0.1s linear, background-color 0.3s;
        }

        .timer-bar.critical {
          background: #ef4444;
        }

        .launchpad {
          position: absolute;
          top: 66%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, #fee440 0%, #d4af37 40%, transparent 70%);
          box-shadow: 0 0 30px rgba(0, 245, 212, 0.4), 0 0 60px rgba(254, 228, 64, 0.2), inset 0 0 20px rgba(0, 245, 212, 0.3);
          z-index: 5;
        }

        .launchpad::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 45px;
          border-radius: 50%;
          border: 2px solid rgba(0, 245, 212, 0.6);
          box-shadow: 0 0 15px rgba(0, 245, 212, 0.5);
        }

        .launchpad::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 35px;
          border-radius: 50%;
          border: 1px solid rgba(254, 228, 64, 0.4);
        }

        .coin-wrapper {
          position: absolute;
          top: 54%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 25;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .coin-wrapper.airborne {
          top: 50%;
        }

        .coin-spin-area {
          width: 148px;
          height: 148px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .quantum-coin {
          width: 132px;
          height: 132px;
          position: relative;
          transform-style: preserve-3d;
        }

        .coin-idle .quantum-coin-inner {
          transform: rotateX(55deg);
        }

        .coin-spinning .quantum-coin-inner {
          animation: coinSpin3D 0.55s linear infinite;
        }

        .coin-collapsed .quantum-coin-inner {
          transform: rotateY(0deg) rotateX(0deg);
        }

        .quantum-coin-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .coin-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
          backface-visibility: hidden;
          border: 4px solid;
        }

        .coin-front {
          background: radial-gradient(circle at 35% 35%, #fff7a1, #fee440 40%, #d4af37 80%);
          border-color: #b8860b;
          color: #0b0d17;
          box-shadow: inset 0 0 20px rgba(184, 134, 11, 0.5), 0 0 15px rgba(254, 228, 64, 0.3);
        }

        .coin-back {
          transform: rotateY(180deg);
          background: radial-gradient(circle at 35% 35%, #e8d5ff, #9b5de5 40%, #6b21a8 80%);
          border-color: #581c87;
          color: #fff;
          box-shadow: inset 0 0 20px rgba(88, 28, 135, 0.5), 0 0 15px rgba(155, 93, 229, 0.3);
        }

        .coin-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 146px;
          height: 146px;
          border-radius: 50%;
          border: 2px solid rgba(0, 245, 212, 0.7);
          box-shadow: 0 0 24px rgba(0, 245, 212, 0.45), inset 0 0 16px rgba(155, 93, 229, 0.45);
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .coin-wrapper.airborne .coin-aura {
          opacity: 1;
          animation: auraPulse 0.55s linear infinite;
        }

        @keyframes auraPulse {
          0% { box-shadow: 0 0 24px rgba(0, 245, 212, 0.45), inset 0 0 16px rgba(155, 93, 229, 0.45); }
          50% { box-shadow: 0 0 32px rgba(0, 245, 212, 0.7), inset 0 0 24px rgba(155, 93, 229, 0.7); }
          100% { box-shadow: 0 0 24px rgba(0, 245, 212, 0.45), inset 0 0 16px rgba(155, 93, 229, 0.45); }
        }

        .shockwave {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 132px;
          height: 132px;
          border-radius: 50%;
          border: 6px solid #fee440;
          opacity: 0;
          pointer-events: none;
        }

        .coin-wrapper.collapsed .shockwave {
          animation: shockwaveExpand 0.6s ease-out forwards;
        }

        @keyframes coinSpin3D {
          0% { transform: rotateY(0deg) rotateX(12deg); }
          100% { transform: rotateY(1080deg) rotateX(12deg); }
        }

        @keyframes shockwaveExpand {
          0% { width: 132px; height: 132px; opacity: 1; border-width: 8px; }
          100% { width: 400px; height: 400px; opacity: 0; border-width: 0px; }
        }

        .action-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .btn-group {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .sim-btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.1s, filter 0.2s;
        }

        .sim-btn:hover {
          filter: brightness(1.1);
        }

        .sim-btn:active {
          transform: scale(0.95);
        }

        .sim-btn-primary {
          background: linear-gradient(135deg, #00f5d4, #00bb94);
          color: #0b0d17;
          box-shadow: 0 0 15px rgba(0, 245, 212, 0.4);
        }

        .sim-btn-heads {
          background: linear-gradient(135deg, #fee440, #d4af37);
          color: #0b0d17;
          border: 2px solid #b8860b;
        }

        .sim-btn-tails {
          background: linear-gradient(135deg, #9b5de5, #7c3aed);
          color: white;
          border: 2px solid #581c87;
        }

        .sim-btn-secondary {
          background: #334155;
          color: white;
        }

        .sim-btn-success {
          background: #10b981;
          color: white;
        }

        .scoreboard {
          display: flex;
          gap: 12px;
          background: #0f172a;
          padding: 16px 32px;
          border-radius: 8px;
          border: 1px solid #1e293b;
          font-size: 14px;
          width: 100%;
          justify-content: center;
        }

        .score-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 80px;
          padding: 14px 12px;
          min-height: 72px;
          justify-content: center;
        }

        .score-val {
          font-size: 18px;
          font-weight: bold;
          color: #00f5d4;
          line-height: 1.3;
        }
      `}</style>

      <SpeakingSchro text={getMascotText()} />

      <div className="sim-stage">
        <div className="top-zone">
          {phase === 'idle' && (
            <div className="status-badge" style={{ color: '#94a3b8' }}>
              CLASSICAL STATE: RESTING FLAT ON LAUNCHPAD
            </div>
          )}
          {phase === 'airborne' && (
            <>
              <div className="status-badge">
                ⏱️ COIN SPINNING IN MID-AIR: {timeLeft.toFixed(1)}s left — Call Heads or Tails!
              </div>
              <div className="timer-bar-container">
                <div
                  className={`timer-bar ${timeLeft <= 2 ? 'critical' : ''}`}
                  style={{ width: `${(timeLeft / 5) * 100}%` }}
                ></div>
              </div>
            </>
          )}
          {phase === 'collapsed' && (
            <div className="status-badge" style={{ color: userChoice === outcome ? '#10b981' : '#f59e0b' }}>
              YOU CALLED: {userChoice ?? 'TIMEOUT'} • LANDED ON: {outcome}
            </div>
          )}
        </div>

        <div className={`coin-wrapper ${phase}`}>
          <div className="coin-spin-area">
            <div className="coin-aura"></div>
            <div className="shockwave"></div>
            <div className={`quantum-coin ${
              phase === 'idle' ? 'coin-idle' :
              phase === 'airborne' ? 'coin-spinning' : 'coin-collapsed'
            }`} style={phase === 'collapsed' && outcome === 'TAILS' ? { transform: 'rotateY(180deg)' } : {}}>
              <div className="quantum-coin-inner">
                <div className="coin-face coin-front">HEADS (0)</div>
                <div className="coin-face coin-back">TAILS (1)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="launchpad"></div>
      </div>

      <div className="action-panel">
        {phase === 'idle' && (
          <button className="sim-btn sim-btn-primary" onClick={flipCoin}>
            ⚡ Flip the Coin!
          </button>
        )}

        {phase === 'airborne' && (
          <div className="btn-group">
            <button className="sim-btn sim-btn-heads" onClick={() => callCoin('HEADS')}>
              🪙 Call HEADS (0)
            </button>
            <button className="sim-btn sim-btn-tails" onClick={() => callCoin('TAILS')}>
              ⚡ Call TAILS (1)
            </button>
          </div>
        )}

        {phase === 'collapsed' && (
          <div className="btn-group">
            <button className="sim-btn sim-btn-secondary" onClick={flipCoin}>
              🔄 Flip Again
            </button>
            <button className="sim-btn sim-btn-success" onClick={onComplete}>
              Continue Next Step →
            </button>
          </div>
        )}

        <div className="scoreboard">
          <div className="score-stat">
            <span style={{ color: '#94a3b8' }}>Flips</span>
            <span className="score-val">{stats.flips}</span>
          </div>
          <div className="score-stat">
            <span style={{ color: '#94a3b8' }}>Heads %</span>
            <span className="score-val">
              {stats.flips ? Math.round((stats.heads / stats.flips) * 100) : 0}%
            </span>
          </div>
          <div className="score-stat">
            <span style={{ color: '#94a3b8' }}>Tails %</span>
            <span className="score-val">
              {stats.flips ? Math.round((stats.tails / stats.flips) * 100) : 0}%
            </span>
          </div>
          <div className="score-stat">
            <span style={{ color: '#94a3b8' }}>Wins</span>
            <span className="score-val">{stats.wins}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
