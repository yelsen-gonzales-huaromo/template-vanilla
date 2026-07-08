/**
 * Panel del lanzador de aplicaciones (icono "rejilla9" del navbar).
 *
 * Referencia visual: Falcon — grid 3 columnas, iconos grandes redondeados con
 * color de marca por app, nombre debajo, footer con selector + acciones.
 *
 * Las apps internas (productos del propio template-vanilla) navegan por el router.
 * Las apps externas abren en una nueva pestaña.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { cerrarMenuActivo } from '../../../components/ui/dropdown/dropdown.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';

const N = NOMBRES_RUTAS;

// Catálogo de apps mostradas en el launcher. Mezcla apps internas + externas.
const APPS = [
  { id: 'cuenta',     etiqueta: 'Cuenta',      tipo: 'interna', ruta: N.PERFIL,        icono: 'perfil',     gradiente: 'linear-gradient(135deg,#f472b6,#ec4899)' },
  { id: 'analitica',  etiqueta: 'Analítica',   tipo: 'interna', ruta: N.PANEL_ANALITICA, icono: 'analitica', gradiente: 'linear-gradient(135deg,#34d399,#10b981)' },
  { id: 'chat',       etiqueta: 'Chat',        tipo: 'interna', ruta: N.CHAT,          icono: 'chat',       gradiente: 'linear-gradient(135deg,#a78bfa,#8b5cf6)' },
  { id: 'kanban',     etiqueta: 'Kanban',      tipo: 'interna', ruta: N.KANBAN,        icono: 'kanban',     gradiente: 'linear-gradient(135deg,#22d3ee,#0ea5e9)' },
];

const FAVORITOS_INICIAL = ['cuenta', 'analitica', 'chat', 'kanban'];

// Búsqueda de apps por término — reactivo. Permite filtrar el catálogo.
const filtro = senal('');

const renderItem = (app) => {
  const onClick = (e) => {
    e.preventDefault();
    cerrarMenuActivo();
    if (app.tipo === 'interna') navegarA(RUTAS[app.ruta]);
    else if (app.url) window.open(app.url, '_blank', 'noopener');
  };
  return crearEl('a', {
    class: 'apps-launcher__item',
    href: app.tipo === 'interna' ? RUTAS[app.ruta] : (app.url || '#'),
    onClick,
  }, [
    crearEl('span', {
      class: 'apps-launcher__icon',
      style: { background: app.gradiente },
      'aria-hidden': 'true',
    }, [Icono(app.icono, { tamano: 22 })]),
    crearEl('span', { class: 'apps-launcher__nombre' }, [app.etiqueta]),
  ]);
};

export const PanelAplicaciones = () => {
  const grid = crearEl('div', { class: 'apps-launcher__grid' });

  efecto(() => {
    const q = filtro.value.trim().toLowerCase();
    const visibles = q
      ? APPS.filter((a) => a.etiqueta.toLowerCase().includes(q))
      : APPS;

    if (!visibles.length) {
      grid.replaceChildren(crearEl('div', { class: 'apps-launcher__vacio' }, [
        Icono('busqueda', { tamano: 22 }),
        crearEl('p', null, ['Sin coincidencias']),
      ]));
      return;
    }
    grid.replaceChildren(...visibles.map(renderItem));
  });

  // Cabecera: input de búsqueda compacto
  const buscador = crearEl('input', {
    type: 'search',
    class: 'apps-launcher__buscador',
    placeholder: 'Buscar apps…',
    'aria-label': 'Buscar aplicaciones',
    onInput: (e) => { filtro.value = e.currentTarget.value; },
  });

  // Pie: selector + acciones (replicando el footer de Falcon).
  const pie = crearEl('div', { class: 'apps-launcher__pie' }, [
    crearEl('button', { type: 'button', class: 'apps-launcher__pie-btn' }, [
      crearEl('span', null, ['Categorías']),
      Icono('chevron_d', { tamano: 12 }),
    ]),
    crearEl('button', {
      type: 'button',
      class: 'apps-launcher__pie-icon',
      'aria-label': 'Más opciones',
    }, [Icono('mas', { tamano: 14 })]),
  ]);

  return crearEl('div', { class: 'apps-launcher' }, [
    crearEl('div', { class: 'apps-launcher__cabecera' }, [
      crearEl('h3', { class: 'apps-launcher__titulo' }, ['Aplicaciones']),
      buscador,
    ]),
    crearEl('div', { class: 'apps-launcher__cuerpo scroll-discreto' }, [grid]),
    pie,
  ]);
};
