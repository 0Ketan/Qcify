import React, { useState, useEffect, useRef } from 'react';

export function SpeakingSchro({ text }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    // reset
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedText('');
    setIsSpeaking(true);
    
    let i = 0;
    intervalRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setIsSpeaking(false);
      }
    }, 30);
    
    // Voice synth
    if (voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.2; // Slightly higher pitch for cute cat
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, voiceEnabled]);

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="speaking-schro">
      <style>{`
        .speaking-schro {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          background: rgba(20, 27, 45, 0.8);
          border: 1px dashed #334155;
          padding: 16px;
          border-radius: 12px;
          width: 100%;
        }

        .schro-avatar {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
        }

        .schro-bounce {
          animation: bounceCat 0.5s infinite alternate ease-in-out;
        }

        @keyframes bounceCat {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }

        .schro-blink {
          animation: blinkEyes 3s infinite;
        }

        @keyframes blinkEyes {
          0%, 95%, 100% { transform: scaleY(1); }
          97.5% { transform: scaleY(0.1); }
        }

        .schro-mouth-speak {
          animation: talkMouth 0.15s infinite alternate;
        }

        @keyframes talkMouth {
          from { transform: scaleY(0.2); }
          to { transform: scaleY(1); }
        }

        .schro-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .schro-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .schro-name {
          font-family: var(--font-code, monospace);
          font-size: 11px;
          color: #00f5d4;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .voice-eq {
          display: flex;
          gap: 2px;
          height: 10px;
          align-items: flex-end;
        }

        .eq-bar {
          width: 3px;
          background: #00f5d4;
          border-radius: 2px;
        }

        .eq-bar-anim1 { animation: eqAnim 0.3s infinite alternate; }
        .eq-bar-anim2 { animation: eqAnim 0.4s infinite alternate-reverse; }
        .eq-bar-anim3 { animation: eqAnim 0.25s infinite alternate; }
        .eq-bar-anim4 { animation: eqAnim 0.35s infinite alternate-reverse; }

        @keyframes eqAnim {
          from { height: 2px; }
          to { height: 10px; }
        }

        .schro-bubble {
          font-size: 15px;
          line-height: 1.5;
          color: #e2e8f0;
          min-height: 45px;
        }

        .voice-toggle {
          background: transparent;
          border: 1px solid #334155;
          color: #94a3b8;
          border-radius: 4px;
          font-size: 10px;
          padding: 2px 6px;
          cursor: pointer;
        }
        
        .voice-toggle.active {
          color: #00f5d4;
          border-color: #00f5d4;
        }
      `}</style>
      
      <div className={`schro-avatar ${isSpeaking ? 'schro-bounce' : ''}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base Head */}
          <rect x="15" y="25" width="70" height="60" rx="30" fill="#1e293b" />
          {/* Ears */}
          <polygon points="15,40 5,10 35,25" fill="#1e293b" />
          <polygon points="85,40 95,10 65,25" fill="#1e293b" />
          <polygon points="17,37 9,15 32,26" fill="#9b5de5" opacity="0.6"/>
          <polygon points="83,37 91,15 68,26" fill="#9b5de5" opacity="0.6"/>
          
          {/* Cyber Visor */}
          <rect x="20" y="40" width="60" height="20" rx="10" fill="#0b0d17" stroke="#00f5d4" strokeWidth="2" />
          
          {/* Glowing Eyes */}
          <g className="schro-blink" transform-origin="50px 50px">
            <circle cx="35" cy="50" r="5" fill="#00f5d4" />
            <circle cx="65" cy="50" r="5" fill="#00f5d4" />
          </g>
          
          {/* Whiskers */}
          <line x1="5" y1="60" x2="20" y2="62" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="70" x2="20" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <line x1="95" y1="60" x2="80" y2="62" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <line x1="95" y1="70" x2="80" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          
          {/* Nose */}
          <polygon points="50,68 47,65 53,65" fill="#9b5de5" />
          
          {/* Mouth */}
          <g transform-origin="50px 75px" className={isSpeaking ? 'schro-mouth-speak' : ''}>
            <path d="M45 75 Q50 80 55 75" stroke="#00f5d4" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>
      
      <div className="schro-content">
        <div className="schro-header">
          <div className="schro-name">
            SCHRÖ • LIVE GUIDE
            {isSpeaking && (
              <div className="voice-eq">
                <div className="eq-bar eq-bar-anim1"></div>
                <div className="eq-bar eq-bar-anim2"></div>
                <div className="eq-bar eq-bar-anim3"></div>
                <div className="eq-bar eq-bar-anim4"></div>
              </div>
            )}
          </div>
          <button 
            className={`voice-toggle ${voiceEnabled ? 'active' : ''}`}
            onClick={toggleVoice}
          >
            {voiceEnabled ? '🔊 Voice ON' : '🔈 Voice OFF'}
          </button>
        </div>
        <div className="schro-bubble">
          {displayedText}
          {isSpeaking && <span style={{ opacity: 0.5 }}>█</span>}
        </div>
      </div>
    </div>
  );
}

