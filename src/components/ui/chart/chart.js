/**
 * Gráficos nativos en SVG — sin librerías de terceros.
 * Reemplazan ECharts/Chart.js/D3 del template antiguo. Suficientes para dashboards,
 * KPIs e ilustración. Para visualizaciones complejas, intercambia por una librería externa.
 */
import { crearEl } from '../../../utils/helpers/dom.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs = {}, hijos = []) => {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    el.setAttribute(k, v);
  }
  for (const h of (Array.isArray(hijos) ? hijos : [hijos])) {
    if (h) el.appendChild(h);
  }
  return el;
};

const escalar = (datos) => {
  const max = Math.max(...datos);
  const min = Math.min(...datos, 0);
  return { max, min, rango: max - min || 1 };
};

const construirRuta = (datos, ancho, alto, paddingY = 4) => {
  const { max, min, rango } = escalar(datos);
  const paso = ancho / Math.max(1, datos.length - 1);
  return datos.map((v, i) => {
    const x = i * paso;
    const y = alto - paddingY - ((v - min) / rango) * (alto - paddingY * 2);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
};

/** Gráfico de líneas con área sombreada. */
export const GraficoLineas = ({ datos = [], ancho = 320, alto = 96, etiquetas = [], color } = {}) => {
  const ruta = construirRuta(datos, ancho, alto);
  const cierre = `L ${ancho} ${alto} L 0 ${alto} Z`;
  const estilo = color ? { stroke: color } : {};
  return svg('svg', {
    class: 'chart', viewBox: `0 0 ${ancho} ${alto}`,
    preserveAspectRatio: 'none', role: 'img', 'aria-label': 'Gráfico de líneas',
  }, [
    svg('path', { class: 'chart__area', d: ruta + ' ' + cierre, fill: color || null, 'fill-opacity': '0.12' }),
    svg('path', { class: 'chart__line', d: ruta, ...(color && { stroke: color }) }),
    ...(etiquetas.length === datos.length ? datos.map((v, i) => {
      const x = (ancho / Math.max(1, datos.length - 1)) * i;
      return svg('circle', { class: 'chart__point', cx: x, cy: 0, r: 0, 'aria-hidden': 'true' });
    }) : []),
  ]);
};

/** Gráfico de área (variante de líneas con relleno fuerte). */
export const GraficoArea = (props) => GraficoLineas({ ...props });

/** Gráfico de barras vertical. */
export const GraficoBarras = ({ datos = [], etiquetas = [], ancho = 320, alto = 120, color } = {}) => {
  const max = Math.max(...datos, 1);
  const cantidad = datos.length;
  const espacio = 4;
  const anchoBarra = (ancho - espacio * (cantidad - 1)) / cantidad;
  return svg('svg', {
    class: 'chart', viewBox: `0 0 ${ancho} ${alto}`,
    preserveAspectRatio: 'none', role: 'img', 'aria-label': 'Gráfico de barras',
  }, datos.map((v, i) => {
    const altoBarra = Math.max(2, (v / max) * (alto - 14));
    return svg('rect', {
      class: 'chart__bar',
      x: i * (anchoBarra + espacio),
      y: alto - altoBarra - 12,
      width: anchoBarra,
      height: altoBarra,
      rx: 2,
      ...(color && { fill: color }),
      'data-label': etiquetas[i] || '',
    });
  }));
};

/** Gráfico tipo donut (un solo valor con porcentaje). */
export const GraficoDonut = ({ valor = 0, total = 100, tamano = 96, grosor = 10, color } = {}) => {
  const r = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * r;
  const offset = circunferencia - (valor / total) * circunferencia;
  const cx = tamano / 2;
  return svg('svg', {
    class: 'chart',
    viewBox: `0 0 ${tamano} ${tamano}`,
    width: tamano,
    height: tamano,
    role: 'img',
    'aria-label': `${Math.round((valor / total) * 100)}%`,
  }, [
    svg('circle', {
      class: 'chart__donut-track', cx, cy: cx, r,
      fill: 'none', 'stroke-width': grosor,
    }),
    svg('circle', {
      class: 'chart__donut-arc', cx, cy: cx, r,
      fill: 'none',
      stroke: color || 'var(--primary)',
      'stroke-width': grosor,
      'stroke-dasharray': circunferencia,
      'stroke-dashoffset': offset,
      'stroke-linecap': 'round',
      transform: `rotate(-90 ${cx} ${cx})`,
    }),
    svg('text', {
      x: cx, y: cx + 4, 'text-anchor': 'middle',
      'font-weight': 600, 'font-size': '14',
      fill: 'currentColor',
    }, [document.createTextNode(`${Math.round((valor / total) * 100)}%`)]),
  ]);
};

/** Sparkline minimal — sólo línea, sin ejes. */
export const GraficoSparkline = ({ datos = [], ancho = 80, alto = 24, color } = {}) =>
  svg('svg', {
    class: 'chart', viewBox: `0 0 ${ancho} ${alto}`,
    preserveAspectRatio: 'none',
    width: ancho, height: alto, 'aria-hidden': 'true',
  }, [
    svg('path', { class: 'chart__line', d: construirRuta(datos, ancho, alto, 2), ...(color && { stroke: color }) }),
  ]);

/** Barra de progreso horizontal — alternativa accesible a Donut. */
export const GraficoProgreso = ({ valor = 0, total = 100, etiqueta = '', color } = {}) => {
  const pct = Math.max(0, Math.min(100, (valor / total) * 100));
  return crearEl('div', { role: 'progressbar', 'aria-valuenow': valor, 'aria-valuemax': total, 'aria-label': etiqueta }, [
    crearEl('div', {
      style: {
        width: '100%', height: '0.5rem', backgroundColor: 'var(--muted)',
        borderRadius: 'var(--radius-full)', overflow: 'hidden',
      },
    }, [
      crearEl('div', {
        style: {
          width: `${pct}%`, height: '100%',
          backgroundColor: color || 'var(--primary)',
          transition: 'width var(--transition-slow)',
        },
      }),
    ]),
  ]);
};
