"""Diagnostico de las areas logueadas del campus.

Abre Chromium con la extension cargada y ESPERA a que inicies sesion a mano.
No pide ni guarda credenciales: las escribis vos en la ventana del navegador.

Cuando detecta la sesion, recorre las paginas logueadas, vuelca el estado real
del DOM (que menus se cosecharon, que se ve y que no) y saca capturas en
oscuro y claro.

    python scripts/diag_logged_in.py

La salida JSON es lo que hay que pegarle al agente para diagnosticar.
"""
import os
import json
import time

from playwright.sync_api import sync_playwright

BASE = "https://frcon.cvg.utn.edu.ar"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "diag_out")
PROFILE = os.path.join(ROOT, "playwright_user_data")

PAGES = [
    ("categorias",  "/course/index.php"),
    ("dashboard",   "/my/index.php"),
    ("my_courses",  "/my/courses.php"),
    ("curso_645",   "/course/view.php?id=645"),
    ("calendario",  "/calendar/view.php?view=month"),
    ("perfil",      "/user/profile.php"),
]

# Se evalua en la pagina para saber que ve realmente el usuario.
PROBE = r"""() => {
  const $  = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const box = el => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      w: Math.round(r.width), h: Math.round(r.height),
      x: Math.round(r.x), y: Math.round(r.y),
      display: cs.display, visibility: cs.visibility, overflow: cs.overflow,
      z: cs.zIndex,
    };
  };
  return {
    url: location.pathname + location.search,
    bodyClasses: document.body.className.split(' ')
      .filter(c => /pagelayout|nh-|drawer|course-|limitedwidth/.test(c)),

    // Navegacion reconstruida
    header:       box($('#nhood-header')),
    navLinks:     $$('#nhood-header .nh-nav-link').map(a => a.textContent.trim()),
    moreMenuItems:$$('#nhood-header .nh-menu-panel .nh-menu-item').map(a => a.textContent.trim()),
    crumbs:       $$('#nhood-crumbs .nh-crumb').map(c => c.textContent.trim()),
    bodyPadStart: getComputedStyle(document.body).paddingInlineStart,
    pagePadStart: (() => { const p = $('#page'); return p ? getComputedStyle(p).paddingInlineStart : null; })(),

    // El footer aparecía "encajado" en medio de la página en vez de al
    // final. Esto responde: ¿de verdad es el último hijo del body? ¿qué
    // hay justo después de él en el DOM? ¿hay algún ancestro con scroll
    // propio (overflow + altura acotada) que lo esté conteniendo?
    footerDiag: (() => {
      const f = $('#nhood-footer');
      if (!f) return 'NO EXISTE #nhood-footer EN EL DOM';
      const rectF = f.getBoundingClientRect();
      const isLast = f === document.body.lastElementChild;
      const next = f.nextElementSibling;
      const prev = f.previousElementSibling;
      // Camina hacia arriba buscando un ancestro que recorte/scrollee
      // por su cuenta y cuyo rect contenga verticalmente al footer.
      const clippers = [];
      let n = f.parentElement;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        const scrolls = /(auto|scroll)/.test(cs.overflowY);
        const finite = cs.maxHeight !== 'none' || (n.scrollHeight > n.clientHeight + 4);
        if (scrolls && finite) {
          const r = n.getBoundingClientRect();
          clippers.push({
            sel: n.tagName.toLowerCase() + (n.id ? '#'+n.id : '') + '.' +
                 (typeof n.className === 'string' ? n.className.trim().split(/\\s+/).slice(0,3).join('.') : ''),
            overflowY: cs.overflowY, maxHeight: cs.maxHeight,
            scrollHeight: n.scrollHeight, clientHeight: n.clientHeight,
            containsFooterY: rectF.top >= r.top && rectF.bottom <= r.bottom,
          });
        }
        n = n.parentElement;
      }
      return {
        isLastChildOfBody: isLast,
        parent: f.parentElement ? f.parentElement.tagName.toLowerCase() + '#' + (f.parentElement.id||'') : null,
        nextSibling: next ? next.tagName.toLowerCase() + '#' + (next.id||'') + '.' +
                     (typeof next.className === 'string' ? next.className.trim().split(/\\s+/).slice(0,3).join('.') : '') : null,
        prevSibling: prev ? prev.tagName.toLowerCase() + '#' + (prev.id||'') + '.' +
                     (typeof prev.className === 'string' ? prev.className.trim().split(/\\s+/).slice(0,3).join('.') : '') : null,
        rect: { top: Math.round(rectF.top), bottom: Math.round(rectF.bottom), y: Math.round(rectF.y + window.scrollY) },
        docHeight: document.documentElement.scrollHeight,
        scrollingClippers: clippers,
        siblingsAfterFooterCount: (() => {
          let c = 0, s = f.nextElementSibling;
          while (s) { c++; s = s.nextElementSibling; }
          return c;
        })(),
      };
    })(),

    // Controles nativos movidos al header
    nativeControls: $$('#nhood-header .nh-native-controls > *').map(e =>
                      e.tagName + '.' + (e.className || '').split(' ').slice(0,2).join('.')),
    messageDrawer: (() => {
      const d = $('[data-region="message-drawer"]');
      if (!d) return 'NO EXISTE EN EL DOM';
      return box(d);
    })(),
    messageToggle: (() => {
      const t = $('[data-action="toggle-message-drawer"], #message-drawer-toggle,'
                + ' [data-region="popover-region-messages"] .popover-region-toggle');
      return t ? { found: true, box: box(t), inHeader: !!t.closest('#nhood-header') }
               : { found: false };
    })(),

    // Volcado crudo de TODO lo que huela a mensajeria. Los tres selectores
    // de messageToggle dan false en las seis paginas, asi que hay que ver
    // el markup real: sin esto no se puede saber que hay que enganchar.
    messagingDump: (() => {
      const trim = el => {
        const h = el.outerHTML.replace(/\s+/g, ' ');
        return h.length > 700 ? h.slice(0, 700) + ' …[cortado]' : h;
      };
      const desc = el => ({
        tag: el.tagName,
        cls: el.className || '',
        id: el.id || '',
        data: Object.assign({}, el.dataset),
        href: el.getAttribute('href') || '',
        inHeader: !!el.closest('#nhood-header'),
        inNativeControls: !!el.closest('.nh-native-controls'),
        box: box(el),
        html: trim(el),
      });
      // Candidatos por marcado y por texto/icono visible.
      const cands = new Set();
      $$('.popover-region, [data-region^="popover-region"], [data-action*="message"],'
       + ' [id*="message"], [class*="message"], [href*="/message/"]')
        .filter(el => !el.closest('[data-region="message-drawer"]'))
        .forEach(el => cands.add(el));
      $$('a, button').forEach(el => {
        const t = (el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '')
                + ' ' + (el.getAttribute('title') || '');
        if (/mensaje|message|chat/i.test(t)) cands.add(el);
      });
      const list = [...cands].slice(0, 25).map(desc);

      const drawer = $('[data-region="message-drawer"]');
      return {
        candidates: list,
        drawerHTMLHead: drawer ? trim(drawer).slice(0, 700) : null,
        drawerClasses: drawer ? drawer.className : null,
        drawerAria: drawer ? {
          hidden: drawer.getAttribute('aria-hidden'),
          expanded: drawer.getAttribute('aria-expanded'),
        } : null,
        drawerParent: drawer && drawer.parentElement
          ? drawer.parentElement.tagName + '#' + drawer.parentElement.id + '.' + drawer.parentElement.className
          : null,
        // Que regla nuestra le esta ganando al estado abierto/cerrado.
        drawerComputed: drawer ? (() => {
          const cs = getComputedStyle(drawer);
          return { display: cs.display, visibility: cs.visibility, transform: cs.transform,
                   width: cs.width, height: cs.height, right: cs.right, zIndex: cs.zIndex };
        })() : null,
        bodyDrawerClasses: document.body.className.split(' ')
          .filter(c => /drawer|message/i.test(c)),
        jsHooks: {
          hasRequire: typeof window.require === 'function',
          hasM: !!window.M,
        },
      };
    })(),

    // Superficies claras mientras el tema es oscuro: son las cajas blancas
    // que se ven dentro del curso. Reporta quien las pinta para poder
    // escribir el selector correcto en vez de adivinar.
    lightSurfaces: (() => {
      const isLight = document.documentElement.classList.contains('nh-light');
      // Luminancia aproximada a partir de lo que devuelve getComputedStyle.
      const lum = (c) => {
        let m = c.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
        if (m) {
          if (m[4] !== undefined && parseFloat(m[4]) < 0.15) return null;  // transparente
          return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
        }
        m = c.match(/okl(?:ch|ab)\(\s*([\d.]+)/);
        return m ? parseFloat(m[1]) : null;
      };
      const out = [];
      const nodes = $$('#region-main *, .course-content *, #nhood-course-content-container *');
      for (const el of nodes) {
        if (out.length >= 20) break;
        if (el.closest('#nhood-header, #nhood-sheet, #nhood-palette')) continue;
        const cs = getComputedStyle(el);
        const L = lum(cs.backgroundColor);
        if (L === null || L < 0.72) continue;          // no es una superficie clara
        const r = el.getBoundingClientRect();
        if (r.width < 60 || r.height < 24) continue;   // ruido: chips, iconos
        out.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 120),
          id: el.id || '',
          bg: cs.backgroundColor,
          color: cs.color,
          inlineStyle: el.getAttribute('style') || '',
          box: { w: Math.round(r.width), h: Math.round(r.height) },
          // cadena de ancestros: ubica el nodo sin tener que abrir el DOM
          path: (() => {
            const p = [];
            let n = el;
            for (let i = 0; n && i < 4; i++, n = n.parentElement) {
              p.push(n.tagName + (n.id ? '#' + n.id : '')
                   + '.' + (n.className || '').toString().split(' ').slice(0, 3).join('.'));
            }
            return p.join('  <  ');
          })(),
        });
      }
      return { temaClaro: isLight, encontradas: out.length, elementos: out };
    })(),

    // Contenido principal: lo que se "ve raro"
    mainRegion:   box($('#region-main')),
    courseCards:  $$('[data-region="course-content"], .course-card, .dashboard-card').length,
    cardGrid: (() => {
      const g = $('[data-region="courses-view"] .row, .card-deck, #course-category-listing');
      if (!g) return null;
      const cs = getComputedStyle(g);
      return { display: cs.display, gridCols: cs.gridTemplateColumns, w: Math.round(g.getBoundingClientRect().width) };
    })(),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      ? { scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth }
      : false,
    // Elementos que se salen del viewport por derecha
    offscreenRight: $$('#region-main *').filter(e => {
      const r = e.getBoundingClientRect();
      return r.width > 40 && r.right > window.innerWidth + 4;
    }).slice(0, 6).map(e => e.tagName + '.' + (e.className || '').toString().split(' ').slice(0,2).join('.')),
  };
}"""


