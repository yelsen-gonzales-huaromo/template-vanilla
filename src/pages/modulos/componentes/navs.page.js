import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Pestanas } from '../../../components/ui/tabs/tabs.js';
import { ListaGrupo } from '../../../components/ui/list-group/list-group.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner5 } from '../../../components/ui/card/card-decoraciones.js';

const lorem = (txt) => crearEl('p', {
  style: { margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' },
}, [txt]);

// ============================================================================
//  Helpers de patrones de nav
// ============================================================================
const filterGroup = (opciones, inicial) => {
  const activo = senal(inicial || opciones[0].id);
  const grupo = crearEl('div', { class: 'mock-filter-group' });
  const refrescar = () => grupo.replaceChildren(...opciones.map((o) => crearEl('button', {
    type: 'button', class: 'mock-filter-group__pill',
    'data-activo': String(o.id === activo.value),
    onClick: () => { activo.value = o.id; refrescar(); },
  }, [o.etiqueta])));
  refrescar();
  return grupo;
};

const breadcrumbsNav = (items) => crearEl('nav', {
  style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: 'var(--text-sm)' },
}, items.map((it, i) => crearEl('span', {
  style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
}, [
  i > 0 && crearEl('span', { style: { color: 'var(--muted-foreground)', opacity: 0.5 } }, ['/']),
  crearEl('a', {
    href: '#',
    style: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      color: it.activo ? 'var(--foreground)' : 'var(--muted-foreground)',
      fontWeight: it.activo ? 600 : 500,
      padding: '4px 8px', borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
    },
  }, [
    it.icono && Icono(it.icono, { tamano: 14 }),
    crearEl('span', null, [it.etiqueta]),
  ]),
])));

const checkoutSteps = (pasos, actual) => {
  const nodos = [];
  for (let i = 0; i < pasos.length; i++) {
    nodos.push(crearEl('div', {
      class: 'mock-checkout-steps__paso',
      'data-activo':     String(i + 1 === actual),
      'data-completado': String(i + 1 < actual),
    }, [
      crearEl('span', { class: 'mock-checkout-steps__num' },
        [i + 1 < actual ? '✓' : String(i + 1)]),
      crearEl('span', { class: 'mock-checkout-steps__label' }, [pasos[i]]),
    ]));
    if (i < pasos.length - 1) nodos.push(crearEl('div', {
      class: 'mock-checkout-steps__linea',
      'data-completada': String(i + 1 < actual),
    }));
  }
  return crearEl('div', { class: 'mock-checkout-steps' }, nodos);
};

