import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA } from '../_compartido.js';
import { corner3 } from '../../../../components/ui/card/card-decoraciones.js';

// Genera datos OHLC (open/high/low/close) realistas con random walk
const generarOHLC = (n = 80, precioInicial = 120) => {
  const out = [];
  let precio = precioInicial;
  const fechas = [];
  let fecha = new Date('2025-01-01');
  for (let i = 0; i < n; i++) {
    const open = precio;
    const cambio = (Math.random() - 0.48) * 6;
    const close = +(open + cambio).toFixed(2);
    const high = +(Math.max(open, close) + Math.random() * 3).toFixed(2);
    const low  = +(Math.min(open, close) - Math.random() * 3).toFixed(2);
    out.push([open, close, low, high]);
    precio = close;
    fechas.push(fecha.toISOString().slice(5, 10));
    fecha.setDate(fecha.getDate() + 1);
  }
  return { fechas, datos: out };
};

const calcMA = (datos, n) => datos.map((_, i) => {
  if (i < n - 1) return null;
  const slice = datos.slice(i - n + 1, i + 1);
  return +(slice.reduce((s, d) => s + d[1], 0) / n).toFixed(2);
});

const generarVolumen = (datos) => datos.map(([open, close]) => ({
  value: Math.round(500000 + Math.random() * 1500000),
  itemStyle: { color: close >= open ? '#10b981' : '#ef4444' },
}));

