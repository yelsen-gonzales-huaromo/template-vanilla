# Launchpad — Plantilla nativa vanilla

> JavaScript/HTML/CSS 100% nativo, sin Vite, sin npm, sin build step.
> Listo para servir desde Spring Boot, ASP.NET Razor, Laravel Blade, Django,
> nginx o cualquier servidor estático.

## Cómo correrlo

Necesitas servir los archivos por HTTP (los `import` de módulos ES no funcionan
con `file://`). Cualquier servidor estático sirve. Tres opciones:

```bash
# Python (cualquier sistema con Python 3)
python -m http.server 3000

# Node (sin instalar dependencias del proyecto)
npx --yes serve -l 3000

# PHP
php -S 127.0.0.1:3000
```

Abre <http://localhost:3000>.

## Estructura

```
launchpad/
├─ index.html              ← Punto de entrada. Configura window.LAUNCHPAD_CONFIG.
├─ public/
│   └─ manifest.json
├─ docs/                   ← arquitectura, glosario, despliegue
└─ src/
   ├─ main.js              ← Bootstrap (orden: estado → http → i18n → toasts → router)
   ├─ styles/
   │   ├─ main.css         ← Único CSS cargado por <link>. Importa todos los demás.
   │   ├─ themes/tokens.css
   │   ├─ base/, utilities/
   ├─ components/
   │   ├─ ui/              ← Boton, Tarjeta, Campo, Modal, Tabla, GraficoLineas…
   │   ├─ forms/
   │   └─ common/
   ├─ layouts/             ← DisenoTablero, DisenoAuth, DisenoVacio + sidebar/navbar/footer
   ├─ pages/               ← 71 páginas lazy-loaded por el router
   ├─ router/              ← Router SPA con guardias declarativas
   ├─ services/            ← clienteHttp + servicios de dominio (auth/user/reports/upload)
   ├─ store/               ← estadoAuth, estadoUi, estadoNotificaciones (señales reactivas)
   ├─ hooks/               ← usarAutenticacion, usarTema, usarPaginacion…
   ├─ i18n/                ← es/, en/ (JSON cargados con fetch)
   ├─ config/              ← CONFIG_APP, NOMBRES_RUTAS, RUTAS
   └─ utils/
       ├─ helpers/         ← senal/calculado/efecto, busEventos, crearEl, demo-data…
       ├─ formatters/, validators/, constants/
```

## Configuración

Edita `window.LAUNCHPAD_CONFIG` en `index.html`:

```html
<script>
  window.LAUNCHPAD_CONFIG = Object.freeze({
    nombre:   'Launchpad',
    version:  '1.0.0',
    ambiente: 'production',           // o 'development'
    api: { urlBase: '/api', tiempoEspera: 15000 },
    auth: { cabeceraToken: 'Authorization', prefijoToken: 'Bearer' },
    ui:   { temaPorDefecto: 'system', idiomaPorDefecto: 'es' },
    modoDemo: false,                   // pon true mientras no haya backend
  });
</script>
```

`modoDemo: true` permite iniciar sesión con cualquier email/contraseña sin backend
(ideal para desarrollo de UI). En producción déjalo en `false`.

## Despliegue con backend

Copia toda la carpeta `launchpad/` (excepto `docs/`) al directorio estático de tu
backend:

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

## Inventario migrado de Falcon

71 páginas: 8 dashboards, 7 flujos auth, 18 apps (calendario, chat, kanban con
drag&drop, correo, social, mesa de ayuda, eventos), 11 de comercio, 6 de
aprendizaje, 7 misceláneas, 7 módulos showcase, 4 errores y 4 settings.

Lee [`docs/architecture.md`](docs/architecture.md) y [`docs/glosario-traduccion.md`](docs/glosario-traduccion.md)
para el detalle de la arquitectura y el mapa de nombres en español.

## Highlights

- Reactividad sin framework: `senal()`, `calculado()`, `efecto()` (~80 líneas).
- Cliente HTTP nativo con interceptores (auth/error/logging).
- Router SPA con guardias declarativas y lazy import de páginas.
- i18n vía `fetch()` de JSON (es/en).
- Tema claro/oscuro/alto contraste con tokens CSS.
- Gráficos SVG nativos (líneas, barras, donut, sparkline, progreso).
- Cero dependencias en runtime.
- Cero build step.

## Licencia

MIT.
