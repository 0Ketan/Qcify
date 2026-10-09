// Qcify — API Helper for Mascot Chat
// Centralized place for backend API calls

const API_BASE = 'http://localhost:8000';

/**
 * Sends a chat message to the backend and returns the response.
 * @param {Object} payload - {message, history:[{role,content}], player_name, track, current_route}
 * @returns {Promise<{reply:string, source:"nvidia"|"fallback"}>}
 */
export async function sendChatMessage(payload) {
  try {
    const response = await fetch(`${API_BASE}/mascot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        // Ensure we only send last 20 history items
        history: payload.history.slice(-20),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    // Expect shape {reply, source}
    if (data.reply && data.source) {
      return data;
    }
    throw new Error('Invalid response shape');
  } catch (err) {
    console.warn('Chat API failed, using fallback:', err);
    // Return a friendly in-character fallback
    const fallbackReplies = [
      "Meow! I'm having a moment of quantum uncertainty... Try again in a sec? 😺",
      "Sorry! My entanglement got tangled. Can you repeat that? 🐾",
      "Purr... I need to recharge my whiskers. Ask me again shortly!",
    ];
    const reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return { reply, source: 'fallback' };
  }
}