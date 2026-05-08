/**
 * Ilustraciones SVG para los intro cards de las páginas de componentes.
 *
 * Cada ilustración es un mini-mockup que previsualiza visualmente el
 * componente. Animaciones sutiles vía CSS (definidas en illustrations.css)
 * mediante clases — no usan librerías externas.
 *
 * Uso: `PaginaShowcase({ ilustracion: ilustracionAcordeon() })`
 */

// Helper interno — SVG namespaced.
const svg = (atributos = {}, hijos = []) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  hijos.forEach((h) => h && el.appendChild(h));
  return el;
};
const ns = (tag, atributos = {}, hijos = []) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  hijos.forEach((h) => h && el.appendChild(h));
  return el;
};

// Paleta — usa los tokens del tema actual (currentColor + var() en CSS).
const COLOR_PRIMARIO   = 'var(--primary)';
const COLOR_ACENTO     = 'var(--color-success)';
const COLOR_ADVERTENCIA= 'var(--color-warning)';
const COLOR_PELIGRO    = 'var(--color-danger)';
const COLOR_INFO       = 'var(--color-info)';
const COLOR_BORDE      = 'var(--border)';
const COLOR_SUPERFICIE = 'var(--surface-elevated)';

// ============================================================================
//  ACORDEÓN — paneles apilados con uno abierto que pulsa
// ============================================================================
export const ilustracionAcordeon = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-acordeon', role: 'img', 'aria-label': 'Acordeón',
}, [
  // Panel cerrado 1
  ns('rect', { x: 16, y: 14, width: 188, height: 24, rx: 6, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('rect', { x: 28, y: 24, width: 60, height: 4, rx: 2, fill: COLOR_BORDE }),
  ns('path', { d: 'M186 22 l6 6 -6 6', stroke: COLOR_BORDE, fill: 'none', 'stroke-width': 2, 'stroke-linecap': 'round' }),
  // Panel abierto (con líneas de contenido) — clase para animación
  ns('rect', { class: 'ilus-acordeon__abierto', x: 16, y: 46, width: 188, height: 70, rx: 6,
    fill: 'color-mix(in srgb, var(--primary) 8%, var(--surface-elevated))', stroke: COLOR_PRIMARIO }),
  ns('rect', { x: 28, y: 56, width: 60, height: 4, rx: 2, fill: COLOR_PRIMARIO }),
  ns('path', { d: 'M186 60 l6 -6 -6 -6 z', fill: COLOR_PRIMARIO, transform: 'translate(0,8) rotate(0)' }),
  ns('rect', { x: 28, y: 72, width: 160, height: 3, rx: 1.5, fill: COLOR_BORDE, opacity: 0.7 }),
  ns('rect', { x: 28, y: 82, width: 130, height: 3, rx: 1.5, fill: COLOR_BORDE, opacity: 0.5 }),
  ns('rect', { x: 28, y: 92, width: 100, height: 3, rx: 1.5, fill: COLOR_BORDE, opacity: 0.4 }),
  // Panel cerrado 2
  ns('rect', { x: 16, y: 124, width: 188, height: 24, rx: 6, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('rect', { x: 28, y: 134, width: 60, height: 4, rx: 2, fill: COLOR_BORDE }),
  ns('path', { d: 'M186 132 l6 6 -6 6', stroke: COLOR_BORDE, fill: 'none', 'stroke-width': 2, 'stroke-linecap': 'round' }),
]);

// ============================================================================
//  ALERTAS — 4 alertas apiladas con sus colores
// ============================================================================
export const ilustracionAlertas = () => {
  const alerta = (y, color, opacidad = 1) => [
    ns('rect', { x: 16, y, width: 188, height: 28, rx: 8,
      fill: `color-mix(in srgb, ${color} 18%, transparent)`,
      stroke: `color-mix(in srgb, ${color} 40%, transparent)`, opacity: opacidad }),
    ns('circle', { cx: 32, cy: y + 14, r: 7, fill: color, opacity: opacidad }),
    ns('rect', { x: 48, y: y + 11, width: 130, height: 6, rx: 3,
      fill: `color-mix(in srgb, ${color} 70%, var(--foreground))`, opacity: opacidad }),
    ns('path', { d: `M192 ${y + 10} l4 4 l-4 4 M192 ${y + 18} l4 -4 l-4 -4`,
      stroke: COLOR_BORDE, fill: 'none', 'stroke-width': 1.4, 'stroke-linecap': 'round', opacity: 0.6 }),
  ];
  return svg({ viewBox: '0 0 220 160', class: 'ilus ilus-alertas', role: 'img', 'aria-label': 'Alertas' }, [
    ...alerta(10,  COLOR_ACENTO),
    ...alerta(46,  COLOR_INFO),
    ...alerta(82,  COLOR_ADVERTENCIA),
    ...alerta(118, COLOR_PELIGRO),
  ]);
};

// ============================================================================
//  BOTONES — varios botones de muestra con hover state
// ============================================================================
export const ilustracionBotones = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-botones', role: 'img', 'aria-label': 'Botones',
}, [
  // Primary
  ns('rect', { class: 'ilus-botones__primary', x: 24, y: 36, width: 76, height: 30, rx: 6, fill: COLOR_PRIMARIO }),
  ns('rect', { x: 38, y: 47, width: 48, height: 8, rx: 2, fill: '#fff', opacity: 0.92 }),
  // Secondary
  ns('rect', { x: 112, y: 36, width: 84, height: 30, rx: 6, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('rect', { x: 130, y: 47, width: 48, height: 8, rx: 2, fill: COLOR_BORDE }),
  // Ghost
  ns('rect', { x: 24, y: 78, width: 60, height: 26, rx: 6, fill: 'transparent', stroke: COLOR_BORDE, 'stroke-dasharray': '3 3' }),
  ns('rect', { x: 36, y: 88, width: 36, height: 6, rx: 2, fill: COLOR_BORDE, opacity: 0.7 }),
  // Danger
  ns('rect', { x: 96, y: 78, width: 64, height: 26, rx: 6, fill: COLOR_PELIGRO }),
  ns('rect', { x: 110, y: 88, width: 36, height: 6, rx: 2, fill: '#fff' }),
  // Icon-only
  ns('rect', { x: 172, y: 78, width: 26, height: 26, rx: 6, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('path', { d: 'M185 84 v14 M178 91 h14', stroke: COLOR_PRIMARIO, 'stroke-width': 2, 'stroke-linecap': 'round' }),
  // Bloque
  ns('rect', { x: 24, y: 116, width: 174, height: 28, rx: 6, fill: COLOR_PRIMARIO, opacity: 0.9 }),
  ns('rect', { x: 96, y: 126, width: 30, height: 8, rx: 2, fill: '#fff' }),
]);

// ============================================================================
//  TARJETAS — pila de cards apiladas con efecto profundidad
// ============================================================================
export const ilustracionTarjetas = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-tarjetas', role: 'img', 'aria-label': 'Tarjetas',
}, [
  // Card de fondo (atrás)
  ns('rect', { class: 'ilus-tarjetas__back', x: 36, y: 24, width: 152, height: 100, rx: 12,
    fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE, opacity: 0.6 }),
  // Card del medio
  ns('rect', { class: 'ilus-tarjetas__mid', x: 28, y: 36, width: 168, height: 102, rx: 12,
    fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE, opacity: 0.85 }),
  // Card de adelante (con contenido)
  ns('rect', { class: 'ilus-tarjetas__front', x: 20, y: 50, width: 184, height: 96, rx: 12,
    fill: COLOR_SUPERFICIE, stroke: COLOR_PRIMARIO, 'stroke-width': 1.5 }),
  // Header del card de adelante
  ns('rect', { x: 32, y: 64, width: 60, height: 6, rx: 3, fill: COLOR_PRIMARIO }),
  ns('rect', { x: 32, y: 78, width: 110, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.6 }),
  // Líneas de contenido
  ns('rect', { x: 32, y: 96, width: 152, height: 3, rx: 1.5, fill: COLOR_BORDE, opacity: 0.5 }),
  ns('rect', { x: 32, y: 106, width: 130, height: 3, rx: 1.5, fill: COLOR_BORDE, opacity: 0.4 }),
  ns('rect', { x: 32, y: 116, width: 90, height: 3, rx: 1.5, fill: COLOR_BORDE, opacity: 0.4 }),
  // Botón inline
  ns('rect', { x: 32, y: 128, width: 44, height: 12, rx: 3, fill: COLOR_PRIMARIO }),
]);

// ============================================================================
//  MODALES — backdrop oscurecido + card centrado
// ============================================================================
export const ilustracionModales = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-modales', role: 'img', 'aria-label': 'Modales',
}, [
  // Página de fondo (difuminada)
  ns('rect', { x: 0, y: 0, width: 220, height: 160, fill: 'var(--surface-muted)', opacity: 0.5 }),
  ns('rect', { x: 12, y: 14, width: 50, height: 6, rx: 2, fill: COLOR_BORDE, opacity: 0.4 }),
  ns('rect', { x: 12, y: 28, width: 30, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.3 }),
  // Backdrop oscuro
  ns('rect', { x: 0, y: 0, width: 220, height: 160, fill: '#000', opacity: 0.42 }),
  // Modal central
  ns('rect', { class: 'ilus-modales__card', x: 36, y: 32, width: 148, height: 96, rx: 12,
    fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  // Header con close
  ns('rect', { x: 48, y: 46, width: 70, height: 7, rx: 3, fill: COLOR_PRIMARIO }),
  ns('path', { d: 'M165 47 l-8 8 M165 55 l-8 -8', stroke: COLOR_BORDE, 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
  // Líneas de cuerpo
  ns('rect', { x: 48, y: 66, width: 124, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.55 }),
  ns('rect', { x: 48, y: 76, width: 100, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.4 }),
  ns('rect', { x: 48, y: 86, width: 80,  height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.4 }),
  // Acciones
  ns('rect', { x: 92,  y: 104, width: 36, height: 14, rx: 3, fill: 'transparent', stroke: COLOR_BORDE }),
  ns('rect', { x: 134, y: 104, width: 38, height: 14, rx: 3, fill: COLOR_PRIMARIO }),
]);

// ============================================================================
//  DROPDOWNS — botón + menú flotante con items
// ============================================================================
export const ilustracionDropdowns = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-dropdowns', role: 'img', 'aria-label': 'Dropdowns',
}, [
  // Botón disparador
  ns('rect', { x: 30, y: 22, width: 86, height: 26, rx: 6, fill: COLOR_PRIMARIO }),
  ns('rect', { x: 42, y: 32, width: 42, height: 6, rx: 2, fill: '#fff' }),
  ns('path', { d: 'M96 32 l6 6 l6 -6', stroke: '#fff', fill: 'none', 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
  // Menú flotante
  ns('rect', { class: 'ilus-dropdowns__menu', x: 30, y: 56, width: 140, height: 92, rx: 8,
    fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  // Items
  ns('rect', { x: 40, y: 68,  width: 80,  height: 5, rx: 2, fill: COLOR_BORDE, opacity: 0.7 }),
  ns('rect', { x: 40, y: 84,  width: 110, height: 5, rx: 2, fill: COLOR_BORDE, opacity: 0.5 }),
  // Separador
  ns('line', { x1: 40, y1: 100, x2: 160, y2: 100, stroke: COLOR_BORDE, opacity: 0.4 }),
  // Item destacado (hover)
  ns('rect', { class: 'ilus-dropdowns__activo', x: 36, y: 108, width: 128, height: 14, rx: 4,
    fill: 'color-mix(in srgb, var(--primary) 18%, transparent)' }),
  ns('rect', { x: 44, y: 113, width: 70, height: 4, rx: 2, fill: COLOR_PRIMARIO }),
  // Item peligro
  ns('rect', { x: 40, y: 130, width: 60, height: 5, rx: 2, fill: COLOR_PELIGRO, opacity: 0.85 }),
]);

// ============================================================================
//  TOASTS — 3 notificaciones apiladas con icono
// ============================================================================
export const ilustracionToasts = () => {
  const toast = (y, color, ancho = 180, x = 24) => [
    ns('rect', { x, y, width: ancho, height: 28, rx: 8, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.15))' }),
    ns('rect', { x: x + 6, y: y + 6, width: 4, height: 16, rx: 2, fill: color }),
    ns('circle', { cx: x + 22, cy: y + 14, r: 6, fill: color }),
    ns('rect', { x: x + 36, y: y + 8, width: 80, height: 4, rx: 2, fill: COLOR_BORDE }),
    ns('rect', { x: x + 36, y: y + 18, width: 56, height: 3, rx: 1.5, fill: COLOR_BORDE, opacity: 0.5 }),
  ];
  return svg({ viewBox: '0 0 220 160', class: 'ilus ilus-toasts', role: 'img', 'aria-label': 'Toasts' }, [
    ...toast(20,  COLOR_ACENTO,      170, 30),
    ...toast(60,  COLOR_INFO,        180, 22),
    ...toast(100, COLOR_ADVERTENCIA, 174, 26),
  ]);
};

// ============================================================================
//  TOOLTIPS — botón con bubble flotante
// ============================================================================
export const ilustracionTooltips = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-tooltips', role: 'img', 'aria-label': 'Tooltips',
}, [
  // Botón
  ns('rect', { x: 84, y: 86, width: 52, height: 28, rx: 6, fill: COLOR_PRIMARIO }),
  ns('rect', { x: 96, y: 96, width: 28, height: 8, rx: 2, fill: '#fff' }),
  // Tooltip bubble (con flecha)
  ns('g', { class: 'ilus-tooltips__bubble' }, [
    ns('rect', { x: 60, y: 38, width: 100, height: 30, rx: 6, fill: 'var(--foreground)' }),
    ns('rect', { x: 72, y: 49, width: 76, height: 8, rx: 2, fill: 'var(--background)', opacity: 0.85 }),
    ns('path', { d: 'M104 68 l6 8 l6 -8 z', fill: 'var(--foreground)' }),
  ]),
  // Otros botones de fondo
  ns('rect', { x: 24, y: 94, width: 30, height: 14, rx: 3, fill: COLOR_BORDE, opacity: 0.4 }),
  ns('rect', { x: 166, y: 94, width: 30, height: 14, rx: 3, fill: COLOR_BORDE, opacity: 0.4 }),
]);

// ============================================================================
//  SPINNERS — círculo con arco que rota
// ============================================================================
export const ilustracionSpinners = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-spinners', role: 'img', 'aria-label': 'Spinners',
}, [
  // Pista
  ns('circle', { cx: 110, cy: 80, r: 36, fill: 'none', stroke: COLOR_BORDE, 'stroke-width': 5 }),
  // Arco animado
  ns('circle', {
    class: 'ilus-spinners__arc',
    cx: 110, cy: 80, r: 36, fill: 'none', stroke: COLOR_PRIMARIO, 'stroke-width': 5,
    'stroke-linecap': 'round', 'stroke-dasharray': '60 200',
    transform: 'rotate(-90 110 80)',
  }),
  // Mini spinners más pequeños a los lados
  ns('circle', { cx: 40, cy: 80, r: 16, fill: 'none', stroke: COLOR_BORDE, 'stroke-width': 3 }),
  ns('circle', {
    class: 'ilus-spinners__arc',
    cx: 40, cy: 80, r: 16, fill: 'none', stroke: COLOR_ACENTO, 'stroke-width': 3,
    'stroke-linecap': 'round', 'stroke-dasharray': '28 80',
    transform: 'rotate(-90 40 80)',
  }),
  ns('circle', { cx: 180, cy: 80, r: 22, fill: 'none', stroke: COLOR_BORDE, 'stroke-width': 4 }),
  ns('circle', {
    class: 'ilus-spinners__arc',
    cx: 180, cy: 80, r: 22, fill: 'none', stroke: COLOR_INFO, 'stroke-width': 4,
    'stroke-linecap': 'round', 'stroke-dasharray': '38 120',
    transform: 'rotate(-90 180 80)',
  }),
]);

// ============================================================================
//  PESTAÑAS — barra de tabs con indicador deslizante
// ============================================================================
export const ilustracionPestanas = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-pestanas', role: 'img', 'aria-label': 'Pestañas',
}, [
  // Línea inferior
  ns('line', { x1: 16, y1: 60, x2: 204, y2: 60, stroke: COLOR_BORDE, 'stroke-width': 1.5 }),
  // Tab 1
  ns('rect', { x: 24, y: 38, width: 40, height: 6, rx: 2, fill: COLOR_BORDE }),
  // Tab 2 (activo) — indicador animado abajo
  ns('rect', { x: 78, y: 38, width: 50, height: 6, rx: 2, fill: COLOR_PRIMARIO }),
  ns('rect', { class: 'ilus-pestanas__indicador', x: 76, y: 58, width: 54, height: 3, rx: 1.5, fill: COLOR_PRIMARIO }),
  // Tab 3
  ns('rect', { x: 144, y: 38, width: 36, height: 6, rx: 2, fill: COLOR_BORDE }),
  // Panel debajo
  ns('rect', { x: 16, y: 76, width: 188, height: 70, rx: 6, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('rect', { x: 30, y: 92,  width: 130, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.6 }),
  ns('rect', { x: 30, y: 104, width: 100, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.45 }),
  ns('rect', { x: 30, y: 116, width: 150, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.45 }),
  ns('rect', { x: 30, y: 128, width: 70,  height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.4 }),
]);

// ============================================================================
//  PROGRESS — barras de progreso reactivas
// ============================================================================
export const ilustracionProgreso = () => {
  const barra = (y, color, anchoLleno) => [
    ns('rect', { x: 16, y, width: 188, height: 10, rx: 5, fill: COLOR_BORDE, opacity: 0.4 }),
    ns('rect', { class: 'ilus-progreso__valor', x: 16, y, width: anchoLleno, height: 10, rx: 5, fill: color }),
  ];
  return svg({ viewBox: '0 0 220 160', class: 'ilus ilus-progreso', role: 'img', 'aria-label': 'Progreso' }, [
    ...barra(20,  COLOR_PRIMARIO,    50),
    ...barra(50,  COLOR_ACENTO,      120),
    ...barra(80,  COLOR_ADVERTENCIA, 80),
    ...barra(110, COLOR_INFO,        160),
    ...barra(140, COLOR_PELIGRO,     30),
  ]);
};

// ============================================================================
//  TIMELINE — línea vertical con eventos
// ============================================================================
export const ilustracionTimeline = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-timeline', role: 'img', 'aria-label': 'Línea de tiempo',
}, [
  // Línea vertical
  ns('line', { x1: 50, y1: 16, x2: 50, y2: 144, stroke: COLOR_BORDE, 'stroke-width': 2 }),
  // Evento 1 (success)
  ns('circle', { cx: 50, cy: 28, r: 8, fill: COLOR_ACENTO }),
  ns('rect', { x: 70, y: 22, width: 80, height: 5, rx: 2, fill: COLOR_BORDE }),
  ns('rect', { x: 70, y: 32, width: 130, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.5 }),
  // Evento 2 (info, activo con pulso)
  ns('circle', { class: 'ilus-timeline__activo', cx: 50, cy: 64, r: 9, fill: COLOR_INFO }),
  ns('rect', { x: 70, y: 58, width: 100, height: 5, rx: 2, fill: COLOR_BORDE }),
  ns('rect', { x: 70, y: 68, width: 120, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.5 }),
  // Evento 3 (primary)
  ns('circle', { cx: 50, cy: 100, r: 8, fill: COLOR_PRIMARIO }),
  ns('rect', { x: 70, y: 94,  width: 70, height: 5, rx: 2, fill: COLOR_BORDE }),
  ns('rect', { x: 70, y: 104, width: 100, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.5 }),
  // Evento 4 (peligro)
  ns('circle', { cx: 50, cy: 134, r: 8, fill: COLOR_PELIGRO }),
  ns('rect', { x: 70, y: 128, width: 90, height: 5, rx: 2, fill: COLOR_BORDE }),
  ns('rect', { x: 70, y: 138, width: 130, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.5 }),
]);

// ============================================================================
//  AVATARES — grupo apilado de avatares
// ============================================================================
export const ilustracionAvatar = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-avatar', role: 'img', 'aria-label': 'Avatares',
}, [
  // Grupo apilado horizontal
  ns('circle', { cx: 60,  cy: 80, r: 28, fill: COLOR_PRIMARIO,        stroke: 'var(--background)', 'stroke-width': 4 }),
  ns('text', { x: 60, y: 87, 'text-anchor': 'middle', fill: '#fff', 'font-size': 14, 'font-weight': 700, 'font-family': 'sans-serif' }, []),
  ns('circle', { cx: 100, cy: 80, r: 28, fill: COLOR_ACENTO,          stroke: 'var(--background)', 'stroke-width': 4 }),
  ns('circle', { cx: 140, cy: 80, r: 28, fill: COLOR_ADVERTENCIA,     stroke: 'var(--background)', 'stroke-width': 4 }),
  ns('circle', { cx: 180, cy: 80, r: 28, fill: COLOR_INFO,            stroke: 'var(--background)', 'stroke-width': 4 }),
  // Iniciales con createTextNode (sin innerHTML para SVG)
  ...['AB', 'CD', 'EF', 'GH'].map((iniciales, i) => {
    const t = ns('text', {
      x: 60 + i * 40, y: 87, 'text-anchor': 'middle', fill: '#fff',
      'font-size': 14, 'font-weight': 700, 'font-family': 'sans-serif',
    });
    t.textContent = iniciales;
    return t;
  }),
]);

