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
    ("my_courses", "/my/courses.php"),
    ("dashboard",  "/my/"),
    ("calendario", "/calendar/view.php?view=month"),
    ("perfil",     "/user/profile.php"),
]

# Se evalua en la pagina para saber que ve realmente el usuario.
PROBE = """() => {
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
    rail:         box($('#nhood-block-rail')),
    railBlocks:   $$('#nhood-block-rail .block').map(b =>
                    (b.className.match(/block_[a-z_]+/) || ['?'])[0]),
    bodyPadStart: getComputedStyle(document.body).paddingInlineStart,
    pagePadStart: (() => { const p = $('#page'); return p ? getComputedStyle(p).paddingInlineStart : null; })(),

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
