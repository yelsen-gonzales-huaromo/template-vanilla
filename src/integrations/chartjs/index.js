/**
 * Adaptador para Chart.js — gráficos avanzados (líneas, barras, donut, radar, etc.).
 *  https://www.chartjs.org/
 *
 * Si te basta con KPIs simples, usa los `GraficoLineas`/`GraficoBarras` SVG nativos.
 * Chart.js es para gráficos interactivos, animados, con tooltips y leyendas.
 *
 *   const { canvas, instancia } = await GraficoChartJs({
 *     tipo: 'line',
 *     datos: { labels: [...], datasets: [...] },
 *     opciones: {},
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '4.4.6';
const URL_JS = `https://cdn.jsdelivr.net/npm/chart.js@${VERSION}/dist/chart.umd.min.js`;

export const cargarChartJs = () => cargarLib({ scripts: URL_JS, global: 'Chart' });

/**
 * @param {object} opts
 * @param {'line'|'bar'|'doughnut'|'pie'|'radar'|'polarArea'|'bubble'|'scatter'} opts.tipo
 * @param {object} opts.datos     — { labels, datasets }
 * @param {object} [opts.opciones]
 * @param {string} [opts.alto='240px']
 * @returns {Promise<{canvas: HTMLCanvasElement, instancia: object}>}
 */
export const GraficoChartJs = async ({ tipo, datos, opciones = {}, alto = '240px' } = {}) => {
  const Chart = await cargarChartJs();
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.height = alto;
  const canvas = document.createElement('canvas');
  wrapper.appendChild(canvas);

  // Aplicamos colores del tema si no se proveen.
  const css = getComputedStyle(document.documentElement);
  const primario = css.getPropertyValue('--primary').trim() || '#2563eb';
  const muted    = css.getPropertyValue('--muted-foreground').trim() || '#6b7280';

  const instancia = new Chart(canvas, {
    type: tipo,
    data: datos,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: muted } },
      },
      scales: tipo === 'line' || tipo === 'bar' ? {
        x: { ticks: { color: muted }, grid: { color: 'rgba(120,120,120,0.1)' } },
        y: { ticks: { color: muted }, grid: { color: 'rgba(120,120,120,0.1)' } },
      } : undefined,
      color: primario,
      ...opciones,
    },
  });

  return { canvas: wrapper, instancia };
};
