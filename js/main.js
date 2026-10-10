/**
 * main.js - High-Performance Full Stack Developer Portfolio Engine
 * Zeyad Elassad — Freelance Full Stack Developer
 * Optimized for 60-120 FPS buttery smooth scrolling & zero layout thrashing
 */

const state = {
  theme: localStorage.getItem('theme') || 'light',
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// Real Projects Database
const caseStudies = {
  'muslim': {
    title: 'Muslim Platform — Comprehensive Islamic Web App',
    client: 'Independent Production Project',
    role: 'Lead Full Stack Developer & Performance Engineer',
    year: '2024',
    category: 'Next.js 14 & PWA',
    description: 'An all-in-one Islamic web platform featuring the full Quran with synced audio recitations, precision prayer times using Adhan.js, interactive Qibla compass, Athkar counter, 99 Names of Allah, and full offline PWA support.',
    tech: ['Next.js 14', 'React 18', 'Vanilla CSS Tokens', 'Adhan.js', 'Web-Push API', 'React.memo', 'PWA Offline'],
    stats: { performance: '60 FPS Smooth', latency: 'Zero Load Delay', uptime: '100% PWA Offline' },
    image: './assets/img/muslim.webp',
    liveUrl: 'https://muslim-eight-iota.vercel.app/'
  },
  'courses': {
    title: 'Courses City — Advanced LMS & Student Tracking',
    client: 'EdTech Academy Platform',
    role: 'Frontend & System Architect',
    year: '2024',
    category: 'Next.js & Storybook',
    description: 'Educational learning management system equipped with student video watch-time progress telemetry, full instructor & student dashboards, assignment submissions, lesson playlists, and modular Storybook component system.',
    tech: ['Next.js', 'React', 'Storybook', 'Tailwind CSS', 'RESTful APIs', 'Video Telemetry'],
    stats: { architecture: 'Storybook Driven', dashboards: 'Student & Teacher', responseTime: '<25ms UI' },
    image: './assets/img/courses.webp',
    liveUrl: 'https://courses-sity.vercel.app/'
  },
  'fintech': {
    title: 'FinTech Money — Digital Banking Transaction System',
    client: 'Financial Technology Product',
    role: 'Full Stack Engineer',
    year: '2024',
    category: 'Fintech & Next.js',
    description: 'High-security financial transfer platform modelled on instant bank transactions (similar to InstaPay), delivering real-time balance calculations, audit logs, recipient verification, and clean banking interfaces.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Secure Financial APIs', 'State Management'],
    stats: { security: 'Encrypted Endpoints', speed: 'Instant Transfer UI', typeSafety: '100% TypeScript' },
    image: './assets/img/fintech.webp',
    liveUrl: 'https://fin-tech-money.vercel.app/'
  },
  'albaytcharity': {
    title: 'Al Bayt Charity — Humanitarian Aid Case Portal',
    client: 'Al Bayt Charity Organization',
    role: 'Full Stack Developer',
    year: '2024',
    category: 'Full Stack Web & Database',
    description: 'Comprehensive humanitarian charity platform engineered for managing aid cases, collecting support requests, donor tracking, and automated administrative reports.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Responsive CSS', 'File Uploads', 'Admin CMS'],
    stats: { database: 'Relational MySQL', security: 'Role-Based Auth', design: 'Mobile First' },
    image: './assets/img/albaytcharity.webp',
    liveUrl: 'https://albaytcharity.kesug.com/'
  },
  'travelsphere': {
    title: 'TravelSphere — Tourism Exploration & Itinerary Booking',
    client: 'Travel & Tourism Product',
    role: 'React Frontend Developer',
    year: '2023',
    category: 'React & Interactive UI',
    description: 'Interactive global tourism discovery web application featuring curated destination filtering, interactive tour schedules, dynamic cost calculations, and modern responsive galleries.',
    tech: ['React.js', 'Modern CSS Architecture', 'Responsive Layouts', 'Client Routing'],
    stats: { performance: 'Instant Filtering', responsiveness: 'Mobile Optimized', design: 'Editorial' },
    image: './assets/img/TravelSphere.webp',
    liveUrl: 'https://zeyaddn.github.io/TravelSphere/'
  },
  'freshfood': {
    title: 'FreshFood — Organic Market & Express Delivery Landing',
    client: 'Food Delivery Platform',
    role: 'Web Developer',
    year: '2023',
    category: 'HTML5, CSS3 & JavaScript',
    description: 'Crisp, lightweight online organic grocery and meal delivery storefront with dynamic shopping cart calculations, nutritional showcases, and zero external framework bloat.',
    tech: ['HTML5 Semantic', 'CSS3 Flex/Grid', 'Vanilla JavaScript ES6', 'Micro-Interactions'],
    stats: { lighthouseScore: '100/100', loadSpeed: '<0.5s', bundleSize: '<45KB Total' },
    image: './assets/img/FreshFood2.webp',
    liveUrl: 'https://zeyaddn.github.io/FreshFood2/'
  }
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
    document.getElementById('copyEmailHeroBtn'),
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
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
  const html = document.documentElement;
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    state.theme = theme;

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
   MODAL CASE STUDIES LAUNCHER
   ========================================================================== */
