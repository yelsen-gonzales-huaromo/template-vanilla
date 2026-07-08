# template-vanilla

> **Plantilla de panel administrativo empresarial — JavaScript / HTML / CSS 100% nativo.**
> Sin Vite, sin webpack, sin npm, sin paso de build. El navegador carga los archivos tal cual.

<p align="center">
  <img src="public/img/Panel%20%C2%B7%20template-vanilla.png" alt="Panel template-vanilla" width="100%">
</p>

template-vanilla es una plantilla SPA pensada para servirse desde cualquier backend
(Spring Boot, ASP.NET Razor, Laravel, Django, nginx) o como sitio estático puro.
Todo el código fuente está escrito en **español** —nombres de variables,
funciones, archivos, rutas, mensajes y documentación— y está organizado por
capas para escalar de un panel pequeño a un dashboard empresarial sin
reescribir la base.

---

## Qué es realmente template-vanilla

template-vanilla **no** es un framework, **no** es una librería npm, **no** es un
boilerplate de Vite. Es una **aplicación SPA completa, sin compilación**, que
se ejecuta directamente en el navegador usando módulos ES nativos (`<script
type="module">`). El backend (si lo hay) sólo sirve los archivos estáticos y
las llamadas a `/api`.

En la práctica encontrarás:

- **119 vistas** ya construidas (dashboards, auth, apps, módulos showcase,
  ajustes, errores, reportes), cargadas lazy por el router.
- **7 dashboards de negocio**: analítica, CRM, comercio, LMS, proyectos, SaaS, soporte.
- **~41 componentes UI** propios (Botón, Tarjeta, Modal, Tabla, Toast, Tooltip,
  KPICard, GraficoLineas, ConfigPanel, CommandPalette…) + **10 componentes
  comunes** (RutaProtegida, LimiteError, TituloPagina, etc.).
- **8 hooks/composables** (`usarAutenticacion`, `usarPeticion`, `usarTema`,
  `usarPaginacion`, `usarPermisos`, `usarDebounce`…).
- **Reactividad propia** (`senal`, `calculado`, `efecto`, `reactivo`) en ~80
  líneas — sin React, sin Vue, sin Solid.
- **Cliente HTTP** sobre `fetch` con interceptores de petición/respuesta/error.
- **Router SPA** con History API, guardias declarativas y lazy import.
- **i18n** (es/en) por carga diferida de JSON.
- **Tema** claro / oscuro / alto contraste vía custom properties CSS.
- **Modo demo** con datos sintéticos para desarrollar sin backend.
- **30+ integraciones opcionales** con librerías de terceros (Chart.js, D3,
  ECharts, Leaflet, FullCalendar, Swiper, TinyMCE, Flatpickr, Choices,
  GLightbox, Prism, Sortable, Lottie, etc.) cargadas **lazy desde CDN** sólo
  cuando un componente las necesita.

---

## Arrancarlo en 30 segundos

Como los `import` de módulos ES no funcionan en `file://`, hay que servir por
HTTP. Cualquier servidor estático sirve:

```bash
# Python (cualquier sistema con Python 3)
python -m http.server 3000

# Node sin instalar nada en el proyecto
npx --yes serve -l 3000

# PHP
php -S 127.0.0.1:3000
```

Abre <http://localhost:3000>. Verás la pantalla de login (modo demo: cualquier
email y contraseña inician sesión).

---

## Estructura del proyecto

