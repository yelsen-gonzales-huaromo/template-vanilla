/**
 * Banco de animaciones SVG compuestas — estilo LottieFiles, sin dependencias.
 *
 * Cada función devuelve un SVG independiente con varios elementos animados
 * mediante CSS keyframes (definidos en animations-pro.css). Listo para
 * insertarse en cualquier card, modal, hero o estado vacío.
 *
 *   AnimPro.dotsBouncing()    → SVG con 4 puntos rebotando
 *   AnimPro.spinnerRing()     → SVG ring con arco rotante
 *   AnimPro.checkmarkDraw()   → SVG check dibujándose
 *   ...
 */

const ns = (tag, attrs = {}, children = []) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  children.forEach((c) => c && el.appendChild(c));
  return el;
};
const svg = (cls, attrs, children) => ns('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 200 200',
  width: '100%', height: '100%',
  class: cls,
  ...attrs,
}, children);

// Paleta vibrante tipo LottieFiles
const C = {
  rojo:    '#ef4444',
  naranja: '#f59e0b',
  amarillo:'#fbbf24',
  verde:   '#22c55e',
  esmeralda:'#10b981',
  cian:    '#06b6d4',
  azul:    '#3b82f6',
  indigo:  '#6366f1',
  violeta: '#8b5cf6',
  rosa:    '#ec4899',
  blanco:  '#ffffff',
};

// ============================================================================
//  LOADING / SPINNERS
// ============================================================================
export const dotsBouncing = () => svg('ap ap-dots-bouncing', null, [
  ns('circle', { cx: 50,  cy: 100, r: 12, fill: C.rojo }),
  ns('circle', { cx: 85,  cy: 100, r: 12, fill: C.azul }),
  ns('circle', { cx: 120, cy: 100, r: 12, fill: C.verde }),
  ns('circle', { cx: 155, cy: 100, r: 12, fill: C.amarillo }),
]);

export const dotsPulsing = () => svg('ap ap-dots-pulsing', null, [
  ns('circle', { cx: 40,  cy: 100, r: 10, fill: C.rojo }),
  ns('circle', { cx: 70,  cy: 100, r: 10, fill: C.azul }),
  ns('circle', { cx: 100, cy: 100, r: 10, fill: C.verde }),
  ns('circle', { cx: 130, cy: 100, r: 10, fill: C.amarillo }),
  ns('circle', { cx: 160, cy: 100, r: 10, fill: C.naranja }),
]);

export const spinnerRing = () => svg('ap ap-spinner-ring', null, [
  ns('circle', { cx: 100, cy: 100, r: 50, fill: 'none', stroke: '#e5e7eb', 'stroke-width': 8 }),
  ns('circle', { class: 'ap-arc', cx: 100, cy: 100, r: 50, fill: 'none',
    stroke: C.azul, 'stroke-width': 8, 'stroke-linecap': 'round',
    'stroke-dasharray': '90 220', transform: 'rotate(-90 100 100)' }),
]);

export const spinnerDual = () => svg('ap ap-spinner-dual', null, [
  ns('circle', { class: 'ap-spinner-dual__a', cx: 100, cy: 100, r: 56, fill: 'none',
    stroke: C.azul, 'stroke-width': 6, 'stroke-linecap': 'round',
    'stroke-dasharray': '60 300' }),
  ns('circle', { class: 'ap-spinner-dual__b', cx: 100, cy: 100, r: 38, fill: 'none',
    stroke: C.rosa, 'stroke-width': 6, 'stroke-linecap': 'round',
    'stroke-dasharray': '40 220' }),
]);

export const spinnerBars = () => {
  const barras = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30);
    barras.push(ns('rect', {
      class: 'ap-spinner-bars__b', style: `--i: ${i}`,
      x: 96, y: 30, width: 8, height: 22, rx: 4,
      fill: C.azul,
      transform: `rotate(${angle} 100 100)`,
    }));
  }
  return svg('ap ap-spinner-bars', null, barras);
};

export const barsSequential = () => svg('ap ap-bars-seq', null, [
  ns('rect', { x: 50, y: 70,  width: 16, height: 60, rx: 4, fill: C.azul }),
  ns('rect', { x: 78, y: 70,  width: 16, height: 60, rx: 4, fill: C.azul }),
  ns('rect', { x: 106,y: 70,  width: 16, height: 60, rx: 4, fill: C.azul }),
  ns('rect', { x: 134,y: 70,  width: 16, height: 60, rx: 4, fill: C.azul }),
]);

