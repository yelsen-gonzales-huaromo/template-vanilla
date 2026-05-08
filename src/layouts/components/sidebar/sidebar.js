import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { almacenamientoLocal } from '../../../utils/helpers/storage.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { MenuDesplegable, cerrarMenuActivo } from '../../../components/ui/dropdown/dropdown.js';
import { estadoUi } from '../../../store/ui.store.js';
import { estadoAuth } from '../../../store/auth.store.js';
import { usarAutenticacion } from '../../../hooks/useAuth.js';
import { usarRuta, navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { SECCIONES } from '../../../config/navigation.config.js';
import { t } from '../../../i18n/index.js';
import { CONFIG_APP } from '../../../config/app.config.js';

const N = NOMBRES_RUTAS;

const CLAVE_SECCION = 'launchpad.ui.sidebar.seccion';
const CLAVE_SUBABIERTAS = 'launchpad.ui.sidebar.subabiertas';

const irA = (ruta) => (e) => {
  e.preventDefault();
  navegarA(ruta);
};

/* ----------------------------------------------------------------------------
   Helpers de árbol — para auto-expandir, buscar item activo, etc. Trabajan con
   la estructura recursiva donde un nodo es:
     • { ruta, etiqueta, ... }                 (hoja)
     • { id, etiqueta, items: [...] }          (rama)
   -------------------------------------------------------------------------- */
const recorrerHojas = function* (items) {
  for (const it of items || []) {
    if (it.items) yield* recorrerHojas(it.items);
    else if (it.ruta) yield it;
  }
};

/** Devuelve todos los `id` de ramas en cuyo subárbol vive `path`. */
const idsAncestrosDePath = (items, path, acc = []) => {
  for (const it of items || []) {
    if (it.items) {
      const dentro = idsAncestrosDePath(it.items, path, []);
      if (dentro.found) {
        acc.push(it.id, ...dentro.ids);
        return { found: true, ids: acc };
      }
    } else if (it.ruta && RUTAS[it.ruta] === path) {
      return { found: true, ids: acc };
    }
  }
  return { found: false, ids: acc };
};

/** Devuelve los IDs ancestros de una RAMA específica (por id). Para accordion. */
const idsAncestrosDeRama = (items, ramaId, acc = []) => {
  for (const it of items || []) {
    if (!it.items) continue;
    if (it.id === ramaId) return { found: true, ids: acc };
    const dentro = idsAncestrosDeRama(it.items, ramaId, []);
    if (dentro.found) {
      acc.push(it.id, ...dentro.ids);
      return { found: true, ids: acc };
    }
  }
  return { found: false, ids: acc };
};

/* ----------------------------------------------------------------------------
   Popover de sub-items para sidebar colapsado — portaleado a <body> para
   escapar del overflow:hidden del nav. Reutiliza el styling .dropdown__menu.
   Soporta items anidados: si un item tiene `items` se renderiza con caret y
   abre un sub-popover al hacer hover/click.
   -------------------------------------------------------------------------- */
let _popoverSeccion = null;

const cerrarPopoverSeccion = () => {
  if (!_popoverSeccion) return;
  _popoverSeccion.cleanup();
  _popoverSeccion.menu.remove();
  _popoverSeccion = null;
};

const construirItemsPopover = (items) =>
  items.map((it) => {
    if (it.items) {
      // Sub-rama: botón con caret y submenú interno colapsable.
      const sub = crearEl('div', { class: 'sidebar-popover__sub' },
        construirItemsPopover(it.items));
      const btn = crearEl('button', {
        type: 'button',
        role: 'menuitem',
        class: 'dropdown__item dropdown__item--has-sub',
        onClick: () => {
          const abierto = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!abierto));
        },
        'aria-expanded': 'false',
      }, [
        crearEl('span', null, [t(it.etiqueta) || it.etiqueta]),
        Icono('chevron_d', { tamano: 12 }),
      ]);
      return crearEl('div', { class: 'sidebar-popover__group' }, [btn, sub]);
    }
    return crearEl('button', {
      type: 'button',
      role: 'menuitem',
      class: 'dropdown__item',
      onClick: () => {
        navegarA(RUTAS[it.ruta]);
        cerrarPopoverSeccion();
      },
    }, [
      crearEl('span', null, [t(it.etiqueta) || it.etiqueta]),
      it.nuevo && crearEl('span', { class: 'sidebar__badge sidebar__badge--inline' }, ['Nuevo']),
    ]);
  });

