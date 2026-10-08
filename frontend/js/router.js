/**
 * QUANTUMPAWS — Client-Side Router
 * Hash-based SPA routing
 */

const Router = {
  routes: {},
  currentScreen: null,

  register(path, renderFn) {
    this.routes[path] = renderFn;
  },

  navigate(path, params = {}) {
    const url = params ? `#${path}` : `#${path}`;
    window.history.pushState({ path, params }, '', url);
    this._render(path, params);
  },

  _render(path, params = {}) {
    const app = document.getElementById('app');
    const renderFn = this.routes[path];

    if (!renderFn) {
      console.warn(`No route for: ${path}`);
      this.navigate('/login');
      return;
    }

    // Clear and render
    app.innerHTML = '';
    renderFn(app, params);
    this.currentScreen = path;

    // Show floating button on relevant screens
    const floatingBtn = document.getElementById('floating-schro-btn');
    const showOn = ['/dashboard', '/lesson', '/quiz', '/sandbox', '/profile'];
    if (showOn.includes(path)) {
      floatingBtn.classList.remove('hidden');
      // Show nudge after 3s
      setTimeout(() => {
        const nudge = document.getElementById('proactive-nudge');
        if (nudge && path === '/lesson') {
          nudge.style.display = 'flex';
        }
      }, 3000);
    } else {
      floatingBtn.classList.add('hidden');
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Close chat drawer on navigate
    closeChatDrawer();
  },

  init() {
    window.addEventListener('popstate', (e) => {
      const path = window.location.hash.replace('#', '') || '/login';
      this._render(path, e.state?.params || {});
    });

    const hasName = sessionStorage.getItem('qp_name');
    let initialPath = window.location.hash.replace('#', '') || '/login';
    if (!hasName) {
      initialPath = '/login';
    }
    this._render(initialPath);
  }
};

// Global nav helpers
function navigate(path, params) {
  Router.navigate(path, params);
}