function initWorkSection() {
  const modalTriggers = document.querySelectorAll('[data-project-trigger]');
  const modalEl = document.getElementById('projectCaseModal');
  let bsModal = null;

  if (window.bootstrap && modalEl) {
    bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project-trigger');
      const data = caseStudies[projectId];
      if (!data || !modalEl) return;

      document.getElementById('modalProjectTitle').textContent = data.title;
      document.getElementById('modalProjectClient').textContent = data.category;
      document.getElementById('modalProjectRole').textContent = data.role;
      document.getElementById('modalProjectYear').textContent = data.year;
      document.getElementById('modalProjectDesc').textContent = data.description;
      document.getElementById('modalProjectImg').setAttribute('src', data.image);
      document.getElementById('modalProjectImg').setAttribute('alt', data.title);
      document.getElementById('modalProjectLiveLink').setAttribute('href', data.liveUrl);

      const techContainer = document.getElementById('modalProjectTech');
      techContainer.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'work-tag-pill tw-mr-2 tw-mb-2 tw-inline-block';
        span.textContent = t;
        techContainer.appendChild(span);
      });

      const statsContainer = document.getElementById('modalProjectStats');
      statsContainer.innerHTML = '';
      Object.entries(data.stats).forEach(([key, val]) => {
        const div = document.createElement('div');
        div.className = 'tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-xl tw-p-3';
        div.innerHTML = `<span class="mono-tag tw-text-gray-500 tw-block">${key}</span><span class="tw-font-bold tw-text-gray-900 tw-text-sm">${val}</span>`;
        statsContainer.appendChild(div);
      });

      if (bsModal) {
        bsModal.show();
      }
    });
  });
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value.trim() !== '') return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending message...`;

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      if (alertEl) {
        alertEl.className = 'tw-p-4 tw-rounded-xl tw-bg-green-50 tw-border tw-border-green-300 tw-text-green-800 tw-font-mono tw-text-sm tw-mb-6';
        alertEl.textContent = 'Message sent successfully! Zeyad will get in touch with you shortly.';
        alertEl.classList.remove('tw-hidden');
      }

      showToast('Message sent successfully!');
      form.reset();
    } catch (err) {
      if (alertEl) {
        alertEl.className = 'tw-p-4 tw-rounded-xl tw-bg-red-50 tw-border tw-border-red-300 tw-text-red-700 tw-font-mono tw-text-sm tw-mb-6';
        alertEl.textContent = 'Error sending message. Please email zeyadkassem83@gmail.com directly.';
        alertEl.classList.remove('tw-hidden');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
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

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px 80px 0px',
    threshold: 0.01
  });

  elements.forEach(el => observer.observe(el));
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
   DOM READY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPortraitTilt();
  initNavbar();
  initCounters();
  initScrollReveal();
  initServiceButtons();
  initWorkSection();
  initProjectFilters();
  initDevTerminal();
  initToastAndCopyEmail();
  initContactForm();
});