export const wavePulse = () => svg('ap ap-wave', null, [
  ns('path', {
    class: 'ap-wave__line',
    d: 'M 20 100 Q 50 70, 80 100 T 140 100 T 200 100',
    fill: 'none', stroke: C.cian, 'stroke-width': 4, 'stroke-linecap': 'round',
  }),
]);

export const paperPlane = () => svg('ap ap-paper-plane', null, [
  // Nubes de fondo
  ns('ellipse', { class: 'ap-cloud-1', cx: 50,  cy: 60, rx: 18, ry: 8, fill: '#cbd5e1', opacity: 0.6 }),
  ns('ellipse', { class: 'ap-cloud-2', cx: 150, cy: 140, rx: 22, ry: 10, fill: '#cbd5e1', opacity: 0.6 }),
  // Avión
  ns('g', { class: 'ap-plane' }, [
    ns('path', {
      d: 'M 60 110 L 140 80 L 130 105 L 95 110 L 130 115 L 140 140 Z',
      fill: C.indigo, stroke: C.violeta, 'stroke-width': 1, 'stroke-linejoin': 'round',
    }),
    ns('path', {
      d: 'M 95 110 L 105 95 L 130 105 Z',
      fill: C.violeta,
    }),
  ]),
  // Estela
  ns('path', { class: 'ap-trail',
    d: 'M 30 110 Q 50 105, 60 110',
    fill: 'none', stroke: C.indigo, 'stroke-width': 2, 'stroke-linecap': 'round',
    'stroke-dasharray': '4 6', opacity: 0.6 }),
]);

