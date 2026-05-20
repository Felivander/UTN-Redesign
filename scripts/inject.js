/**
 * UTN FRCon Campus Redesign v4
 * Maneja: front page / curso / login — logged in / out
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'nhood-theme';

  // ── Detectar contexto ──────────────────────────────────
  const body        = document.body;
  const isFrontPage = body.classList.contains('pagelayout-frontpage');
  const isLoggedIn  = !body.classList.contains('notloggedin');
  const isLoginPage = body.classList.contains('pagelayout-login');

  // ── Icon map ───────────────────────────────────────────
  const ICONS = {
    'ingreso':'🎓','basica':'📐','básica':'📐','civil':'🏗️',
    'eléctrica':'⚡','electrica':'⚡','industrial':'⚙️',
    'administración':'💼','administracion':'💼','higiene':'🛡️',
    'seguridad':'🛡️','programación':'💻','programacion':'💻',
    'mantenimiento':'🔧','posgrado':'🎯','extensión':'🌐',
    'extension':'🌐','encuesta':'📊','articulación':'🔗',
    'articulacion':'🔗','planeamiento':'📋','capacitación':'📚',
    'capacitacion':'📚','gestión':'🏛️','gestion':'🏛️','tecnicatura':'📖',
  };
  function getIcon(t) {
    const l = (t || '').toLowerCase();
    for (const [k,v] of Object.entries(ICONS)) if (l.includes(k)) return v;
    return '📁';
  }

  // ── Helpers ────────────────────────────────────────────
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ── Theme ──────────────────────────────────────────────
  function getTheme()   { return localStorage.getItem(STORAGE_KEY) || 'dark'; }
  function saveTheme(t) { localStorage.setItem(STORAGE_KEY, t); }
  function applyTheme(theme) {
    body.classList.toggle('nh-light', theme === 'light');
    const btn = document.getElementById('nh-theme-toggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
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
      '.usermenu img.userpicture, .userimage, img.userpicture'
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
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '👤';

    return {
      name:          name || 'Mi perfil',
      avatarSrc:     avatarImg?.src ?? '',
      initials,
      logoutURL:     logoutLink?.href  ?? '/login/logout.php',
      profileURL:    profileLink?.href ?? '/user/profile.php',
      myCoursesURL:  myCoursesLink?.href ?? '/my/courses.php',
    };
  }

  function scrapeLogin() {
    const form = $('#login');
    return {
      action:    form?.action ?? '/login/index.php',
      token:     form?.querySelector('[name="logintoken"]')?.value ?? '',
      forgotURL: $('a[href*="forgot_password"]')?.href ?? '/login/forgot_password.php',
      signupURL: $('a[href*="signup"]')?.href         ?? '/login/signup.php',
    };
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
      : `<span style="font-size:20px">🎓</span>`;

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
           style="color:var(--muted)">Salir</a>
      `
      : `<a class="nh-login-btn" href="${loginURL}">Entrar</a>`;

    header.innerHTML = `
      <div class="nh-inner">
        <a class="nh-logo" href="/">${logoHTML}</a>
        <div class="nh-divider"></div>
        <span class="nh-site-name">Campus Virtual · FRCon</span>
        <div class="nh-spacer"></div>
        <div class="nh-search">
          <span class="nh-search-icon">🔍</span>
          <form action="${searchAction}" method="get">
            <input type="text" name="q" placeholder="Buscar cursos…" autocomplete="off">
          </form>
        </div>
        <button id="nh-theme-toggle" title="Cambiar tema">☀️</button>
        ${rightHTML}
      </div>
    `;

    header.querySelector('#nh-theme-toggle').addEventListener('click', toggleTheme);
    return header;
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
          <h1>Hola, ${user.name.split(' ')[0]} 👋</h1>
          <p>${stats.courses} cursos disponibles · ${stats.online} usuarios en línea ahora</p>
        </div>
        <div class="nw-actions">
          <a class="nw-btn nw-btn-primary" href="${user.myCoursesURL}">
            📚 Mis cursos
          </a>
          <a class="nw-btn nw-btn-secondary" href="/my/">
            🏠 Dashboard
          </a>
          <a class="nw-btn nw-btn-secondary" href="${user.profileURL}">
            👤 Mi perfil
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

    // Don't redesign the login page — Moodle's is fine, just apply dark theme
    if (isLoginPage) { applyTheme(getTheme()); return; }

    const headerData = scrapeHeader();
    const user       = isLoggedIn ? scrapeUser() : null;

    applyTheme(getTheme());

    const header = buildHeader(headerData, user);
    body.insertBefore(header, body.firstChild);

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
