/**
 * Helpers compartidos para las páginas de Charts (Chart.js / D3 / ECharts).
 * Cada chart se monta con lazy-init via IntersectionObserver para no descargar
 * la lib hasta que el chart entra en viewport.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { cargarECharts } from '../../../integrations/echarts/index.js';
import { cargarChartJs } from '../../../integrations/chartjs/index.js';
import { cargarD3 } from '../../../integrations/d3/index.js';
import { estadoUi } from '../../../store/ui.store.js';

// ============================================================================
//  Paleta consistente para todos los charts (azul · violeta · cyan · verde …)
// ============================================================================
export const PALETA = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16', '#0ea5e9', '#a855f7'];

// ============================================================================
//  Echart — div lazy-init que carga ECharts al entrar en viewport
// ============================================================================
export const Echart = ({ opcion, alto = '320px', evento } = {}) => {
  const div = crearEl('div', {
    style: {
      width: '100%', height: alto,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
    },
  });

  let inited = false;
  const obs = new IntersectionObserver(async (entries) => {
    if (!entries[0].isIntersecting || inited) return;
    inited = true;
    obs.disconnect();
    const echarts = await cargarECharts();
    const tema = estadoUi.tema.peek();
    const inst = echarts.init(div, tema === 'dark' ? 'dark' : null);
    inst.setOption(opcion);
    if (evento) evento(inst, echarts);
    new ResizeObserver(() => inst.resize()).observe(div);
  });
  obs.observe(div);

  return div;
};

// ============================================================================
//  ChartJsContainer — canvas con lazy-init de Chart.js
// ============================================================================
export const ChartJs = ({ tipo, datos, opciones = {}, alto = '280px' } = {}) => {
  const wrapper = crearEl('div', {
    style: {
      position: 'relative', width: '100%', height: alto,
      padding: 'var(--space-3)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    },
  });
  const canvas = crearEl('canvas');
  wrapper.appendChild(canvas);

  let inited = false;
  const obs = new IntersectionObserver(async (entries) => {
    if (!entries[0].isIntersecting || inited) return;
    inited = true;
    obs.disconnect();
    const Chart = await cargarChartJs();
    const css = getComputedStyle(document.documentElement);
    const muted = css.getPropertyValue('--muted-foreground').trim() || '#6b7280';
    new Chart(canvas, {
      type: tipo,
      data: datos,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: muted, usePointStyle: true, padding: 14 } },
          tooltip: { padding: 10, cornerRadius: 8 },
        },
        ...((tipo === 'line' || tipo === 'bar') && {
          scales: {
            x: { ticks: { color: muted }, grid: { color: 'rgba(120,120,120,0.1)' } },
            y: { ticks: { color: muted }, grid: { color: 'rgba(120,120,120,0.1)' } },
          },
        }),
        ...opciones,
      },
    });
  });
  obs.observe(wrapper);

  return wrapper;
};

// ============================================================================
//  D3Container — div con SVG en su interior, render() recibe { d3, svg, w, h }
// ============================================================================
export const D3Chart = ({ render, alto = '320px' } = {}) => {
  const wrapper = crearEl('div', {
    style: {
      position: 'relative', width: '100%', height: alto,
      padding: 'var(--space-3)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    },
  });

  let inited = false;
  const obs = new IntersectionObserver(async (entries) => {
    if (!entries[0].isIntersecting || inited) return;
    inited = true;
    obs.disconnect();
    const d3 = await cargarD3();
    const rect = wrapper.getBoundingClientRect();
    const svg = d3.select(wrapper).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${rect.width} ${rect.height}`);
    render({ d3, svg, w: rect.width, h: rect.height, contenedor: wrapper });
  });
  obs.observe(wrapper);

  return wrapper;
};

// ============================================================================
//  Datos de ejemplo realistas (reusables entre páginas)
// ============================================================================
export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const ventasMensuales      = [42000, 51000, 47500, 58000, 64200, 71500, 78900, 82400, 76800, 88200, 92500, 105400];
export const ventasMensualesAnt   = [38000, 44000, 42500, 51000, 56200, 62000, 65900, 69400, 67800, 75200, 79500, 89400];

export const usuariosActivos      = [1240, 1340, 1480, 1620, 1750, 1890, 2050, 2240, 2380, 2510, 2680, 2920];
export const sesionesPromedio     = [4.2, 4.4, 4.5, 4.7, 4.6, 4.9, 5.1, 5.3, 5.2, 5.5, 5.7, 6.0];

export const trafico              = [320, 450, 580, 920, 1250, 1820, 2240, 1980, 1450, 920, 540, 320];

// ============================================================================
//  Fondo gradient para áreas de chart (compatible con ECharts y Chart.js)
// ============================================================================
export const gradiente = (color, opacidadInicial = 0.6, opacidadFinal = 0.05) => ({
  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
  colorStops: [
    { offset: 0, color: `${color}` },
    { offset: 1, color: 'transparent' },
  ],
  global: false,
});

// Para Chart.js — gradiente vertical en canvas
export const gradienteCanvas = (ctx, color, h = 200) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, color + 'CC');
  g.addColorStop(1, color + '00');
  return g;
};

// ============================================================================
//  Opciones base de ECharts con tema cohesivo
// ============================================================================
export const opcionesBase = () => {
  const tema = estadoUi.tema.peek();
  const oscuro = tema === 'dark';
  return {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'inherit', color: oscuro ? '#cbd5e1' : '#475569' },
    color: PALETA,
    grid: { left: 50, right: 30, top: 40, bottom: 40, containLabel: true },
    legend: {
      top: 10, textStyle: { color: oscuro ? '#cbd5e1' : '#475569' },
      icon: 'roundRect', itemWidth: 12, itemHeight: 8, itemGap: 16,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: oscuro ? '#1e293b' : '#fff',
      borderWidth: 1, borderColor: oscuro ? '#334155' : '#e5e7eb',
      textStyle: { color: oscuro ? '#f1f5f9' : '#1e293b', fontSize: 12 },
      padding: [8, 12],
      extraCssText: 'border-radius: 8px; box-shadow: 0 12px 32px -12px rgba(0,0,0,0.18);',
    },
    xAxis: {
      axisLine: { lineStyle: { color: oscuro ? '#334155' : '#e5e7eb' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { color: oscuro ? '#94a3b8' : '#64748b' },
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: oscuro ? '#1e293b' : '#f1f5f9', type: 'dashed' } },
      axisLabel: { color: oscuro ? '#94a3b8' : '#64748b' },
    },
  };
};

// Merge profundo simple (suficiente para opciones de ECharts)
export const merge = (...objs) => {
  const out = {};
  for (const o of objs) {
    if (!o) continue;
    for (const [k, v] of Object.entries(o)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        out[k] = merge(out[k] || {}, v);
      } else {
        out[k] = v;
      }
    }
  }
  return out;
};
