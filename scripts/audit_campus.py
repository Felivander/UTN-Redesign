import os
import sys
import time
from playwright.sync_api import sync_playwright

# Configuration
URL_BASE = "https://frcon.cvg.utn.edu.ar"
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCREENSHOTS_DIR = r"C:\Users\RAVSA\.gemini\antigravity\brain\c4cde305-afc6-4948-bf49-ea17a24df92a\audit_screenshots"
USER_DATA_DIR = os.path.join(WORKSPACE_DIR, "playwright_user_data")

# Create output directories
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def clean_filename(name):
    # Remove characters that are illegal in file names or spaces
    import re
    return re.sub(r'[^a-zA-Z0-9_\-]', '_', name).strip('_')

def capture_dual_mode(page, page_name):
    try:
        # Wait for page to stabilize
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1500)
    except Exception as e:
        print(f"  Timeout/Error waiting for networkidle: {e}")
    
    # Hide any ephemeral elements like tooltip or overlays if necessary, or just wait
    page.wait_for_timeout(500)
    
    # 1. Dark Mode screenshot (Ensure it is dark first)
    try:
        is_light = page.evaluate("() => document.documentElement.classList.contains('nh-light')")
        if is_light:
            theme_btn = page.locator("#nh-theme-toggle")
            if theme_btn.count() > 0:
                theme_btn.click()
                page.wait_for_timeout(800)
        
        dark_path = os.path.join(SCREENSHOTS_DIR, f"{page_name}_dark.png")
        page.screenshot(path=dark_path, full_page=True)
        print(f"  Captured Dark Mode: {dark_path}")
    except Exception as e:
        print(f"  Failed capturing dark mode screenshot: {e}")
        
    # 2. Light Mode screenshot
    try:
        theme_btn = page.locator("#nh-theme-toggle")
        if theme_btn.count() > 0:
            theme_btn.click()
            page.wait_for_timeout(800)
            
            light_path = os.path.join(SCREENSHOTS_DIR, f"{page_name}_light.png")
            page.screenshot(path=light_path, full_page=True)
            print(f"  Captured Light Mode: {light_path}")
            
            # Switch back to Dark Mode for subsequent actions
            theme_btn.click()
            page.wait_for_timeout(500)
        else:
            print("  Warning: Theme toggle button `#nh-theme-toggle` not found!")
    except Exception as e:
        print(f"  Failed capturing light mode screenshot: {e}")

