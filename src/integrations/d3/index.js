/**
 * Adaptador para D3.js — biblioteca de visualización de datos low-level.
 *  https://d3js.org/
 *
 * Sólo expone `cargarD3()`. La API de D3 es enorme, así que no la envolvemos:
 * cárgala donde la necesites y usa sus selecciones/escalas directamente.
 *
 *   const d3 = await cargarD3();
 *   d3.select(svg).selectAll('rect').data(datos)...;
 */
import { cargarLib } from '../_loader.js';

const VERSION = '7.9.0';
const URL_JS = `https://cdn.jsdelivr.net/npm/d3@${VERSION}/dist/d3.min.js`;

export const cargarD3 = () => cargarLib({ scripts: URL_JS, global: 'd3' });
