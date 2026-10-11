/* Early theme bootstrap — runs before first paint to avoid a flash of the wrong theme. */
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) { /* localStorage unavailable */ }
})();
