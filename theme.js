/* ============================================================
   SKIN RESOLUTE — theme controller
   Dual-mode toggle: Faithful ⇄ Playful
   - Persists choice to localStorage (shared across all pages)
   - Restores before paint to avoid flash (see inline head snippet)
   - Uses View Transitions API when available for the signature
     cross-fade; falls back to the CSS color transition in theme.css
   ============================================================ */
(function () {
  var STORE = 'sr:mode';
  var MODES = ['faithful', 'playful'];

  function currentMode() {
    var m = (document.documentElement.getAttribute('data-mode') || 'faithful').toLowerCase();
    return MODES.indexOf(m) !== -1 ? m : 'faithful';
  }

  function apply(mode) {
    document.documentElement.setAttribute('data-mode', mode);
    // Update every toggle's aria-pressed for accessibility
    document.querySelectorAll('.mode-toggle').forEach(function (t) {
      t.setAttribute('aria-pressed', mode === 'playful' ? 'true' : 'false');
      t.setAttribute('aria-label', 'Reading in ' + (mode === 'playful' ? 'Playful' : 'Faithful') + ' mode. Tap to switch.');
    });
  }

  function persist(mode) {
    try { localStorage.setItem(STORE, mode); } catch (_) {}
  }

  function readStored() {
    try {
      var m = localStorage.getItem(STORE);
      return MODES.indexOf(m) !== -1 ? m : null;
    } catch (_) { return null; }
  }

  function flip() {
    var next = currentMode() === 'faithful' ? 'playful' : 'faithful';
    // The signature motion — View Transitions API cross-fades the root.
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(function () {
        apply(next);
        persist(next);
      });
    } else {
      apply(next);
      persist(next);
    }
  }

  // Restore saved mode on load (the no-flash snippet in <head> already
  // set it before CSS painted; this just keeps the toggle aria in sync).
  apply(readStored() || currentMode());

  // Wire up every toggle button on the page.
  function bind() {
    document.querySelectorAll('.mode-toggle').forEach(function (t) {
      if (t.__srBound) return;
      t.__srBound = true;
      t.addEventListener('click', flip);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  // Sync across tabs / windows.
  window.addEventListener('storage', function (e) {
    if (e.key === STORE && e.newValue && MODES.indexOf(e.newValue) !== -1) {
      apply(e.newValue);
    }
  });

  // Expose for debugging.
  window.__srTheme = { flip: flip, apply: apply, current: currentMode };
})();