const abrirPopoverSeccion = (disparador, etiqueta, subItems) => {
  cerrarPopoverSeccion();
  cerrarMenuActivo();

  const menu = crearEl('div', {
    class: 'dropdown__menu dropdown__menu--right sidebar-popover',
    role: 'menu',
  }, [
    crearEl('div', { class: 'dropdown__label' }, [etiqueta]),
    ...construirItemsPopover(subItems),
  ]);

  document.body.appendChild(menu);

  const reposicionar = () => {
    const r = disparador.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const margen = 8;
    let top = r.top;
    let left = r.right + margen;
    const vw = window.innerWidth, vh = window.innerHeight;
    left = Math.max(margen, Math.min(left, vw - m.width - margen));
    top  = Math.max(margen, Math.min(top,  vh - m.height - margen));
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  };
  reposicionar();

  const onDoc = (e) => {
    if (menu.contains(e.target) || disparador.contains(e.target)) return;
    cerrarPopoverSeccion();
  };
  const onScroll = () => reposicionar();
  setTimeout(() => document.addEventListener('click', onDoc), 0);
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onScroll);
  const cleanup = () => {
    document.removeEventListener('click', onDoc);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onScroll);
  };

  _popoverSeccion = { menu, cleanup };
};

export const BarraLateral = () => {
  const ruta = usarRuta();
  const { cerrarSesion } = usarAutenticacion();

  // Secciones de primer nivel expandidas — Set para permitir varias abiertas
  // a la vez al EXPLORAR. El accordion (auto-colapsar otras) sólo ocurre al
  // NAVEGAR a otra página, igual que con sub-ramas.
  const expandidas = senal(new Set());
  // Limpia entrada vieja del localStorage si existe (de versiones anteriores
  // donde guardábamos un solo string)
  try { almacenamientoLocal.guardar(CLAVE_SECCION, ''); } catch {}

  // Sub-ramas anidadas abiertas — Set efímero (no persistido) porque el
  // accordion auto-expande/colapsa según la ruta actual al cargar la página.
  // Persistir causaba que se acumularan TODAS las ramas visitadas.
  const subAbiertas = senal(new Set());
  // Limpia entrada vieja del localStorage si existe (de versiones anteriores)
  try { almacenamientoLocal.guardar(CLAVE_SUBABIERTAS, []); } catch {}

  // Toggle simple: abrir o cerrar SÓLO esta rama, sin tocar las hermanas.
  // El accordion (auto-colapso de hermanas) sólo ocurre al NAVEGAR a otra
  // página — exploración manual es libre, puedes tener varias abiertas.
  const alternarSub = (id) => {
    const s = new Set(subAbiertas.value);
    s.has(id) ? s.delete(id) : s.add(id);
    subAbiertas.value = s;
  };

  // Auto-expande la sección + ramas que contienen la ruta actual.
  // ACCORDION: solo las sub-ramas que son ANCESTRO de la ruta actual quedan
  // abiertas. Las sub-ramas hermanas que no contienen la ruta se colapsan.
  // El usuario aún puede abrir manualmente cualquier sub-rama vía click —
  // pero al navegar, el sidebar vuelve a la vista mínima necesaria.
  // IMPORTANTE: usamos .peek() en las senales que MODIFICAMOS aquí para no
  // entrar en bucle infinito.
  efecto(() => {
    const actual = ruta.value?.path;
    if (!actual) return;
    for (const s of SECCIONES) {
      if (!s.items) continue;
      const r = idsAncestrosDePath(s.items, actual);
      if (r.found) {
        // Sección que contiene el activo: ÚNICA abierta (accordion al navegar)
        const expActual = expandidas.peek();
        const expIguales = expActual.size === 1 && expActual.has(s.id);
        if (!expIguales) expandidas.value = new Set([s.id]);
        // Sub-ramas: igual, sólo los ancestros del activo quedan abiertos
        const subActual = subAbiertas.peek();
        const subNuevo = new Set(r.ids);
        const subIguales = subActual.size === subNuevo.size
          && [...subNuevo].every((id) => subActual.has(id));
        if (!subIguales) subAbiertas.value = subNuevo;
        return;
      }
    }
  });

  /** Renderiza un item (hoja o rama) — recursivo para sub-niveles.
   *  `idsConActivo` = Set de IDs de sub-ramas que contienen la ruta activa.
   *  Estas ramas reciben `data-tiene-activo="true"` para pintarse en primary
   *  aunque estén COLAPSADAS (así el usuario sabe dónde vive lo que tiene activo).
   */
  const renderItem = (item, nivel = 1, idsConActivo = new Set()) => {
    if (item.items) {
      const abierta = subAbiertas.value.has(item.id);
      const tieneActivo = idsConActivo.has(item.id);
      const etiqueta = t(item.etiqueta) || item.etiqueta;
      const btn = crearEl('button', {
        type: 'button',
        class: 'sidebar__sub-toggle',
        'aria-expanded': String(abierta),
        'data-nivel': String(nivel),
        onClick: () => alternarSub(item.id),
      }, [
        crearEl('span', { class: 'sidebar__link-bullet', 'aria-hidden': 'true' }),
        crearEl('span', { class: 'sidebar__link-text' }, [etiqueta]),
        item.nuevo && crearEl('span', { class: 'sidebar__badge' }, ['Nuevo']),
        crearEl('span', { class: 'sidebar__sub-caret', 'aria-hidden': 'true' }, [
          Icono('chevron_r', { tamano: 11 }),
        ]),
      ]);
      const childList = crearEl('ul', {
        class: 'sidebar__items sidebar__items--nested',
        'data-nivel': String(nivel),
      }, item.items.map((c) => renderItem(c, nivel + 1, idsConActivo)));
      return crearEl('li', {
        class: 'sidebar__sub',
        'data-open': String(abierta),
        'data-tiene-activo': String(tieneActivo),
      }, [btn, childList]);
    }

    const path = RUTAS[item.ruta] || `#/${item.ruta || 'sin-ruta'}`;
    const activo = ruta.value?.path === path;
    return crearEl('li', null, [
      crearEl('a', {
        href: path,
        class: 'sidebar__link',
        'data-nivel': String(nivel),
        'aria-current': activo ? 'page' : null,
        onClick: irA(path),
      }, [
        crearEl('span', { class: 'sidebar__link-bullet', 'aria-hidden': 'true' }),
        crearEl('span', { class: 'sidebar__link-text' }, [t(item.etiqueta) || item.etiqueta]),
        item.nuevo && crearEl('span', { class: 'sidebar__badge' }, ['Nuevo']),
      ]),
    ]);
  };

  const renderSeccion = (s) => {
    if (s.grupo) return crearEl('div', { class: 'sidebar__group' }, [t(s.grupo) || s.grupo]);

    const etiqueta = t(s.etiqueta) || s.etiqueta;

    // Sección top-level con ruta directa (sin submenu) — render como link clickeable
    // que navega directo, manteniendo el icono y el estilo de header de sección.
    if (s.ruta && !s.items) {
      const path = RUTAS[s.ruta] || `#/${s.ruta}`;
      const activo = ruta.value?.path === path;
      return crearEl('div', {
        class: 'sidebar__section sidebar__section--directa',
        'data-tiene-activo': String(activo),
      }, [
        crearEl('a', {
          href: path,
          class: 'sidebar__section-toggle sidebar__section-toggle--link',
          'aria-current': activo ? 'page' : null,
          'data-tooltip': etiqueta,
          'data-tooltip-when': '.sidebar[data-collapsed="true"]',
          onClick: irA(path),
        }, [
          crearEl('span', { class: 'sidebar__section-icon', 'aria-hidden': 'true' }, [
            Icono(s.icono || 'panel', { tamano: 18 }),
          ]),
          crearEl('span', { class: 'sidebar__section-label' }, [etiqueta]),
          s.nuevo && crearEl('span', { class: 'sidebar__badge' }, ['Nuevo']),
        ]),
      ]);
    }

    const abierta = expandidas.value.has(s.id);

    // Calcular si la sección y/o sus sub-ramas contienen la ruta actual
    const path = ruta.value?.path;
    const r = path && s.items ? idsAncestrosDePath(s.items, path) : { found: false, ids: [] };
    const seccionTieneActivo = r.found;
    const idsConActivo = new Set(r.ids);

    const btnToggle = crearEl('button', {
      type: 'button',
      class: 'sidebar__section-toggle',
      'aria-expanded': String(abierta),
      'data-tooltip': etiqueta,
      'data-tooltip-when': '.sidebar[data-collapsed="true"]',
      onClick: () => {
        const colapsado = document.querySelector('.sidebar')?.dataset.collapsed === 'true';
        if (colapsado) {
          // Modo colapsado: popover portaleado con el subárbol completo
          abrirPopoverSeccion(btnToggle, etiqueta, s.items);
        } else {
          // Toggle simple — añade/quita ESTA sección sin tocar las otras.
          // El accordion al navegar reduce a una sola; al explorar libre.
          const next = new Set(expandidas.value);
          next.has(s.id) ? next.delete(s.id) : next.add(s.id);
          expandidas.value = next;
        }
      },
    }, [
      crearEl('span', { class: 'sidebar__section-icon', 'aria-hidden': 'true' }, [
        Icono(s.icono || 'panel', { tamano: 18 }),
      ]),
      crearEl('span', { class: 'sidebar__section-label' }, [etiqueta]),
      s.nuevo && crearEl('span', { class: 'sidebar__badge' }, ['Nuevo']),
      crearEl('span', { class: 'sidebar__section-caret', 'aria-hidden': 'true' }, [
        Icono('chevron_r', { tamano: 12 }),
      ]),
    ]);

    return crearEl('div', {
      class: 'sidebar__section',
      'data-open': String(abierta),
      'data-tiene-activo': String(seccionTieneActivo),
    }, [
      btnToggle,
      crearEl('ul', { class: 'sidebar__items' }, [
        crearEl('li', { class: 'sidebar__items-header', 'aria-hidden': 'true' }, [etiqueta]),
        ...s.items.map((it) => renderItem(it, 1, idsConActivo)),
      ]),
    ]);
  };

  const navHost = crearEl('nav', { class: 'sidebar__nav scroll-discreto', 'aria-label': 'Navegación principal' });

  // ============ EFECTO 1: re-render — SOLO preserva scroll, no fuerza nada
  // Cualquier cambio de estado (toggle manual, ruta, etc.) re-renderiza el
  // nav. Aquí solo guardamos y restauramos el scroll para que la posición
  // actual del usuario nunca se pierda al re-renderizar.
  let scrollGuardado = 0;
  let scrollCapturado = false;
  efecto(() => {
    if (!scrollCapturado) {
      scrollGuardado = navHost.scrollTop;
      scrollCapturado = true;
      queueMicrotask(() => { scrollCapturado = false; });
    }
    navHost.replaceChildren(...SECCIONES.map(renderSeccion));
    requestAnimationFrame(() => { navHost.scrollTop = scrollGuardado; });
  });

  // ============ EFECTO 2: scroll-into-view del activo SOLO al cambiar la ruta
  // (montaje inicial, navegación, recarga). Si el usuario solo está
  // explorando (toggling ramas, scrolleando), este efecto NO se dispara.
  // Trackeamos la última ruta vista — si es la misma, no hacemos nada.
  let ultimaRutaVista = null;
  efecto(() => {
    const path = ruta.value?.path;
    if (!path || path === ultimaRutaVista) return;
    ultimaRutaVista = path;
    // Esperamos al next paint para que el activo esté ya en el DOM
    requestAnimationFrame(() => {
      const activo = navHost.querySelector('[aria-current="page"]');
      if (!activo) return;
      const navRect = navHost.getBoundingClientRect();
      const actRect = activo.getBoundingClientRect();
      const fueraArriba = actRect.top    < navRect.top    + 8;
      const fueraAbajo  = actRect.bottom > navRect.bottom - 8;
      if (fueraArriba || fueraAbajo) {
        activo.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    });
  });

  // ---- Footer: avatar usuario con menú (estilo Vercel/Linear) ----
  const usuario = estadoAuth.usuario.peek();
  const nombreUsuario = usuario?.nombre || usuario?.name || 'Invitado';
  const emailUsuario = usuario?.email || `${CONFIG_APP.nombre} · v${CONFIG_APP.version}`;

  const btnUsuario = crearEl('button', {
    type: 'button',
    class: 'sidebar__user',
    'aria-label': 'Cuenta',
    'data-tooltip': nombreUsuario,
    'data-tooltip-when': '.sidebar[data-collapsed="true"]',
  }, [
    Avatar({ nombre: nombreUsuario, tamano: 'sm' }),
    crearEl('div', { class: 'sidebar__user-text' }, [
      crearEl('strong', null, [nombreUsuario]),
      crearEl('span', null, [emailUsuario]),
    ]),
    crearEl('span', { class: 'sidebar__user-caret', 'aria-hidden': 'true' }, [
      Icono('chevron_v', { tamano: 14 }),
    ]),
  ]);

  const usuarioConMenu = MenuDesplegable({
    disparador: btnUsuario,
    direccion: 'right',
    alineacion: 'end',
    items: [
      { separador: true },
      { etiqueta: t('nav.profile') || 'Perfil',         icono: Icono('perfil',       { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.PERFIL]) },
      { etiqueta: t('nav.security') || 'Seguridad',     icono: Icono('seguridad',    { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.SEGURIDAD]) },
      { etiqueta: t('nav.preferences') || 'Preferencias', icono: Icono('preferencias', { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.PREFERENCIAS]) },
      { separador: true },
      { etiqueta: t('auth.lock_screen') || 'Bloquear', icono: Icono('candado', { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.BLOQUEO]) },
      { etiqueta: t('actions.logout') || 'Cerrar sesión', icono: Icono('cerrar_sesion', { tamano: 16 }), peligro: true,
        alSeleccionar: async () => {
          await cerrarSesion();
          navegarA(RUTAS[N.INGRESAR]);
        } },
    ],
  });

  // ---- Brand: dropdown estilo "Teams" (workspace switcher) ----
  const btnBrand = crearEl('button', {
    type: 'button',
    class: 'sidebar__brand',
    'aria-label': CONFIG_APP.nombre,
    'data-tooltip': CONFIG_APP.nombre,
    'data-tooltip-when': '.sidebar[data-collapsed="true"]',
  }, [
    crearEl('span', { class: 'sidebar__brand-mark', 'aria-hidden': 'true' }, ['L']),
    crearEl('span', { class: 'sidebar__brand-text' }, [CONFIG_APP.nombre]),
    crearEl('span', { class: 'sidebar__brand-caret', 'aria-hidden': 'true' }, [
      Icono('chevron_v', { tamano: 14 }),
    ]),
  ]);

  const brandConMenu = MenuDesplegable({
    disparador: btnBrand,
    direccion: 'right',
    alineacion: 'start',
    items: [
      { grupo: 'Workspaces' },
      { etiqueta: CONFIG_APP.nombre,        icono: Icono('panel',  { tamano: 16 }), alSeleccionar: () => navegarA(RUTAS[N.PANEL]) },
      { etiqueta: 'Acme Inc',               icono: Icono('grupos', { tamano: 16 }), alSeleccionar: () => {} },
      { etiqueta: 'Acme Corp.',             icono: Icono('grupos', { tamano: 16 }), alSeleccionar: () => {} },
      { separador: true },
      { etiqueta: 'Añadir workspace',       icono: Icono('mas',    { tamano: 16 }), alSeleccionar: () => {} },
    ],
  });

  const lateral = crearEl('aside', {
    class: 'sidebar',
    'data-collapsed': String(!estadoUi.barraFijada.peek()),
    'data-open': String(estadoUi.barraAbierta.peek()),
    'aria-label': 'Navegación principal',
  }, [
    brandConMenu,
    navHost,
    crearEl('div', { class: 'sidebar__footer' }, [usuarioConMenu]),
  ]);

  estadoUi.barraAbierta.subscribe(v => lateral.setAttribute('data-open', String(v)));
  estadoUi.barraFijada.subscribe(v => {
    lateral.setAttribute('data-collapsed', String(!v));
    cerrarPopoverSeccion();
  });

  // ---- Backdrop móvil — vive en #app (no en body) porque #app tiene
  // `isolation: isolate` y el sidebar necesita estar en el mismo stacking
  // context que el backdrop para que su z-index lo supere.
  const backdrop = crearEl('div', {
    class: 'sidebar-backdrop',
    'aria-hidden': 'true',
    onClick: () => { estadoUi.barraAbierta.value = false; },
  });
  const sincronizarBackdrop = () => {
    const enMovil = matchMedia('(max-width: 1023.98px)').matches;
    if (enMovil && estadoUi.barraAbierta.peek()) {
      const host = document.getElementById('app') || document.body;
      if (!backdrop.isConnected) host.appendChild(backdrop);
    } else {
      backdrop.remove();
    }
  };
  estadoUi.barraAbierta.subscribe(sincronizarBackdrop);
  matchMedia('(max-width: 1023.98px)').addEventListener('change', sincronizarBackdrop);
  sincronizarBackdrop();

  // En móvil, navegar cierra el drawer.
  lateral.addEventListener('click', (e) => {
    const link = e.target.closest('a.sidebar__link');
    if (!link) return;
    if (matchMedia('(max-width: 1023.98px)').matches) {
      estadoUi.barraAbierta.value = false;
    }
  });

  return lateral;
};
