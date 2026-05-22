/**
 * UTN FRCon Campus Redesign v4
 * Maneja: front page / curso / login — logged in / out
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'nhood-theme';

  // ── Lucide Vector Icons (Inline SVGs for reliability and zero-CSP issues) ──────
  const LUCIDE_ICONS = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    key: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 11 2 2 4-4"/></svg>`,
    graduationCap: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/><path d="M21.5 12v6"/></svg>`,
    logOut: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out" style="display: inline-block; vertical-align: middle; margin-left: 4.5px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    compass: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`,
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    cog: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cog"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6Z"/></svg>`,
    terminal: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    award: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    barChart2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    clipboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`,
    bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><polyline points="9 18 15 12 9 6"/></svg>`
  };

  // ── Detectar contexto ──────────────────────────────────
  const body        = document.body;
  const isFrontPage = body.classList.contains('pagelayout-frontpage');
  const isLoggedIn  = !body.classList.contains('notloggedin');
  const isLoginPage = body.classList.contains('pagelayout-login');

  // Inject general courses page layout class if on dashboard or courses page
  const isMyCoursesPage = window.location.pathname.includes('/my/') || window.location.pathname.includes('courses.php');
  if (isMyCoursesPage) {
    body.classList.add('pagelayout-mycourses');
  }

  // ── Icon map ───────────────────────────────────────────
  const ICONS = {
    'ingreso':'graduationCap','basica':'compass','básica':'compass','civil':'building',
    'eléctrica':'zap','electrica':'zap','industrial':'cog',
    'administración':'briefcase','administracion':'briefcase','higiene':'shield',
    'seguridad':'shield','programación':'terminal','programacion':'terminal',
    'mantenimiento':'wrench','posgrado':'award','extensión':'globe',
    'extension':'globe','encuesta':'barChart2','articulación':'link',
    'articulacion':'link','planeamiento':'clipboard','capacitación':'bookOpen',
    'capacitacion':'bookOpen','gestión':'building','gestion':'building','tecnicatura':'bookOpen',
  };
  function getIcon(t) {
    const l = (t || '').toLowerCase();
    for (const [k,v] of Object.entries(ICONS)) if (l.includes(k)) return LUCIDE_ICONS[v] || LUCIDE_ICONS.folder;
    return LUCIDE_ICONS.folder;
  }

  // ── Helpers ────────────────────────────────────────────
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ── Theme ──────────────────────────────────────────────
  function getTheme()   { return localStorage.getItem(STORAGE_KEY) || 'dark'; }
  function saveTheme(t) { localStorage.setItem(STORAGE_KEY, t); }
  function applyTheme(theme) {
    document.documentElement.classList.toggle('nh-light', theme === 'light');
    body.classList.toggle('nh-light', theme === 'light');
    
    // Update both main and login theme toggler SVGs dynamically
    const btn = document.getElementById('nh-theme-toggle');
    if (btn) btn.innerHTML = theme === 'light' ? LUCIDE_ICONS.moon : LUCIDE_ICONS.sun;
    const loginBtn = document.getElementById('nl-theme-toggle');
    if (loginBtn) loginBtn.innerHTML = theme === 'light' ? LUCIDE_ICONS.moon : LUCIDE_ICONS.sun;
  }
  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    saveTheme(next); applyTheme(next);
  }

  // ── Scrape ─────────────────────────────────────────────
  function scrapeHeader() {
    let logoSrc = '';
    const logoSelectors = [
      '#logo',
      'img#logo',
      'img.logo',
      '.navbar-brand img',
      'img[src*="logo"]',
      'img[class*="logo"]',
      'header img',
      '#adaptable-page-header-wrapper img',
      '#page-header img',
      'img[src*="pluginfile"][src*="logo"]'
    ];
    for (const sel of logoSelectors) {
      try {
        const el = $(sel);
        if (el?.src) {
          logoSrc = el.src;
          break;
        }
      } catch (e) {}
    }
    return {
      logoSrc,
      loginURL:     $('a.btn-login')?.href ?? '/login/index.php',
      searchAction: $('form.searchform-navbar')?.action ?? '/course/search.php',
    };
  }

  function scrapeUser() {
    // Try to get username and avatar from Moodle's user menu
    const nameEl = $(
      '.usermenu .usertext, .navbar .usertext, [data-region="user-menu"] .usertext, ' +
      '.userlogininfo a[href*="profile"], .logininfo a'
    );
    const avatarImg = $(
      '.navbar .usermenu img.userpicture, ' +
      '#usernavigation img.userpicture, ' +
      '.usermenu img.userpicture, ' +
      '[data-region="user-menu"] img.userpicture, ' +
      '#user-menu-toggle img, ' +
      '.userlogininfo a img.userpicture, ' +
      '.logininfo a img.userpicture'
    );
    const logoutLink = $('a[href*="logout"]');
    const profileLink = $('a[href*="/user/profile"]') || $('a[href*="profile.php"]');
    const myCoursesLink = $('a[href*="my/courses"]') || $('a[href*="/my/"]');

    // Fallback: look in nav tree
    let name = nameEl?.textContent?.trim() ?? '';
    if (!name) {
      const li = $('li.nav-item .usermenu');
      name = li?.textContent?.trim()?.split('\n')?.[0]?.trim() ?? 'Mi perfil';
    }
    // Clean up: remove extra whitespace
    name = name.replace(/\s+/g, ' ').trim().split(' ').slice(0, 2).join(' ');

    // Initials fallback
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '';

    let avatarSrc = avatarImg?.src ?? '';
    const isDefaultAvatar = avatarSrc && (
      avatarSrc.includes('/u/f') || 
      avatarSrc.includes('u%2Ff') || 
      avatarSrc.includes('f1.png') || 
      avatarSrc.includes('f2.png') || 
      avatarSrc.includes('default') ||
      avatarSrc.includes('gravatar')
    );
    if (isDefaultAvatar) {
      avatarSrc = '';
    }

    return {
      name:          name || 'Mi perfil',
      avatarSrc,
      initials,
      logoutURL:     logoutLink?.href  ?? '/login/logout.php',
      profileURL:    profileLink?.href ?? '/user/profile.php',
      myCoursesURL:  myCoursesLink?.href ?? '/my/courses.php',
    };
  }

  function scrapeLogin() {
    const form = $('#login') || $('form[action*="/login/"]') || $('form[action*="login"]');
    const errorEl = $('.loginerrors, #loginerrormessage, .alert-danger, [role="alert"]');
    
    let logoSrc = '';
    const logoSelectors = [
      '#logo',
      'img#logo',
      'img.logo',
      '.navbar-brand img',
      'img[src*="logo"]',
      'img[class*="logo"]',
      'header img',
      '#adaptable-page-header-wrapper img',
      '#page-header img',
      'img[src*="pluginfile"][src*="logo"]',
      '.logincontainer img'
    ];
    for (const sel of logoSelectors) {
      try {
        const el = $(sel);
        if (el?.src) {
          logoSrc = el.src;
          break;
        }
      } catch (e) {}
    }

    return {
      action:    form?.action ?? '/login/index.php',
      token:     form?.querySelector('[name="logintoken"]')?.value ?? '',
      forgotURL: $('a[href*="forgot_password"]')?.href ?? '/login/forgot_password.php',
      signupURL: $('a[href*="signup"]')?.href         ?? '/login/signup.php',
      error:     errorEl ? errorEl.textContent.trim() : '',
      logoSrc:   logoSrc,
    };
  }

  function buildLoginPage({ action, token, forgotURL, signupURL, error, logoSrc }) {
    // Make sure premium fonts are loaded
    if (!document.getElementById('nh-premium-fonts')) {
      const link = document.createElement('link');
      link.id = 'nh-premium-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap';
      document.head.appendChild(link);
    }

    const page = document.createElement('div');
    page.id = 'nhood-login-page';

    page.innerHTML = `
      <div class="nl-brand-col">
        <div class="nl-mesh"></div>
        <div class="nl-grid-overlay"></div>
        <div class="nl-brand-content">
          <div class="nl-logo-area">
            ${logoSrc 
              ? `<img src="${logoSrc}" class="nl-logo-img" alt="UTN Logo">`
              : `<span class="nl-logo-emoji">${LUCIDE_ICONS.graduationCap}</span>`
            }
            <span class="nl-university">UTN · FRCon</span>
          </div>
          
          <div class="nl-gear-container">
            <svg viewBox="0 0 120 120" class="nl-utn-svg-gear" aria-hidden="true">
              <defs>
                <path id="tooth" d="M -6 -48 L 6 -48 L 8 -36 L -8 -36 Z" fill="currentColor" />
              </defs>
              <g transform="translate(60, 60)" class="nl-gear-body">
                <use href="#tooth" transform="rotate(0)" />
                <use href="#tooth" transform="rotate(25.7)" />
                <use href="#tooth" transform="rotate(51.4)" />
                <use href="#tooth" transform="rotate(77.1)" />
                <use href="#tooth" transform="rotate(102.8)" />
                <use href="#tooth" transform="rotate(128.5)" />
                <use href="#tooth" transform="rotate(154.2)" />
                <use href="#tooth" transform="rotate(180)" />
                <use href="#tooth" transform="rotate(205.7)" />
                <use href="#tooth" transform="rotate(231.4)" />
                <use href="#tooth" transform="rotate(257.1)" />
                <use href="#tooth" transform="rotate(282.8)" />
                <use href="#tooth" transform="rotate(308.5)" />
                <use href="#tooth" transform="rotate(334.2)" />
                <circle cx="0" cy="0" r="40" stroke="currentColor" stroke-width="8" fill="none" />
                <line x1="0" y1="-40" x2="0" y2="40" stroke="currentColor" stroke-width="8" />
                <line x1="-40" y1="0" x2="40" y2="0" stroke="currentColor" stroke-width="8" />
                <circle cx="0" cy="0" r="26" fill="none" stroke="currentColor" stroke-width="6" class="nl-gear-hub-circle" />
              </g>
              <text x="60" y="68" font-family="'Outfit', sans-serif" font-weight="900" font-size="22" fill="currentColor" text-anchor="middle" letter-spacing="-0.5">UTN</text>
            </svg>
          </div>
          
          <div class="nl-hero-text">
            <span class="nl-eyebrow">FACULTAD REGIONAL CONCORDIA</span>
            <h1>Campus<br>Virtual</h1>
            <p>Accedé a tus cátedras virtuales, calificaciones, material de estudio y foros de interacción académica en un entorno diseñado para potenciar tu aprendizaje.</p>
          </div>
          <div class="nl-brand-footer">
            <span class="nl-secure-indicator">
              ${LUCIDE_ICONS.shieldCheck}
              Conexión SSL encriptada
            </span>
            <span class="nl-domain-info">frcon.cvg.utn.edu.ar</span>
          </div>
        </div>
      </div>
      <div class="nl-form-col">
        <button id="nl-theme-toggle" class="nl-theme-btn" title="Cambiar tema">
          ${getTheme() === 'light' ? LUCIDE_ICONS.moon : LUCIDE_ICONS.sun}
        </button>
        <div class="nl-form-container">
          <div class="nl-form-card">
            <div class="nl-card-header">
              <div class="nl-badge-status">
                <span class="nl-pulse-dot"></span>
                Portal de Acceso
              </div>
              <h2>Identificación</h2>
              <p>Ingresá tus credenciales institucionales para acceder a la plataforma.</p>
            </div>
            
            ${error ? `
              <div class="nl-error-box">
                <span class="nl-error-icon">${LUCIDE_ICONS.alertTriangle}</span>
                <span class="nl-error-text">${error}</span>
              </div>
            ` : ''}
            
            <form method="post" action="${action}" id="nl-custom-form">
              <div class="nl-field-group">
                <label for="nl-input-user">Nombre de usuario</label>
                <div class="nl-input-wrapper">
                  <span class="nl-input-icon">${LUCIDE_ICONS.user}</span>
                  <input id="nl-input-user" type="text" name="username" placeholder="Usuario" required autocomplete="username">
                </div>
              </div>
              
              <div class="nl-field-group">
                <div class="nl-label-row">
                  <label for="nl-input-pass">Contraseña</label>
                  <a href="${forgotURL}" class="nl-forgot-inline">¿La olvidaste?</a>
                </div>
                <div class="nl-input-wrapper">
                  <span class="nl-input-icon">${LUCIDE_ICONS.lock}</span>
                  <input id="nl-input-pass" type="password" name="password" placeholder="••••••••" required autocomplete="current-password">
                </div>
              </div>
              
              <div class="nl-options-row">
                <label class="nl-checkbox-label">
                  <input type="checkbox" name="rememberusername" value="1" checked>
                  <span class="nl-checkbox-custom"></span>
                  Recordar mi usuario
                </label>
              </div>

              <input type="hidden" name="logintoken" value="${token}">
              
              <button type="submit" class="nl-submit-btn">
                <span>Ingresar al Sistema</span>
                <span class="nl-btn-arrow">${LUCIDE_ICONS.arrowRight}</span>
              </button>
            </form>
            
            <div class="nl-card-footer">
              <span>¿No tenés una cuenta?</span>
              <a href="${signupURL}" class="nl-signup-link">Registrate aquí</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind theme toggler
    const toggleBtn = page.querySelector('#nl-theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    return page;
  }


  function scrapeCategories() {
    return $$('.course_category_tree .category[data-depth="1"]').map(cat => {
      const link  = $('h3 a, h4 a', cat);
      const count = $('.numberofcourse', cat);
      const subs  = $$('.subcategories .category[data-depth="2"]', cat).map(sub => {
        const sl = $('h4 a, h3 a', sub);
        const sc = $('.numberofcourse', sub);
        return {
          title: sl?.textContent?.trim() ?? '',
          href:  sl?.href ?? '#',
          count: sc?.textContent?.replace(/[()\\s]/g,'').trim() ?? '',
        };
      });
      return {
        title: link?.textContent?.trim() ?? '',
        href:  link?.href ?? '#',
        count: count?.textContent?.replace(/[()\\s]/g,'').trim() ?? '',
        subs,
      };
    });
  }

  function getStats(cats) {
    return {
      courses: cats.reduce((a,c) => a + (parseInt(c.count)||0), 0),
      careers: cats.length,
      online:  $('.block_online_users .info')?.textContent?.match(/\d+/)?.[0] ?? '—',
    };
  }

  // ── Build Header ───────────────────────────────────────
  function buildHeader({ logoSrc, loginURL, searchAction }, user) {
    const header = document.createElement('div');
    header.id = 'nhood-header';

    const logoHTML = logoSrc
      ? `<img src="${logoSrc}" alt="UTN">`
      : `<span style="font-size:20px; display:inline-flex; align-items:center;">${LUCIDE_ICONS.graduationCap}</span>`;

    const avatarHTML = user && user.avatarSrc
      ? `<div class="nh-avatar"><img src="${user.avatarSrc}" alt="${user.name}"></div>`
      : `<div class="nh-avatar">${user?.initials ?? '?'}</div>`;

    const isMyCoursesPage = window.location.pathname.includes('/my/') || window.location.pathname.includes('courses.php');
    const rightHTML = isLoggedIn && user
      ? `
        <a class="nh-nav-link${isMyCoursesPage ? ' active' : ''}" href="${user.myCoursesURL}">Mis cursos</a>
        <a class="nh-user-pill" href="${user.profileURL}" title="Ver perfil">
          ${avatarHTML}
          <span class="nh-username">${user.name}</span>
        </a>
        <a class="nh-nav-link" href="${user.logoutURL}" title="Cerrar sesión"
           style="color:var(--muted); display:inline-flex; align-items:center; gap:4px;">Salir ${LUCIDE_ICONS.logOut}</a>
      `
      : `<a class="nh-login-btn" href="${loginURL}">Entrar</a>`;

    header.innerHTML = `
      <div class="nh-inner">
        <a class="nh-logo" href="/">${logoHTML}</a>
        <div class="nh-divider"></div>
        <span class="nh-site-name">Campus Virtual · FRCon</span>
        <div class="nh-spacer"></div>
        <div class="nh-search">
          <span class="nh-search-icon">${LUCIDE_ICONS.search}</span>
          <form action="${searchAction}" method="get">
            <input type="text" name="q" placeholder="Buscar cursos…" autocomplete="off">
          </form>
        </div>
        <button id="nh-theme-toggle" title="Cambiar tema">
          ${getTheme() === 'light' ? LUCIDE_ICONS.moon : LUCIDE_ICONS.sun}
        </button>
        ${rightHTML}
      </div>
    `;

    header.querySelector('#nh-theme-toggle').addEventListener('click', toggleTheme);
    return header;
  }

  // ── Inject Native Controls ─────────────────────────────
  function injectNativeControls(headerEl) {
    const inner = headerEl.querySelector('.nh-inner');
    if (!inner) return;

    const themeToggle = headerEl.querySelector('#nh-theme-toggle');
    if (!themeToggle) return;

    const container = document.createElement('div');
    container.className = 'nh-native-controls';

    // 1. Edit mode toggle
    const editToggle = $('.editmode-toggle-form, [data-region="editmode-toggle"], .custom-control.custom-switch:has(input[name="seteditmode"])');
    if (editToggle) {
      container.appendChild(editToggle);
    }

    // 2. Notifications Popover
    const notif = $('[data-region="popover-region-notification"], .popover-region-notifications');
    if (notif) {
      container.appendChild(notif);
    }

    // 3. Messages Popover
    const msg = $('[data-region="popover-region-messages"], .popover-region-messages');
    if (msg) {
      container.appendChild(msg);
    }

    if (container.children.length > 0) {
      inner.insertBefore(container, themeToggle);
    }
  }

  // ── Build Hero (no logueado) ───────────────────────────
  function buildHero({ action, token, forgotURL, signupURL }, stats) {
    const hero = document.createElement('div');
    hero.id = 'nhood-hero';
    hero.innerHTML = `
      <div class="hero-inner">
        <div class="hero-text">
          <div class="hero-eyebrow">
            <span class="ey-dot"></span>
            UTN · Facultad Regional Concordia
          </div>
          <h1>Campus Virtual</h1>
          <p class="hero-sub">
            Accedé a tus materias, aulas virtuales y recursos académicos
            de la Universidad Tecnológica Nacional.
          </p>
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="s-num">${stats.courses}</span>
              <span class="s-lbl">Cursos</span>
            </div>
            <div class="hero-stat">
              <span class="s-num">${stats.careers}</span>
              <span class="s-lbl">Carreras</span>
            </div>
            <div class="hero-stat">
              <span class="s-num">${stats.online}</span>
              <span class="s-lbl">En línea</span>
            </div>
          </div>
        </div>
        <div class="hero-login">
          <h2>Iniciar sesión</h2>
          <form method="post" action="${action}">
            <div class="hl-field">
              <label for="nh-user">Usuario</label>
              <input id="nh-user" type="text" name="username"
                     placeholder="Nombre de usuario" autocomplete="username">
            </div>
            <div class="hl-field">
              <label for="nh-pass">Contraseña</label>
              <input id="nh-pass" type="password" name="password"
                     placeholder="Contraseña" autocomplete="current-password">
            </div>
            <input type="hidden" name="logintoken" value="${token}">
            <button type="submit" class="hl-submit">Acceder</button>
            <div class="hl-links">
              <a href="${forgotURL}">¿Olvidaste tu contraseña?</a>
              <a href="${signupURL}">Crear cuenta</a>
            </div>
          </form>
        </div>
      </div>
    `;
    return hero;
  }

  // ── Build Welcome (logueado, front page) ───────────────
  function buildWelcome(user, stats) {
    const welcome = document.createElement('div');
    welcome.id = 'nhood-welcome';
    welcome.innerHTML = `
      <div class="nw-inner">
        <div class="nw-greeting">
          <h1>Hola, ${user.name.split(' ')[0]}</h1>
          <p>${stats.courses} cursos disponibles · ${stats.online} usuarios en línea ahora</p>
        </div>
        <div class="nw-actions">
          <a class="nw-btn nw-btn-primary" href="${user.myCoursesURL}">
            ${LUCIDE_ICONS.bookOpen} Mis cursos
          </a>
          <a class="nw-btn nw-btn-secondary" href="/my/">
            ${LUCIDE_ICONS.home} Dashboard
          </a>
          <a class="nw-btn nw-btn-secondary" href="${user.profileURL}">
            ${LUCIDE_ICONS.user} Mi perfil
          </a>
        </div>
      </div>
    `;
    return welcome;
  }

  // ── Build Categories ───────────────────────────────────
  function buildCategories(cats) {
    const outer = document.createElement('div');
    outer.id = 'nhood-categories-wrap';
    const wrap = document.createElement('div');
    wrap.id = 'nhood-categories';

    const hdr = document.createElement('div');
    hdr.className = 'nc-header';
    hdr.innerHTML = `<h2>Carreras y categorías</h2><span class="nc-count">${cats.length} categorías</span>`;
    wrap.appendChild(hdr);

    const grid = document.createElement('div');
    grid.className = 'nc-grid';

    cats.forEach((cat, i) => {
      if (!cat.title) return;
      const n = parseInt(cat.count) || 0;
      const courseLabel = n === 1 ? '1 curso' : n > 0 ? `${n} cursos` : 'Ver cursos';

      const card = document.createElement('div');
      card.className = 'nc-card';
      card.style.animationDelay = `${Math.min(i * 0.04, 0.5)}s`;
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', () => { location.href = cat.href; });
      card.addEventListener('keydown', e => { if (e.key === 'Enter') location.href = cat.href; });

      const subsHTML = cat.subs.map(s => {
        const sn = parseInt(s.count) || 0;
        const sl = sn === 1 ? '1 curso' : sn > 0 ? `${sn} cursos` : '';
        return `<div class="nc-sub" role="link" tabindex="0" data-href="${s.href}">
          <span>${s.title}</span>
          <span class="nc-sub-count">${sl}</span>
        </div>`;
      }).join('');

      card.innerHTML = `
        <span class="nc-icon">${getIcon(cat.title)}</span>
        <span class="nc-title">${cat.title.trim()}</span>
        ${subsHTML}
        <div class="nc-meta">
          <span class="nc-badge">${courseLabel}</span>
          <span class="nc-arrow">→</span>
        </div>
      `;

      card.querySelectorAll('.nc-sub').forEach(sub => {
        sub.addEventListener('click', e => { e.stopPropagation(); location.href = sub.dataset.href; });
        sub.addEventListener('keydown', e => { if (e.key === 'Enter') { e.stopPropagation(); location.href = sub.dataset.href; }});
      });

      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    const more = document.createElement('div');
    more.id = 'nhood-more-btn';
    more.innerHTML = `<a href="/course/index.php?browse=categories">Ver todas las categorías →</a>`;
    wrap.appendChild(more);
    outer.appendChild(wrap);
    return outer;
  }

  // ── Build Footer ───────────────────────────────────────
  function buildFooter(user) {
    const f = document.createElement('div');
    f.id = 'nhood-footer';
    const logoutLink = user
      ? `<a href="${user.logoutURL}">Cerrar sesión</a>`
      : `<a href="/login/signup.php">Registrarse</a>`;
    f.innerHTML = `
      <div class="nf-inner">
        <span class="nf-logo">UTN · Facultad Regional Concordia</span>
        <div class="nf-links">
          <a href="/login/index.php">Iniciar sesión</a>
          ${logoutLink}
          <a href="/course/index.php">Todos los cursos</a>
          <a href="/login/forgot_password.php">Ayuda</a>
        </div>
        <span class="nf-copy">frcon.cvg.utn.edu.ar</span>
      </div>
    `;
    return f;
  }

  // ── Redesign Course View (Sidebar directory menu) ──────
  function redesignCourseView() {
    if (document.getElementById('nhood-course-layout')) return;

    const courseContent = $('.course-content');
    if (!courseContent) return;

    const sections = $$(
      '.course-content ul.topics li.section, ' +
      '.course-content ul.weeks li.section, ' +
      '.course-content li.section, ' +
      '.course-content .section'
    );
    if (sections.length === 0) return;

    const directoryTree = [];
    sections.forEach((sectionEl, idx) => {
      const id = sectionEl.id || `section-${idx}`;
      
      const titleEl = $(
        '.sectionname, h3.section-title, .section-title, h3',
        sectionEl
      );
      let title = titleEl?.textContent?.trim() || `Sección ${idx}`;
      title = title.replace(/\s*Editar\s*$/, '').trim();
      if (!title) title = `Tema ${idx}`;

      const items = [];
      const activities = $$('.activity', sectionEl);
      activities.forEach((actEl) => {
        const link = $('a', actEl);
        if (!link) return;
        
        const nameEl = $('.instancename, span.activityname, a', actEl);
        let name = nameEl?.textContent?.trim() || link.textContent?.trim() || 'Recurso';
        
        // Clean up native Moodle suffixes and extra whitespace
        name = name.replace(/\s*(Archivo|Foro|Tarea|Cuestionario|Página|URL|Carpeta|Feedback)\s*$/, '').trim();

        let type = 'resource';
        const classes = [...actEl.classList];
        const typeClass = classes.find(c => c.startsWith('modtype_'));
        if (typeClass) {
          type = typeClass.replace('modtype_', '');
        }

        items.push({
          name,
          href: link.href,
          type,
          id: actEl.id || '',
        });
      });

      directoryTree.push({
        id,
        title,
        items,
      });
    });

    const sidebar = document.createElement('div');
    sidebar.id = 'nhood-course-sidebar';

    let treeHTML = '';
    directoryTree.forEach((sec) => {
      let itemsHTML = '';
      sec.items.forEach(item => {
        let icon = LUCIDE_ICONS.folder;
        if (item.type === 'forum') icon = LUCIDE_ICONS.globe;
        else if (item.type === 'assign') icon = LUCIDE_ICONS.clipboard;
        else if (item.type === 'quiz') icon = LUCIDE_ICONS.shieldCheck;
        else if (item.type === 'resource') icon = LUCIDE_ICONS.bookOpen;
        else if (item.type === 'page' || item.type === 'url') icon = LUCIDE_ICONS.link;
        else if (item.type === 'feedback') icon = LUCIDE_ICONS.barChart2;

        itemsHTML += `
          <div class="nh-sidebar-item" data-item-id="${item.id}" data-href="${item.href}">
            <span class="nh-sidebar-item-icon">${icon}</span>
            <span class="nh-sidebar-item-name" title="${item.name}">${item.name}</span>
          </div>
        `;
      });

      treeHTML += `
        <div class="nh-sidebar-sec-group" data-sec-id="${sec.id}">
          <div class="nh-sidebar-sec-header">
            <span class="nh-sidebar-sec-arrow">${LUCIDE_ICONS.chevronRight}</span>
            <span class="nh-sidebar-sec-title" title="${sec.title}">${sec.title}</span>
          </div>
          <div class="nh-sidebar-sec-items" style="display: block;">
            ${itemsHTML || '<div class="nh-sidebar-item-empty">Sin actividades</div>'}
          </div>
        </div>
      `;
    });

    sidebar.innerHTML = `
      <div class="nh-sidebar-inner">
        <div class="nh-sidebar-title">Índice del Curso</div>
        <div class="nh-sidebar-tree">
          ${treeHTML}
        </div>
      </div>
    `;

    // Wrapping layout
    const mainRegion = $('#region-main') || $('.course-content');
    if (!mainRegion) return;

    // Extract full course name
    let courseTitle = '';
    const h1El = $('.page-header-headings h1, .page-header h1, #page-header h1, h1');
    if (h1El) courseTitle = h1El.textContent.trim();
    if (!courseTitle || courseTitle.toLowerCase() === 'utn') {
      let rawTitle = document.title;
      if (rawTitle.includes(':')) rawTitle = rawTitle.split(':').pop();
      if (rawTitle.includes('-')) rawTitle = rawTitle.split('-')[0];
      courseTitle = rawTitle.trim();
    }
    courseTitle = courseTitle.replace(/\s+/g, ' ').replace(/\s*Editar\s*$/, '').trim();

    // Create course header
    const courseHeader = document.createElement('div');
    courseHeader.className = 'nh-course-header-block';
    courseHeader.innerHTML = `
      <div class="nh-course-badge-row">
        <span class="nh-course-badge">Materia</span>
      </div>
      <h1 class="nh-course-title-text">${courseTitle}</h1>
    `;

    const layoutWrapper = document.createElement('div');
    layoutWrapper.id = 'nhood-course-layout';
    
    mainRegion.parentNode.insertBefore(layoutWrapper, mainRegion);
    
    const contentContainer = document.createElement('div');
    contentContainer.id = 'nhood-course-content-container';
    
    contentContainer.appendChild(mainRegion);
    contentContainer.insertBefore(courseHeader, mainRegion);
    
    layoutWrapper.appendChild(sidebar);
    layoutWrapper.appendChild(contentContainer);

    // Event listeners
    $$('.nh-sidebar-sec-header', sidebar).forEach(headerBtn => {
      headerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const group = headerBtn.closest('.nh-sidebar-sec-group');
        const itemsDiv = $('.nh-sidebar-sec-items', group);
        const secId = group.getAttribute('data-sec-id');
        const targetSection = document.getElementById(secId);

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const isCollapsed = itemsDiv.style.display === 'none';
        itemsDiv.style.display = isCollapsed ? 'block' : 'none';
        group.classList.toggle('collapsed', !isCollapsed);
      });
    });

    $$('.nh-sidebar-item', sidebar).forEach(itemBtn => {
      itemBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = itemBtn.getAttribute('data-href');
        const itemId = itemBtn.getAttribute('data-item-id');
        
        $$('.nh-sidebar-item', sidebar).forEach(el => el.classList.remove('active'));
        itemBtn.classList.add('active');

        const targetAct = document.getElementById(itemId);
        if (targetAct) {
          targetAct.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetAct.classList.add('nh-highlight-pulse');
          setTimeout(() => targetAct.classList.remove('nh-highlight-pulse'), 2000);
        } else if (href) {
          window.location.href = href;
        }
      });
    });

    // Scroll Spy highlight
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const secId = entry.target.id;
          const sidebarGroup = $(`.nh-sidebar-sec-group[data-sec-id="${secId}"]`, sidebar);
          if (sidebarGroup) {
            $$('.nh-sidebar-sec-group', sidebar).forEach(g => g.classList.remove('active'));
            sidebarGroup.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(sec => {
      if (sec.id) observer.observe(sec);
    });
  }

  // ── Kill Moodle remnants ───────────────────────────────
  function killRemnants() {
    // Footer
    $$('footer, #page-footer, [id*="footer"], .page-footer').forEach(el => {
      if (el.id !== 'nhood-footer')
        el.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important';
    });
    // Backgrounds
    ['#page-wrapper','#page','#page-content','#region-main-box'].forEach(s => {
      const el = $(s);
      if (el) el.style.background = 'transparent';
    });
    // On login or front page, ensure all native drawers/wrappers are completely hidden
    if (isLoginPage || isFrontPage) {
      $$('#page-wrapper, .logincontainer, #page-header, #page-footer, #page, .navbar, #adaptable-page-header-wrapper, .drawers, .drawer-toggles, .drawer, #nav-drawer').forEach(el => {
        if (el && el.id !== 'nhood-login-page' && !el.id.startsWith('nhood-')) {
          el.style.cssText = 'display:none!important;height:0!important;min-height:0!important;max-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;margin:0!important;padding:0!important';
        }
      });
    }
  }

  // ── Main ───────────────────────────────────────────────
  function main() {
    // Remove any previously injected elements to avoid duplicates during dynamic re-renders
    const oldHeader = document.getElementById('nhood-header');
    if (oldHeader) oldHeader.remove();
    const oldHero = document.getElementById('nhood-hero');
    if (oldHero) oldHero.remove();
    const oldWelcome = document.getElementById('nhood-welcome');
    if (oldWelcome) oldWelcome.remove();
    const oldCats = document.getElementById('nhood-categories-wrap');
    if (oldCats) oldCats.remove();
    const oldFooter = document.getElementById('nhood-footer');
    if (oldFooter) oldFooter.remove();
    const oldLogin = document.getElementById('nhood-login-page');
    if (oldLogin) oldLogin.remove();

    if (isLoginPage) {
      const loginData = scrapeLogin();
      const loginPage = buildLoginPage(loginData);
      body.appendChild(loginPage);
      applyTheme(getTheme());
      killRemnants();
      return;
    }

    const headerData = scrapeHeader();
    const user       = isLoggedIn ? scrapeUser() : null;

    applyTheme(getTheme());

    const header = buildHeader(headerData, user);
    body.insertBefore(header, body.firstChild);
    injectNativeControls(header);

    if (isFrontPage) {
      // Front page: full rebuild
      const cats   = scrapeCategories();
      const stats  = getStats(cats);
      const login  = scrapeLogin();

      const topBlock = isLoggedIn
        ? buildWelcome(user, stats)
        : buildHero(login, stats);

      const catsEl = buildCategories(cats);
      const footer = buildFooter(user);

      body.appendChild(topBlock);
      body.appendChild(catsEl);
      body.appendChild(footer);
    } else {
      // Inner pages: just footer, Moodle content stays
      body.appendChild(buildFooter(user));

      if (body.classList.contains('pagelayout-course') || window.location.pathname.includes('/course/view.php')) {
        body.classList.add('pagelayout-course');
        redesignCourseView();
      }
    }

    applyTheme(getTheme());
    killRemnants();
    setTimeout(killRemnants, 1500);
    setTimeout(killRemnants, 3500);

    console.log(
      `%c UTN Redesign v4 %c ${isFrontPage ? 'frontpage' : 'inner'} · ${isLoggedIn ? 'logged in' : 'guest'} `,
      'background:#1c1d22;color:#6b7cff;font-weight:700',
      'background:#1c1d22;color:#5e5f6b;font-weight:400'
    );
  }

  // ── Wait for Moodle ────────────────────────────────────
  function waitAndRun() {
    applyTheme(getTheme());

    if (!isFrontPage) { main(); return; } // Inner pages don't need categories

    if ($$('.course_category_tree .category').length > 0) { main(); return; }

    let ran = false;
    const obs = new MutationObserver(() => {
      if (ran) return;
      if ($$('.course_category_tree .category').length > 0) {
        ran = true; obs.disconnect(); setTimeout(main, 80);
      }
    });
    obs.observe(body, { childList: true, subtree: true });
    setTimeout(() => { if (!ran) { ran = true; obs.disconnect(); main(); } }, 4000);
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', waitAndRun);
  else
    waitAndRun();

})();