export default async () => {
  const { fechas, datos } = generarOHLC(80, 120);
  const ma5 = calcMA(datos, 5);
  const ma20 = calcMA(datos, 20);
  const volumen = generarVolumen(datos);

  return PaginaShowcase({
    titulo: 'ECharts · Velas (Candlestick)',
    descripcion: 'Charts financieros con velas japonesas: open/high/low/close por período. Verde = cierre subió, rojo = cierre bajó. Imprescindibles para trading, criptomonedas, análisis técnico. ECharts soporta volumen integrado, medias móviles, brush selectors y zoom interactivo.',
    decoracion: corner3(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
    ],
    hijos: [

      Seccion({
        titulo: '1 · Candlestick básico',
        descripcion: 'Cada vela representa OHLC de un período (día/hora/min). El cuerpo va entre open y close; las "mechas" van a los extremos high/low.',
        hijos: [VistaCodigo({
          vista: Echart({
            alto: '380px',
            opcion: merge(opcionesBase(), {
              xAxis: { type: 'category', data: fechas },
              yAxis: { type: 'value', scale: true, splitArea: { show: true } },
              series: [{
                type: 'candlestick',
                data: datos,
                itemStyle: {
                  color: '#10b981',  borderColor: '#10b981',  // bullish (sube)
                  color0: '#ef4444', borderColor0: '#ef4444',  // bearish (baja)
                },
              }],
            }),
          }),
          codigo: `series: [{
  type: 'candlestick',
  data: [[open, close, low, high], ...],
  itemStyle: {
    color:        '#10b981',           // bullish
    borderColor:  '#10b981',
    color0:       '#ef4444',           // bearish
    borderColor0: '#ef4444',
  },
}]`,
        })],
      }),

      Seccion({
        titulo: '2 · Con medias móviles (MA5 + MA20)',
        descripcion: 'Las medias móviles filtran ruido y muestran tendencia. Patrón estándar de trading: cruce de MA5 sobre MA20 = señal de compra.',
        hijos: [VistaCodigo({
          vista: Echart({
            alto: '420px',
            opcion: merge(opcionesBase(), {
              legend: { data: ['BTC/USD', 'MA5', 'MA20'] },
              xAxis: { type: 'category', data: fechas },
              yAxis: { type: 'value', scale: true },
              series: [
                { name: 'BTC/USD', type: 'candlestick', data: datos,
                  itemStyle: { color: '#10b981', borderColor: '#10b981', color0: '#ef4444', borderColor0: '#ef4444' } },
                { name: 'MA5',  type: 'line', data: ma5,  smooth: true, showSymbol: false, lineStyle: { width: 1.5, color: PALETA[5] } },
                { name: 'MA20', type: 'line', data: ma20, smooth: true, showSymbol: false, lineStyle: { width: 1.5, color: PALETA[1] } },
              ],
            }),
          }),
          codigo: `// Calcular MA en cliente
const calcMA = (datos, n) => datos.map((_, i) => {
  if (i < n - 1) return null;
  const slice = datos.slice(i - n + 1, i + 1);
  return slice.reduce((s, d) => s + d[1], 0) / n;
});

series: [
  { type: 'candlestick', data },
  { type: 'line', data: ma5,  smooth: true },
  { type: 'line', data: ma20, smooth: true },
]`,
        })],
      }),

      Seccion({
        titulo: '3 · Con volumen abajo (sub-grid)',
        descripcion: 'Layout pro: precio arriba (70% altura), volumen abajo (25%). El volumen acompaña: alto en breakouts, bajo en consolidación.',
        hijos: [VistaCodigo({
          vista: Echart({
            alto: '480px',
            opcion: merge(opcionesBase(), {
              legend: { data: ['Precio', 'Volumen'] },
              grid: [
                { left: 50, right: 30, top: 50, height: '58%' },
                { left: 50, right: 30, top: '76%', height: '18%' },
              ],
              xAxis: [
                { type: 'category', data: fechas, gridIndex: 0, axisLabel: { show: false } },
                { type: 'category', data: fechas, gridIndex: 1, axisLabel: { fontSize: 10 } },
              ],
              yAxis: [
                { gridIndex: 0, scale: true, splitNumber: 4 },
                { gridIndex: 1, splitNumber: 2, axisLabel: { formatter: (v) => v / 1000000 + 'M' } },
              ],
              series: [
                { name: 'Precio', type: 'candlestick', data: datos, xAxisIndex: 0, yAxisIndex: 0,
                  itemStyle: { color: '#10b981', borderColor: '#10b981', color0: '#ef4444', borderColor0: '#ef4444' } },
                { name: 'Volumen', type: 'bar', data: volumen, xAxisIndex: 1, yAxisIndex: 1 },
              ],
              dataZoom: [
                { type: 'inside', xAxisIndex: [0, 1], start: 50, end: 100 },
              ],
            }),
          }),
          codigo: `grid: [
  { top: 50, height: '58%' },               // chart precio
  { top: '76%', height: '18%' },             // chart volumen
],
series: [
  { type: 'candlestick', data, xAxisIndex: 0, yAxisIndex: 0 },
  { type: 'bar',         data: volumen, xAxisIndex: 1, yAxisIndex: 1 },
]`,
        })],
      }),

      Seccion({
        titulo: '4 · Con brush — análisis sobre rango',
        descripcion: '`brush` permite al usuario seleccionar un rango con drag — útil para hacer zoom analítico sobre un período específico (mostrando volumen total, retorno, etc.).',
        hijos: [VistaCodigo({
          vista: Echart({
            alto: '420px',
            opcion: merge(opcionesBase(), {
              legend: { data: ['BTC/USD', 'MA5', 'MA20'] },
              brush: { xAxisIndex: 'all', toolbox: ['lineX', 'clear'], brushType: 'lineX' },
              toolbox: { feature: { brush: { type: ['lineX', 'clear'] } }, right: 20 },
              xAxis: { type: 'category', data: fechas },
              yAxis: { type: 'value', scale: true },
              series: [
                { name: 'BTC/USD', type: 'candlestick', data: datos,
                  itemStyle: { color: '#10b981', borderColor: '#10b981', color0: '#ef4444', borderColor0: '#ef4444' } },
                { name: 'MA5',  type: 'line', data: ma5,  smooth: true, showSymbol: false, lineStyle: { width: 1.5, color: PALETA[5] } },
                { name: 'MA20', type: 'line', data: ma20, smooth: true, showSymbol: false, lineStyle: { width: 1.5, color: PALETA[1] } },
              ],
              dataZoom: [{ type: 'inside', start: 30, end: 100 }, { type: 'slider', start: 30, end: 100, height: 20, bottom: 8 }],
            }),
          }),
          codigo: `brush: { xAxisIndex: 'all', toolbox: ['lineX', 'clear'], brushType: 'lineX' },
toolbox: { feature: { brush: { type: ['lineX', 'clear'] } } },
dataZoom: [
  { type: 'inside', start: 30, end: 100 },
  { type: 'slider', start: 30, end: 100, height: 20 },
]`,
        })],
      }),

      Seccion({
        titulo: '5 · Tipo "OHLC" (barras americanas)',
        descripcion: 'Variante alternativa: cada barra muestra high/low como línea vertical, open como tick izquierdo, close como tick derecho. Usado en charting clásico americano.',
        hijos: [VistaCodigo({
          vista: Echart({
            alto: '380px',
            opcion: merge(opcionesBase(), {
              xAxis: { type: 'category', data: fechas },
              yAxis: { type: 'value', scale: true },
              series: [{
                type: 'custom',
                renderItem: (params, api) => {
                  const yIdxOpen = api.value(0);
                  const yIdxClose = api.value(1);
                  const yIdxLow = api.value(2);
                  const yIdxHigh = api.value(3);
                  const x = api.coord([api.value(4), 0])[0];
                  const yOpen = api.coord([0, yIdxOpen])[1];
                  const yClose = api.coord([0, yIdxClose])[1];
                  const yLow = api.coord([0, yIdxLow])[1];
                  const yHigh = api.coord([0, yIdxHigh])[1];
                  const color = yIdxClose >= yIdxOpen ? '#10b981' : '#ef4444';
                  const w = api.size([1, 0])[0];
                  return {
                    type: 'group',
                    children: [
                      { type: 'line', shape: { x1: x, x2: x, y1: yLow, y2: yHigh }, style: { stroke: color, lineWidth: 1.5 } },
                      { type: 'line', shape: { x1: x - w * 0.3, x2: x, y1: yOpen, y2: yOpen }, style: { stroke: color, lineWidth: 1.5 } },
                      { type: 'line', shape: { x1: x, x2: x + w * 0.3, y1: yClose, y2: yClose }, style: { stroke: color, lineWidth: 1.5 } },
                    ],
                  };
                },
                encode: { x: 4, y: [0, 1, 2, 3] },
                data: datos.map((d, i) => [...d, i]),
              }],
            }),
          }),
          codigo: `// OHLC bars con custom renderItem
series: [{
  type: 'custom',
  renderItem: (params, api) => {
    // dibuja: vertical (high-low) + tick izq (open) + tick der (close)
    return { type: 'group', children: [...] };
  },
}]`,
        })],
      }),

      Seccion({
        titulo: '6 · Múltiples activos comparativos',
        descripcion: 'Para mostrar varios assets en el mismo chart, normaliza precios al 100% del primer día y usa `line` con marcadores. Da una visión comparativa pura.',
        hijos: [VistaCodigo({
          vista: Echart({
            alto: '380px',
            opcion: merge(opcionesBase(), {
              legend: { data: ['BTC', 'ETH', 'SOL'] },
              xAxis: { type: 'category', data: fechas },
              yAxis: { type: 'value', axisLabel: { formatter: (v) => v.toFixed(0) + '%' } },
              series: [
                { name: 'BTC', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2.5, color: '#f59e0b' },
                  data: datos.map((d, i) => +((d[1] / datos[0][1]) * 100 - 100).toFixed(2)) },
                { name: 'ETH', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2.5, color: '#3b82f6' },
                  data: datos.map((d, i) => +(((d[1] / datos[0][1]) * 100 - 100) * 0.7 + Math.sin(i * 0.3) * 8).toFixed(2)) },
                { name: 'SOL', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2.5, color: '#8b5cf6' },
                  data: datos.map((d, i) => +(((d[1] / datos[0][1]) * 100 - 100) * 1.4 + Math.cos(i * 0.2) * 12).toFixed(2)) },
              ],
            }),
          }),
          codigo: `// Normalizar precios para comparar performance
const normalizar = serie => serie.map(p => (p / serie[0]) * 100 - 100);

// Cada serie en %, eje Y muestra "+X% / -X%"
series: [
  { name: 'BTC', type: 'line', data: normalizar(btc) },
  { name: 'ETH', type: 'line', data: normalizar(eth) },
  { name: 'SOL', type: 'line', data: normalizar(sol) },
]`,
        })],
      }),

    ],
  });
};
