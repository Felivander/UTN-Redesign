# UTN FRCon Moodle Campus Redesign – Claude Agent Handoff

Este documento sirve como manual de transferencia de arquitectura, diseño y código técnico para continuar con el desarrollo del rediseño visual del Campus Virtual de la **UTN Facultad Regional Concordia (FRCon)** (`https://frcon.cvg.utn.edu.ar`).

Este proyecto se materializa en una extensión de navegador (Chrome/Firefox/Edge) ligera y robusta que inyecta hojas de estilo personalizadas y scripts de re-estructuración para lograr un diseño premium, sobrio, utilitario, completamente responsivo y compatible con temas Oscuro y Claro.

---

## 🛠️ Estructura del Proyecto

El repositorio está organizado de forma modular para separar claramente las hojas de estilo de la lógica del DOM:

```
UTN-Redesign/
├── manifest.json         # Configuración y metadatos de la extensión (MV3)
├── icons/                # Assets gráficos (16x16, 48x48 y 128x128)
├── scripts/
│   ├── init.js           # Corre en document_start: aplica el tema antes de la primera pintura
│   ├── inject.js         # Cosecha de menús, reconstrucción del DOM, paleta, tema
│   ├── background.js     # Abre el campus al hacer click en el icono de la extensión
│   └── audit_campus.py   # Barrido visual con Playwright (requiere login manual)
└── styles/
    └── main.css          # Tokens OKLCH (oscuro/claro) y overrides completos del layout Moodle
```

---

## 🎨 Sistema de Diseño (CSS Tokens)

El diseño es **sobrio y utilitario con tonos grises**, logrando una excelente legibilidad académica, libre de distracciones visuales.

Los tokens viven en `styles/main.css` y se expresan en **OKLCH**: al ser un espacio perceptualmente uniforme, los pasos de la rampa neutra se leen parejos y no hay deriva de tono al pasar de oscuro a claro. Cambian mediante la clase `.nh-light`, que `applyTheme()` aplica tanto en `<html>` como en `<body>`.

### Superficies y texto

| Token | Tema Oscuro (defecto) | Tema Claro (`.nh-light`) | Propósito |
| :--- | :--- | :--- | :--- |
| `--bg` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Fondo principal de página |
| `--surface` | `oklch(0.210 0.006 285.9)` | `oklch(1 0 0)` | Cabeceras fijas, paneles, modales |
| `--card` | `oklch(0.210 0.006 285.9)` | `oklch(1 0 0)` | Cajas y tarjetas |
| `--card-h` | `oklch(0.274 0.006 286)` | `oklch(0.967 0.001 286.4)` | Tarjetas en hover |
| `--border` | `oklch(0.274 0.006 286)` | `oklch(0.920 0.004 286.3)` | Bordes de separación |
| `--border-h` | `oklch(0.370 0.013 285.8)` | `oklch(0.871 0.006 286.3)` | Bordes en hover |
| `--text` | `oklch(0.985 0 0)` | `oklch(0.145 0 0)` | Texto principal y títulos |
| `--sub` | `oklch(0.705 0.015 286.1)` | `oklch(0.442 0.017 285.8)` | Texto secundario |
| `--muted` | `oklch(0.552 0.016 285.9)` | `oklch(0.552 0.016 285.9)` | Ayudas, controles inactivos |

### Acento

El acento **tiene tono propio**: antes valía `#fafafa`, idéntico a `--text` en oscuro, con lo cual el estado activo, los enlaces y el anillo de foco no comunicaban nada. En claro baja de luminosidad para conservar 4.5:1 sobre blanco.

| Token | Oscuro | Claro | Propósito |
| :--- | :--- | :--- | :--- |
| `--accent` | `oklch(0.72 0.15 274)` | `oklch(0.50 0.19 274)` | Enlaces, estado activo, foco |
| `--accent-h` | `oklch(0.78 0.15 274)` | `oklch(0.44 0.19 274)` | Hover del acento |
| `--accent-fg` | `oklch(0.145 0 0)` | `oklch(1 0 0)` | Texto **sobre** el acento |
| `--accent-s` | alfa 0.14 | alfa 0.16 | Halo de foco |
| `--accent-q` | alfa 0.10 | alfa 0.07 | Relleno tenue de estado activo |

### Semánticos y tipos de actividad

`--success`, `--warning`, `--danger`, `--info` reemplazan los colores sueltos que estaban repartidos por el archivo. De ahí derivan `--act-forum`, `--act-assign`, `--act-quiz`, `--act-resource` y `--act-other`, que pintan el ribete lateral de cada actividad del curso y el ícono correspondiente en el índice lateral. `--green` queda como alias de `--success` por compatibilidad.

