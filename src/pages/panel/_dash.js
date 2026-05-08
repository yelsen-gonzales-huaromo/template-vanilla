/**
 * Dashboard kit — widgets profesionales reutilizables.
 *
 *  - KPI         — tarjeta con valor grande, delta, sparkline y gradient icon
 *  - PanelChart  — wrapper para charts con header (titulo, acción)
 *  - Panel       — wrapper genérico para listas/contenido
 *  - Lista       — lista de items con avatar/icono + meta
 *  - Progreso    — fila con label + valor + barra de progreso
 *  - Sparkline   — mini-chart SVG
 *  - Donut       — donut SVG con leyenda
 *  - Bar         — gráfico de barras vertical SVG
 *  - Linea       — gráfico de líneas con área SVG
 *  - Funnel      — visualización de embudo (CRM, ventas)
 *  - StatPill    — píldora de estadística inline
 *  - Calor       — heatmap simple (e.g. "tickets por hora del día")
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { Icono } from '../../components/ui/icon/icons.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const sv = (tag, attrs = {}, hijos = []) => {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    el.setAttribute(k, v);
  }
  (Array.isArray(hijos) ? hijos : [hijos]).forEach((h) => h && el.appendChild(h));
  return el;
};

// ===========================================================================
//  Sparkline (mini-chart)
// ===========================================================================
export const Sparkline = ({ datos = [], ancho = 120, alto = 36, color = 'var(--primary)', conArea = true } = {}) => {
  if (!datos.length) return crearEl('span');
  const max = Math.max(...datos);
  const min = Math.min(...datos);
  const r = max - min || 1;
  const px = ancho / Math.max(1, datos.length - 1);
  const pts = datos.map((v, i) => `${(i * px).toFixed(1)},${(alto - 2 - ((v - min) / r) * (alto - 6)).toFixed(1)}`);
  const path = 'M ' + pts.join(' L ');
  const area = `${path} L ${ancho},${alto} L 0,${alto} Z`;
  return sv('svg', { class: 'dash-spark', viewBox: `0 0 ${ancho} ${alto}`, preserveAspectRatio: 'none' }, [
    conArea && sv('path', { d: area, fill: color, 'fill-opacity': '0.18' }),
    sv('path', { d: path, fill: 'none', stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ]);
};

// ===========================================================================
//  KPI Card
// ===========================================================================
export const KPI = ({ etiqueta, valor, delta, tendencia = 'up', icono = 'analitica', color = 'primary', sparkline = [], sub } = {}) => {
  const tendArrow = tendencia === 'up' ? '↑' : tendencia === 'down' ? '↓' : '→';
  return crearEl('div', { class: ['dash-kpi', `dash-kpi--${color}`] }, [
    crearEl('div', { class: 'dash-kpi__head' }, [
      crearEl('span', { class: 'dash-kpi__ico' }, [Icono(icono, { tamano: 16 })]),
      delta && crearEl('span', { class: ['dash-kpi__delta', `dash-kpi__delta--${tendencia}`] },
        [`${tendArrow} ${delta}`]),
    ]),
    crearEl('div', { class: 'dash-kpi__valor' }, [valor]),
    crearEl('div', { class: 'dash-kpi__lbl' }, [etiqueta]),
    sub && crearEl('div', { class: 'dash-kpi__sub' }, [sub]),
    sparkline.length > 0 && crearEl('div', { class: 'dash-kpi__spark' }, [
      Sparkline({ datos: sparkline, ancho: 200, alto: 30,
        color: tendencia === 'down' ? 'var(--color-danger)' : 'var(--color-success)' }),
    ]),
  ]);
};

// ===========================================================================
//  Panel (wrapper para charts / listas)
// ===========================================================================
export const Panel = ({ titulo, subtitulo, accion, hijos, sinPadding = false } = {}) => crearEl('div', { class: 'dash-panel' }, [
  (titulo || accion) && crearEl('div', { class: 'dash-panel__head' }, [
    crearEl('div', null, [
      titulo && crearEl('h3', { class: 'dash-panel__titulo' }, [titulo]),
      subtitulo && crearEl('p', { class: 'dash-panel__sub' }, [subtitulo]),
    ]),
    accion && crearEl('div', { class: 'dash-panel__accion' }, [accion]),
  ]),
  crearEl('div', { class: ['dash-panel__cuerpo', sinPadding && 'dash-panel__cuerpo--liso'] },
    Array.isArray(hijos) ? hijos : [hijos]),
]);

// ===========================================================================
//  Lista (items con avatar/icono + nombre + meta)
// ===========================================================================
export const Lista = (items) => crearEl('div', { class: 'dash-lista' },
  items.map((it) => crearEl('div', { class: 'dash-lista__item' }, [
    it.avatar
      ? crearEl('span', { class: 'dash-lista__avatar', style: { background: it.color || '#64748b' } }, [it.avatar])
      : it.icono
        ? crearEl('span', { class: 'dash-lista__icono', style: it.color ? { background: `color-mix(in srgb, ${it.color} 14%, transparent)`, color: it.color } : {} }, [Icono(it.icono, { tamano: 16 })])
        : null,
    crearEl('div', { class: 'dash-lista__cuerpo' }, [
      crearEl('div', { class: 'dash-lista__titulo' }, [it.titulo]),
      it.sub && crearEl('div', { class: 'dash-lista__sub' }, [it.sub]),
    ]),
    it.valor && crearEl('div', { class: 'dash-lista__valor' }, [
      it.valor,
      it.delta && crearEl('span', { class: ['dash-lista__delta', `dash-lista__delta--${it.tendencia || 'up'}`] }, [it.delta]),
    ]),
  ])),
);

// ===========================================================================
//  Progreso (lista con barra)
// ===========================================================================
export const Progreso = (items) => crearEl('div', { class: 'dash-progreso' },
  items.map((it) => crearEl('div', { class: 'dash-progreso__fila' }, [
    crearEl('div', { class: 'dash-progreso__head' }, [
      crearEl('span', { class: 'dash-progreso__lbl' }, [it.label]),
      crearEl('span', { class: 'dash-progreso__valor' }, [it.valor || `${it.pct}%`]),
    ]),
    crearEl('div', { class: 'dash-progreso__barra' }, [
      crearEl('div', {
        class: 'dash-progreso__fill',
        style: { width: `${it.pct}%`, background: it.color || 'var(--primary)' },
      }),
    ]),
  ])),
);

// ===========================================================================
//  Donut (SVG)
// ===========================================================================
export const Donut = ({ datos = [], tamano = 180, grosor = 22 } = {}) => {
  const total = datos.reduce((s, d) => s + d.valor, 0) || 1;
  const r = tamano / 2 - grosor / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  const segments = datos.map((d) => {
    const dasharray = `${(d.valor / total) * c} ${c}`;
    const dashoffset = -((acc / total) * c);
    acc += d.valor;
    return sv('circle', {
      cx: tamano / 2, cy: tamano / 2, r,
      fill: 'none',
      stroke: d.color,
      'stroke-width': grosor,
      'stroke-dasharray': dasharray,
      'stroke-dashoffset': dashoffset,
      transform: `rotate(-90 ${tamano / 2} ${tamano / 2})`,
      'stroke-linecap': 'butt',
    });
  });

  const wrap = crearEl('div', { class: 'dash-donut' }, [
    sv('svg', { width: tamano, height: tamano, viewBox: `0 0 ${tamano} ${tamano}` }, [
      sv('circle', {
        cx: tamano / 2, cy: tamano / 2, r,
        fill: 'none', stroke: 'color-mix(in srgb, var(--foreground) 6%, transparent)',
        'stroke-width': grosor,
      }),
      ...segments,
    ]),
    crearEl('div', { class: 'dash-donut__centro' }, [
      crearEl('div', { class: 'dash-donut__total' }, [String(total.toLocaleString('es-PE'))]),
      crearEl('div', { class: 'dash-donut__lbl' }, ['Total']),
    ]),
  ]);

  const leyenda = crearEl('div', { class: 'dash-donut__leyenda' },
    datos.map((d) => crearEl('div', { class: 'dash-donut__item' }, [
      crearEl('span', { class: 'dash-donut__chip', style: { background: d.color } }),
      crearEl('span', { class: 'dash-donut__nombre' }, [d.label]),
      crearEl('span', { class: 'dash-donut__pct' }, [`${Math.round((d.valor / total) * 100)}%`]),
    ])),
  );

  return crearEl('div', { class: 'dash-donut__wrap' }, [wrap, leyenda]);
};

// ===========================================================================
//  Bar chart (vertical)
// ===========================================================================
export const Bar = ({ datos = [], etiquetas = [], color = 'var(--primary)', alto = 200 } = {}) => {
  const max = Math.max(...datos, 1);
  const ancho = Math.max(280, datos.length * 36);
  const w = ancho / datos.length;
  const padW = w * 0.3;
  const barW = w - padW;
  return crearEl('div', { class: 'dash-bar' }, [
    sv('svg', { width: '100%', height: alto, viewBox: `0 0 ${ancho} ${alto}`, preserveAspectRatio: 'none' },
      datos.map((v, i) => {
        const h = (v / max) * (alto - 30);
        const x = i * w + padW / 2;
        const y = alto - 24 - h;
        return sv('g', null, [
          sv('rect', {
            x, y, width: barW, height: h,
            fill: color, rx: 3,
            'fill-opacity': '0.95',
          }),
          sv('text', {
            x: x + barW / 2, y: alto - 8,
            'text-anchor': 'middle',
            'font-size': '10',
            fill: 'currentColor',
            'fill-opacity': '0.6',
          }, [document.createTextNode(etiquetas[i] || '')]),
        ]);
      }),
    ),
  ]);
};

// ===========================================================================
//  Línea con área (chart de tendencia)
// ===========================================================================
export const Linea = ({ series = [], etiquetas = [], alto = 240, colores = ['var(--primary)', 'var(--color-success)'] } = {}) => {
  if (series.length === 0) return crearEl('div');
  const ancho = 760;
  const padX = 30, padY = 16;
  const todos = series.flat();
  const max = Math.max(...todos);
  const min = Math.min(...todos, 0);
  const r = max - min || 1;
  const lenMax = Math.max(...series.map((s) => s.length));
  const px = (ancho - padX * 2) / Math.max(1, lenMax - 1);

  const pathDe = (datos) => datos.map((v, i) => {
    const x = padX + i * px;
    const y = padY + (1 - (v - min) / r) * (alto - padY * 2 - 20);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const lineas = series.map((s, idx) => {
    const c = colores[idx % colores.length];
    const path = pathDe(s);
    const area = `${path} L ${padX + (s.length - 1) * px} ${alto - 20} L ${padX} ${alto - 20} Z`;
    return [
      sv('path', { d: area, fill: c, 'fill-opacity': '0.10' }),
      sv('path', { d: path, fill: 'none', stroke: c, 'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ];
  }).flat();

  // Etiquetas eje X
  const labels = etiquetas.map((e, i) => sv('text', {
    x: padX + i * px, y: alto - 4,
    'text-anchor': 'middle',
    'font-size': '10',
    fill: 'currentColor',
    'fill-opacity': '0.5',
  }, [document.createTextNode(e)]));

  // Grid líneas horizontales
  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const y = padY + i * ((alto - padY * 2 - 20) / 4);
    gridLines.push(sv('line', {
      x1: padX, x2: ancho - padX, y1: y, y2: y,
      stroke: 'currentColor', 'stroke-opacity': '0.06', 'stroke-width': '1',
    }));
  }

  return crearEl('div', { class: 'dash-linea' }, [
    sv('svg', { viewBox: `0 0 ${ancho} ${alto}`, preserveAspectRatio: 'none', class: 'dash-linea__svg' },
      [...gridLines, ...lineas, ...labels]),
  ]);
};

// ===========================================================================
//  Funnel (visualización de embudo de ventas)
// ===========================================================================
export const Funnel = (etapas) => {
  const max = Math.max(...etapas.map((e) => e.valor));
  return crearEl('div', { class: 'dash-funnel' },
    etapas.map((e, i) => {
      const pct = (e.valor / max) * 100;
      return crearEl('div', { class: 'dash-funnel__fila' }, [
        crearEl('div', { class: 'dash-funnel__num' }, [String(i + 1)]),
        crearEl('div', { class: 'dash-funnel__cuerpo' }, [
          crearEl('div', { class: 'dash-funnel__head' }, [
            crearEl('span', { class: 'dash-funnel__lbl' }, [e.label]),
            crearEl('span', { class: 'dash-funnel__valor' }, [e.valor.toLocaleString('es-PE')]),
          ]),
          crearEl('div', { class: 'dash-funnel__barra' }, [
            crearEl('div', {
              class: 'dash-funnel__fill',
              style: { width: `${pct}%`, background: e.color || 'var(--primary)' },
            }),
          ]),
          i < etapas.length - 1 && crearEl('div', { class: 'dash-funnel__conv' }, [
            `→ ${Math.round((etapas[i + 1].valor / e.valor) * 100)}% conversión`,
          ]),
        ]),
      ]);
    }),
  );
};

// ===========================================================================
//  Heatmap (calor por día/hora)
// ===========================================================================
export const Heatmap = ({ filas = [], cols = [], datos = [] } = {}) => {
  // datos: matriz [filas][cols] de 0..1
  const max = Math.max(...datos.flat(), 1);
  return crearEl('div', { class: 'dash-heat' }, [
    crearEl('table', { class: 'dash-heat__tabla' }, [
      crearEl('thead', null, [
        crearEl('tr', null, [
          crearEl('th'),
          ...cols.map((c) => crearEl('th', null, [c])),
        ]),
      ]),
      crearEl('tbody', null,
        filas.map((f, i) => crearEl('tr', null, [
          crearEl('th', null, [f]),
          ...(datos[i] || []).map((v) => {
            const intensidad = v / max;
            return crearEl('td', {
              style: { background: `color-mix(in srgb, var(--primary) ${Math.round(intensidad * 80)}%, transparent)` },
              title: String(v),
            });
          }),
        ])),
      ),
    ]),
  ]);
};

// ===========================================================================
//  StatPill — píldora inline para mostrar números
// ===========================================================================
export const StatPill = ({ valor, label, color = 'var(--primary)' }) => crearEl('div', { class: 'dash-pill' }, [
  crearEl('div', { class: 'dash-pill__valor', style: { color } }, [valor]),
  crearEl('div', { class: 'dash-pill__lbl' }, [label]),
]);

// ===========================================================================
//  Header de página de dashboard
// ===========================================================================
export const DashHeader = ({ titulo, subtitulo, acciones } = {}) => crearEl('div', { class: 'dash-header' }, [
  crearEl('div', null, [
    crearEl('h1', { class: 'dash-header__titulo' }, [titulo]),
    subtitulo && crearEl('p', { class: 'dash-header__sub' }, [subtitulo]),
  ]),
  acciones && crearEl('div', { class: 'dash-header__acciones' }, acciones),
]);

// ===========================================================================
//  Generadores de datos demo (deterministicos, no random)
// ===========================================================================
export const seriePerlin = (n, base = 50, variacion = 30, semilla = 1) => {
  const arr = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += Math.sin(i * 0.7 + semilla) * (variacion / 4) + Math.cos(i * 0.3 + semilla * 2) * (variacion / 6);
    arr.push(Math.max(0, Math.round(v)));
  }
  return arr;
};
