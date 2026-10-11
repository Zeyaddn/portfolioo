/* Project pages theme toggle — standalone app so case studies share the homepage theme.
   Mirrors the toggle logic in js/main.js without pulling in the full app. */
(function () {
  var html = document.documentElement;
  var SUN = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
  var MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  function getTheme() {
    try { return localStorage.getItem('theme') || 'light'; } catch (e) { return 'light'; }
  }

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0C0C0E' : '#FFFFFF');
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      var icon = btn.querySelector('.theme-icon-container');
      if (icon) icon.innerHTML = isDark ? SUN : MOON;
    });
  }

  apply(getTheme());

  document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });
})();