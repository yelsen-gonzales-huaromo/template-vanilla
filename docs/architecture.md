# Arquitectura

> template-vanilla es una plantilla JavaScript **nativa** (sin frameworks) diseñada para
> escalar de un panel admin sencillo a un dashboard empresarial/gubernamental
> sin reescribirla. Todo el código fuente está en español.

## Estructura por capas

```
src/
├─ assets/         Fuentes, iconos e imágenes empaquetados con el bundle.
├─ components/     Piezas UI reutilizables. Una carpeta por componente (.js + .css + .html).
│   ├─ ui/         Bloques atómicos (Boton, Campo, Modal, Tarjeta, Tabla, GraficoLineas…).
│   ├─ forms/      Composiciones para formularios (CampoFormulario, ErrorFormulario…).
│   └─ common/     Widgets transversales (LimiteError, RutaProtegida, TituloPagina…).
├─ config/         Configuración en runtime (env-driven), sin lógica de negocio.
├─ hooks/          Composables (usarAutenticacion, usarPeticion, usarTema, usarPaginacion…).
├─ i18n/           Diccionarios JSON + resolver mínimo. Lazy-loaded por locale.
├─ layouts/        Shells de la app (DisenoTablero / DisenoAuth / DisenoVacio) + chrome compartido.
├─ pages/          Vistas a nivel de ruta. Cada una se importa de forma lazy por el enrutador.
├─ router/         Router SPA con guardias declarativas.
├─ services/       Frontera con backend: clienteHttp, interceptores, servicios de dominio.
├─ store/          Estado reactivo por característica, compuesto en store/index.js.
├─ styles/         Tokens (fuente única de verdad), reset, tipografía, utilidades.
└─ utils/          Helpers puros, formatters, validators, constantes.
```

## Modelo de reactividad

Una primitiva mínima en `utils/helpers/reactive.js` ofrece:

- **`senal(inicial)`** — celda observable. `.value` lee/escribe; `.subscribe(fn)` escucha.
- **`calculado(fn)`** — señal derivada que se reevalúa cuando cambian sus dependencias.
- **`efecto(fn)`** — ejecuta `fn` y la re-ejecuta cuando cambia cualquier señal que lee.
- **`reactivo(obj)`** — proxy con reactividad por propiedad (para stores).

Los componentes usan estas primitivas en lugar de jQuery o frameworks runtime.
Esto da ergonomía equivalente a Vue/Solid con cero dependencias.

## Comunicación

Los eventos transversales pasan por `utils/helpers/event-bus.js`:

```js
import { busEventos, EVENTOS_APP } from '@utils/helpers/event-bus.js';
busEventos.on(EVENTOS_APP.AUTH_EXPIRADA, () => navegarA('/ingresar'));
```

Todos los eventos viven en un objeto inmutable para evitar strings mágicos.

## Stores

| Store                  | Propósito                                                |
|------------------------|----------------------------------------------------------|
| `estadoAuth`           | Sesión, usuario, helpers RBAC, hidratación local         |
| `estadoUi`             | Tema, idioma, dirección, sidebar                         |
| `estadoNotificaciones` | Cola de toasts/notificaciones                            |

## Capa HTTP

`services/http/client.js` es un wrapper sobre `fetch` con pipeline de tres etapas:

```
interceptor de petición → fetch → interceptor de respuesta
                                       └ interceptor de error (en no-2xx)
```

Servicios de dominio (`auth.service`, `user.service`, …) llaman a `clienteHttp.get/post/…`
y devuelven JSON. Las páginas y hooks consumen los servicios, nunca `fetch` directamente.

## Routing y code splitting

`router/index.js` es un router de History API que:

1. Empareja la URL con `routes.js`.
2. Ejecuta el array `guards` — pueden devolver `{redireccion, query}`.
3. Lazy-importa el módulo de página (`() => import('../pages/...')`) para mantener el bundle inicial mínimo.
4. Envuelve la página en un layout (`dashboard | auth | blank`) y la monta.
5. Intercepta clicks en `<a>` para mantener navegación SPA.

## Inventario migrado (Falcon → template-vanilla)

| Sección Falcon              | Páginas migradas en template-vanilla |
|-----------------------------|-------------------------------|
| 7 dashboards                | analitica, crm, comercio, lms, proyectos, saas, soporte |
| Auth (3 variantes × 7)      | login, registro, recuperar, restablecer, confirmar-correo, bloqueo, asistente-registro |
| 9 apps                      | calendario, chat, kanban, correo (3), social (4), soporte (5), eventos (3) |
| E-commerce (14)             | productos lista/grid/detalle/nuevo, pedidos lista/detalle, clientes lista/detalle, carrito, checkout, factura |
| E-learning (6)              | cursos lista/grid/detalle/crear, perfil estudiante/instructor |
| Páginas misc (7)            | FAQ, precios, aterrizaje, inicial, asociaciones, invitar, privacidad |
| Módulos (7 showcase)        | gráficos, formularios, tablas, iconos, mapas, utilidades, componentes |
| Errores (3)                 | 403, 404, 500 |
| Configuración (4)           | perfil, seguridad, preferencias, reportes |

**Total: 71 páginas** (Falcon tenía ~209 páginas-HTML repetidas en 3 variantes de auth, 4 layouts de navbar, etc. — template-vanilla consolida y reescribe en español).

## Theming

Los tokens son CSS custom properties en `:root`, sobreescritos por
`[data-theme='dark']` y `[data-theme='high-contrast']`. Cambiar tema cuesta
cero JS — sólo un atributo en `<html>`.

Un script pre-paint en `index.html` lee tema/dir desde `localStorage` antes
de que el CSS evalúe, eliminando el FOUC del template antiguo.

## i18n

Los diccionarios son JSON en `i18n/<locale>/common.json`. El resolver soporta
dot-paths e interpolación `{var}`. Cambiar idioma dispara una recarga reactiva.
Idiomas soportados por defecto: **es**, **en**.

## Accesibilidad

- Outlines `:focus-visible`, `:focus` retirado sólo si `:focus-visible` existe.
- ARIA: `role=dialog` + `aria-modal` en Modal, `aria-current="page"` en navegación activa,
  `aria-live="polite"` en la región de toasts, focus-trap en Modal/Drawer.
- Skip-link, `prefers-reduced-motion`, tema de alto contraste.
- Propiedades lógicas (`margin-inline-start`, `padding-block`) para RTL gratis.

## Seguridad

- CSP y headers en `docker/nginx.conf` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- Tokens en `localStorage` con clave central (`CLAVES_ALMACENAMIENTO`).
- `escaparHtml` para sanitizar input antes de `innerHTML`.
- RBAC componible: `usarPermisos().tiene/tieneTodos/tieneRol`.
- Guardias de ruta: `guardiaAutenticacion`, `guardiaInvitado`, `guardiaRol`.
- Manejo central de 401 (logout automático), 403 (toast), 5xx, errores de red.
