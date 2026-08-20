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
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><polyline points="9 18 15 12 9 6"/></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><polyline points="6 9 12 15 18 9"/></svg>`,
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    bell: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    files: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-files"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M15 2v5h5"/></svg>`,
    layoutGrid: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
    cornerDownLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-down-left"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>`
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

  // ── Fuentes ────────────────────────────────────────────
  // Se cargan sin bloquear la primera pintura: la hoja entra con
  // media="print" (el navegador no la considera crítica) y recién al
  // terminar de descargar pasa a media="all". Sin handlers inline, así
  // que no choca con la CSP del campus.
  function loadFonts() {
    if (document.getElementById('nh-fonts')) return;
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = 'https://fonts.gstatic.com';
    pre.crossOrigin = 'anonymous';
    document.head.appendChild(pre);

    const link = document.createElement('link');
    link.id    = 'nh-fonts';
    link.rel   = 'stylesheet';
    link.media = 'print';
    link.href  = 'https://fonts.googleapis.com/css2'
               + '?family=Inter:wght@400;500;600;700'
               + '&family=Outfit:wght@600;700;800'
               + '&display=swap';
    link.addEventListener('load', () => { link.media = 'all'; });
    document.head.appendChild(link);
  }

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
      loginURL: $('a.btn-login')?.href ?? '/login/index.php',
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

  // ── Navegación: cosecha de TODOS los menús nativos ─────
  // Moodle/Adaptable reparte la navegación en cinco lugares distintos.
  // En vez de ocultarlos y perder los destinos, los leemos y los
  // reconstruimos en un único menú propio.

  const NAV_ICON_RULES = [
    [/^inicio|portada|sitio/i,                'home'],
    [/área personal|area personal|dashboard/i,'layoutGrid'],
    [/curso/i,                                'bookOpen'],
    [/calendario/i,                           'calendar'],
    [/mensaje/i,                              'messageSquare'],
    [/notificaci/i,                           'bell'],
    [/archivo/i,                              'files'],
    [/insignia|badge/i,                       'award'],
    [/calificaci|nota/i,                      'barChart2'],
    [/preferencia|ajuste|configurac/i,        'cog'],
    [/participante|perfil|usuario/i,          'user'],
    [/salir|cerrar sesión|logout/i,           'logOut'],
    [/buscar|search/i,                        'search'],
    [/administrac/i,                          'shield'],
    [/foro/i,                                 'globe'],
    [/tarea|entrega/i,                        'clipboard'],
  ];
  function navIconFor(label) {
    for (const [re, name] of NAV_ICON_RULES) if (re.test(label)) return LUCIDE_ICONS[name];
    return LUCIDE_ICONS.chevronRight;
  }

  // Rutas que Moodle siempre expone a un usuario logueado. Se agregan
  // como red de seguridad: si el drawer nativo no se pudo leer (carga
  // lenta, permisos, tema alternativo), estos destinos siguen alcanzables.
  const KNOWN_ROUTES = [
    ['Inicio del sitio',   '/',                                       'Campus'],
    ['Área personal',      '/my/',                                    'Campus'],
    ['Mis cursos',         '/my/courses.php',                         'Campus'],
    ['Todos los cursos',   '/course/index.php',                       'Campus'],
    ['Calendario',         '/calendar/view.php?view=month',           'Campus'],
    ['Mensajes',           '/message/index.php',                      'Campus'],
    ['Notificaciones',     '/message/output/popup/notifications.php', 'Campus'],
    ['Buscar cursos',      '/course/search.php',                      'Campus'],
    ['Mis calificaciones', '/grade/report/overview/index.php',        'Cuenta'],
    ['Archivos privados',  '/user/files.php',                         'Cuenta'],
    ['Mis insignias',      '/badges/mybadges.php',                    'Cuenta'],
    ['Preferencias',       '/user/preferences.php',                   'Cuenta'],
  ];

  // Destinos accesibles sin sesión iniciada.
  const PUBLIC_ROUTES = [
    ['Inicio del sitio',  '/',                        'Campus'],
    ['Todos los cursos',  '/course/index.php',        'Campus'],
    ['Buscar cursos',     '/course/search.php',       'Campus'],
    ['Iniciar sesión',    '/login/index.php',         'Cuenta'],
    ['Crear cuenta',      '/login/signup.php',        'Cuenta'],
    ['Recuperar contraseña', '/login/forgot_password.php', 'Cuenta'],
  ];

  // Enlace principal de la barra: sólo Mis cursos. El resto (Área
  // personal, Calendario, Mensajes) ya vive en el desplegable, y
  // Mensajes además duplica el icono nativo que queda más a la derecha.
  const NAV_PRIORITY = [/mis cursos/i];

  function currentCourseId() {
    const m = body.className.match(/\bcourse-(\d+)\b/);
    return m && m[1] !== '1' ? m[1] : null;
  }

  function scrapeNav(user) {
    const seen  = new Set();
    const items = [];

    function push(label, href, group) {
      if (!label || !href) return;
      label = label.replace(/\s+/g, ' ').trim();
      // Moodle repite el texto del enlace dentro de spans .sr-only; recortamos
      if (!label || label.length > 64) return;
      let url;
      try { url = new URL(href, location.origin); } catch (e) { return; }
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
      if (url.searchParams.has('lang')) return;   // conmutador de idioma, no es navegación
      const key = (url.pathname + url.search).toLowerCase() + '|' + label.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ label, href: url.href, group, icon: navIconFor(label), external: url.origin !== location.origin });
    }

    const harvest = (selector, group) => {
      $$(selector).forEach(a => {
        // Ignorar los toggles que sólo abren un panel (no llevan a ningún lado)
        if (a.getAttribute('href') === '#' || a.dataset.toggle === 'dropdown') return;
        push(a.textContent, a.href, group);
      });
    };

    // 1. Drawer primario de Moodle 4 (Inicio, Área personal, Mis cursos…)
    harvest('#theme_adaptable-drawers-primary a[href], .primary-navigation a[href], #nav-drawer a[href]', 'Campus');
    // 2. Menú institucional propio de la facultad (tema Adaptable)
    harvest('#header1 nav.navbar a[href], .btco-hover-menu a[href]', 'Institucional');
    // 3. Menú desplegable del usuario
    harvest('.usermenu .dropdown-menu a[href], #usernavigation .dropdown-menu a[href], [data-region="user-menu"] a[href]', 'Cuenta');
    // 4. Navegación secundaria / pestañas de la página actual
    harvest('.secondary-navigation a[href], nav.moremenu a[href], .nav-tabs a[href], .tabtree a[href]', 'Esta página');
    // 5. Bloques del drawer lateral (Navegación, Administración del curso…)
    harvest('#theme_adaptable-drawers-sidepost .block_navigation a[href], #theme_adaptable-drawers-sidepost .block_settings a[href]', 'Navegación');

    if (!isLoggedIn) {
      // Un visitante también tiene destinos: sin esto la paleta queda vacía.
      PUBLIC_ROUTES.forEach(([label, path, group]) => push(label, path, group));
    }

    if (isLoggedIn) {
      KNOWN_ROUTES.forEach(([label, path, group]) => push(label, path, group));
      if (user) {
        push('Mi perfil',     user.profileURL, 'Cuenta');
        push('Cerrar sesión', user.logoutURL,  'Cuenta');
      }
      const cid = currentCourseId();
      if (cid) {
        push('Participantes del curso',  `/user/index.php?id=${cid}`,             'Curso actual');
        push('Calificaciones del curso', `/grade/report/user/index.php?id=${cid}`, 'Curso actual');
        push('Página del curso',         `/course/view.php?id=${cid}`,             'Curso actual');
      }
    }

    // 6. Cursos visibles en la página actual — alimentan la paleta de comandos
    $$('a[href*="/course/view.php?id="]').forEach(a => {
      const label = a.textContent.replace(/\s+/g, ' ').trim();
      if (label && label.length > 2 && label.length < 64) push(label, a.href, 'Cursos');
    });

    return items;
  }

  function scrapeCrumbs() {
    const nav = $('#page-navbar .breadcrumb, .breadcrumb');
    if (!nav) return [];
    return $$('li', nav).map(li => {
      const a = $('a', li);
      return {
        label: (a || li).textContent.replace(/\s+/g, ' ').trim(),
        href:  a ? a.href : '',
      };
    }).filter(c => c.label);
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
    const page = document.createElement('div');
    page.id = 'nhood-login-page';

    page.innerHTML = `
      <div class="nl-brand-col">
        <div class="nl-brand-content">
          <div class="nl-logo-area">
            ${logoSrc
              ? `<img src="${esc(logoSrc)}" class="nl-logo-img" alt="Logo de UTN">`
              : `<span class="nl-logo-emoji">${LUCIDE_ICONS.graduationCap}</span>`
            }
            <span class="nl-university">UTN · FRCon</span>
          </div>

          <div class="nl-logo-hero">
            ${logoSrc
              ? `<img src="${esc(logoSrc)}" class="nl-logo-hero-img" alt="" aria-hidden="true">`
              : `<span class="nl-logo-hero-fallback" aria-hidden="true">${LUCIDE_ICONS.graduationCap}</span>`
            }
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
        <button type="button" id="nl-theme-toggle" class="nl-theme-btn" title="Cambiar tema" aria-label="Cambiar entre tema claro y oscuro">
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
                <span class="nl-error-text">${esc(error)}</span>
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
          count: sc?.textContent?.replace(/[()\s]/g,'').trim() ?? '',
        };
      });
      return {
        title: link?.textContent?.trim() ?? '',
        href:  link?.href ?? '#',
        count: count?.textContent?.replace(/[()\s]/g,'').trim() ?? '',
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

  // ── Menús desplegables accesibles ──────────────────────
  // Un único cableado para el menú "Más" y el menú de usuario:
  // teclado completo, cierre por Escape / click afuera, y sólo un
  // panel abierto a la vez.
  const openMenus = new Set();

  function closeMenu(menu, refocus) {
    const trigger = $('.nh-menu-trigger', menu);
    const panel   = $('.nh-menu-panel', menu);
    if (!trigger || !panel) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    openMenus.delete(menu);
    if (refocus) trigger.focus();
  }

  function closeAllMenus() { [...openMenus].forEach(m => closeMenu(m, false)); }

  function wireMenu(menu) {
    const trigger = $('.nh-menu-trigger', menu);
    const panel   = $('.nh-menu-panel', menu);
    if (!trigger || !panel) return;
    const itemsOf = () => $$('[role="menuitem"]', panel);

    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = panel.hidden;
      closeAllMenus();
      if (!willOpen) return;
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      openMenus.add(menu);
    });

    trigger.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (panel.hidden) trigger.click();
        itemsOf()[0]?.focus();
      }
    });

    panel.addEventListener('keydown', e => {
      const items = itemsOf();
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown')      { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
      else if (e.key === 'Home')      { e.preventDefault(); items[0]?.focus(); }
      else if (e.key === 'End')       { e.preventDefault(); items[items.length - 1]?.focus(); }
      else if (e.key === 'Escape')    { e.preventDefault(); closeMenu(menu, true); }
      else if (e.key === 'Tab')       { closeMenu(menu, false); }
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.nh-menu')) closeAllMenus();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && openMenus.size) closeMenu([...openMenus][0], true);
  });

  // ── Render de una lista de destinos agrupada ───────────
  function renderNavGroups(items, groupOrder) {
    const groups = new Map();
    items.forEach(it => {
      if (!groups.has(it.group)) groups.set(it.group, []);
      groups.get(it.group).push(it);
    });
    const order = groupOrder.filter(g => groups.has(g))
      .concat([...groups.keys()].filter(g => !groupOrder.includes(g)));

    return order.map(g => `
      <div class="nh-menu-group" role="group" aria-label="${esc(g)}">
        <div class="nh-menu-group-label">${esc(g)}</div>
        ${groups.get(g).map(it => `
          <a role="menuitem" class="nh-menu-item${isCurrent(it.href) ? ' current' : ''}"
             href="${esc(it.href)}"${it.external ? ' rel="noopener"' : ''}>
            <span class="nh-menu-item-icon" aria-hidden="true">${it.icon}</span>
            <span class="nh-menu-item-label">${esc(it.label)}</span>
          </a>
        `).join('')}
      </div>
    `).join('');
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function isCurrent(href) {
    try {
      const u = new URL(href, location.origin);
      return u.pathname === location.pathname && u.search === location.search;
    } catch (e) { return false; }
  }

  const GROUP_ORDER = ['Campus', 'Curso actual', 'Esta página', 'Cursos', 'Navegación', 'Institucional', 'Cuenta'];

  // ── Build Header ───────────────────────────────────────
  function buildHeader({ logoSrc, loginURL }, user, nav) {
    const header = document.createElement('header');
    header.id = 'nhood-header';
    header.setAttribute('role', 'banner');

    const logoHTML = logoSrc
      ? `<img src="${esc(logoSrc)}" alt="UTN Facultad Regional Concordia">`
      : `<span class="nh-logo-fallback" aria-hidden="true">${LUCIDE_ICONS.graduationCap}</span>`;

    const avatarHTML = user && user.avatarSrc
      ? `<span class="nh-avatar"><img src="${esc(user.avatarSrc)}" alt=""></span>`
      : `<span class="nh-avatar" aria-hidden="true">${esc(user?.initials ?? '?')}</span>`;

    // Enlaces principales: los de mayor prioridad que existan, sin repetir.
    // Todo lo demás vive en el desplegable de la hamburguesa, a la
    // izquierda — no en un menú "Más" suelto en la barra.
    const primary = [];
    NAV_PRIORITY.forEach(re => {
      const hit = nav.find(i => re.test(i.label) && !primary.includes(i) && i.group !== 'Cursos');
      if (hit) primary.push(hit);
    });

    const navHTML = isLoggedIn ? `
      <nav class="nh-nav" aria-label="Navegación principal">
        ${primary.map(i => `
          <a class="nh-nav-link${isCurrent(i.href) ? ' active' : ''}" href="${esc(i.href)}"
             ${isCurrent(i.href) ? 'aria-current="page"' : ''}>${esc(i.label)}</a>
        `).join('')}
      </nav>` : '';

    const accountItems = nav.filter(i => i.group === 'Cuenta');
    const rightHTML = isLoggedIn && user
      ? `
        <div class="nh-menu nh-user-menu">
          <button type="button" class="nh-user-pill nh-menu-trigger" aria-expanded="false" aria-haspopup="true">
            ${avatarHTML}
            <span class="nh-username">${esc(user.name)}</span>
            <span aria-hidden="true" class="nh-user-caret">${LUCIDE_ICONS.chevronDown}</span>
          </button>
          <div class="nh-menu-panel nh-menu-panel-right" role="menu" aria-label="Mi cuenta" hidden>
            <div class="nh-menu-identity">
              ${avatarHTML}
              <span class="nh-menu-identity-name">${esc(user.name)}</span>
            </div>
            ${renderNavGroups(accountItems.length ? accountItems : [
              { label: 'Mi perfil',     href: user.profileURL, group: 'Cuenta', icon: LUCIDE_ICONS.user },
              { label: 'Cerrar sesión', href: user.logoutURL,  group: 'Cuenta', icon: LUCIDE_ICONS.logOut },
            ], GROUP_ORDER)}
          </div>
        </div>`
      : `<a class="nh-login-btn" href="${esc(loginURL)}">Entrar</a>`;

    header.innerHTML = `
      <a class="nh-skip-link" href="#nhood-main">Saltar al contenido</a>
      <div class="nh-inner">
        ${isLoggedIn ? `
          <button type="button" class="nh-menu-btn" aria-label="Abrir menú del campus"
                  aria-expanded="false" aria-controls="nhood-sheet">
            ${LUCIDE_ICONS.menu}<span class="nh-menu-btn-label">Menú</span>
          </button>` : ''}
        <a class="nh-logo" href="/">${logoHTML}</a>
        <span class="nh-divider" aria-hidden="true"></span>
        <span class="nh-site-name">Campus Virtual · FRCon</span>
        ${navHTML}
        <span class="nh-spacer"></span>
        <button type="button" class="nh-cmdk" aria-label="Buscar en el campus (Ctrl+K)">
          <span aria-hidden="true">${LUCIDE_ICONS.search}</span>
          <span class="nh-cmdk-label">Buscar…</span>
          <kbd class="nh-kbd" aria-hidden="true">Ctrl K</kbd>
        </button>
        <button type="button" id="nh-theme-toggle" aria-label="Cambiar entre tema claro y oscuro">
          ${getTheme() === 'light' ? LUCIDE_ICONS.moon : LUCIDE_ICONS.sun}
        </button>
        ${rightHTML}
      </div>
    `;

    $('#nh-theme-toggle', header).addEventListener('click', toggleTheme);
    $$('.nh-menu', header).forEach(wireMenu);
    $('.nh-cmdk', header).addEventListener('click', () => openPalette(nav));

    const menuBtn = $('.nh-menu-btn', header);
    if (menuBtn) menuBtn.addEventListener('click', () => toggleSheet(menuBtn));

    return header;
  }

  // ── Desplegable del campus (hamburguesa, lado izquierdo) ──
  // Concentra TODOS los destinos cosechados más los bloques laterales de
  // Moodle, para que la barra superior quede corta y el índice del curso
  // sea lo único que ocupa la columna izquierda de la página.
  function buildSheet(nav, user, blocks) {
    const sheet = document.createElement('div');
    sheet.id = 'nhood-sheet';
    sheet.hidden = true;
    sheet.innerHTML = `
      <div class="nh-sheet-backdrop" data-close></div>
      <nav class="nh-sheet-panel" aria-label="Menú del campus">
        <div class="nh-sheet-head">
          <span class="nh-sheet-title">${user ? esc(user.name) : 'Campus Virtual'}</span>
          <button type="button" class="nh-sheet-close" aria-label="Cerrar menú" data-close>${LUCIDE_ICONS.x}</button>
        </div>
        <div class="nh-sheet-body">
          <div class="nh-sheet-nav" role="menu">
            ${renderNavGroups(nav.filter(i => i.group !== 'Cursos'), GROUP_ORDER)}
          </div>
          ${blocks && blocks.length ? `
            <div class="nh-sheet-blocks">
              <div class="nh-menu-group-label">Bloques</div>
            </div>` : ''}
        </div>
      </nav>
    `;

    // Los bloques se mueven, no se clonan: si se clonaran, los que traen
    // JavaScript propio (calendario, progreso) quedarían muertos.
    const slot = $('.nh-sheet-blocks', sheet);
    if (slot) blocks.forEach(b => slot.appendChild(b));

    $$('[data-close]', sheet).forEach(el => el.addEventListener('click', () => closeSheet()));
    sheet.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSheet();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = $$('a[href], button:not([disabled])', sheet);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    return sheet;
  }

  function toggleSheet(btn) {
    const sheet = document.getElementById('nhood-sheet');
    if (!sheet) return;
    // `hidden` no sirve como estado: durante los 220ms de la transición de
    // salida sigue en false, así que el botón quedaba muerto — el click
    // siguiente volvía a cerrar en vez de reabrir. Y la clase `open`
    // tampoco, porque la agrega un requestAnimationFrame que no corre si la
    // pestaña pasa a segundo plano. Un flag propio, puesto de forma
    // síncrona, es la única fuente de verdad.
    if (sheet.dataset.open !== '1') {
      window.clearTimeout(sheetCloseTimer);
      sheetCloseTimer = 0;
      sheet.dataset.open = '1';
      sheet.hidden = false;
      requestAnimationFrame(() => { if (sheet.dataset.open === '1') sheet.classList.add('open'); });
      btn.setAttribute('aria-expanded', 'true');
      $('.nh-sheet-close', sheet)?.focus();
    } else {
      closeSheet();
    }
  }

  function closeSheet() {
    const sheet = document.getElementById('nhood-sheet');
    if (!sheet || sheet.dataset.open !== '1') return;
    sheet.dataset.open = '0';
    sheet.classList.remove('open');
    const btn = $('.nh-menu-btn');
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    window.clearTimeout(sheetCloseTimer);
    sheetCloseTimer = window.setTimeout(() => {
      // Si el usuario reabrió durante la transición de salida, no lo ocultamos.
      if (sheet.dataset.open !== '1') sheet.hidden = true;
      sheetCloseTimer = 0;
    }, 220);
  }

  // ── Breadcrumbs propios ────────────────────────────────
  function buildCrumbs(crumbs) {
    if (crumbs.length < 2) return null;
    const el = document.createElement('nav');
    el.id = 'nhood-crumbs';
    el.setAttribute('aria-label', 'Ruta de navegación');
    el.innerHTML = `
      <ol class="nh-crumb-list">
        ${crumbs.map((c, i) => `
          <li class="nh-crumb">
            ${c.href && i < crumbs.length - 1
              ? `<a href="${esc(c.href)}">${esc(c.label)}</a>`
              : `<span aria-current="page">${esc(c.label)}</span>`}
          </li>
        `).join('')}
      </ol>
    `;
    return el;
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

    // 3. Mensajería. Según la versión, Moodle la expone como popover o
    //    como un botón que abre el drawer de mensajes: buscamos las dos.
    // Ojo con el id: el campus lo emite como `message-drawer-toggle-<hash>`,
    // así que un `#message-drawer-toggle` exacto nunca matchea.
    const MSG_TOGGLE = '[data-action="toggle-message-drawer"], [id^="message-drawer-toggle"]';
    const msg = $('[data-region="popover-region-messages"], .popover-region-messages')
             || $(MSG_TOGGLE)?.closest('.nav-item, .popover-region, li')
             || $(MSG_TOGGLE);
    if (msg) {
      container.appendChild(msg);
    }

    if (container.children.length > 0) {
      inner.insertBefore(container, themeToggle);
    }
  }

  // ── Paleta de comandos (Ctrl+K) ────────────────────────
  // Indexa TODOS los destinos cosechados más los cursos visibles, de modo
  // que cualquier rincón del campus queda a dos teclas de distancia.
  let paletteEl = null;
  let paletteReturnFocus = null;
  let paletteNav = [];
  let paletteShortcutWired = false;
  let sheetCloseTimer = 0;

  function normalize(s) {
    // Descarta acentos para que "matematica" encuentre "Matemática"
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function scoreItem(item, q) {
    const label = normalize(item.label);
    const idx = label.indexOf(q);
    if (idx === -1) {
      // Coincidencia por iniciales/subsecuencia: "mcu" → "Mis cursos"
      let i = 0;
      for (const ch of label) { if (ch === q[i]) i++; if (i === q.length) break; }
      return i === q.length ? 1 : 0;
    }
    if (idx === 0) return 100;
    if (/[\s·\-/]/.test(label[idx - 1])) return 60;
    return 30;
  }

  function paletteResults(nav, query) {
    const q = normalize(query.trim());
    if (!q) {
      // Vista inicial: lo más usado primero, pero nunca una lista vacía.
      const featured = nav.filter(i => i.group === 'Campus' || i.group === 'Curso actual');
      return (featured.length ? featured : nav).slice(0, 12);
    }
    return nav
      .map(i => ({ i, s: scoreItem(i, q) }))
      .filter(r => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map(r => r.i);
  }

  function openPalette(nav) {
    if (paletteEl) { $('.nh-pal-input', paletteEl).focus(); return; }
    paletteReturnFocus = document.activeElement;

    paletteEl = document.createElement('div');
    paletteEl.id = 'nhood-palette';
    paletteEl.innerHTML = `
      <div class="nh-pal-backdrop" data-close></div>
      <div class="nh-pal-box" role="dialog" aria-modal="true" aria-label="Buscar en el campus">
        <div class="nh-pal-inputrow">
          <span class="nh-pal-icon" aria-hidden="true">${LUCIDE_ICONS.search}</span>
          <input class="nh-pal-input" type="text" role="combobox" aria-expanded="true"
                 aria-controls="nh-pal-list" aria-autocomplete="list"
                 placeholder="Ir a una sección, curso o actividad…" autocomplete="off" spellcheck="false">
          <kbd class="nh-kbd" aria-hidden="true">Esc</kbd>
        </div>
        <div class="nh-pal-list" id="nh-pal-list" role="listbox" aria-label="Resultados"></div>
        <div class="nh-pal-foot">
          <span>${LUCIDE_ICONS.cornerDownLeft} para abrir</span>
          <span>↑ ↓ para navegar</span>
        </div>
      </div>
    `;
    document.body.appendChild(paletteEl);

    const input = $('.nh-pal-input', paletteEl);
    const list  = $('.nh-pal-list', paletteEl);
    let active = 0;
    let current = [];

    function render() {
      current = paletteResults(nav, input.value);
      const q = input.value.trim();
      if (!current.length && !q) { list.innerHTML = ''; return; }

      let html = '';
      let lastGroup = null;
      current.forEach((it, idx) => {
        if (it.group !== lastGroup) {
          html += `<div class="nh-pal-group">${esc(it.group)}</div>`;
          lastGroup = it.group;
        }
        html += `
          <a class="nh-pal-item${idx === active ? ' active' : ''}" role="option"
             id="nh-pal-opt-${idx}" aria-selected="${idx === active}"
             href="${esc(it.href)}" data-idx="${idx}">
            <span class="nh-pal-item-icon" aria-hidden="true">${it.icon}</span>
            <span class="nh-pal-item-label">${esc(it.label)}</span>
          </a>`;
      });
      if (q) {
        html += `
          <div class="nh-pal-group">Búsqueda</div>
          <a class="nh-pal-item nh-pal-fallback${active >= current.length ? ' active' : ''}" role="option"
             aria-selected="${active >= current.length}"
             href="/course/search.php?search=${encodeURIComponent(q)}">
            <span class="nh-pal-item-icon" aria-hidden="true">${LUCIDE_ICONS.search}</span>
            <span class="nh-pal-item-label">Buscar «${esc(q)}» en todos los cursos</span>
          </a>`;
      }
      if (!html) html = `<div class="nh-pal-empty">Sin resultados para «${esc(q)}»</div>`;
      list.innerHTML = html;
      input.setAttribute('aria-activedescendant', `nh-pal-opt-${active}`);
      $('.nh-pal-item.active', list)?.scrollIntoView({ block: 'nearest' });
    }

    function go() {
      const el = $('.nh-pal-item.active', list);
      if (el) location.href = el.href;
    }

    input.addEventListener('input', () => { active = 0; render(); });
    input.addEventListener('keydown', e => {
      const max = $$('.nh-pal-item', list).length - 1;
      if (e.key === 'ArrowDown')      { e.preventDefault(); active = Math.min(active + 1, max); render(); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); active = Math.max(active - 1, 0);   render(); }
      else if (e.key === 'Enter')     { e.preventDefault(); go(); }
      else if (e.key === 'Escape')    { e.preventDefault(); closePalette(); }
    });
    list.addEventListener('mousemove', e => {
      const item = e.target.closest('.nh-pal-item');
      if (!item) return;
      const idx = [...$$('.nh-pal-item', list)].indexOf(item);
      if (idx !== active) { active = idx; render(); }
    });
    $('.nh-pal-backdrop', paletteEl).addEventListener('click', closePalette);
    paletteEl.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = $$('input, a[href], button:not([disabled])', paletteEl);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    render();
    input.focus();
  }

  function closePalette() {
    if (!paletteEl) return;
    paletteEl.remove();
    paletteEl = null;
    paletteReturnFocus?.focus();
    paletteReturnFocus = null;
  }

  function wirePaletteShortcut(nav) {
    paletteNav = nav;
    if (paletteShortcutWired) return;
    paletteShortcutWired = true;
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        paletteEl ? closePalette() : openPalette(paletteNav);
      }
    });
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
          <form method="post" action="${esc(action)}">
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
            <input type="hidden" name="logintoken" value="${esc(token)}">
            <button type="submit" class="hl-submit">Acceder</button>
            <div class="hl-links">
              <a href="${esc(forgotURL)}">¿Olvidaste tu contraseña?</a>
              <a href="${esc(signupURL)}">Crear cuenta</a>
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
            <h1>Hola, ${esc(user.name.split(' ')[0])}</h1>
          <p>${stats.courses} cursos disponibles · ${stats.online} usuarios en línea ahora</p>
        </div>
        <div class="nw-actions">
          <a class="nw-btn nw-btn-primary" href="${esc(user.myCoursesURL)}">
            ${LUCIDE_ICONS.bookOpen} Mis cursos
          </a>
          <a class="nw-btn nw-btn-secondary" href="/my/">
            ${LUCIDE_ICONS.home} Dashboard
          </a>
          <a class="nw-btn nw-btn-secondary" href="${esc(user.profileURL)}">
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

    // Cada tarjeta usa anchors reales, no `div role="link"`: así funcionan
    // ctrl+click, click del medio, "copiar dirección" y la vista previa del
    // destino en la barra de estado. El enlace del título se estira sobre
    // toda la tarjeta y las subcategorías quedan por encima, de modo que no
    // hay elementos interactivos anidados.
    cats.forEach((cat, i) => {
      if (!cat.title) return;
      const n = parseInt(cat.count) || 0;
      const courseLabel = n === 1 ? '1 curso' : n > 0 ? `${n} cursos` : 'Ver cursos';

      const card = document.createElement('div');
      card.className = 'nc-card';
      card.style.animationDelay = `${Math.min(i * 0.04, 0.5)}s`;

      const subsHTML = cat.subs.filter(s => s.title).map(s => {
        const sn = parseInt(s.count) || 0;
        const sl = sn === 1 ? '1 curso' : sn > 0 ? `${sn} cursos` : '';
        return `<li><a class="nc-sub" href="${esc(s.href)}">
          <span class="nc-sub-name">${esc(s.title)}</span>
          <span class="nc-sub-count">${esc(sl)}</span>
        </a></li>`;
      }).join('');

      card.innerHTML = `
        <span class="nc-icon" aria-hidden="true">${getIcon(cat.title)}</span>
        <h3 class="nc-title">
          <a class="nc-title-link" href="${esc(cat.href)}">${esc(cat.title.trim())}</a>
        </h3>
        ${subsHTML ? `<ul class="nc-subs">${subsHTML}</ul>` : ''}
        <div class="nc-meta">
          <span class="nc-badge">${esc(courseLabel)}</span>
          <span class="nc-arrow" aria-hidden="true">→</span>
        </div>
      `;

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
      ? `<a href="${esc(user.logoutURL)}">Cerrar sesión</a>`
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

    // Sin `.course-content .section` a secas: ese selector también matchea
    // los <ul class="section"> internos de cada tema, con lo cual cada
    // sección entraba dos veces (la segunda sin .sectionname, cayendo al
    // fallback "Sección N") y cada actividad quedaba listada por duplicado.
    const sections = $$(
      '.course-content ul.topics li.section, ' +
      '.course-content ul.weeks li.section, ' +
      '.course-content li.section, ' +
      '.course-content section.section'
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

        // Anchor real: el índice sigue siendo navegable con teclado, se puede
        // abrir en otra pestaña y el destino se ve antes de hacer click.
        itemsHTML += `
          <a class="nh-sidebar-item" href="${esc(item.href)}"
             data-item-id="${esc(item.id)}" data-type="${esc(item.type)}">
            <span class="nh-sidebar-item-icon" aria-hidden="true">${icon}</span>
            <span class="nh-sidebar-item-name">${esc(item.name)}</span>
          </a>
        `;
      });

      const panelId = `nh-sec-panel-${sec.id}`;
      treeHTML += `
        <div class="nh-sidebar-sec-group" data-sec-id="${esc(sec.id)}">
          <button type="button" class="nh-sidebar-sec-header" aria-expanded="true" aria-controls="${panelId}">
            <span class="nh-sidebar-sec-arrow" aria-hidden="true">${LUCIDE_ICONS.chevronRight}</span>
            <span class="nh-sidebar-sec-title">${esc(sec.title)}</span>
          </button>
          <div class="nh-sidebar-sec-items" id="${panelId}">
            ${itemsHTML || '<p class="nh-sidebar-item-empty">Sin actividades</p>'}
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
      headerBtn.addEventListener('click', () => {
        const group    = headerBtn.closest('.nh-sidebar-sec-group');
        const itemsDiv = $('.nh-sidebar-sec-items', group);
        const expanded = headerBtn.getAttribute('aria-expanded') === 'true';

        headerBtn.setAttribute('aria-expanded', String(!expanded));
        itemsDiv.hidden = expanded;
        group.classList.toggle('collapsed', expanded);

        // Al abrir, además llevamos la vista a esa sección del curso.
        if (expanded) return;
        document.getElementById(group.getAttribute('data-sec-id'))
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    $$('.nh-sidebar-item', sidebar).forEach(itemLink => {
      itemLink.addEventListener('click', (e) => {
        // Respetamos ctrl/cmd/shift-click y el click del medio: son formas
        // legítimas de abrir la actividad en otra pestaña.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

        const targetAct = document.getElementById(itemLink.dataset.itemId);
        if (!targetAct) return;   // no está en esta página: que el anchor navegue

        e.preventDefault();
        $$('.nh-sidebar-item', sidebar).forEach(el => {
          el.classList.remove('active');
          el.removeAttribute('aria-current');
        });
        itemLink.classList.add('active');
        itemLink.setAttribute('aria-current', 'page');

        targetAct.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetAct.classList.add('nh-highlight-pulse');
        setTimeout(() => targetAct.classList.remove('nh-highlight-pulse'), 2000);
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
        // El drawer de mensajería queda fuera: es la mensajería en sí,
        // no cromo residual del tema. El `data-region` está en un hijo,
        // así que hay que mirar hacia adentro además de hacia arriba:
        // con sólo `closest()` el contenedor `.drawer` que lo envuelve
        // —el que Moodle abre y cierra— se ocultaba igual.
        if (el.matches('[data-region="message-drawer"]')
            || el.closest('[data-region="message-drawer"]')
            || el.querySelector('[data-region="message-drawer"]')) return;
        if (el && el.id !== 'nhood-login-page' && !el.id.startsWith('nhood-')) {
          el.style.cssText = 'display:none!important;height:0!important;min-height:0!important;max-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;margin:0!important;padding:0!important';
        }
      });
    }
  }

  // ── Bloques laterales de Moodle ────────────────────────
  // El drawer nativo (Calendario, Últimas noticias, Progreso…) se oculta
  // junto con el resto del cromo. Rescatamos sus bloques para colgarlos
  // del desplegable, así el contenido no se pierde y la columna izquierda
  // de la página queda libre para el índice del curso.
  function collectBlocks() {
    if (isLoginPage) return [];
    const source = $('#theme_adaptable-drawers-sidepost, [data-region="blocks-drawer"], #block-region-side-post');
    if (!source) return [];
    return $$('section.block, .block', source)
      .filter(b => b.textContent.trim().length > 8)
      // Descartamos los bloques anidados: alcanza con mover el contenedor.
      .filter(b => !b.parentElement.closest('section.block, .block'));
  }

  // Marca el contenido principal para que el enlace "Saltar al contenido" funcione.
  function markMainLandmark() {
    if (document.getElementById('nhood-main')) return;
    const target = $('#region-main') || $('#nhood-categories-wrap') || $('#page-content');
    if (!target || !target.parentNode) return;
    const anchor = document.createElement('span');
    anchor.id = 'nhood-main';
    anchor.tabIndex = -1;
    target.parentNode.insertBefore(anchor, target);
  }

  // ── Mantener el footer al final ────────────────────────
  // Algunos formatos de curso cargan secciones nuevas a medida que se
  // scrollea (visto en "SEMANA 1" apareciendo recién al bajar). Esas
  // secciones se insertan en el DOM después de que nuestro footer ya
  // era el último hijo del body, así que el footer queda encajado en
  // el medio de la página en vez de al final. Lo reubicamos cada vez
  // que Moodle agrega contenido nuevo.
  function pinFooterToEnd() {
    const footer = document.getElementById('nhood-footer');
    if (footer && footer !== body.lastElementChild) body.appendChild(footer);
  }

  function watchForLateContent() {
    const observer = new MutationObserver(() => pinFooterToEnd());
    observer.observe(body, { childList: true, subtree: true });
  }

  // ── Main ───────────────────────────────────────────────
  const INJECTED_IDS = [
    'nhood-header', 'nhood-hero', 'nhood-welcome', 'nhood-categories-wrap',
    'nhood-footer', 'nhood-login-page', 'nhood-sheet', 'nhood-crumbs',
    'nhood-palette', 'nhood-main',
  ];

  function main() {
    // Moodle recarga el contenedor principal por PJAX sin reejecutar el script:
    // borramos lo inyectado antes de reconstruir para no duplicar interfaces.
    closePalette();
    window.clearTimeout(sheetCloseTimer);
    sheetCloseTimer = 0;
    INJECTED_IDS.forEach(id => document.getElementById(id)?.remove());
    closeAllMenus();

    if (isLoginPage) {
      const loginData = scrapeLogin();
      body.appendChild(buildLoginPage(loginData));
      applyTheme(getTheme());
      killRemnants();
      return;
    }

    const headerData = scrapeHeader();
    const user       = isLoggedIn ? scrapeUser() : null;
    // La cosecha ocurre ANTES de ocultar nada: los menús nativos siguen en el DOM.
    const nav        = scrapeNav(user);
    const crumbs     = scrapeCrumbs();

    applyTheme(getTheme());

    const header = buildHeader(headerData, user, nav);
    body.insertBefore(header, body.firstChild);
    injectNativeControls(header);

    // Los bloques se rescatan antes de que killRemnants() oculte el drawer.
    if (isLoggedIn) body.appendChild(buildSheet(nav, user, collectBlocks()));
    wirePaletteShortcut(nav);

    if (isFrontPage) {
      // Portada: reconstrucción completa
      const cats  = scrapeCategories();
      const stats = getStats(cats);
      const login = scrapeLogin();

      body.appendChild(isLoggedIn ? buildWelcome(user, stats) : buildHero(login, stats));
      body.appendChild(buildCategories(cats));
      body.appendChild(buildFooter(user));
    } else {
      // Páginas internas: el HTML nativo de Moodle se conserva intacto
      const crumbBar = buildCrumbs(crumbs);
      if (crumbBar) body.insertBefore(crumbBar, header.nextSibling);

      body.appendChild(buildFooter(user));
      // No es sólo la vista de curso: los acordeones de categorías, la
      // paginación y cualquier otro contenido que Moodle agregue después
      // de este punto pueden dejar el footer encajado en el medio.
      watchForLateContent();

      if (body.classList.contains('pagelayout-course') || location.pathname.includes('/course/view.php')) {
        body.classList.add('pagelayout-course');
        redesignCourseView();
      }
    }

    markMainLandmark();
    applyTheme(getTheme());
    killRemnants();
    setTimeout(killRemnants, 1500);
    setTimeout(killRemnants, 3500);

    console.log(
      `%c UTN Redesign v5 %c ${isFrontPage ? 'frontpage' : 'inner'} · ${isLoggedIn ? 'logged in' : 'guest'} · ${nav.length} destinos `,
      'background:#18181b;color:#a78bfa;font-weight:700',
      'background:#18181b;color:#71717a;font-weight:400'
    );
  }

  // ── Wait for Moodle ────────────────────────────────────
  function waitAndRun() {
    loadFonts();
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