// ============================================================================
//  SUCCESS / CONFIRMATION
// ============================================================================
export const checkmarkDraw = () => svg('ap ap-check-draw', null, [
  ns('circle', { cx: 100, cy: 100, r: 60, fill: C.verde, opacity: 0.15 }),
  ns('circle', { class: 'ap-check-bg', cx: 100, cy: 100, r: 50, fill: C.verde }),
  ns('path', { class: 'ap-check-path',
    d: 'M 75 100 L 92 117 L 128 82',
    fill: 'none', stroke: '#fff', 'stroke-width': 8,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
]);

export const confetti = () => {
  const piezas = [];
  const colores = [C.rojo, C.amarillo, C.verde, C.cian, C.violeta, C.rosa];
  for (let i = 0; i < 18; i++) {
    const x = 100 + (Math.random() * 60 - 30);
    const y = 100 + (Math.random() * 60 - 30);
    piezas.push(ns('rect', {
      class: 'ap-conf__pieza', style: `--i: ${i}`,
      x: x - 3, y: y - 5, width: 6, height: 10, rx: 1.5,
      fill: colores[i % colores.length],
      transform: `rotate(${Math.random() * 360} ${x} ${y})`,
    }));
  }
  return svg('ap ap-confetti', null, [
    ns('circle', { cx: 100, cy: 100, r: 22, fill: C.amarillo, opacity: 0.85 }),
    ...piezas,
  ]);
};

export const starsBurst = () => svg('ap ap-stars-burst', null, [
  ns('polygon', { class: 'ap-star', style: '--i: 0', fill: C.amarillo,
    points: '100,80 105,93 119,93 108,102 112,116 100,108 88,116 92,102 81,93 95,93' }),
  ...[0, 1, 2, 3, 4, 5].map((i) => ns('polygon', {
    class: 'ap-star-mini', style: `--i: ${i}`, fill: i % 2 ? C.naranja : C.rosa,
    points: '100,90 102,96 108,96 103,100 105,106 100,103 95,106 97,100 92,96 98,96',
    transform: `rotate(${i * 60} 100 100)`,
  })),
]);

export const circleExpand = () => svg('ap ap-circle-expand', null, [
  ns('circle', { class: 'ap-ce__r1', cx: 100, cy: 100, r: 30, fill: 'none',
    stroke: C.verde, 'stroke-width': 4 }),
  ns('circle', { class: 'ap-ce__r2', cx: 100, cy: 100, r: 30, fill: 'none',
    stroke: C.verde, 'stroke-width': 4 }),
  ns('circle', { cx: 100, cy: 100, r: 18, fill: C.verde }),
  ns('path', { d: 'M 90 100 L 96 106 L 110 92', fill: 'none',
    stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
]);

// ============================================================================
//  ERROR / WARNING
// ============================================================================
export const xMark = () => svg('ap ap-xmark', null, [
  ns('circle', { cx: 100, cy: 100, r: 60, fill: C.rojo, opacity: 0.15 }),
  ns('circle', { class: 'ap-xmark-bg', cx: 100, cy: 100, r: 50, fill: C.rojo }),
  ns('path', { class: 'ap-xmark-l1',
    d: 'M 80 80 L 120 120',
    fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }),
  ns('path', { class: 'ap-xmark-l2',
    d: 'M 120 80 L 80 120',
    fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }),
]);

export const errorPulse = () => svg('ap ap-error-pulse', null, [
  ns('circle', { class: 'ap-ep__ring', cx: 100, cy: 100, r: 70,
    fill: 'none', stroke: C.rojo, 'stroke-width': 2 }),
  ns('circle', { cx: 100, cy: 100, r: 50, fill: C.rojo }),
  ns('path', { d: 'M 100 75 L 100 105', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }),
  ns('circle', { cx: 100, cy: 122, r: 5, fill: '#fff' }),
]);

export const shakeFinger = () => svg('ap ap-shake', null, [
  ns('g', { class: 'ap-shake__finger' }, [
    ns('path', {
      d: 'M 100 60 Q 105 55, 110 60 L 115 130 Q 115 140, 105 142 L 95 142 Q 85 140, 85 130 L 90 60 Q 95 55, 100 60 Z',
      fill: C.naranja, stroke: '#d97706', 'stroke-width': 1.5,
    }),
    ns('rect', { x: 96, y: 70, width: 8, height: 30, rx: 4, fill: '#fff', opacity: 0.4 }),
  ]),
]);

// ============================================================================
//  EMPTY STATES / 404
// ============================================================================
export const emptyBox = () => svg('ap ap-empty-box', null, [
  ns('g', { class: 'ap-eb__caja' }, [
    // Caja
    ns('path', { d: 'M 50 100 L 100 75 L 150 100 L 150 150 L 100 175 L 50 150 Z',
      fill: C.amarillo, opacity: 0.3, stroke: C.naranja, 'stroke-width': 2 }),
    ns('path', { d: 'M 50 100 L 100 125 L 150 100 M 100 125 L 100 175',
      fill: 'none', stroke: C.naranja, 'stroke-width': 2 }),
    // Tapa abierta
    ns('path', { class: 'ap-eb__tapa',
      d: 'M 60 90 L 100 70 L 140 90 L 100 110 Z',
      fill: C.naranja, opacity: 0.6 }),
  ]),
  // Signo de pregunta flotando
  ns('text', { class: 'ap-eb__q', x: 100, y: 60,
    'text-anchor': 'middle', 'font-size': 32, 'font-weight': 700, fill: C.naranja },
    [document.createTextNode('?')]),
]);

export const searchEmpty = () => svg('ap ap-search-empty', null, [
  ns('circle', { class: 'ap-se__lupa', cx: 90, cy: 90, r: 32,
    fill: 'none', stroke: C.azul, 'stroke-width': 6 }),
  ns('line', { x1: 115, y1: 115, x2: 145, y2: 145,
    stroke: C.azul, 'stroke-width': 6, 'stroke-linecap': 'round' }),
  // X dentro
  ns('path', { class: 'ap-se__x',
    d: 'M 78 78 L 102 102 M 102 78 L 78 102',
    stroke: C.rojo, 'stroke-width': 4, 'stroke-linecap': 'round' }),
]);

export const cloudOffline = () => svg('ap ap-cloud-off', null, [
  ns('path', { class: 'ap-co__nube',
    d: 'M 70 110 Q 50 110, 50 90 Q 50 70, 75 70 Q 80 50, 110 50 Q 140 50, 145 75 Q 165 80, 165 100 Q 165 120, 140 120 L 70 120 Z',
    fill: '#94a3b8', opacity: 0.5 }),
  // Línea diagonal
  ns('line', { class: 'ap-co__linea', x1: 50, y1: 50, x2: 165, y2: 145,
    stroke: C.rojo, 'stroke-width': 5, 'stroke-linecap': 'round' }),
]);

// ============================================================================
//  ACTIVITY (notification, like, heart)
// ============================================================================
export const bellRing = () => svg('ap ap-bell', null, [
  ns('g', { class: 'ap-bell__cuerpo' }, [
    ns('path', { d: 'M 100 50 Q 80 50, 75 80 L 75 110 L 65 125 L 135 125 L 125 110 L 125 80 Q 120 50, 100 50 Z',
      fill: C.amarillo, stroke: C.naranja, 'stroke-width': 2 }),
    ns('circle', { cx: 100, cy: 135, r: 8, fill: C.naranja }),
  ]),
  // Ondas
  ns('path', { class: 'ap-bell__o1',
    d: 'M 145 75 Q 155 90, 145 105',
    fill: 'none', stroke: C.amarillo, 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ns('path', { class: 'ap-bell__o2',
    d: 'M 55 75 Q 45 90, 55 105',
    fill: 'none', stroke: C.amarillo, 'stroke-width': 3, 'stroke-linecap': 'round' }),
]);

export const heartFly = () => svg('ap ap-heart-fly', null, [
  ...[0, 1, 2].map((i) => ns('path', {
    class: 'ap-hf__corazon', style: `--i: ${i}`,
    d: 'M 100 130 L 80 110 Q 65 95, 80 80 Q 95 70, 100 90 Q 105 70, 120 80 Q 135 95, 120 110 Z',
    fill: C.rosa,
  })),
]);

export const likeBurst = () => svg('ap ap-like', null, [
  ns('g', { class: 'ap-like__pulgar' }, [
    ns('path', {
      d: 'M 70 110 L 70 150 L 100 150 L 100 110 L 80 95 L 95 70 Q 100 60, 105 65 Q 108 70, 105 80 L 100 100 L 130 100 Q 140 100, 140 110 L 135 145 Q 133 150, 128 150 L 100 150',
      fill: C.azul, stroke: C.indigo, 'stroke-width': 1.5,
      'stroke-linejoin': 'round',
    }),
  ]),
  // Sparkles
  ...[0, 1, 2, 3, 4].map((i) => ns('circle', {
    class: 'ap-like__spark', style: `--i: ${i}`,
    cx: 130 + (i % 2) * 14, cy: 60 + i * 8, r: 3, fill: C.amarillo,
  })),
]);

export const chatBubbles = () => svg('ap ap-chat', null, [
  ns('path', { class: 'ap-chat__b1',
    d: 'M 50 70 Q 50 55, 65 55 L 110 55 Q 125 55, 125 70 L 125 90 Q 125 105, 110 105 L 80 105 L 65 120 L 70 105 L 65 105 Q 50 105, 50 90 Z',
    fill: C.cian, stroke: C.azul, 'stroke-width': 1.5 }),
  ns('path', { class: 'ap-chat__b2',
    d: 'M 90 110 Q 90 95, 105 95 L 145 95 Q 160 95, 160 110 L 160 130 Q 160 145, 145 145 L 130 145 L 145 160 L 120 145 L 105 145 Q 90 145, 90 130 Z',
    fill: C.violeta, stroke: C.indigo, 'stroke-width': 1.5 }),
  // Puntos dentro
  ns('circle', { cx: 75,  cy: 80, r: 3, fill: '#fff' }),
  ns('circle', { cx: 88,  cy: 80, r: 3, fill: '#fff' }),
  ns('circle', { cx: 101, cy: 80, r: 3, fill: '#fff' }),
]);

// ============================================================================
//  WELCOME / ONBOARDING
// ============================================================================
export const rocketLaunch = () => svg('ap ap-rocket', null, [
  // Llamas
  ns('g', { class: 'ap-rocket__llamas' }, [
    ns('path', { d: 'M 90 130 L 85 155 L 100 145 L 115 155 L 110 130 Z', fill: C.naranja }),
    ns('path', { d: 'M 95 135 L 95 165 L 105 165 L 105 135 Z', fill: C.amarillo }),
  ]),
  ns('g', { class: 'ap-rocket__cuerpo' }, [
    // Cuerpo
    ns('ellipse', { cx: 100, cy: 95, rx: 18, ry: 40, fill: C.blanco, stroke: C.azul, 'stroke-width': 2 }),
    // Ventana
    ns('circle', { cx: 100, cy: 80, r: 8, fill: C.cian, stroke: C.azul, 'stroke-width': 1.5 }),
    // Aletas
    ns('path', { d: 'M 82 115 L 70 130 L 82 130 Z', fill: C.rojo }),
    ns('path', { d: 'M 118 115 L 130 130 L 118 130 Z', fill: C.rojo }),
    // Punta
    ns('path', { d: 'M 100 55 L 90 70 L 110 70 Z', fill: C.rojo }),
  ]),
  // Estrellas
  ns('circle', { class: 'ap-rocket__star', style: '--i: 0', cx: 50,  cy: 60,  r: 2, fill: C.amarillo }),
  ns('circle', { class: 'ap-rocket__star', style: '--i: 1', cx: 150, cy: 80,  r: 2, fill: C.amarillo }),
  ns('circle', { class: 'ap-rocket__star', style: '--i: 2', cx: 40,  cy: 100, r: 2, fill: C.blanco }),
  ns('circle', { class: 'ap-rocket__star', style: '--i: 3', cx: 160, cy: 40,  r: 2, fill: C.blanco }),
]);

export const wavingHand = () => svg('ap ap-hand', null, [
  ns('g', { class: 'ap-hand__mano' }, [
    ns('path', {
      d: 'M 80 100 Q 75 80, 80 70 Q 85 65, 90 70 L 95 90 L 95 50 Q 95 45, 100 45 Q 105 45, 105 50 L 105 90 L 110 60 Q 110 55, 115 55 Q 120 55, 120 60 L 120 95 L 125 70 Q 125 65, 130 65 Q 135 65, 135 70 L 135 105 Q 135 130, 110 140 L 90 140 Q 75 135, 75 120 Z',
      fill: C.amarillo, stroke: C.naranja, 'stroke-width': 1.5,
      'stroke-linejoin': 'round',
    }),
  ]),
]);

export const sparklesAround = () => svg('ap ap-sparkles', null, [
  ns('circle', { cx: 100, cy: 100, r: 28, fill: C.violeta }),
  ns('text', { x: 100, y: 110, 'text-anchor': 'middle',
    'font-size': 28, fill: '#fff' }, [document.createTextNode('✨')]),
  ...[0, 1, 2, 3, 4, 5].map((i) => ns('polygon', {
    class: 'ap-sparkles__chispa', style: `--i: ${i}`,
    fill: C.amarillo,
    points: '100,82 102,90 110,92 102,94 100,102 98,94 90,92 98,90',
    transform: `rotate(${i * 60} 100 100) translate(0 -40)`,
  })),
]);

// ============================================================================
//  NETWORK
// ============================================================================
export const wifiPulse = () => svg('ap ap-wifi', null, [
  ns('circle', { cx: 100, cy: 140, r: 8, fill: C.azul }),
  ns('path', { class: 'ap-wifi__a1',
    d: 'M 75 115 Q 100 90, 125 115',
    fill: 'none', stroke: C.azul, 'stroke-width': 5, 'stroke-linecap': 'round' }),
  ns('path', { class: 'ap-wifi__a2',
    d: 'M 60 100 Q 100 60, 140 100',
    fill: 'none', stroke: C.azul, 'stroke-width': 5, 'stroke-linecap': 'round' }),
  ns('path', { class: 'ap-wifi__a3',
    d: 'M 45 85 Q 100 30, 155 85',
    fill: 'none', stroke: C.azul, 'stroke-width': 5, 'stroke-linecap': 'round' }),
]);

export const cloudUpload = () => svg('ap ap-cloud-up', null, [
  ns('path', {
    d: 'M 70 130 Q 50 130, 50 110 Q 50 90, 70 88 Q 75 65, 105 65 Q 130 65, 135 90 Q 155 95, 155 115 Q 155 135, 130 135 L 70 135 Z',
    fill: C.cian, opacity: 0.85 }),
  // Flecha
  ns('g', { class: 'ap-cu__flecha' }, [
    ns('line', { x1: 100, y1: 130, x2: 100, y2: 95,
      stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    ns('path', { d: 'M 88 105 L 100 90 L 112 105',
      fill: 'none', stroke: '#fff', 'stroke-width': 6,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ]),
]);

export const syncRotating = () => svg('ap ap-sync', null, [
  ns('g', { class: 'ap-sync__rot' }, [
    ns('path', {
      d: 'M 100 50 A 50 50 0 0 1 150 100 L 140 100 L 155 115 L 170 100 L 160 100 A 60 60 0 0 0 100 40 Z',
      fill: C.azul,
    }),
    ns('path', {
      d: 'M 100 150 A 50 50 0 0 1 50 100 L 60 100 L 45 85 L 30 100 L 40 100 A 60 60 0 0 0 100 160 Z',
      fill: C.cian,
    }),
  ]),
]);

// ============================================================================
//  Catálogo organizado
// ============================================================================
export const ANIMACIONES_PRO = {
  loading: {
    titulo: 'Loading',
    items: [
      { id: 'dots-bouncing',  nombre: 'Puntos rebotando',    factory: dotsBouncing },
      { id: 'dots-pulsing',   nombre: 'Puntos pulsando',     factory: dotsPulsing },
      { id: 'spinner-ring',   nombre: 'Anillo giratorio',    factory: spinnerRing },
      { id: 'spinner-dual',   nombre: 'Doble anillo',        factory: spinnerDual },
      { id: 'spinner-bars',   nombre: 'Barras radiales',     factory: spinnerBars },
      { id: 'bars-seq',       nombre: 'Barras secuenciales', factory: barsSequential },
      { id: 'wave',           nombre: 'Onda',                factory: wavePulse },
      { id: 'paper-plane',    nombre: 'Avión de papel',      factory: paperPlane },
    ],
  },
  exito: {
    titulo: 'Éxito',
    items: [
      { id: 'check',          nombre: 'Check dibujado',      factory: checkmarkDraw },
      { id: 'confetti',       nombre: 'Confetti',            factory: confetti },
      { id: 'stars-burst',    nombre: 'Estrellas',           factory: starsBurst },
      { id: 'circle-expand',  nombre: 'Círculo expandiendo', factory: circleExpand },
    ],
  },
  error: {
    titulo: 'Error',
    items: [
      { id: 'xmark',          nombre: 'X marcada',           factory: xMark },
      { id: 'error-pulse',    nombre: 'Alerta pulsante',     factory: errorPulse },
      { id: 'shake',          nombre: 'Sacudir',             factory: shakeFinger },
    ],
  },
  vacio: {
    titulo: 'Estados vacíos',
    items: [
      { id: 'empty-box',      nombre: 'Caja vacía',          factory: emptyBox },
      { id: 'search-empty',   nombre: 'Sin resultados',      factory: searchEmpty },
      { id: 'cloud-off',      nombre: 'Sin conexión',        factory: cloudOffline },
    ],
  },
  actividad: {
    titulo: 'Actividad',
    items: [
      { id: 'bell',           nombre: 'Campana',             factory: bellRing },
      { id: 'heart-fly',      nombre: 'Corazones flotantes', factory: heartFly },
      { id: 'like',           nombre: 'Like burst',          factory: likeBurst },
      { id: 'chat',           nombre: 'Chat burbujas',       factory: chatBubbles },
    ],
  },
  bienvenida: {
    titulo: 'Bienvenida',
    items: [
      { id: 'rocket',         nombre: 'Cohete despega',      factory: rocketLaunch },
      { id: 'hand',           nombre: 'Mano saludando',      factory: wavingHand },
      { id: 'sparkles',       nombre: 'Chispas',             factory: sparklesAround },
    ],
  },
  red: {
    titulo: 'Conexión / Red',
    items: [
      { id: 'wifi',           nombre: 'WiFi pulse',          factory: wifiPulse },
      { id: 'cloud-up',       nombre: 'Cloud upload',        factory: cloudUpload },
      { id: 'sync',           nombre: 'Sincronizar',         factory: syncRotating },
    ],
  },
};

export const TODAS_PRO = Object.entries(ANIMACIONES_PRO).flatMap(([cat, sec]) =>
  sec.items.map((it) => ({ ...it, categoria: cat })));
