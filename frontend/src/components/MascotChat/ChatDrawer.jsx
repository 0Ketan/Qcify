import React, { useState, useRef, useEffect } from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { api } from '../../services/api';
import { SchroMascot } from '../Shared/SchroMascot';
import { HintLadder } from './HintLadder';

export function ChatDrawer() {
  const isChatOpen = useUserStore(s => s.isChatOpen);
  const chatMessages = useUserStore(s => s.chatMessages);
  const schroExpression = useUserStore(s => s.schroExpression);
  const currentRoute = useUserStore(s => s.currentRoute);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  if (!isChatOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    setInputVal('');
    userStore.addChatMessage({ role: 'user', content: query });
    userStore.setSchroExpression('thinking');
    setIsTyping(true);

    try {
      const res = await api.chatWithSchro(query, currentRoute, chatMessages);
      userStore.addChatMessage({ role: 'assistant', content: res.reply });
      if (res.expression) {
        userStore.setSchroExpression(res.expression);
      }
    } catch (err) {
      userStore.addChatMessage({
        role: 'assistant',
        content: "Meow! My probability wave encountered cosmic interference, but I'm still purring! Try asking about Hadamard gates or Superposition! 🐾"
      });
      userStore.setSchroExpression('encouraging');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '72px',
      right: 0,
      bottom: 0,
      width: '380px',
      background: 'rgba(15, 21, 37, 0.98)',
      backdropFilter: 'blur(16px)',
      borderLeft: '1.5px dashed var(--stroke-chalk)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px dashed var(--stroke-chalk)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(20, 27, 45, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SchroMascot expression={schroExpression} size={48} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Schrö
              <span style={{ fontSize: '10px', color: 'var(--accent-lime)', fontFamily: 'var(--font-code)' }}>AI LAB MENTOR</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              State: Superposition 🐾
            </div>
          </div>
        </div>

        <button
          onClick={() => userStore.toggleChat()}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '18px', padding: '4px 8px' }}
        >
          ✕
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {chatMessages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: isUser ? 'var(--primary-dirty)' : 'var(--surface-raised)',
                border: isUser ? '1px solid rgba(255,255,255,0.2)' : '1px dashed var(--stroke-chalk)',
                borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                padding: '10px 14px',
                fontSize: '13.5px',
                lineHeight: 1.5,
                color: 'var(--text)',
                boxShadow: isUser ? 'var(--shadow-grainy)' : 'none'
              }}
            >
              {msg.content}
            </div>
          );
        })}

        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '8px 14px',
            background: 'var(--surface-raised)',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'var(--text-chalk)',
            fontStyle: 'italic'
          }}>
            Schrö is calculating probability amplitudes... 🐾
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Hint Ladder */}
      <div style={{ padding: '0 16px' }}>
        <HintLadder topic="superposition" />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '14px 16px',
          borderTop: '1px dashed var(--stroke-chalk)',
          display: 'flex',
          gap: '8px',
          background: 'rgba(20, 27, 45, 0.8)'
        }}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask Schrö about qubits, gates..."
          style={{
            flex: 1,
            background: 'var(--surface-raised)',
            border: '1px solid var(--stroke-chalk)',
            borderRadius: 'var(--radius-imperfect)',
            padding: '10px 14px',
            color: 'var(--text)',
            fontSize: '13.5px',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn btn-primary btn-sm">
          ➤
        </button>
      </form>
    </div>
  );
}