def main():
    print("=====================================================================")
    print("      UTN Campus Redesign – INICIO DE AUDITORÍA VISUAL AUTOMATIZADA  ")
    print("=====================================================================")
    print(f"Directorio de la Extensión: {WORKSPACE_DIR}")
    print(f"Directorio de Destino de Capturas: {SCREENSHOTS_DIR}")
    
    with sync_playwright() as p:
        print("\nLanzando Chromium con la Extensión cargada...")
        context = p.chromium.launch_persistent_context(
            USER_DATA_DIR,
            headless=False,
            args=[
                f"--disable-extensions-except={WORKSPACE_DIR}",
                f"--load-extension={WORKSPACE_DIR}",
                "--start-maximized"
            ],
            no_viewport=True
        )
        
        page = context.pages[0]
        
        # Go to Moodle front page
        print(f"Navegando a {URL_BASE}...")
        page.goto(URL_BASE)
        
        # Check login status
        page.wait_for_load_state("load")
        time.sleep(1)
        
        is_logged_in = False
        try:
            # If nh-theme-toggle is already present and we are NOT on login page
            is_logged_in = page.evaluate("() => !document.body.classList.contains('notloggedin') && !document.body.classList.contains('pagelayout-login')")
        except Exception:
            pass
            
        if not is_logged_in:
            print("\n" + "="*70)
            print("  POR FAVOR INICIA SESIÓN EN LA VENTANA DEL NAVEGADOR DE PLAYWRIGHT.")
            print("  (Ingresa tu usuario y contraseña de forma manual y segura)")
            print("  El script esperará a que inicies sesión y cargue el Dashboard...")
            print("="*70 + "\n")
            
            # Wait loop for login completion
            logged_in_detected = False
            for _ in range(300): # 5 minutes timeout
                try:
                    current_url = page.url
                    # Detect if we landed on /my/ or if login-related page layout is gone
                    not_login_layout = page.evaluate("() => !document.body.classList.contains('notloggedin') && !document.body.classList.contains('pagelayout-login')")
                    if "my/" in current_url or "courses.php" in current_url or not_login_layout:
                        print("¡Inicio de sesión detectado!")
                        logged_in_detected = True
                        break
                except Exception:
                    pass
                time.sleep(1)
                
            if not logged_in_detected:
                print("Error: Tiempo de espera para inicio de sesión agotado (5 minutos).")
                context.close()
                return
        else:
            print("¡Sesión activa preexistente detectada!")
            
        # We are logged in! Let's start the sweep
        print("\nComenzando barrido de páginas globales...")
        
        # 1. Frontpage (Inicio)
        print("Auditando Portada Principal...")
        page.goto(URL_BASE)
        capture_dual_mode(page, "01_portada")
        
        # 2. Dashboard
        print("Auditando Dashboard...")
        page.goto(f"{URL_BASE}/my/")
        capture_dual_mode(page, "02_dashboard")
        
        # Get all course links dynamically from the dashboard
        print("Escaneando materias activas...")
        page.wait_for_timeout(2000)
        
        # Find all course view URLs
        links = page.locator("a[href*='/course/view.php?id=']").all()
        course_data = []
        for link in links:
            try:
                href = link.get_attribute("href")
                if not href:
                    continue
                # Clean URL to get base course url
                if "?" in href:
                    base_url = href.split("?")[0] + "?" + [p for p in href.split("?")[1].split("&") if p.startswith("id=")][0]
                else:
                    base_url = href
                
                # Try to get course title
                title = link.inner_text().strip()
                if not title:
                    # check sibling or parent text
                    title = page.evaluate("(el) => el.innerText", link.element_handle())
                
                title = clean_filename(title.split("\n")[0])
                if not title:
                    title = f"Curso_ID_{base_url.split('id=')[-1]}"
                    
                entry = {"url": base_url, "title": title, "id": base_url.split("id=")[-1]}
                if entry not in course_data and len(course_data) < 10:  # Max 10 courses to keep it sane
                    course_data.append(entry)
            except Exception as e:
                pass
                
        print(f"Se detectaron {len(course_data)} cursos activos:")
        for idx, course in enumerate(course_data):
            print(f"  [{idx+1}] {course['title']} (ID: {course['id']})")
            
        # 3. Calendar
        print("Auditando Calendario...")
        page.goto(f"{URL_BASE}/calendar/view.php")
        capture_dual_mode(page, "03_calendario")
        
        # 4. Messages
        print("Auditando Mensajería...")
        page.goto(f"{URL_BASE}/message/")
        capture_dual_mode(page, "04_mensajeria")
        
        # Sweep all courses
        for idx, course in enumerate(course_data):
            c_name = f"curso_{idx+1:02d}_{course['title']}"
            print(f"\nAuditando Curso [{idx+1}/{len(course_data)}]: {course['title']}...")
            
            # A. Course Homepage
            page.goto(course["url"])
            capture_dual_mode(page, f"{c_name}_inicio")
            
            # B. Gradebook
            grade_url = f"{URL_BASE}/grade/report/user/index.php?id={course['id']}"
            print(f"  Calificaciones...")
            page.goto(grade_url)
            capture_dual_mode(page, f"{c_name}_calificaciones")
            
            # C. Participants
            part_url = f"{URL_BASE}/user/index.php?id={course['id']}"
            print(f"  Participantes...")
            page.goto(part_url)
            capture_dual_mode(page, f"{c_name}_participantes")
            
            # D. Activities (Try to find a forum or assignment inside the course main page)
            try:
                page.goto(course["url"])
                page.wait_for_load_state("networkidle")
                
                # Check for forum links
                forum_link = page.locator("a[href*='/mod/forum/view.php?id=']").first
                if forum_link.count() > 0:
                    f_url = forum_link.get_attribute("href")
                    print(f"  Foro...")
                    page.goto(f_url)
                    capture_dual_mode(page, f"{c_name}_actividad_foro")
                    
                # Check for assign links
                assign_link = page.locator("a[href*='/mod/assign/view.php?id=']").first
                if assign_link.count() > 0:
                    a_url = assign_link.get_attribute("href")
                    print(f"  Tarea...")
                    page.goto(a_url)
                    capture_dual_mode(page, f"{c_name}_actividad_tarea")
            except Exception as e:
                print(f"  Error escaneando actividades del curso: {e}")
                
        print("\n" + "="*70)
        print("  ¡AUDITORÍA FINALIZADA CON ÉXITO!")
        print(f"  Todas las capturas se guardaron en: {SCREENSHOTS_DIR}")
        print("="*70 + "\n")
        
        context.close()

if __name__ == "__main__":
    main()
