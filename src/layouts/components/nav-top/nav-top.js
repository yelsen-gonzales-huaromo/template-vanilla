/**
 * Barra de navegación HORIZONTAL — usada cuando estadoUi.posicionNav = 'top' o 'combo'.
 *
 * Comparte el mismo árbol de SECCIONES que el sidebar pero lo renderiza como
 * mega-menus desplegables al hacer hover/click sobre cada disparador.
 */
import { crearEl, alClickFuera } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { usarRuta, navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';
import { t } from '../../../i18n/index.js';

const N = NOMBRES_RUTAS;

// Top nav usa GRUPOS de sub-secciones (más compacto que el sidebar).
// Cada grupo es un dropdown; sus items son las rutas relevantes.
const GRUPOS = [
  {
    id: 'paneles', etiqueta: 'nav.dashboards', icono: 'panel',
    items: [
      { ruta: N.PANEL,            etiqueta: 'nav.dashboard',  icono: 'panel' },
      { ruta: N.PANEL_ANALITICA,  etiqueta: 'nav.analytics',  icono: 'analitica' },
      { ruta: N.PANEL_CRM,        etiqueta: 'nav.crm',        icono: 'crm' },
      { ruta: N.PANEL_COMERCIO,   etiqueta: 'nav.ecommerce',  icono: 'comercio' },
      { ruta: N.PANEL_LMS,        etiqueta: 'nav.lms',        icono: 'lms', nuevo: true },
      { ruta: N.PANEL_PROYECTOS,  etiqueta: 'nav.projects',   icono: 'proyectos' },
      { ruta: N.PANEL_SAAS,       etiqueta: 'nav.saas',       icono: 'saas' },
      { ruta: N.PANEL_SOPORTE,    etiqueta: 'nav.support',    icono: 'soporte', nuevo: true },
    ],
  },
  {
    id: 'apps', etiqueta: 'nav.apps', icono: 'rejilla9',
    items: [
      { ruta: N.CHAT,              etiqueta: 'nav.chat',      icono: 'chat' },
      { ruta: N.KANBAN,            etiqueta: 'nav.kanban',    icono: 'kanban' },
    ],
  },
  {
    id: 'paginas', etiqueta: 'nav.pages', icono: 'pagina',
    items: [
      { ruta: N.INGRESAR,          etiqueta: 'Iniciar sesión',   icono: 'candado' },
      { ruta: N.REGISTRAR,         etiqueta: 'Registro',          icono: 'perfil' },
    ],
  },
  {
    id: 'modulos', etiqueta: 'nav.modules', icono: 'componentes',
    items: [
      { ruta: N.MOD_GRAFICOS,    etiqueta: 'nav.charts',     icono: 'graficos' },
      { ruta: N.MOD_FORMULARIOS, etiqueta: 'nav.forms',      icono: 'formularios' },
      { ruta: N.MOD_TABLAS,      etiqueta: 'nav.tables',     icono: 'tablas' },
      { ruta: N.MOD_ICONOS,      etiqueta: 'nav.icons',      icono: 'iconos' },
      { ruta: N.MOD_MAPAS,       etiqueta: 'nav.maps',       icono: 'mapas' },
      { ruta: N.MOD_UTILIDADES,  etiqueta: 'nav.utilities',  icono: 'utilidades' },
      { ruta: N.MOD_COMPONENTES, etiqueta: 'nav.components', icono: 'componentes' },
    ],
  },
  {
    id: 'config', etiqueta: 'nav.settings', icono: 'preferencias',
    items: [
      { ruta: N.PERFIL,        etiqueta: 'nav.profile',     icono: 'perfil' },
      { ruta: N.SEGURIDAD,     etiqueta: 'nav.security',    icono: 'seguridad' },
      { ruta: N.PREFERENCIAS,  etiqueta: 'nav.preferences', icono: 'preferencias' },
      { ruta: N.REPORTES,      etiqueta: 'nav.reports',     icono: 'reportes' },
    ],
  },
];

const irA = (ruta) => (e) => { e.preventDefault(); navegarA(ruta); };

export const BarraNavSuperior = () => {
  const ruta = usarRuta();
  const grupoAbierto = senal(null);

  // Cierra al hacer click fuera
  let limpiezaFuera = null;

  const cerrar = () => { grupoAbierto.value = null; };

  const renderItem = (item) => {
    const path = RUTAS[item.ruta];
    const activo = ruta.value?.path === path;
    return crearEl('a', {
      href: path,
      class: 'nav-top__link',
      'aria-current': activo ? 'page' : null,
      onClick: (e) => { irA(path)(e); cerrar(); },
    }, [
      crearEl('span', { class: 'nav-top__link-icon' }, [Icono(item.icono, { tamano: 16 })]),
      crearEl('span', null, [t(item.etiqueta) || item.etiqueta]),
      item.nuevo && crearEl('span', { class: 'nav-top__badge' }, ['Nuevo']),
    ]);
  };

  const renderGrupo = (g) => {
    const grupoActivo = g.items.some(i => RUTAS[i.ruta] === ruta.value?.path);
    const trigger = crearEl('button', {
      type: 'button',
      class: 'nav-top__trigger',
      'aria-expanded': grupoAbierto.value === g.id ? 'true' : 'false',
      'aria-haspopup': 'true',
      'data-active': grupoActivo ? 'true' : 'false',
      onClick: (e) => {
        e.stopPropagation();
        grupoAbierto.value = grupoAbierto.value === g.id ? null : g.id;
      },
    }, [
      Icono(g.icono, { tamano: 16 }),
      crearEl('span', null, [t(g.etiqueta) || g.etiqueta]),
      crearEl('span', { class: 'nav-top__caret', 'aria-hidden': 'true' }, [
        Icono('chevron_d', { tamano: 12 }),
      ]),
    ]);

    const contenedor = crearEl('div', { class: 'nav-top__group' }, [trigger]);

    efecto(() => {
      // Limpia mega anterior
      const existente = contenedor.querySelector('.nav-top__mega');
      if (existente) existente.remove();
      if (grupoAbierto.value === g.id) {
        const mega = crearEl('div', {
          class: ['nav-top__mega', g.items.length <= 5 && 'nav-top__mega--single'],
          role: 'menu',
        }, g.items.map(renderItem));
        contenedor.appendChild(mega);

        limpiezaFuera?.();
        limpiezaFuera = alClickFuera(contenedor, cerrar);
      }
    });

    return contenedor;
  };

  return crearEl('nav', { class: 'nav-top', role: 'navigation', 'aria-label': 'Navegación principal' },
    GRUPOS.map(renderGrupo),
  );
};
