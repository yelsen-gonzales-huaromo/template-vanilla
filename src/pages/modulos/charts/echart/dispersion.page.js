import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA } from '../_compartido.js';
import { corner5 } from '../../../../components/ui/card/card-decoraciones.js';

const generarPuntos = (n, xCenter = 50, yCenter = 50, spread = 25) => Array.from({ length: n }, () => [
  +(xCenter + (Math.random() - 0.5) * spread * 2 + (Math.random() - 0.5) * 10).toFixed(2),
  +(yCenter + (Math.random() - 0.5) * spread * 2 + (Math.random() - 0.5) * 10).toFixed(2),
]);

export default async () => PaginaShowcase({
  titulo: 'ECharts · Dispersión / Scatter',
  descripcion: 'Scatter plots para visualizar correlación entre dos (o tres) variables. Cada punto es un par (x, y) — útil para datasets dispersos: clientes (uso vs satisfacción), productos (precio vs ventas), datasets de ML (features vs labels).',
  decoracion: corner5(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Scatter básico',
      descripcion: 'Una serie de puntos (x, y). Tamaño y color uniforme.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'value', name: 'Tiempo de uso (min)' },
            yAxis: { type: 'value', name: 'NPS' },
            tooltip: { trigger: 'item', formatter: (p) => `(${p.value[0]}, ${p.value[1]})` },
            series: [{
              type: 'scatter', data: generarPuntos(80, 50, 60, 30),
              symbolSize: 10, itemStyle: { color: PALETA[0], opacity: 0.7 },
            }],
          }),
        }),
        codigo: `series: [{
  type: 'scatter',
  data: [[12, 65], [24, 80], ...],            // pares (x, y)
  symbolSize: 10,
}]`,
      })],
    }),

    Seccion({
      titulo: '2 · Multi-cluster',
      descripcion: 'Varios clusters identificables por color. Patrón de segmentación de clientes, A/B testing, anomalía detection.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Casual', 'Power user', 'Enterprise'] },
            xAxis: { type: 'value', name: 'Sesiones/mes' },
            yAxis: { type: 'value', name: 'Spend (USD)' },
            tooltip: { trigger: 'item' },
            series: [
              { name: 'Casual',     type: 'scatter', data: generarPuntos(45, 25, 80, 15),  symbolSize: 8, itemStyle: { color: PALETA[3], opacity: 0.7 } },
              { name: 'Power user', type: 'scatter', data: generarPuntos(35, 70, 200, 20), symbolSize: 10, itemStyle: { color: PALETA[0], opacity: 0.7 } },
              { name: 'Enterprise', type: 'scatter', data: generarPuntos(20, 120, 480, 30), symbolSize: 14, itemStyle: { color: PALETA[5], opacity: 0.8 } },
            ],
          }),
        }),
        codigo: `series: [
  { name: 'Casual',     type: 'scatter', data: [...], itemStyle: { color: '#10b981' } },
  { name: 'Power user', type: 'scatter', data: [...], itemStyle: { color: '#3b82f6' } },
  { name: 'Enterprise', type: 'scatter', data: [...], itemStyle: { color: '#ef4444' } },
]`,
      })],
    }),

    Seccion({
      titulo: '3 · Bubble (3 dimensiones)',
      descripcion: 'Scatter donde el TAMAÑO del punto representa una tercera variable. Clásico de "GDP per capita vs Life expectancy" tipo Gapminder.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'value', name: 'GDP per capita (k USD)' },
            yAxis: { type: 'value', name: 'Life expectancy (años)' },
            tooltip: { trigger: 'item', formatter: (p) => `<strong>${p.data.nombre}</strong><br>GDP: ${p.value[0]}K<br>Vida: ${p.value[1]}<br>Población: ${p.value[2]}M` },
            series: [{
              type: 'scatter',
              data: [
                { value: [62, 79, 330], nombre: 'Estados Unidos', itemStyle: { color: '#3b82f6' } },
                { value: [10, 77, 1410], nombre: 'China', itemStyle: { color: '#ef4444' } },
                { value: [40, 84, 125],  nombre: 'Japón', itemStyle: { color: '#f59e0b' } },
                { value: [48, 81, 84],   nombre: 'Alemania', itemStyle: { color: '#8b5cf6' } },
                { value: [2.2, 70, 1430], nombre: 'India', itemStyle: { color: '#06b6d4' } },
                { value: [42, 81, 67],   nombre: 'Reino Unido', itemStyle: { color: '#10b981' } },
                { value: [38, 82, 65],   nombre: 'Francia', itemStyle: { color: '#ec4899' } },
                { value: [11, 76, 213],  nombre: 'Brasil', itemStyle: { color: '#84cc16' } },
                { value: [14, 72, 145],  nombre: 'Rusia', itemStyle: { color: '#0ea5e9' } },
                { value: [60, 83, 26],   nombre: 'Australia', itemStyle: { color: '#a855f7' } },
              ],
              symbolSize: (v) => Math.sqrt(v[2]) * 1.6,
              itemStyle: { opacity: 0.8 },
            }],
          }),
        }),
        codigo: `series: [{
  type: 'scatter',
  data: [
    { value: [62, 79, 330], nombre: 'USA' },   // [x, y, r]
    { value: [10, 77, 1410], nombre: 'China' },
  ],
  symbolSize: v => Math.sqrt(v[2]) * 1.6,
}]`,
      })],
    }),

    Seccion({
      titulo: '4 · Con regresión lineal visual',
      descripcion: 'Scatter + línea de tendencia (computed offline). El `markLine` con dos puntos `[xMin, m*xMin+b]` y `[xMax, m*xMax+b]` simula la recta.',
      hijos: [VistaCodigo({
        vista: (() => {
          const datos = generarPuntos(60, 50, 50, 25).map(([x, y], i) => [x, +(y * 0.6 + x * 0.5 + Math.random() * 8).toFixed(2)]);
          // Regresión simple
          const n = datos.length;
          const sumX = datos.reduce((s, [x]) => s + x, 0);
          const sumY = datos.reduce((s, [, y]) => s + y, 0);
          const sumXY = datos.reduce((s, [x, y]) => s + x * y, 0);
          const sumXX = datos.reduce((s, [x]) => s + x * x, 0);
          const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const b = (sumY - m * sumX) / n;
          return Echart({
            opcion: merge(opcionesBase(), {
              xAxis: { type: 'value', name: 'X' },
              yAxis: { type: 'value', name: 'Y' },
              tooltip: { trigger: 'item' },
              series: [{
                type: 'scatter', data: datos,
                symbolSize: 9, itemStyle: { color: PALETA[2], opacity: 0.65 },
                markLine: {
                  symbol: 'none', lineStyle: { color: PALETA[5], width: 2.5 },
                  data: [[{ coord: [0, b] }, { coord: [100, m * 100 + b] }]],
                  label: { show: true, position: 'end', formatter: `y = ${m.toFixed(2)}x + ${b.toFixed(2)}` },
                },
              }],
            }),
          });
        })(),
        codigo: `// 1. Calcular regresión en cliente (mínimos cuadrados)
const m = (n*sumXY - sumX*sumY) / (n*sumXX - sumX*sumX);
const b = (sumY - m*sumX) / n;

// 2. Trazar la recta como markLine
markLine: {
  symbol: 'none',
  data: [[{ coord: [0, b] }, { coord: [100, m*100 + b] }]],
}`,
      })],
    }),

    Seccion({
      titulo: '5 · Animado por categoría (split por color)',
      descripcion: 'Cada serie tiene su animación de entrada secuenciada. Visualmente atractivo para presentaciones live.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Producto A', 'Producto B', 'Producto C'] },
            xAxis: { type: 'value', name: 'Precio (USD)' },
            yAxis: { type: 'value', name: 'Reviews' },
            tooltip: { trigger: 'item' },
            series: [
              { name: 'Producto A', type: 'scatter', data: generarPuntos(20, 30, 4.2, 8), symbolSize: 12, itemStyle: { color: PALETA[0], opacity: 0.7 }, animationDelay: (i) => i * 30 },
              { name: 'Producto B', type: 'scatter', data: generarPuntos(20, 60, 4.5, 8), symbolSize: 12, itemStyle: { color: PALETA[1], opacity: 0.7 }, animationDelay: (i) => 600 + i * 30 },
              { name: 'Producto C', type: 'scatter', data: generarPuntos(20, 90, 4.8, 8), symbolSize: 12, itemStyle: { color: PALETA[3], opacity: 0.7 }, animationDelay: (i) => 1200 + i * 30 },
            ],
          }),
        }),
        codigo: `series: [{
  type: 'scatter',
  data: [...],
  animationDelay: i => i * 30,                 // delay incremental por punto
}]`,
      })],
    }),

    Seccion({
      titulo: '6 · Quadrant chart (matriz 2×2)',
      descripcion: 'Ejes que cruzan en valores específicos para crear cuadrantes. Útil para "Eisenhower matrix", BCG matrix, priorización.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'value', name: 'Impacto', min: 0, max: 100, axisLine: { onZero: false } },
            yAxis: { type: 'value', name: 'Esfuerzo', min: 0, max: 100, axisLine: { onZero: false } },
            tooltip: { trigger: 'item' },
            series: [{
              type: 'scatter',
              data: [
                { value: [85, 25], nombre: 'Quick wins',      itemStyle: { color: '#10b981' } },
                { value: [80, 30], nombre: 'Login social',    itemStyle: { color: '#10b981' } },
                { value: [75, 18], nombre: 'Onboarding',      itemStyle: { color: '#10b981' } },
                { value: [85, 75], nombre: 'Big bet',         itemStyle: { color: '#3b82f6' } },
                { value: [78, 88], nombre: 'AI assistant',    itemStyle: { color: '#3b82f6' } },
                { value: [22, 18], nombre: 'Time wasters',    itemStyle: { color: '#f59e0b' } },
                { value: [25, 85], nombre: 'Money pits',      itemStyle: { color: '#ef4444' } },
                { value: [30, 78], nombre: 'Refactor legacy', itemStyle: { color: '#ef4444' } },
              ],
              symbolSize: 18,
              label: { show: true, position: 'top', fontSize: 11, formatter: (p) => p.data.nombre },
              markLine: {
                symbol: 'none', lineStyle: { color: 'rgba(120,120,120,0.4)', type: 'dashed' },
                data: [{ xAxis: 50 }, { yAxis: 50 }],
              },
              markArea: {
                silent: true, itemStyle: { opacity: 0.05 },
                data: [
                  [{ name: 'Quick Wins', xAxis: 50, yAxis: 0, itemStyle: { color: '#10b981' } }, { xAxis: 100, yAxis: 50 }],
                  [{ name: 'Big Bets', xAxis: 50, yAxis: 50, itemStyle: { color: '#3b82f6' } }, { xAxis: 100, yAxis: 100 }],
                  [{ name: 'Time Wasters', xAxis: 0, yAxis: 0, itemStyle: { color: '#f59e0b' } }, { xAxis: 50, yAxis: 50 }],
                  [{ name: 'Money Pits', xAxis: 0, yAxis: 50, itemStyle: { color: '#ef4444' } }, { xAxis: 50, yAxis: 100 }],
                ],
                label: { show: true, color: 'rgba(120,120,120,0.7)', fontSize: 11, fontWeight: 700 },
              },
            }],
          }),
        }),
        codigo: `// Cuadrantes con markLine (cruz al 50%) + markArea (4 zonas)
markLine: {
  data: [{ xAxis: 50 }, { yAxis: 50 }],
},
markArea: {
  data: [
    [{ name: 'Quick Wins', xAxis: 50, yAxis: 0 }, { xAxis: 100, yAxis: 50 }],
    [{ name: 'Big Bets',   xAxis: 50, yAxis: 50 }, { xAxis: 100, yAxis: 100 }],
    // ...
  ],
}`,
      })],
    }),

  ],
});