### Forma, movimiento y tipografía

| Token | Valor | Propósito |
| :--- | :--- | :--- |
| `--r-sm` / `--r-md` / `--r-lg` | `6px` / `10px` / `14px` | Radios de esquina |
| `--t-fast` / `--t` | `120ms` / `180ms` `cubic-bezier(.2,0,.2,1)` | Duración y curva de transición |
| `--font` | Inter + stack de sistema | Interfaz y texto corrido |
| `--font-display` | Outfit | Sólo títulos grandes |
| `--font-mono` | stack de sistema | Rótulos monoespaciados |
| `--fs-xs` … `--fs-3xl` | `0.75rem` … `clamp()` | Escala tipográfica |
| `--lh-tight` / `--lh-body` / `--lh-prose` | `1.2` / `1.6` / `1.75` | Interlineado por rol |

Las fuentes **no** se cargan con `@import` (bloquea la primera pintura). `loadFonts()` en `inject.js` inserta la hoja con `media="print"` y la promueve a `media="all"` al terminar de descargar, sin handlers inline para no chocar con la CSP del campus.

---

## ⚡ Funcionamiento Técnico & Arquitectura

Moodle implementa transiciones AJAX/PJAX que recargan el contenedor principal de la página sin hacer un reload completo del script inyectado de la extensión. Esto produce bugs comunes como la **doble inyección de interfaces customizadas**.

Este proyecto resuelve este desafío de forma óptima a través de los siguientes pilares de lógica en `scripts/inject.js`:

### 1. Limpieza y Evasión de Duplicación (Anti-PJAX Duplication Guard)
Al inicio del método principal `main()`, el script destruye de forma proactiva cualquier elemento previamente inyectado mediante ID antes de crearlos nuevamente.
```javascript
// Remove any previously injected elements to avoid duplicates during dynamic re-renders
const oldHeader = document.getElementById('nhood-header');
if (oldHeader) oldHeader.remove();
const oldHero = document.getElementById('nhood-hero');
if (oldHero) oldHero.remove();
// ...
```

### 2. Scraping de Moodle Nativo
El script no interfiere con las bases de datos de Moodle; en su lugar, actúa como un scraper veloz en tiempo de renderizado:
- **`scrapeHeader()`**: Recupera la ruta dinámica del logo de UTN (por si cambia o usa URLs temporales de pluginfile), la URL de ingreso y de búsqueda de cursos.
- **`scrapeUser()`**: Extrae el nombre, avatar, iniciales, URL de perfil y URL de cierre de sesión a partir de los menús nativos de usuario Moodle.
- **`scrapeCategories()`**: Lee las categorías primarias (`data-depth="1"`) y secundarias (`data-depth="2"`) con su respectivo contador de cursos y enlaces de la portada para reconstruir la botonera elegante de categorías académicas.

### 3. Reconstrucción Condicional del DOM
- **Portada (`body.pagelayout-frontpage`)**: Oculta completamente el contenido nativo (`#frontblockregion`, `#maincontainer`, bloques laterales) e inyecta la experiencia de usuario personalizada de la extensión: Cabecera Premium, Hero Banner dinámico (con formulario de login integrado para no-logueados o banner de bienvenida interactivo para alumnos logueados), la rejilla estilizada de Carreras/Categorías con iconos contextualmente asignados, y el footer unificado.
- **Páginas Internas (Cursos, Actividades, Configuración)**: Mantiene el HTML nativo intacto de Moodle para evitar romper formularios académicos complejos o editores de texto, inyectando únicamente la Cabecera superior adaptada y el Footer minimalista unificado, mientras que la hoja de estilos (`main.css`) redefine completamente toda la estética interna.

### 4. Mapeo Contextual de Iconos en Carreras
Un mapa asociativo en `scripts/inject.js` analiza el nombre de la categoría y asigna un icono. **No son emojis**: son SVG de Lucide embebidos en `LUCIDE_ICONS`, para que hereden `currentColor`, escalen sin pixelarse y no dependan de la fuente de emoji del sistema operativo.
```javascript
const ICONS = {
  'ingreso':'graduationCap', 'basica':'compass', 'civil':'building',
  'eléctrica':'zap', 'industrial':'cog', 'administración':'briefcase',
  'programación':'terminal', 'mantenimiento':'wrench', 'posgrado':'award',
  'extensión':'globe', /* … */
};
```