```
template-vanilla/
├─ index.html            ← Punto de entrada. Define window.TEMPLATE_VANILLA_CONFIG.
├─ public/
│   ├─ favicons/
│   └─ manifest.json
├─ docs/
│   ├─ architecture.md
│   ├─ components.md
│   ├─ deployment.md
│   └─ glosario-traduccion.md
└─ src/
   ├─ main.js            ← Bootstrap (estado → http → i18n → toasts → router).
   ├─ config/            ← CONFIG_APP, NOMBRES_RUTAS, RUTAS.
   ├─ styles/
   │   ├─ main.css       ← Único CSS cargado por <link>; importa todo lo demás.
   │   ├─ themes/tokens.css
   │   ├─ base/, utilities/
   ├─ components/
   │   ├─ ui/            ← 41 componentes atómicos reutilizables.
   │   ├─ forms/         ← CampoFormulario, ErrorFormulario, SelectorIdioma…
   │   └─ common/        ← RutaProtegida, LimiteError, TituloPagina…
   ├─ layouts/           ← dashboard-layout, auth-layout, blank-layout
   │                       + sidebar / navbar / footer / config-panel.
   ├─ pages/             ← 119 vistas lazy-loaded.
   │   ├─ dashboard/
   │   ├─ panel/         ← analitica, crm, comercio, lms, proyectos, saas, soporte
   │   ├─ auth/          ← login, register, forgot/reset password, confirm-mail,
   │   │                   lock-screen, wizard
   │   ├─ app/           ← chat, kanban
   │   ├─ modulos/       ← showcase: charts, componentes, forms, iconos,
   │   │                   mapas, tablas, utilidades
   │   ├─ errors/        ← 401, 403, 404, 500, 503, mantenimiento, offline
   │   ├─ settings/      ← perfil, seguridad, preferencias, ajustes
   │   └─ reports/
   ├─ router/            ← Router SPA con guardias declarativas.
   ├─ services/          ← clienteHttp + auth.service / user.service /
   │                       reports.service / upload.service.
   ├─ store/             ← estadoAuth, estadoUi, estadoNotificaciones (señales).
   ├─ hooks/             ← usarAutenticacion, usarTema, usarPaginacion…
   ├─ i18n/              ← es/, en/ (JSON cargados con fetch).
   ├─ integrations/      ← Adaptadores lazy a 30+ libs de terceros (CDN).
   ├─ data/              ← Datos geo (mapas).
   └─ utils/
       ├─ helpers/       ← senal/calculado/efecto, busEventos, crearEl,
       │                   demo-data, reactive…
       ├─ formatters/, validators/, constants/
```

---

## Configuración

Edita `window.TEMPLATE_VANILLA_CONFIG` en `index.html`. El backend puede sobreescribir
estos valores antes de cargar `main.js` (por ejemplo desde Razor / Blade /
Spring):

```html
<script>
  window.TEMPLATE_VANILLA_CONFIG = Object.freeze({
    nombre:   'template-vanilla',
    version:  '1.0.0',
    ambiente: 'production',          // o 'development'
    api: { urlBase: '/api', tiempoEspera: 15000 },
    auth: {
      cabeceraToken: 'Authorization',
      prefijoToken:  'Bearer',
      margenRenovacionSeg: 60,
    },
    ui: {
      temaPorDefecto:    'system',   // 'light' | 'dark' | 'high-contrast' | 'system'
      idiomaPorDefecto:  'es',
      idiomasSoportados: ['es', 'en'],
      direccion: 'ltr',
    },
    caracteristicas: { pwa: false, analitica: false },
    modoDemo: false,                 // pon true mientras no haya backend
  });
</script>
```

Con `modoDemo: true` puedes iniciar sesión con cualquier email/contraseña y
todas las páginas funcionan con datos sintéticos. Ideal para iterar UI sin
backend.

---

## Despliegue con backend

Copia toda la carpeta `template-vanilla/` (sin `docs/` ni `README.md`) al directorio
estático de tu backend:

