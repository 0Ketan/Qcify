import { sendChatMessage } from './api.js';

const SchroResponses = {
  greetings: [
    "Meow! 🐾 What quantum mystery can I help you unravel today?",
    "Hey there! I'm Schrö — simultaneously everywhere and nowhere until you ask me something! ⚛️",
    "Purr... ready to explore the quantum realm together? 🌀"
  ],
  superposition: [
    "Great question! 🌟 Superposition is like me being both asleep AND awake until you peek — Schrödinger's cat in action! The qubit is in BOTH states simultaneously until measured.",
    "Think of it like a coin spinning in the air — it's neither heads nor tails until it lands. A qubit in superposition is both |0⟩ AND |1⟩ at the same time! ⚛️"
  ],
  entanglement: [
    "Entanglement is my favorite! 💜 Two qubits become so deeply connected that measuring one instantly tells you about the other — Einstein called it 'spooky action at a distance'!",
    "Imagine if every time I yawned, another cat across the universe yawned too — instantly! That's quantum entanglement. 🐾"
  ],
  gates: [
    "Quantum gates are like operations on qubits — similar to classical logic gates but with quantum superpowers! The H gate puts a qubit into superposition. Try it! ⚗️",
    "The Hadamard (H) gate is the most magical — it takes a definite |0⟩ and turns it into an equal superposition of |0⟩ and |1⟩. Pure quantum magic! ✨"
  ],
  encouragement: [
    "You're doing amazing! Every quantum physicist started exactly where you are. Keep going! 💜",
    "That's the spirit! Quantum mechanics confused Einstein too, so you're in good company! 🌟",
    "Purrfect effort! 🐾 The quantum world rewards curiosity — and you have plenty of that!"
  ],
  default: [
    "Hmm, let me think about that... 🤔 Quantum computing is full of surprises! Try asking me about superposition, entanglement, or quantum gates!",
    "Great question! Quantum mechanics is wild — even cats like me find it fascinating. What specific part would you like to explore? ⚛️"
  ]
};