### 5. Cosecha de Navegación (`scrapeNav`)
Adaptable reparte los menús en cinco lugares distintos. La hoja de estilos oculta el cromo nativo, así que **antes** de ocultarlo `scrapeNav()` lee todos los destinos y los reconstruye. Sin este paso, ocultar el drawer dejaba huérfanas a Calendario, Archivos privados, Insignias, Preferencias, Notificaciones y el menú institucional.

Fuentes que cosecha, en orden de prioridad para el desempate:

1. `#theme_adaptable-drawers-primary` — drawer primario de Moodle 4
2. `#header1 nav.navbar` / `.btco-hover-menu` — menú institucional de la facultad
3. `.usermenu .dropdown-menu` — menú desplegable del usuario
4. `.secondary-navigation`, `nav.moremenu`, `.nav-tabs`, `.tabtree` — pestañas de la página actual
5. `#theme_adaptable-drawers-sidepost .block_navigation` / `.block_settings`
6. `a[href*="/course/view.php?id="]` — cursos visibles, para la paleta

A eso se suman `KNOWN_ROUTES` (sesión iniciada) y `PUBLIC_ROUTES` (visitante), que garantizan los destinos aunque la cosecha falle por carga lenta o permisos. Los enlaces se deduplican por `pathname + search + label` y se descarta el conmutador de idioma.

Lo cosechado alimenta tres superficies:

- **Desplegable de la hamburguesa** — la lista completa, agrupada. Es el botón que abre `#nhood-sheet`, primero de todo y del lado **izquierdo**. Único punto de entrada a todo el campus.
- **Barra del header** — sólo los enlaces prioritarios (`NAV_PRIORITY`), como atajo. Se ocultan por debajo de 1024px porque ya están en el desplegable.
- **Paleta de comandos (Ctrl+K)** — índice completo con filtro que ignora acentos y admite subsecuencias (`mcu` encuentra "Mis cursos")

**Regla de disposición:** toda la navegación vive en el borde izquierdo, y en este orden — primero el desplegable (hamburguesa, en el header), después el índice del curso (`#nhood-course-sidebar`). No hay una tercera columna a la derecha.

### 6. Bloques laterales de Moodle
`collectBlocks()` recoge los bloques de `#theme_adaptable-drawers-sidepost` (Calendario, Últimas noticias, Progreso…) y `buildSheet()` los **mueve** —no los clona— al final del desplegable, antes de que `killRemnants()` oculte el drawer. Clonarlos dejaría muertos a los que traen JavaScript propio. Antes se perdían por completo.

### 7. Drawer de mensajería
En Moodle 4 la mensajería **no** es un popover: es un drawer (`[data-region="message-drawer"]`). La regla global que oculta `.drawer` lo excluye explícitamente, en CSS y en `killRemnants()`. Sin esa excepción el botón de Mensajes se abría contra un elemento en `display:none` y no mostraba nada.

---

## 🎨 Personalizaciones Clave de Páginas Internas (`main.css`)

### 1. Panel de Cursos (/my/courses.php)
Estiliza la lista nativa de cursos del usuario para convertirla en tarjetas premium modernas:
- **Grilla Glassmorphic**: Estilo de tarjetas limpias con sombras suaves y borde sutil.
- **Progress Bar**: Barra de progreso académica estilizada usando `--green` para contrastar el avance del alumno de forma minimalista.

### 2. Vista de Categorías y Listados (/course/index.php)
- Organiza los resultados en una cuadrícula alineada.
- Ubica la paginación nativa de Moodle de forma centrada a lo ancho total de la cuadrícula usando `grid-column: 1 / -1`.

### 3. Vista de Materia / Curso (/course/view.php)
Transforma la anticuada estructura lineal de temas en tarjetas modulares:
- **Temas como Tarjetas**: Los temas/secciones nativas se convierten en contenedores de alto contraste con elevación.
- **Tema Activo (`.current`)**: Posee un borde de acento en `--accent` para guiar instantáneamente el ojo del estudiante al módulo actual de clases.
- **Actividades Codificadas por Color**: Los contenedores `.activity` (como foros, cuestionarios, tareas y recursos) cuentan con un ribete lateral izquierdo de color correspondiente a su tipo de actividad:
  - **Foros (`.forum`)**: Borde azul académico.
  - **Tareas (`.assign`)**: Borde naranja de entrega.
  - **Cuestionarios (`.quiz`)**: Borde rojo de evaluación.
  - **Recursos PDF/URL (`.resource`)**: Borde verde de material de lectura.