| Backend                    | Carpeta destino                      |
|----------------------------|--------------------------------------|
| **Spring Boot** (Java)     | `src/main/resources/static/`         |
| **ASP.NET / Razor** (C#)   | `wwwroot/`                           |
| **Laravel / Blade** (PHP)  | `public/`                            |
| **Django / Flask** (Py)    | `static/`                            |
| **nginx** (cualquiera)     | `/usr/share/nginx/html/` o similar   |

### Fallback SPA

Cuando el usuario entra a `/panel/crm`, el servidor debe devolver `index.html`
(la ruta la resuelve el router en el navegador):

**Spring Boot** — `WebMvcConfig.java`:
```java
registry.addResourceHandler("/**")
    .addResourceLocations("classpath:/static/")
    .resourceChain(true)
    .addResolver(new PathResourceResolver() {
        @Override
        protected Resource getResource(String path, Resource location) throws IOException {
            Resource r = location.createRelative(path);
            return r.exists() && r.isReadable() ? r : new ClassPathResource("/static/index.html");
        }
    });
```

**ASP.NET Core** — `Program.cs`:
```csharp
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
```

**Laravel** — `routes/web.php`:
```php
Route::get('/{any}', fn () => file_get_contents(public_path('index.html')))
    ->where('any', '.*');
```

**nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Inventario de páginas

**Total: 119 vistas** organizadas así:

| Sección       | Vistas | Detalle                                                     |
|---------------|-------:|-------------------------------------------------------------|
| Dashboard     |     1  | Resumen general                                             |
| Paneles       |     7  | analítica, CRM, comercio, LMS, proyectos, SaaS, soporte     |
| Autenticación |     7  | login, registro, recuperar, restablecer, confirmar correo, bloqueo, asistente |
| Apps          |     2  | chat, kanban                                                |
| Errores       |     7  | 401, 403, 404, 500, 503, mantenimiento, offline             |
| Ajustes       |     4  | perfil, seguridad, preferencias, ajustes                    |
| Reportes      |     1  | constructor de reportes                                     |
| **Módulos showcase** |  ~90 | gráficos (12), componentes (45+), formularios (17), iconos (4), mapas (2), tablas (3), utilidades |

Los **módulos showcase** son la galería de componentes y demos —ECharts,
Chart.js, D3, Bootstrap Icons, Feather, Font Awesome, Material Icons, Leaflet,
Google Maps, DataTables, FullCalendar, TinyMCE, Flatpickr, etc.— que sirven
como referencia de uso.

Lee [`docs/architecture.md`](docs/architecture.md) y
[`docs/glosario-traduccion.md`](docs/glosario-traduccion.md) para el detalle
arquitectónico y el mapa de nombres en español.

---

## Integraciones de terceros (lazy)

template-vanilla **no incluye** estas librerías en su bundle. Cuando un componente o
una página las necesita, `src/integrations/_loader.js` las descarga desde un
CDN público y cachea la promesa. Hay adaptadores para:

```
anchorjs  · chartjs    · choices    · countup    · d3
datatables · dayjs     · dropzone   · echarts    · emoji-mart
flag-icons · flatpickr · fontawesome · fullcalendar · glightbox
inputmask · leaflet    · leaflet-plugins · list-js · lottie
nouislider · plyr      · prism      · rater      · simplebar
sortable  · swiper     · tinymce    · typed      · validator
```

Para uso **offline** o aislado, sustituye las URLs CDN dentro de cada
adaptador (`src/integrations/<lib>/`) por rutas locales tipo
`./vendor/<lib>/...`. No hay otro paso.

---

## Highlights técnicos

- **Reactividad sin framework**: `senal()`, `calculado()`, `efecto()`,
  `reactivo()` en ~80 líneas (`src/utils/helpers/reactive.js`).
- **Cliente HTTP nativo** sobre `fetch` con interceptores de auth, error y
  logging encadenables.
- **Router SPA** con guardias declarativas, lazy import por ruta y captura
  global de `<a>` para mantener navegación SPA.
- **i18n vía `fetch()`** de JSON por idioma — sin librería externa.
- **Tema** claro / oscuro / alto contraste con tokens CSS, hidratado antes del
  primer paint para evitar FOUC.
- **Stores reactivos** compuestos: `estadoAuth`, `estadoUi`,
  `estadoNotificaciones`.
- **Bus de eventos** transversal con catálogo inmutable de eventos
  (`EVENTOS_APP`).
- **Cero build step**, **cero dependencias instaladas localmente**,
  **cero `node_modules/`**.

---

## Documentación

- [`docs/architecture.md`](docs/architecture.md) — arquitectura por capas,
  reactividad, stores, HTTP, routing.
- [`docs/components.md`](docs/components.md) — catálogo de componentes UI.
- [`docs/deployment.md`](docs/deployment.md) — guía de despliegue por
  plataforma.
- [`docs/glosario-traduccion.md`](docs/glosario-traduccion.md) — mapa
  inglés → español de los nombres de archivos, funciones y rutas.

---

## Licencia

MIT.
