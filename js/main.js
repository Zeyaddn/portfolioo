/**
 * main.js - High-Performance Full Stack Developer Portfolio Engine
 * Zeyad Elassad — Freelance Full Stack Developer
 * Optimized for 60-120 FPS buttery smooth scrolling & zero layout thrashing
 */

import { initHero3D } from './hero-3d.js';

const state = {
  theme: localStorage.getItem('theme') || 'light',
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/* ==========================================================================
   GLOBAL TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('siteToast');
  const toastMsg = document.getElementById('siteToastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function initToastAndCopyEmail() {
  const copyBtns = [
    document.getElementById('copyEmailContactBtn')
  ];

  copyBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('zeyadkassem83@gmail.com');
        showToast('Email copied: zeyadkassem83@gmail.com');
      } catch (e) {
        showToast('Direct Email: zeyadkassem83@gmail.com');
      }
    });
  });
}

/* ==========================================================================
   MAGNETIC CTA BUTTONS (subtle pull toward cursor)
   ========================================================================== */
function initMagnetic() {
  if (state.prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  const targets = document.querySelectorAll('.magnetic-target');
  if (!targets.length) return;

  targets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      el.style.transform = `translate(${(relX * 6).toFixed(1)}px, ${(relY * 6).toFixed(1)}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
  const html = document.documentElement;
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    state.theme = theme;

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#0C0C0E' : '#FFFFFF');
    }

    themeToggles.forEach(btn => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      const icon = btn.querySelector('.theme-icon-container');
      if (icon) {
        icon.innerHTML = isDark 
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      }
    });
  }

  applyTheme(state.theme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });
}

/* ==========================================================================
   SMOOTH PORTRAIT TILT (ZERO LAYOUT THRASHING - CACHED RECT)
   ========================================================================== */
function initPortraitTilt() {
  if (state.prefersReducedMotion || window.innerWidth < 768) return;

  const stage = document.querySelector('.hero-portrait-stage-centered');
  const animatedWrapper = document.querySelector('.hero-portrait-animated-wrapper');
  if (!stage || !animatedWrapper) return;

  let rect = null;
  let ticking = false;

  stage.addEventListener('mouseenter', () => {
    rect = stage.getBoundingClientRect();
  });

  stage.addEventListener('mousemove', (e) => {
    if (!rect || ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      const tiltX = (y / (rect.height / 2)) * -5;
      const tiltY = (x / (rect.width / 2)) * 5;

      animatedWrapper.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`;
      ticking = false;
    });
  });

  stage.addEventListener('mouseleave', () => {
    rect = null;
    animatedWrapper.style.transform = '';
  });
}

/* ==========================================================================
   NAVBAR & SCROLLSPY (THROTTLED WITH REQUESTANIMATIONFRAME)
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.site-navbar');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');
  const offcanvasEl = document.getElementById('mobileNavOffcanvas');
  let bsOffcanvas = null;

  if (window.bootstrap && offcanvasEl) {
    bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
  }

  document.querySelectorAll('#mobileNavOffcanvas a').forEach(link => {
    link.addEventListener('click', () => {
      if (bsOffcanvas) bsOffcanvas.hide();
    });
  });

  // Zero-thrashing scroll state
  let isScrolled = false;
  window.addEventListener('scroll', () => {
    const shouldBeScrolled = window.scrollY > 30;
    if (navbar && shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      if (isScrolled) {
        navbar.classList.add('scrolled', 'tw-shadow-sm');
      } else {
        navbar.classList.remove('scrolled', 'tw-shadow-sm');
      }
    }
  }, { passive: true });

  // IntersectionObserver for active nav links - zero reflow layout thrashing
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  });

  sections.forEach(sec => navObserver.observe(sec));
}

/* ==========================================================================
   STAT COUNTERS (RE-TRIGGER ON EVERY SCROLL-IN)
   ========================================================================== */
