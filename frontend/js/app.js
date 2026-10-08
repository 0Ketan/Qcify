/**
 * QUANTUMPAWS — App Entry Point
 * Registers all routes and initializes the app
 */

// ---- Route Registration ----
Router.register('/login', renderLogin);
Router.register('/onboarding', renderOnboarding);
Router.register('/dashboard', renderDashboard);
Router.register('/lesson', renderLesson);
Router.register('/quiz', renderQuiz);
Router.register('/sandbox', renderSandbox);
Router.register('/profile', renderProfile);
Router.register('/coming-soon', renderComingSoon);

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  // Set up QP global state
  window.QP = {
    playerName: sessionStorage.getItem('qp_name') || null,
    track: sessionStorage.getItem('qp_track') || 'newbie',
    progress: parseInt(sessionStorage.getItem('qp_progress') || '15'),
  };

  // Start router
  Router.init();

  // Keyboard shortcut: Escape closes modal/drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeChatDrawer();
    }
  });
});

// Persist player name when set
const _origLogin = handleLogin;
// Override to also save to session
window.handleLogin = function() {
  const nameInput = document.getElementById('player-name');
  const name = nameInput?.value.trim();
  if (name) {
    sessionStorage.setItem('qp_name', name);
    if (window.QP) window.QP.playerName = name;
  }
  _origLogin();
};