### 4. Ocultamiento Completo de Remanentes (Evasión de Fugas de Interfaz)
Para evitar que elementos antiguos de Moodle se carguen por debajo, se implementa la función `killRemnants()` que se ejecuta cíclicamente tras `main()`, asegurando que `footer` originales, botones `.drawer-toggles` rotos o headers residuales nunca rompan la experiencia visual.

---

## ♿ Accesibilidad

Decisiones que hay que **mantener** al tocar el código:

- **`.sr-only` nunca lleva `display:none`.** Se oculta con el patrón de recorte (`clip-path: inset(50%)`), que lo saca de la vista pero lo deja en el árbol de accesibilidad. Con `display:none` se borraban ~24 etiquetas de lector de pantalla por página.
- **Nada de `div role="link"`.** Las tarjetas de categoría usan un anchor de título estirado con `::after { position:absolute; inset:0 }`, y las subcategorías van encima con `z-index`. Así funcionan ctrl+click, click del medio y la vista previa del destino, sin anidar elementos interactivos.
- **Los colapsables son `<button>` con `aria-expanded`**, sincronizado con el atributo `hidden` del panel.
- **El color nunca es el único portador de información**: el estado activo suma una barra (`box-shadow: inset`), los errores de formulario van con texto, y el ribete por tipo de actividad acompaña al ícono nativo de Moodle.
- **Foco visible** en todo lo enfocable vía `:focus-visible`, y `prefers-reduced-motion` neutraliza animaciones y scroll suave.
- Los menús desplegables soportan `ArrowUp`/`ArrowDown`/`Home`/`End`/`Escape`/`Tab`, cierran al hacer click afuera y devuelven el foco al disparador.

---

## 🧪 Verificación

`scripts/audit_campus.py` abre Chromium con la extensión cargada, **espera a que inicies sesión a mano** y barre portada, dashboard, calendario, mensajería y por cada curso su inicio, calificaciones, participantes, foro y tarea, en oscuro y claro.

```bash
python scripts/audit_campus.py
```

Notas para agentes: el modo headless de Playwright **no carga extensiones MV3** — hay que usar `headless=False`. Y el perfil persistente conserva `nhood-theme` en `localStorage` entre corridas, así que para comparar temas hay que fijarlo explícitamente o borrar el perfil; si no, se leen capturas del tema equivocado.

### Correcciones aplicadas en la última revisión

- El formulario de acceso de la portada vuelve a estar disponible en pantallas chicas: se apila debajo del texto en vez de ocultarse.
- El drawer del campus cancela correctamente su temporizador de cierre; abrirlo durante la animación de salida ya no lo deja invisible.
- La paleta `Ctrl+K` mantiene un único listener y actualiza su índice para evitar resultados viejos después de una reconstrucción de la interfaz.
- El foco queda contenido dentro del drawer y la paleta, y `Escape` permite cerrar ambos desde cualquier control enfocado.
- Se corrigieron nombres accesibles de controles, `aria-current="page"`, atributos `type="button"` y el escape de valores dinámicos insertados en HTML.

### Validación pendiente

La verificación automatizada disponible (`scripts/audit_campus.py`) requiere una sesión real de Moodle y una ventana de Chromium visible. Conviene comprobar manualmente la portada en 390px/768px, abrir y cerrar rápidamente el menú lateral, usar `Ctrl+K` tras navegar entre páginas y revisar el drawer de mensajes.

---

## 🎯 Próximos Pasos & Tareas Pendientes

1. **Verificación de las áreas logueadas**: la cosecha de navegación se probó contra la portada, el login y el listado de cursos como visitante. Falta confirmar contra un usuario real qué devuelven el drawer primario y el menú de usuario, y ajustar `NAV_PRIORITY` según lo que realmente aparezca.
2. **Empaquetar las fuentes como `woff2`** dentro de `icons/` o `fonts/` y servirlas con `chrome.runtime.getURL`. Hoy siguen viniendo de Google Fonts: la carga ya no bloquea el render, pero sigue siendo una petición externa.
3. **Auditar contraste del contenido nativo** en `/course/view.php` con tema claro: el HTML de las cátedras trae estilos en línea propios que los tokens no alcanzan.
4. **Pantallas ultra-anchas**: revisar que `.section .activity` escale bien cuando el rail de bloques está abierto.
5. **`transition: var(--t)` sin propiedad explícita** quedó en reglas heredadas — anima `all`. Los componentes nuevos ya declaran propiedades concretas; conviene ir migrando el resto.