function initCounters() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements.length) return;

  function runCounter(el) {
    if (el._counterAnimId) {
      cancelAnimationFrame(el._counterAnimId);
      el._counterAnimId = null;
    }

    const target = parseFloat(el.getAttribute('data-counter-target'));
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1200;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = isDecimal ? (ease * target).toFixed(1) : Math.floor(ease * target);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        el._counterAnimId = requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
        el._counterAnimId = null;
      }
    }

    el._counterAnimId = requestAnimationFrame(updateCounter);
  }

  function resetCounter(el) {
    if (el._counterAnimId) {
      cancelAnimationFrame(el._counterAnimId);
      el._counterAnimId = null;
    }
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    el.textContent = `${prefix}0${suffix}`;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
      } else {
        resetCounter(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = Array.from(document.querySelectorAll('.real-project-card'));
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Fade out then re-show
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (!show) {
          card.setAttribute('data-hidden', 'true');
        } else {
          card.removeAttribute('data-hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   DEVELOPER TERMINAL TABS & CODE COPY
   ========================================================================== */
function initDevTerminal() {
  const tabBtns = document.querySelectorAll('.terminal-tab-btn');
  const panes = document.querySelectorAll('.terminal-pane');
  const copyBtn = document.getElementById('copyCodeSnippetBtn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const activePane = document.querySelector('.terminal-pane.active code');
      if (activePane) {
        try {
          await navigator.clipboard.writeText(activePane.innerText);
          showToast('Code snippet copied to clipboard!');
        } catch (err) {
          showToast('Copied code snippet!');
        }
      }
    });
  }
}

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertEl = document.getElementById('formAlert');
  const submitBtn = document.getElementById('contactSubmitBtn');
  if (!form) return;

  const showAlert = (type, msg) => {
    if (!alertEl) return;
    const base = 'tw-p-4 tw-rounded-xl tw-font-mono tw-text-sm tw-mb-6 ';
    const style = type === 'success'
      ? 'tw-bg-green-50 tw-border tw-border-green-300 tw-text-green-800'
      : 'tw-bg-red-50 tw-border tw-border-red-300 tw-text-red-700';
    alertEl.className = base + style;
    alertEl.textContent = msg;
  };

  const fields = Array.from(form.querySelectorAll('.form-control-custom'));
  fields.forEach(field => {
    const clearInvalid = () => field.classList.remove('is-invalid');
    field.addEventListener('input', clearInvalid);
    field.addEventListener('change', clearInvalid);
    field.addEventListener('blur', () => {
      if (field.hasAttribute('required') && !field.checkValidity()) {
        field.classList.add('is-invalid');
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value.trim() !== '') return;

    if (!form.checkValidity()) {
      fields.forEach(field => {
        field.classList.toggle('is-invalid', !field.checkValidity());
      });
      form.reportValidity();
      return;
    }

    const endpoint = form.getAttribute('action') || '';
    const isConfigured = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint);

    // No live backend configured yet: never silently drop a message, open a prefilled draft instead.
    if (!isConfigured) {
      const data = new FormData(form);
      const subject = encodeURIComponent(`New project inquiry — ${data.get('scope') || 'General'}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name') || ''}\n` +
        `Email: ${data.get('email') || ''}\n` +
        `Project type: ${data.get('scope') || ''}\n\n` +
        `${data.get('message') || ''}`
      );
      window.location.href = `mailto:zeyadkassem83@gmail.com?subject=${subject}&body=${body}`;
      showAlert('success', 'Opening your email app to send the message to zeyadkassem83@gmail.com...');
      showToast('Opening your email app...');
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending message...';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('Request failed');

      showAlert('success', 'Message sent successfully! Zeyad will get in touch with you shortly.');
      showToast('Message sent successfully!');
      form.reset();
    } catch (err) {
      showAlert('error', 'Error sending message. Please email zeyadkassem83@gmail.com directly.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (SMOOTH 60-120 FPS ZERO DELAY)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-top, .scroll-reveal-scale, .scroll-reveal-journey-1, .scroll-reveal-journey-2, .scroll-reveal-journey-3'
  );
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '120px 0px 120px 0px',
    threshold: 0
  });

  elements.forEach(el => observer.observe(el));

  // Fallback check to immediately reveal any elements already in or near viewport
  const revealVisible = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    elements.forEach(el => {
      if (!el.classList.contains('revealed')) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh + 100 && rect.bottom >= -100) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      }
    });
  };

  requestAnimationFrame(revealVisible);
  window.addEventListener('scroll', revealVisible, { passive: true });
}

/* ==========================================================================
   SERVICES SELECTION PRE-FILL & FOCUS
   ========================================================================== */
function initServiceButtons() {
  const serviceButtons = document.querySelectorAll('[data-service-select]');
  const projectScopeInput = document.getElementById('projectScope');
  const userMessageInput = document.getElementById('userMessage');

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service-select');
      if (projectScopeInput && serviceName) {
        projectScopeInput.value = serviceName;
        projectScopeInput.style.borderColor = 'var(--text)';
        projectScopeInput.style.backgroundColor = 'var(--surface)';
        setTimeout(() => {
          projectScopeInput.style.borderColor = '';
          projectScopeInput.style.backgroundColor = '';
        }, 2200);
      }
      setTimeout(() => {
        if (userMessageInput && !userMessageInput.value) {
          userMessageInput.focus();
        }
      }, 450);
      showToast(`تم اختيار: ${serviceName}`);
    });
  });
}

/* ==========================================================================
   DOM READY & INITIALIZATION
   ========================================================================== */
function initApp() {
  initTheme();
  initHero3D();
  initMagnetic();
  initPortraitTilt();
  initNavbar();
  initCounters();
  initScrollReveal();
  initServiceButtons();
  initProjectFilters();
  initDevTerminal();
  initToastAndCopyEmail();
  initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

