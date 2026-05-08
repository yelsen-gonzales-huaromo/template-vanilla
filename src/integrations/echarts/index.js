/**
 * Adaptador para Apache ECharts — gráficos complejos e interactivos.
 *  https://echarts.apache.org/
 *
 * Más potente que Chart.js (mapas, sankey, sunburst, gauge, treemap…).
 * Pesa ~1 MB; úsalo sólo en páginas que lo necesiten.
 */
import { cargarLib } from '../_loader.js';
import { estadoUi } from '../../store/ui.store.js';

const VERSION = '5.5.1';
const URL_JS = `https://cdn.jsdelivr.net/npm/echarts@${VERSION}/dist/echarts.min.js`;

export const cargarECharts = () => cargarLib({ scripts: URL_JS, global: 'echarts' });

/**
 * Crea un gráfico ECharts.
 * @param {object} opts
 * @param {object} opts.opcion        — `option` de ECharts (https://echarts.apache.org/option.html)
 * @param {string} [opts.alto='300px']
 * @returns {Promise<{contenedor: HTMLDivElement, instancia: object}>}
 */
export const GraficoECharts = async ({ opcion, alto = '300px' } = {}) => {
  const echarts = await cargarECharts();
  const contenedor = document.createElement('div');
  contenedor.style.width = '100%';
  contenedor.style.height = alto;

  const tema = estadoUi.tema.peek();
  const instancia = echarts.init(contenedor, tema === 'dark' ? 'dark' : null);
  instancia.setOption(opcion);

  // Resize automático.
  const observador = new ResizeObserver(() => instancia.resize());
  observador.observe(contenedor);

  return { contenedor, instancia };
};