// ============================================================================
//  PAGINACIÓN — botones de página con elipsis
// ============================================================================
export const ilustracionPaginacion = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-paginacion', role: 'img', 'aria-label': 'Paginación',
}, [
  // Anterior
  ns('rect', { x: 18, y: 70, width: 24, height: 24, rx: 4, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('path', { d: 'M33 76 l-6 6 l6 6', stroke: COLOR_BORDE, 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' }),
  // Páginas
  ns('rect', { x: 48, y: 70, width: 24, height: 24, rx: 4, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('text', { x: 60, y: 86, 'text-anchor': 'middle', fill: 'var(--foreground)', 'font-size': 12 }),
  ns('rect', { x: 78, y: 70, width: 24, height: 24, rx: 4, fill: COLOR_PRIMARIO }),
  ns('rect', { x: 108, y: 70, width: 24, height: 24, rx: 4, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  // Elipsis
  ns('text', { x: 145, y: 88, 'text-anchor': 'middle', fill: COLOR_BORDE, 'font-size': 16 }),
  ns('rect', { x: 158, y: 70, width: 24, height: 24, rx: 4, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  // Siguiente
  ns('rect', { x: 188, y: 70, width: 24, height: 24, rx: 4, fill: COLOR_SUPERFICIE, stroke: COLOR_BORDE }),
  ns('path', { d: 'M197 76 l6 6 l-6 6', stroke: COLOR_BORDE, 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' }),
  // Etiqueta de página
  ns('rect', { x: 60, y: 110, width: 100, height: 4, rx: 2, fill: COLOR_BORDE, opacity: 0.5 }),
]);

// ============================================================================
//  BADGES (Insignias) — variantes de pill
// ============================================================================
export const ilustracionBadges = () => {
  const pill = (x, y, color, ancho = 50) => [
    ns('rect', { x, y, width: ancho, height: 22, rx: 11, fill: color }),
    ns('rect', { x: x + 12, y: y + 8, width: ancho - 24, height: 6, rx: 2, fill: '#fff', opacity: 0.92 }),
  ];
  const pillSoft = (x, y, color, ancho = 60) => [
    ns('rect', { x, y, width: ancho, height: 22, rx: 11,
      fill: `color-mix(in srgb, ${color} 16%, transparent)`,
      stroke: `color-mix(in srgb, ${color} 40%, transparent)` }),
    ns('rect', { x: x + 12, y: y + 8, width: ancho - 24, height: 6, rx: 2, fill: color, opacity: 0.9 }),
  ];
  return svg({ viewBox: '0 0 220 160', class: 'ilus ilus-badges', role: 'img', 'aria-label': 'Insignias' }, [
    ...pill(18, 28,     COLOR_PRIMARIO,    50),
    ...pill(74, 28,     COLOR_ACENTO,      54),
    ...pill(134, 28,    COLOR_ADVERTENCIA, 60),
    ...pillSoft(18, 64, COLOR_PELIGRO,     54),
    ...pillSoft(78, 64, COLOR_INFO,        72),
    ...pillSoft(156, 64, COLOR_PRIMARIO,   46),
    // Con punto
    ns('rect', { x: 18, y: 100, width: 78, height: 22, rx: 11,
      fill: 'color-mix(in srgb, var(--color-success) 16%, transparent)',
      stroke: 'color-mix(in srgb, var(--color-success) 40%, transparent)' }),
    ns('circle', { cx: 30, cy: 111, r: 4, fill: COLOR_ACENTO }),
    ns('rect', { x: 38, y: 107, width: 50, height: 6, rx: 2, fill: COLOR_ACENTO, opacity: 0.9 }),
    // Numérica
    ns('rect', { x: 110, y: 100, width: 28, height: 22, rx: 11, fill: COLOR_PELIGRO }),
    ns('text', { x: 124, y: 116, 'text-anchor': 'middle', fill: '#fff', 'font-size': 12, 'font-weight': 700, 'font-family': 'sans-serif' }),
  ]);
};

// ============================================================================
//  GENÉRICA — usada como fallback (puzzle de bloques)
// ============================================================================
export const ilustracionGenerica = () => svg({
  viewBox: '0 0 220 160', class: 'ilus ilus-generica', role: 'img', 'aria-label': 'Componente',
}, [
  ns('rect', { x: 30, y: 24, width: 70, height: 50, rx: 8, fill: COLOR_PRIMARIO,        opacity: 0.85 }),
  ns('rect', { x: 110, y: 24, width: 80, height: 50, rx: 8, fill: COLOR_ACENTO,         opacity: 0.85 }),
  ns('rect', { x: 30, y: 84,  width: 80, height: 52, rx: 8, fill: COLOR_INFO,           opacity: 0.85 }),
  ns('rect', { x: 120, y: 84, width: 70, height: 52, rx: 8, fill: COLOR_ADVERTENCIA,    opacity: 0.85 }),
]);
