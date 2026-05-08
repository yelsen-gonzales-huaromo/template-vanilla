import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA } from '../_compartido.js';
import { corner7 } from '../../../../components/ui/card/card-decoraciones.js';

export default async () => PaginaShowcase({
  titulo: 'ECharts · Gauge',
  descripcion: 'Gauges para mostrar progreso, KPIs, scores. Variantes: básico (speedometer), grade (clasificación), progress (anillo), multi-needle, ring, gradient. ECharts es la única lib gratuita con gauges 1:1 con Highcharts.',
  decoracion: corner7(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Speedometer clásico',
      descripcion: 'El velocímetro de toda la vida. Aguja apuntando al valor actual sobre una escala 0-100.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '320px',
          opcion: merge(opcionesBase(), {
            series: [{
              type: 'gauge', radius: '85%',
              detail: { valueAnimation: true, formatter: '{value}', color: 'inherit', fontSize: 28, offsetCenter: [0, '70%'] },
              data: [{ value: 73, name: 'Velocidad' }],
              title: { offsetCenter: [0, '95%'], color: 'inherit', fontSize: 12 },
              progress: { show: true, width: 12 },
              axisLine: { lineStyle: { width: 12, color: [[1, 'rgba(120,120,120,0.18)']] } },
              axisTick: { distance: -22, length: 6, lineStyle: { color: 'inherit', opacity: 0.5 } },
              splitLine: { distance: -28, length: 12, lineStyle: { color: 'inherit', width: 2, opacity: 0.7 } },
              axisLabel: { distance: -42, color: 'inherit', fontSize: 11 },
              pointer: { itemStyle: { color: PALETA[0] }, length: '60%', width: 5 },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined, tooltip: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'gauge',
  data: [{ value: 73, name: 'Velocidad' }],
  progress: { show: true, width: 12 },
  pointer: { length: '60%', width: 5 },
}]`,
      })],
    }),

    Seccion({
      titulo: '2 · Grade (multi-color por rango)',
      descripcion: 'Escala dividida en colores: verde (0-40) → amarillo (40-70) → naranja (70-90) → rojo (90-100). Útil para "salud del sistema".',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '320px',
          opcion: merge(opcionesBase(), {
            series: [{
              type: 'gauge', radius: '85%',
              detail: { valueAnimation: true, formatter: '{value}%', color: 'inherit', fontSize: 30, offsetCenter: [0, '70%'] },
              data: [{ value: 62 }],
              progress: { show: true, width: 14, itemStyle: { color: PALETA[5] } },
              axisLine: {
                lineStyle: {
                  width: 14,
                  color: [
                    [0.4, '#10b981'],
                    [0.7, '#f59e0b'],
                    [0.9, '#ef4444'],
                    [1, '#7f1d1d'],
                  ],
                },
              },
              axisTick: { show: false },
              splitLine: { distance: -22, length: 14, lineStyle: { color: '#fff', width: 3 } },
              axisLabel: { distance: -38, color: 'inherit', fontSize: 11 },
              pointer: { length: '65%', width: 4, itemStyle: { color: 'auto' } },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined, tooltip: undefined,
          }),
        }),
        codigo: `axisLine: {
  lineStyle: {
    width: 14,
    color: [
      [0.4, '#10b981'],   // 0-40   verde
      [0.7, '#f59e0b'],   // 40-70  amarillo
      [0.9, '#ef4444'],   // 70-90  rojo
      [1,   '#7f1d1d'],   // 90-100 rojo oscuro
    ],
  },
}`,
      })],
    }),

    Seccion({
      titulo: '3 · Progress ring (sin aguja)',
      descripcion: 'Anillo de progreso minimalista. Sin aguja, sin ticks. Ideal para "% completado" en dashboards modernos.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '320px',
          opcion: merge(opcionesBase(), {
            series: [{
              type: 'gauge', radius: '85%', startAngle: 90, endAngle: -270,
              data: [{ value: 73, name: 'Performance' }],
              pointer: { show: false },
              progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: { borderWidth: 0,
                color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
                  colorStops: [{ offset: 0, color: PALETA[2] }, { offset: 1, color: PALETA[1] }],
                },
              } },
              axisLine: { lineStyle: { width: 18, color: [[1, 'rgba(120,120,120,0.12)']] } },
              splitLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              detail: { valueAnimation: true, fontSize: 42, fontWeight: 800, formatter: '{value}%', color: 'inherit', offsetCenter: [0, 0] },
              title: { offsetCenter: [0, '36%'], color: 'inherit', fontSize: 12, fontWeight: 600 },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined, tooltip: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'gauge',
  startAngle: 90, endAngle: -270,             // círculo completo
  pointer: { show: false },
  progress: { show: true, roundCap: true, itemStyle: { color: gradient } },
  axisLine: { lineStyle: { width: 18, color: [[1, '#eee']] } },
  splitLine: { show: false },
  axisTick: { show: false },
  axisLabel: { show: false },
}]`,
      })],
    }),

    Seccion({
      titulo: '4 · Multi-needle (varias métricas)',
      descripcion: 'Varias agujas en el mismo gauge para comparar valores. Ej. "performance actual vs target vs promedio".',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '340px',
          opcion: merge(opcionesBase(), {
            series: [{
              type: 'gauge', radius: '85%',
              data: [
                { value: 75, name: 'Actual',   itemStyle: { color: PALETA[0] }, title: { offsetCenter: [-50, '85%'] }, detail: { offsetCenter: [-50, '95%'] } },
                { value: 60, name: 'Promedio', itemStyle: { color: PALETA[5] }, title: { offsetCenter: [0, '85%'] },   detail: { offsetCenter: [0, '95%'] } },
                { value: 90, name: 'Target',   itemStyle: { color: PALETA[3] }, title: { offsetCenter: [50, '85%'] },  detail: { offsetCenter: [50, '95%'] } },
              ],
              detail: { valueAnimation: true, color: 'inherit', fontSize: 14, fontWeight: 700 },
              title: { color: 'inherit', fontSize: 11, opacity: 0.7 },
              progress: { show: false },
              axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(120,120,120,0.18)']] } },
              axisTick: { distance: -16, length: 5, lineStyle: { color: 'inherit', opacity: 0.5 } },
              splitLine: { distance: -22, length: 10, lineStyle: { color: 'inherit', width: 2, opacity: 0.7 } },
              axisLabel: { distance: -36, color: 'inherit', fontSize: 10 },
              pointer: { length: '55%', width: 4 },
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined, tooltip: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'gauge',
  data: [
    { value: 75, name: 'Actual',   itemStyle: { color: '#3b82f6' } },
    { value: 60, name: 'Promedio', itemStyle: { color: '#ef4444' } },
    { value: 90, name: 'Target',   itemStyle: { color: '#10b981' } },
  ],
}]`,
      })],
    }),

    Seccion({
      titulo: '5 · KPI con label personalizada',
      descripcion: 'Gauge sin aguja con título grande y subtítulo descriptivo en el centro. Patrón "score de calidad", "credit rating".',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '320px',
          opcion: merge(opcionesBase(), {
            series: [{
              type: 'gauge', radius: '85%', startAngle: 200, endAngle: -20,
              min: 0, max: 100,
              data: [{ value: 87 }],
              pointer: { show: false },
              progress: { show: true, width: 22, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#10b981' }, { offset: 1, color: '#0ea5e9' }] }, borderWidth: 0 }, roundCap: true },
              axisLine: { lineStyle: { width: 22, color: [[1, 'rgba(120,120,120,0.12)']] } },
              axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
              detail: { valueAnimation: true, fontSize: 56, fontWeight: 800, color: 'inherit', formatter: '{value}', offsetCenter: [0, '-10%'] },
              title: { fontSize: 13, color: 'inherit', opacity: 0.7, offsetCenter: [0, '20%'] },
            }],
            graphic: [
              { type: 'text', left: 'center', top: '70%', style: { text: 'Excelente · A+', fontSize: 14, fontWeight: 700, fill: '#10b981' } },
            ],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined, tooltip: undefined,
          }),
        }),
        codigo: `series: [{
  type: 'gauge',
  startAngle: 200, endAngle: -20,             // 240° de arco
  progress: { show: true, width: 22, roundCap: true },
  detail: { fontSize: 56, fontWeight: 800 },
}],
graphic: [{ type: 'text', style: { text: 'Excelente · A+' } }]`,
      })],
    }),

    Seccion({
      titulo: '6 · Grid de KPIs (mini-gauges)',
      descripcion: 'Múltiples gauges chicos para dashboard de monitoring. Apilamos 4 charts en columnas — cada uno un KPI.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '260px',
          opcion: merge(opcionesBase(), {
            series: [
              { type: 'gauge', center: ['12.5%', '50%'], radius: '60%', data: [{ value: 78, name: 'CPU' }],
                progress: { show: true, width: 8, itemStyle: { color: '#3b82f6' } },
                axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(120,120,120,0.12)']] } },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                pointer: { show: false }, startAngle: 90, endAngle: -270,
                detail: { fontSize: 22, fontWeight: 800, color: 'inherit', formatter: '{value}%', offsetCenter: [0, 0] },
                title: { fontSize: 11, color: 'inherit', opacity: 0.7, offsetCenter: [0, '70%'] },
              },
              { type: 'gauge', center: ['37.5%', '50%'], radius: '60%', data: [{ value: 42, name: 'RAM' }],
                progress: { show: true, width: 8, itemStyle: { color: '#10b981' } },
                axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(120,120,120,0.12)']] } },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                pointer: { show: false }, startAngle: 90, endAngle: -270,
                detail: { fontSize: 22, fontWeight: 800, color: 'inherit', formatter: '{value}%', offsetCenter: [0, 0] },
                title: { fontSize: 11, color: 'inherit', opacity: 0.7, offsetCenter: [0, '70%'] },
              },
              { type: 'gauge', center: ['62.5%', '50%'], radius: '60%', data: [{ value: 91, name: 'Disco' }],
                progress: { show: true, width: 8, itemStyle: { color: '#f59e0b' } },
                axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(120,120,120,0.12)']] } },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                pointer: { show: false }, startAngle: 90, endAngle: -270,
                detail: { fontSize: 22, fontWeight: 800, color: 'inherit', formatter: '{value}%', offsetCenter: [0, 0] },
                title: { fontSize: 11, color: 'inherit', opacity: 0.7, offsetCenter: [0, '70%'] },
              },
              { type: 'gauge', center: ['87.5%', '50%'], radius: '60%', data: [{ value: 28, name: 'Red' }],
                progress: { show: true, width: 8, itemStyle: { color: '#8b5cf6' } },
                axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(120,120,120,0.12)']] } },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                pointer: { show: false }, startAngle: 90, endAngle: -270,
                detail: { fontSize: 22, fontWeight: 800, color: 'inherit', formatter: '{value}%', offsetCenter: [0, 0] },
                title: { fontSize: 11, color: 'inherit', opacity: 0.7, offsetCenter: [0, '70%'] },
              },
            ],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined, tooltip: undefined,
          }),
        }),
        codigo: `// 4 mini-gauges en una sola instancia con center: ['x%', 'y%']
series: [
  { type: 'gauge', center: ['12.5%', '50%'], data: [{ value: 78, name: 'CPU' }] },
  { type: 'gauge', center: ['37.5%', '50%'], data: [{ value: 42, name: 'RAM' }] },
  { type: 'gauge', center: ['62.5%', '50%'], data: [{ value: 91, name: 'Disco' }] },
  { type: 'gauge', center: ['87.5%', '50%'], data: [{ value: 28, name: 'Red' }] },
]`,
      })],
    }),

  ],
});
