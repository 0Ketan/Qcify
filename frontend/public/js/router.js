/**
 * Qcify — Client-Side Router
 * Hash-based SPA routing with query param deep linking and state preservation
 */

const Router = {
  routes: {},
  currentScreen: null,

  register(path, renderFn) {
    this.routes[path] = renderFn;
  },

  navigate(path, params = {}) {
    // If params are provided, serialize to URL query string for refresh & share persistence
    let url = `#${path}`;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) searchParams.set(k, String(v));
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    window.history.pushState({ path, params }, '', url);
    this._render(path, params);
  },

  _render(rawPath, explicitParams = {}) {
    const app = document.getElementById('app');
    
    // Parse route path and query parameters
    let [pathOnly, queryString] = (rawPath || '/login').split('?');
    pathOnly = pathOnly.trim() || '/login';

    const parsedParams = {};
    if (queryString) {
      const sp = new URLSearchParams(queryString);
      sp.forEach((val, key) => {
        parsedParams[key] = val;
      });
    }
    const mergedParams = { ...parsedParams, ...explicitParams };

    const renderFn = this.routes[pathOnly];

    if (!renderFn) {
      console.warn(`No route for: ${pathOnly}`);
      const hasName = sessionStorage.getItem('qp_name');
      this.navigate(hasName ? '/dashboard' : '/login');
      return;
    }

    // Clear and render
    app.innerHTML = '';
    renderFn(app, mergedParams);
    this.currentScreen = pathOnly;

    // Show floating button on relevant screens
    const floatingBtn = document.getElementById('floating-schro-btn');
    if (floatingBtn) {
      const showOn = ['/dashboard', '/lesson', '/quiz', '/sandbox', '/profile', '/badges'];
      if (showOn.includes(pathOnly)) {
        floatingBtn.classList.remove('hidden');
        // Show nudge after 3s
        setTimeout(() => {
          const nudge = document.getElementById('proactive-nudge');
          if (nudge && pathOnly === '/lesson') {
            nudge.style.display = 'flex';
          }
        }, 3000);
      } else {
        floatingBtn.classList.add('hidden');
      }
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Close chat drawer on navigate
    if (typeof closeChatDrawer === 'function') {
      closeChatDrawer();
    }
  },

  init() {
    window.addEventListener('popstate', (e) => {
      const hashStr = window.location.hash.replace('#', '') || '/login';
      this._render(hashStr, e.state?.params || {});
    });

    const hasName = sessionStorage.getItem('qp_name');
    let initialHash = window.location.hash.replace('#', '').trim();
    
    if (!initialHash || initialHash === '/' || initialHash === '') {
      initialHash = hasName ? '/dashboard' : '/login';
    } else if (!hasName && initialHash !== '/login') {
      // Require name for protected screens
      initialHash = '/login';
    }

    this._render(initialHash);
  }
};

// Global nav helpers
function navigate(path, params) {
  Router.navigate(path, params);
}
