import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA, MESES, ventasMensuales, ventasMensualesAnt, DIAS } from '../_compartido.js';
import { corner2 } from '../../../../components/ui/card/card-decoraciones.js';

export default async () => PaginaShowcase({
  titulo: 'ECharts · Barras',
  descripcion: 'Bar charts: básico, horizontal, agrupado, apilado, con gradiente, mixto, waterfall, polarizado y race chart. Las barras son el chart más legible para comparativas categóricas — ECharts las anima de forma fluida y soporta tooltips interactivos.',
  decoracion: corner2(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Barras vertical básico',
      descripcion: 'Default. Bordes redondeados arriba (`borderRadius: [6,6,0,0]`) para estética moderna.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES },
            yAxis: { type: 'value' },
            series: [{
              data: ventasMensuales, type: 'bar',
              itemStyle: { color: PALETA[0], borderRadius: [6, 6, 0, 0] },
            }],
          }),
        }),
        codigo: `series: [{
  data, type: 'bar',
  itemStyle: {
    color: '#3b82f6',
    borderRadius: [6, 6, 0, 0],          // [TL, TR, BR, BL]
  },
}]`,
      })],
    }),

    Seccion({
      titulo: '2 · Horizontal',
      descripcion: 'Inverte ejes — `xAxis: value`, `yAxis: category`. Ideal cuando las labels son largas (no se solapan).',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            grid: { left: 110 },
            xAxis: { type: 'value' },
            yAxis: { type: 'category', data: ['Estados Unidos', 'China', 'Japón', 'Alemania', 'India', 'Reino Unido', 'Francia', 'Italia'] },
            series: [{
              data: [25400, 18800, 4900, 4200, 3700, 3100, 2900, 2100], type: 'bar',
              itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [{ offset: 0, color: PALETA[0] + '55' }, { offset: 1, color: PALETA[0] }],
                },
              },
            }],
          }),
        }),
        codigo: `xAxis: { type: 'value' },
yAxis: { type: 'category', data: paises },
series: [{ data, type: 'bar' }]`,
      })],
    }),

    Seccion({
      titulo: '3 · Agrupadas (side-by-side)',
      descripcion: 'Series sin `stack` aparecen lado a lado. Compara categorías entre sí.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Web', 'Mobile', 'API'] },
            xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
            yAxis: { type: 'value', axisLabel: { formatter: (v) => v / 1000 + 'K' } },
            series: [
              { name: 'Web',    data: [12000, 15400, 18200, 22800], type: 'bar', itemStyle: { borderRadius: [6, 6, 0, 0], color: PALETA[0] } },
              { name: 'Mobile', data: [8400, 11200, 14600, 19200],  type: 'bar', itemStyle: { borderRadius: [6, 6, 0, 0], color: PALETA[1] } },
              { name: 'API',    data: [3200, 4400, 5800, 7400],     type: 'bar', itemStyle: { borderRadius: [6, 6, 0, 0], color: PALETA[3] } },
            ],
          }),
        }),
        codigo: `series: [
  { name: 'Web',    data: [...], type: 'bar' },
  { name: 'Mobile', data: [...], type: 'bar' },
  { name: 'API',    data: [...], type: 'bar' },
]`,
      })],
    }),

    Seccion({
      titulo: '4 · Apiladas (stacked)',
      descripcion: 'Series con `stack: "Total"` se apilan. Muestra composición + total de un vistazo.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Email', 'Push', 'In-app', 'SMS'] },
            xAxis: { type: 'category', data: DIAS },
            yAxis: { type: 'value' },
            series: [
              { name: 'Email',  type: 'bar', stack: 'Total', data: [120, 95, 140, 165, 110, 60, 30],  itemStyle: { borderRadius: [0, 0, 0, 0] } },
              { name: 'Push',   type: 'bar', stack: 'Total', data: [80, 110, 95, 140, 95, 50, 25] },
              { name: 'In-app', type: 'bar', stack: 'Total', data: [60, 75, 85, 95, 70, 30, 15] },
              { name: 'SMS',    type: 'bar', stack: 'Total', data: [40, 35, 50, 65, 45, 20, 10],     itemStyle: { borderRadius: [6, 6, 0, 0] } },
            ],
          }),
        }),
        codigo: `series: [
  { name: 'Email', type: 'bar', stack: 'Total', data: [...] },
  { name: 'Push',  type: 'bar', stack: 'Total', data: [...] },
  { name: 'SMS',   type: 'bar', stack: 'Total', data: [...] },
]`,
      })],
    }),

    Seccion({
      titulo: '5 · Apiladas 100% (composición)',
      descripcion: 'Cuando lo importante es la PROPORCIÓN de cada categoría, no los valores absolutos. Cada barra suma 100%.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Orgánico', 'Pago', 'Email', 'Social'] },
            xAxis: { type: 'category', data: DIAS },
            yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
            series: [
              { name: 'Orgánico', type: 'bar', stack: 'p', data: [42, 38, 45, 48, 40, 50, 55], itemStyle: { color: PALETA[3] } },
              { name: 'Pago',     type: 'bar', stack: 'p', data: [28, 32, 25, 22, 30, 25, 20], itemStyle: { color: PALETA[0] } },
              { name: 'Email',    type: 'bar', stack: 'p', data: [18, 15, 18, 16, 18, 15, 15], itemStyle: { color: PALETA[1] } },
              { name: 'Social',   type: 'bar', stack: 'p', data: [12, 15, 12, 14, 12, 10, 10], itemStyle: { color: PALETA[5], borderRadius: [6, 6, 0, 0] } },
            ],
          }),
        }),
        codigo: `// Suma 100% por barra (calculado pre-data o normalizado en server)
series: [
  { stack: 'p', data: [42, 38, 45, ...] },         // %
  { stack: 'p', data: [28, 32, 25, ...] },
  { stack: 'p', data: [18, 15, 18, ...] },
  { stack: 'p', data: [12, 15, 12, ...] },
]`,
      })],
    }),

    Seccion({
      titulo: '6 · Con gradiente vertical',
      descripcion: 'Cada barra con un gradiente — más bonito que un color sólido para hero charts y dashboards visualmente cargados.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES },
            yAxis: { type: 'value', axisLabel: { formatter: (v) => v / 1000 + 'K' } },
            series: [{
              data: ventasMensuales, type: 'bar',
              itemStyle: {
                borderRadius: [8, 8, 0, 0],
                color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: PALETA[1] }, { offset: 0.5, color: PALETA[0] }, { offset: 1, color: PALETA[0] + '33' }],
                },
              },
              barWidth: '50%',
              emphasis: { itemStyle: { shadowBlur: 20, shadowColor: PALETA[0] + '99' } },
            }],
          }),
        }),
        codigo: `itemStyle: {
  borderRadius: [8, 8, 0, 0],
  color: {
    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0,   color: '#8b5cf6' },         // top
      { offset: 0.5, color: '#3b82f6' },
      { offset: 1,   color: '#3b82f633' },       // bottom (transp.)
    ],
  },
}`,
      })],
    }),

    Seccion({
      titulo: '7 · Comparativa positivo/negativo',
      descripcion: 'Barras divergentes con escala que cruza el 0. Cambia color por signo de los valores.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES },
            yAxis: { type: 'value' },
            series: [{
              type: 'bar',
              data: [4.2, 6.8, -3.1, 8.5, 5.2, -2.4, 9.8, 12.4, 6.7, 4.1, -1.8, 8.9].map((v) => ({
                value: v,
                itemStyle: {
                  color: v >= 0 ? '#10b981' : '#ef4444',
                  borderRadius: v >= 0 ? [6, 6, 0, 0] : [0, 0, 6, 6],
                },
              })),
              barWidth: '50%',
            }],
          }),
        }),
        codigo: `// Color condicional por valor
data: valores.map(v => ({
  value: v,
  itemStyle: {
    color: v >= 0 ? '#10b981' : '#ef4444',
    borderRadius: v >= 0 ? [6,6,0,0] : [0,0,6,6],
  },
}))`,
      })],
    }),

    Seccion({
      titulo: '8 · Waterfall (cascada financiera)',
      descripcion: 'Para descomposición de un total — útil en finanzas (revenue → costs → margen) o crecimiento de usuarios (active → churn → growth).',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: ['Inicial', 'Adquisición', 'Activación', 'Churn', 'Expansión', 'Final'] },
            yAxis: { type: 'value' },
            series: [
              {
                name: 'placeholder', type: 'bar', stack: 'total',
                itemStyle: { borderColor: 'transparent', color: 'transparent' },
                emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
                data: [0, 12000, 18000, 14500, 11000, 0],
              },
              {
                name: 'cambio', type: 'bar', stack: 'total',
                data: [
                  { value: 12000, itemStyle: { color: '#3b82f6' } },
                  { value: 6000,  itemStyle: { color: '#10b981' } },
                  { value: -3500, itemStyle: { color: '#10b981' } },
                  { value: -3500, itemStyle: { color: '#ef4444' } },
                  { value: 4500,  itemStyle: { color: '#10b981' } },
                  { value: 15500, itemStyle: { color: '#3b82f6' } },
                ],
                itemStyle: { borderRadius: [4, 4, 4, 4] },
                label: { show: true, position: 'top', formatter: (p) => (p.value > 0 ? '+' : '') + (p.value / 1000).toFixed(1) + 'K' },
              },
            ],
          }),
        }),
        codigo: `// Waterfall = serie placeholder transparente + serie de cambios
series: [
  { type: 'bar', stack: 'total', data: [0, 12000, 18000, ...], itemStyle: { color: 'transparent' } },
  { type: 'bar', stack: 'total', data: [
    { value: 12000, itemStyle: { color: '#3b82f6' } },
    { value: 6000,  itemStyle: { color: '#10b981' } },
    { value: -3500, itemStyle: { color: '#ef4444' } },
  ]},
]`,
      })],
    }),

    Seccion({
      titulo: '9 · Bar polar (en coordenadas radiales)',
      descripcion: 'Las barras dispuestas en un anillo. Look "Apple Activity Rings" o métricas circulares.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            angleAxis: { type: 'category', data: ['Apertura', 'CTR', 'Conversión', 'Retención', 'Engagement', 'NPS'] },
            radiusAxis: {},
            polar: { center: ['50%', '54%'], radius: ['18%', '85%'] },
            series: [{
              type: 'bar', coordinateSystem: 'polar',
              data: [78, 42, 18, 65, 88, 56],
              itemStyle: {
                color: (p) => PALETA[p.dataIndex % PALETA.length],
                borderRadius: 8,
              },
              barWidth: '60%',
            }],
            grid: undefined,
            xAxis: undefined,
            yAxis: undefined,
          }),
        }),
        codigo: `polar: { center: ['50%', '54%'], radius: ['18%', '85%'] },
angleAxis: { type: 'category', data: categorias },
radiusAxis: {},
series: [{
  type: 'bar', coordinateSystem: 'polar',
  data: valores,
}]`,
      })],
    }),

    Seccion({
      titulo: '10 · Bar race (animado por intervalo)',
      descripcion: 'Las barras se reordenan al cambiar los datos — ideal para "evolución del top 5". Aquí simulamos pero la magia está en `mergeOption` cada N segundos.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '320px',
          opcion: merge(opcionesBase(), {
            grid: { left: 100 },
            xAxis: { type: 'value', max: 'dataMax' },
            yAxis: { type: 'category', data: ['Vercel', 'Netlify', 'AWS', 'Cloudflare', 'Render', 'Railway'].reverse(), inverse: true, animationDuration: 300, animationDurationUpdate: 300 },
            series: [{
              type: 'bar', realtimeSort: true,
              data: [820, 760, 940, 680, 320, 290].reverse().map((v, i) => ({ value: v, itemStyle: { color: PALETA[i], borderRadius: [0, 6, 6, 0] } })),
              label: { show: true, position: 'right', valueAnimation: true, formatter: (p) => Math.round(p.value).toLocaleString() },
            }],
            animationDuration: 800, animationDurationUpdate: 600, animationEasingUpdate: 'linear',
          }),
        }),
        codigo: `// Bar race con realtimeSort
yAxis: { animationDuration: 300, animationDurationUpdate: 300 },
series: [{
  type: 'bar', realtimeSort: true,
  label: { show: true, position: 'right', valueAnimation: true },
}]

// Para animar:
setInterval(() => {
  inst.setOption({ series: [{ data: nuevosValores }] });
}, 2000);`,
      })],
    }),

  ],
});