function getSchroResponse(input) {
  const lower = input.toLowerCase();
  if (lower.match(/superposi/)) return random(SchroResponses.superposition);
  if (lower.match(/entangl/)) return random(SchroResponses.entanglement);
  if (lower.match(/gate|hadamard|pauli|cnot/)) return random(SchroResponses.gates);
  if (lower.match(/hi|hello|hey|meow/)) return random(SchroResponses.greetings);
  if (lower.match(/help|lost|confused|hard/)) return random(SchroResponses.encouragement);
  return random(SchroResponses.default);
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- Quick Ask Chips ----
function getQuickAskChips(track) {
  switch (track) {
    case 'newbie':
      return [
        "Explain superposition like a coin",
        "What is a qubit?",
        "Why does quantum computing matter?"
      ];
    case 'intermediate':
      return [
        "What does the H-gate do?",
        "Explain |+> vs |0>",
        "How do I make a Bell state in Qiskit?"
      ];
    case 'advanced':
      return [
        "Show the matrix of the CX gate",
        "Qiskit tip for debugging circuits",
        "Explain phase kickback"
      ];
    default:
      return [];
  }
}

// ---- Chat State ----
let chatOpen = false;
let chatMessages = [];
let hintsOpen = false;
let hintsRevealed = 0;

function toggleChatDrawer() {
  chatOpen = !chatOpen;
  const drawer = document.getElementById('chat-drawer');
  drawer.classList.toggle('open', chatOpen);

  if (chatOpen && chatMessages.length === 0) {
    // Show greeting with quick-ask chips based on track
    const track = window.QP?.track ?? 'newbie';
    const quickChips = getQuickAskChips(track);
    setTimeout(() => {
      addSchroMessage(random(SchroResponses.greetings), quickChips);
    }, 400);
  }
}

function closeChatDrawer() {
  chatOpen = false;
  const drawer = document.getElementById('chat-drawer');
  if (drawer) drawer.classList.remove('open');
}

function minimizeChatDrawer() {
  closeChatDrawer();
}

function closeNudge() {
  const nudge = document.getElementById('proactive-nudge');
  if (nudge) nudge.style.display = 'none';
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input?.value.trim();
  if (!text) return;

  // Hide empty state
  const empty = document.getElementById('chat-empty');
  if (empty) empty.style.display = 'none';

  addUserMessage(text);
  input.value = '';

  // Show typing
  const typingId = addTypingIndicator();

  try {
    // Prepare payload
    const payload = {
      message: text,
      history: chatMessages.slice(-20).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      player_name: window.QP?.playerName ?? '',
      track: window.QP?.track ?? 'newbie',
      current_route: window.Router?.currentScreen ?? ''
    };

    // Call backend API
    const response = await sendChatMessage(payload);

    // Remove typing indicator
    removeTypingIndicator(typingId);

    // Add assistant message
    addSchroMessage(response.reply);
  } catch (err) {
    console.error('Chat error:', err);
    removeTypingIndicator(typingId);
    // Fallback message
    addSchroMessage("Meow! I'm having a moment of quantum uncertainty... Try again in a sec? 😺");
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function addUserMessage(text) {
  chatMessages.push({ role: 'user', text });
  const body = document.getElementById('chat-messages');
  if (!body) return;
  const row = document.createElement('div');
  row.className = 'chat-msg-row user animate-fade-in';
  row.innerHTML = `<div class="user-bubble">${text}</div>`;
  body.appendChild(row);
  scrollChatToBottom();
}

function addSchroMessage(text, quickReplies = null) {
  chatMessages.push({ role: 'schro', text });
  const body = document.getElementById('chat-messages');
  if (!body) return;

  const row = document.createElement('div');
  row.className = 'chat-msg-row animate-fade-in';

  let quickReplyHtml = '';
  if (quickReplies) {
    quickReplyHtml = `
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
        ${quickReplies.map(r => `<button class="btn btn-secondary btn-sm" onclick="sendQuickReply('${r}')">${r}</button>`).join('')}
      </div>
    `;
  }

  row.innerHTML = `
    <div style="font-size:24px;flex-shrink:0">🐾</div>
    <div class="mascot-bubble">${text}${quickReplyHtml}</div>
  `;
  body.appendChild(row);
  scrollChatToBottom();
}

function sendQuickReply(text) {
  const input = document.getElementById('chat-input');
  if (input) input.value = text;
  sendChatMessage();
}

function addTypingIndicator() {
  const body = document.getElementById('chat-messages');
  if (!body) return null;
  const id = 'typing-' + Date.now();
  const row = document.createElement('div');
  row.className = 'chat-msg-row';
  row.id = id;
  row.innerHTML = `
    <div style="font-size:24px;flex-shrink:0">🐾</div>
    <div class="mascot-bubble" style="padding:10px 16px">
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  body.appendChild(row);
  scrollChatToBottom();
  return id;
}

function removeTypingIndicator(id) {
  if (id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}

function scrollChatToBottom() {
  const body = document.getElementById('chat-body');
  if (body) body.scrollTop = body.scrollHeight;
}

function toggleHints() {
  hintsOpen = !hintsOpen;
  const list = document.getElementById('hints-list');
  if (list) list.classList.toggle('hidden', !hintsOpen);
}

function revealHint(num) {
  if (num > hintsRevealed + 1) return;
  hintsRevealed = Math.max(hintsRevealed, num);

  if (num === 1) {
    const h2 = document.getElementById('hint-2');
    if (h2) h2.classList.remove('hint-locked');
  }
  if (num >= 2) {
    const ha = document.getElementById('hint-answer');
    if (ha) ha.classList.remove('hint-locked');
  }

  showToast('Hint revealed! 💡', 'default', 2000);
}