const tabBarMovil = (items, activoId) => crearEl('div', { class: 'mock-tabbar' },
  items.map((it) => crearEl('button', {
    type: 'button', class: 'mock-tabbar__item',
    'data-activo': String(it.id === activoId),
  }, [
    Icono(it.icono, { tamano: 22 }),
    crearEl('span', null, [it.etiqueta]),
  ])),
);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Navs',
  descripcion: 'Patrones de navegación contextual — para moverse dentro de una página o sección. Pestañas, listas verticales, breadcrumbs, filter pills, segmented controls, tab bar móvil y steppers de checkout. Cada uno tiene su lugar según la cantidad de items y el flujo del usuario.',
  decoracion: corner5(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: 'Pestañas horizontales',
      descripcion: 'Para 2-6 secciones de contenido relacionado. El componente `Pestanas` cubre 5 variantes visuales — ver la página de Pestañas para todas.',
      hijos: [VistaCodigo({
        vista: Pestanas({ items: [
          { id: 'a', etiqueta: 'Inicio',   contenido: lorem('Panel principal del usuario.') },
          { id: 'b', etiqueta: 'Perfil',   contenido: lorem('Información personal y avatar.') },
          { id: 'c', etiqueta: 'Mensajes', contenido: lorem('Bandeja de mensajes.') },
        ]}),
        codigo: `Pestanas({ items: [
  { id, etiqueta, contenido, icono?, badge?, deshabilitado? },
  ...
] })`,
      })],
    }),

    Seccion({
      titulo: 'Lista vertical (sidebar)',
      descripcion: 'Para 5+ items o navegación principal de un módulo. `ListaGrupo` con `activo: true` resalta el item actual.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { maxWidth: '280px' } }, [
          ListaGrupo({ items: [
            { contenido: 'Inicio',         activo: true, alClick: () => {} },
            { contenido: 'Perfil',                       alClick: () => {} },
            { contenido: 'Mensajes',                     alClick: () => {} },
            { contenido: 'Configuración',                alClick: () => {} },
            { contenido: 'Facturación',                  alClick: () => {} },
            { contenido: 'Equipo',                       alClick: () => {} },
          ]}),
        ]),
        codigo: `ListaGrupo({ items: [
  { contenido: 'Inicio',  activo: true, alClick: () => {} },
  { contenido: 'Perfil',                alClick: () => {} },
  // ...
]})`,
      })],
    }),

    Seccion({
      titulo: 'Breadcrumbs',
      descripcion: 'Para mostrar la jerarquía actual y permitir saltar a niveles superiores. Patrón clásico de e-commerce y dashboards profundos.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          breadcrumbsNav([
            { etiqueta: 'Inicio',     icono: 'panel' },
            { etiqueta: 'Proyectos',  icono: 'proyectos' },
            { etiqueta: 'template-vanilla Web' },
            { etiqueta: 'Configuración', activo: true },
          ]),
          breadcrumbsNav([
            { etiqueta: 'Tienda',           icono: 'comercio' },
            { etiqueta: 'Hombre' },
            { etiqueta: 'Calzado' },
            { etiqueta: 'Sneakers Air Run', activo: true },
          ]),
        ]),
        codigo: `breadcrumbsNav([
  { etiqueta: 'Inicio',    icono: 'panel' },
  { etiqueta: 'Proyectos', icono: 'proyectos' },
  { etiqueta: 'template-vanilla Web' },
  { etiqueta: 'Configuración', activo: true },
])`,
      })],
    }),

    Seccion({
      titulo: 'Filter pills (segmented)',
      descripcion: 'Grupo de pills horizontal para filtrar listados — "Todos / Activos / Archivados". Sin paneles asociados, sólo filtra lo que está visible. Patrón usado por Linear, Notion, GitHub Issues.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'flex-start' } }, [
          filterGroup([
            { id: 'all',     etiqueta: 'Todos' },
            { id: 'active',  etiqueta: 'Activos' },
            { id: 'arch',    etiqueta: 'Archivados' },
            { id: 'trash',   etiqueta: 'Papelera' },
          ], 'active'),
          filterGroup([
            { id: 'd', etiqueta: '1D' },
            { id: 'w', etiqueta: '7D' },
            { id: 'm', etiqueta: '30D' },
            { id: 'q', etiqueta: '90D' },
            { id: 'y', etiqueta: '1Y' },
            { id: 'a', etiqueta: 'Todo' },
          ], 'm'),
        ]),
        codigo: `filterGroup([
  { id: 'all',    etiqueta: 'Todos' },
  { id: 'active', etiqueta: 'Activos' },
  { id: 'arch',   etiqueta: 'Archivados' },
], 'active')`,
      })],
    }),

    Seccion({
      titulo: 'Stepper de checkout',
      descripcion: 'Para flujos lineales de varios pasos — registro, checkout, onboarding. Muestra qué paso está activo, cuáles ya completaste (✓), cuáles faltan.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
          checkoutSteps(['Carrito', 'Envío', 'Pago', 'Confirmación'], 2),
          checkoutSteps(['Cuenta', 'Equipo', 'Plan', 'Confirmación'], 3),
        ]),
        codigo: `checkoutSteps(['Carrito', 'Envío', 'Pago', 'Confirmación'], 2)
// ↑ paso 2 (Envío) está activo, "Carrito" completado.
// Visual: ✓ Carrito ──── ② Envío ──── 3 Pago ──── 4 Confirmación`,
      })],
    }),

    Seccion({
      titulo: 'Tab bar móvil (bottom navigation)',
      descripcion: 'Patrón estándar de apps móviles iOS/Android — barra fija inferior con 4-5 destinos principales. En diseños responsivos, reemplaza al sidebar en pantallas pequeñas.',
      hijos: [VistaCodigo({
        vista: crearEl('div', { class: 'mock-mobile-frame' }, [
          crearEl('div', { class: 'mock-mobile-frame__notch' }),
          crearEl('div', { class: 'mock-mobile-frame__pantalla' }, [
            crearEl('div', { class: 'mock-content', style: { flex: 1, padding: 'var(--space-4)' } }, [
              crearEl('div', { class: 'mock-skel mock-skel--titulo' }),
              crearEl('div', { class: 'mock-skel mock-skel--texto' }),
              crearEl('div', { class: 'mock-skel mock-skel--texto', style: { width: '70%' } }),
              crearEl('div', { class: 'mock-skel mock-skel--card', style: { marginBlockStart: 'var(--space-3)' } }),
              crearEl('div', { class: 'mock-skel mock-skel--card' }),
            ]),
            tabBarMovil([
              { id: 'h', icono: 'panel',     etiqueta: 'Inicio' },
              { id: 's', icono: 'busqueda',  etiqueta: 'Buscar' },
              { id: 'n', icono: 'campana',   etiqueta: 'Avisos' },
              { id: 'p', icono: 'perfil',    etiqueta: 'Perfil' },
            ], 'h'),
          ]),
        ]),
        codigo: `crearEl('div', { class: 'mock-tabbar' }, items.map(it => crearEl('button', {
  class: 'mock-tabbar__item',
  'data-activo': String(it.id === activoId),
}, [
  Icono(it.icono, { tamano: 22 }),
  crearEl('span', null, [it.etiqueta]),
])))`,
      })],
    }),

    Seccion({
      titulo: 'Segmented control (iOS)',
      descripcion: 'Variante `segmented` de Pestañas — usa cuando quieres alternar entre vistas mutuamente excluyentes (Día / Semana / Mes, Lista / Grid, Activos / Inactivos).',
      hijos: [VistaCodigo({
        vista: Pestanas({ variante: 'segmented', items: [
          { id: 'l', etiqueta: 'Lista',     contenido: lorem('Vista en lista vertical compacta.') },
          { id: 'g', etiqueta: 'Grid',      contenido: lorem('Vista en grid 3 columnas.') },
          { id: 'k', etiqueta: 'Kanban',    contenido: lorem('Vista en columnas tipo Kanban.') },
          { id: 't', etiqueta: 'Timeline',  contenido: lorem('Vista cronológica vertical.') },
        ]}),
        codigo: `Pestanas({
  variante: 'segmented',
  items: [
    { id: 'l', etiqueta: 'Lista',    contenido: nodo },
    { id: 'g', etiqueta: 'Grid',     contenido: nodo },
    { id: 'k', etiqueta: 'Kanban',   contenido: nodo },
  ],
})`,
      })],
    }),

  ],
});