def wait_for_login(page):
    page.goto(BASE, wait_until="domcontentloaded")
    page.wait_for_timeout(2000)
    logged = page.evaluate(
        "() => !document.body.classList.contains('notloggedin')"
        " && !document.body.classList.contains('pagelayout-login')")
    if logged:
        print("Sesion activa detectada.\n")
        return True

    print("=" * 72)
    print("  INICIA SESION EN LA VENTANA DEL NAVEGADOR QUE SE ABRIO.")
    print("  Escribi tu usuario y contrasena vos mismo. El script no los toca.")
    print("  Esperando hasta 5 minutos...")
    print("=" * 72 + "\n")
    for _ in range(300):
        try:
            ok = page.evaluate(
                "() => !document.body.classList.contains('notloggedin')"
                " && !document.body.classList.contains('pagelayout-login')")
            if ok or "/my/" in page.url:
                print("Sesion detectada.\n")
                return True
        except Exception:
            pass
        time.sleep(1)
    print("Tiempo agotado esperando el login.")
    return False


def main():
    os.makedirs(OUT, exist_ok=True)
    results = {}
    with sync_playwright() as p:
        # headless=False es obligatorio: el modo headless no carga extensiones MV3.
        ctx = p.chromium.launch_persistent_context(
            PROFILE,
            headless=False,
            args=[f"--disable-extensions-except={ROOT}", f"--load-extension={ROOT}"],
            viewport={"width": 1440, "height": 900},
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        if not wait_for_login(page):
            ctx.close()
            return

        for name, path in PAGES:
            print(f"Analizando {path} ...")
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(BASE + path, wait_until="domcontentloaded")
            page.wait_for_timeout(3500)

            data = page.evaluate(PROBE)
            data["pageErrors"] = errors[:5]

            # Repite sólo el diagnóstico del footer después de scrollear:
            # el reporte del usuario menciona que aparece mal ya al cargar,
            # pero conviene ver si scrollear lo mueve o lo empeora.
            page.mouse.wheel(0, 2000)
            page.wait_for_timeout(1200)
            data["footerDiagAfterScroll"] = page.evaluate(
                "() => { const el = document.querySelector('#nhood-footer');"
                " if (!el) return 'ausente'; const r = el.getBoundingClientRect();"
                " return { isLastChildOfBody: el === document.body.lastElementChild,"
                " top: Math.round(r.top), bottom: Math.round(r.bottom) }; }")

            # Probar el boton de mensajes en la primera pagina
            if name == "my_courses":
                tog = page.locator('[data-action="toggle-message-drawer"], #message-drawer-toggle,'
                                   ' [data-region="popover-region-messages"] .popover-region-toggle').first
                if tog.count():
                    try:
                        tog.click(timeout=4000)
                        page.wait_for_timeout(1500)
                        data["afterMessageClick"] = page.evaluate(
                            "() => { const d = document.querySelector('[data-region=\\\"message-drawer\\\"]');"
                            " if (!d) return 'sin drawer en DOM';"
                            " const cs = getComputedStyle(d); const r = d.getBoundingClientRect();"
                            " return { display: cs.display, visibility: cs.visibility,"
                            " w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x) }; }")
                        page.screenshot(path=os.path.join(OUT, "mensajes_abierto.png"))
                    except Exception as e:
                        data["afterMessageClick"] = f"click fallo: {e}"
                else:
                    data["afterMessageClick"] = "no se encontro el boton de mensajes"

            results[name] = data
            page.screenshot(path=os.path.join(OUT, f"{name}_dark.png"), full_page=True)

            btn = page.locator("#nh-theme-toggle").first
            if btn.count():
                btn.click()
                page.wait_for_timeout(900)
                page.screenshot(path=os.path.join(OUT, f"{name}_light.png"), full_page=True)
                btn.click()
                page.wait_for_timeout(400)

        ctx.close()

    report = os.path.join(OUT, "diagnostico.json")
    with open(report, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=1, ensure_ascii=False)

    print("\n" + "=" * 72)
    print(f"  Listo. Capturas y JSON en: {OUT}")
    print(f"  Pegale al agente el contenido de: {report}")
    print("=" * 72 + "\n")
    print(json.dumps(results, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
