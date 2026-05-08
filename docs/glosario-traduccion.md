# Glosario de traducción — Inglés → Español

> Este documento es la **fuente única de verdad** para nombres en español del código fuente.
> Cualquier renombrado debe seguirlo al pie de la letra para mantener la consistencia.

## Convenciones

- **Nombres de archivos y carpetas**: se mantienen en inglés (button.js, hooks/, etc.) por convención multiplataforma.
- **Clases CSS**: se mantienen en inglés (`.btn`, `.card`, etc.) por compatibilidad con librerías y convenciones BEM.
- **Funciones, clases, variables, constantes**: en español.
- **Comentarios**: en español.
- **Texto visible al usuario**: a través de i18n (es/en).

## Helpers

| Inglés                | Español                  |
|-----------------------|--------------------------|
| `signal`              | `senal`                  |
| `computed`            | `calculado`              |
| `effect`              | `efecto`                 |
| `reactive`            | `reactivo`               |
| `eventBus`            | `busEventos`             |
| `APP_EVENTS`          | `EVENTOS_APP`            |
| `localStore`          | `almacenamientoLocal`    |
| `sessionStore`        | `almacenamientoSesion`   |
| `debounce`            | `antirebote`             |
| `throttle`            | `acelerador`             |
| `uid`                 | `idUnico`                |
| `h` (hyperscript)     | `crearEl`                |
| `mount`               | `montar`                 |
| `trapFocus`           | `atraparFoco`            |
| `onOutsideClick`      | `alClickFuera`           |
| `$`, `$$`             | `$`, `$$` (universales)  |

## Constantes / config

| Inglés              | Español                   |
|---------------------|---------------------------|
| `STORAGE_KEYS`      | `CLAVES_ALMACENAMIENTO`   |
| `PERMISSIONS`       | `PERMISOS`                |
| `ROLES`             | `ROLES`                   |
| `ROLE_PERMISSIONS`  | `PERMISOS_POR_ROL`        |
| `APP_CONFIG`        | `CONFIG_APP`              |
| `ROUTE_NAMES`       | `NOMBRES_RUTAS`           |
| `ROUTE_PATHS`       | `RUTAS`                   |

## Hooks

| Inglés                | Español                       |
|-----------------------|-------------------------------|
| `useAuth`             | `usarAutenticacion`           |
| `useTheme`            | `usarTema`                    |
| `useFetch`            | `usarPeticion`                |
| `useDebounce`         | `usarAntirebote`              |
| `useLocalStorage`     | `usarAlmacenamientoLocal`     |
| `useMediaQuery`       | `usarMedia`                   |
| `useBreakpoint`       | `usarPuntoQuiebre`            |
| `usePagination`       | `usarPaginacion`              |
| `usePermissions`      | `usarPermisos`                |

## Store / estado

| Inglés                 | Español                   |
|------------------------|---------------------------|
| `authStore`            | `estadoAuth`              |
| `uiStore`              | `estadoUi`                |
| `notificationsStore`   | `estadoNotificaciones`    |
| `initStore`            | `iniciarEstado`           |

## Servicios

| Inglés         | Español                   |
|----------------|---------------------------|
| `httpClient`   | `clienteHttp`             |
| `initHttp`     | `iniciarHttp`             |
| `login`        | `iniciarSesion`           |
| `register`     | `registrar`               |
| `logout`       | `cerrarSesion`            |
| `me`           | `miPerfil`                |
| `forgotPassword` | `recuperarContrasena`   |
| `resetPassword` | `restablecerContrasena`  |
| `refreshToken` | `renovarToken`            |

## Router

| Inglés         | Español               |
|----------------|-----------------------|
| `routes`       | `rutas`               |
| `navigateTo`   | `navegarA`            |
| `initRouter`   | `iniciarEnrutador`    |
| `useRoute`     | `usarRuta`            |
| `authGuard`    | `guardiaAutenticacion`|
| `guestGuard`   | `guardiaInvitado`     |
| `roleGuard`    | `guardiaRol`          |

## i18n

| Inglés         | Español       |
|----------------|---------------|
| `initI18n`     | `iniciarI18n` |
| `loadLocale`   | `cargarIdioma`|
| `t`            | `t`           |
| `tx`           | `tx`          |

## Componentes UI

| Inglés       | Español           |
|--------------|-------------------|
| `Button`     | `Boton`           |
| `Input`      | `Campo`           |
| `Textarea`   | `AreaTexto`       |
| `Select`     | `Selector`        |
| `Card`       | `Tarjeta`         |
| `Badge`      | `Insignia`        |
| `Avatar`     | `Avatar`          |
| `Spinner`    | `Cargador`        |
| `Skeleton`   | `Esqueleto`       |
| `Modal`      | `Modal`           |
| `Dropdown`   | `MenuDesplegable` |
| `Table`      | `Tabla`           |
| `Pagination` | `Paginacion`      |
| `Tooltip`    | `Tooltip`         |
| `EmptyState` | `EstadoVacio`     |
| `toast`      | `notificar`       |
| `initToasts` | `iniciarNotificaciones` |

## Componentes formularios

| Inglés      | Español             |
|-------------|---------------------|
| `FormField` | `CampoFormulario`   |
| `FormLabel` | `EtiquetaFormulario`|
| `FormError` | `ErrorFormulario`   |

## Componentes comunes

| Inglés          | Español                 |
|-----------------|-------------------------|
| `ErrorBoundary` | `LimiteError`           |
| `installGlobalErrorHandlers` | `instalarManejadoresErrores` |
| `LazyLoader`    | `CargadorPerezoso`      |
| `PageTitle`     | `TituloPagina`          |
| `ProtectedRoute`| `RutaProtegida`         |

## Layouts

| Inglés            | Español             |
|-------------------|---------------------|
| `DashboardLayout` | `DisenoTablero`     |
| `AuthLayout`      | `DisenoAuth`        |
| `BlankLayout`     | `DisenoVacio`       |
| `mountLayout`     | `montarDiseno`      |
| `Sidebar`         | `BarraLateral`      |
| `Navbar`          | `BarraSuperior`     |
| `Footer`          | `PiePagina`         |
| `Breadcrumbs`     | `Migas`             |

## Validators

| Inglés        | Español         |
|---------------|-----------------|
| `required`    | `obligatorio`   |
| `minLength`   | `longitudMinima`|
| `maxLength`   | `longitudMaxima`|
| `pattern`     | `patron`        |
| `email`       | `correo`        |
| `url`         | `url`           |
| `matches`     | `coincide`      |
| `numeric`     | `numerico`      |
| `validate`    | `validar`       |
| `validateForm`| `validarFormulario` |

## Formatters

| Inglés            | Español              |
|-------------------|----------------------|
| `formatDate`      | `formatearFecha`     |
| `formatDateTime`  | `formatearFechaHora` |
| `formatRelative`  | `formatearRelativo`  |
| `formatNumber`    | `formatearNumero`    |
| `formatCurrency`  | `formatearMoneda`    |
| `formatPercent`   | `formatearPorcentaje`|
| `formatBytes`     | `formatearBytes`     |
| `capitalize`      | `capitalizar`        |
| `truncate`        | `truncar`            |
| `slugify`         | `slug`               |
| `initials`        | `iniciales`          |
| `escapeHtml`      | `escaparHtml`        |
