import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA, MESES, ventasMensuales, ventasMensualesAnt, usuariosActivos, sesionesPromedio, trafico } from '../_compartido.js';
import { corner1 } from '../../../../components/ui/card/card-decoraciones.js';

export default async () => PaginaShowcase({
  titulo: 'ECharts · Líneas',
  descripcion: 'El chart más versátil de ECharts. Usa Canvas (rápido) o SVG (escalable), maneja millones de puntos con dataZoom, soporta tooltips ricos, animaciones de entrada y todo tipo de variantes: liso, suavizado, área, apilado, doble eje, step, gradient, multi-serie con marcadores.',
  decoracion: corner1(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Línea básica',
      descripcion: 'El default. Una serie, eje X de categorías, eje Y numérico, tooltip al hover.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES },
            yAxis: { type: 'value' },
            series: [{ data: ventasMensuales, type: 'line', smooth: false }],
          }),
        }),
        codigo: `{
  xAxis: { type: 'category', data: MESES },
  yAxis: { type: 'value' },
  series: [{ data: ventas, type: 'line' }],
}`,
      })],
    }),

    Seccion({
      titulo: '2 · Línea suavizada con área gradiente',
      descripcion: '`smooth: true` curva la línea, `areaStyle` con gradiente vertical da el look "Stripe Dashboard". Las líneas suaves transmiten tendencia; las rectas, datos exactos.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES, boundaryGap: false },
            yAxis: { type: 'value' },
            series: [{
              data: ventasMensuales, type: 'line', smooth: true,
              showSymbol: false,
              lineStyle: { width: 3, color: PALETA[0] },
              areaStyle: {
                color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: PALETA[0] + 'AA' }, { offset: 1, color: PALETA[0] + '00' }],
                },
              },
              emphasis: { focus: 'series' },
            }],
          }),
        }),
        codigo: `series: [{
  data, type: 'line',
  smooth: true,                           // curva suave
  showSymbol: false,                      // sin puntos
  lineStyle: { width: 3, color: '#3b82f6' },
  areaStyle: {
    color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: '#3b82f6AA' },
        { offset: 1, color: '#3b82f600' },
      ],
    },
  },
}]`,
      })],
    }),

    Seccion({
      titulo: '3 · Multi-serie con leyenda',
      descripcion: 'Comparativa de 3+ series con la misma escala. Click en la leyenda para mostrar/ocultar series.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Web', 'Mobile', 'API'] },
            xAxis: { type: 'category', data: MESES, boundaryGap: false },
            yAxis: { type: 'value' },
            series: [
              { name: 'Web',    data: usuariosActivos,                     type: 'line', smooth: true, lineStyle: { width: 3 } },
              { name: 'Mobile', data: usuariosActivos.map((v) => v * 0.7), type: 'line', smooth: true, lineStyle: { width: 3 } },
              { name: 'API',    data: usuariosActivos.map((v) => v * 0.3), type: 'line', smooth: true, lineStyle: { width: 3 } },
            ],
          }),
        }),
        codigo: `series: [
  { name: 'Web',    data: [...], type: 'line', smooth: true },
  { name: 'Mobile', data: [...], type: 'line', smooth: true },
  { name: 'API',    data: [...], type: 'line', smooth: true },
]`,
      })],
    }),

    Seccion({
      titulo: '4 · Área apilada',
      descripcion: 'Para mostrar evolución del TOTAL y la composición por categoría. `stack: "total"` agrupa series y `areaStyle` les da el relleno.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Email', 'Push', 'In-app', 'SMS'] },
            xAxis: { type: 'category', data: MESES, boundaryGap: false },
            yAxis: { type: 'value' },
            series: [
              { name: 'Email',  data: [120, 132, 101, 134, 90, 230, 210, 245, 280, 295, 310, 340], type: 'line', stack: 'Total', smooth: true, areaStyle: {} },
              { name: 'Push',   data: [220, 182, 191, 234, 290, 330, 310, 320, 345, 380, 410, 460], type: 'line', stack: 'Total', smooth: true, areaStyle: {} },
              { name: 'In-app', data: [150, 232, 201, 154, 190, 330, 410, 380, 365, 410, 440, 480], type: 'line', stack: 'Total', smooth: true, areaStyle: {} },
              { name: 'SMS',    data: [320, 332, 301, 334, 390, 330, 320, 360, 380, 410, 460, 510], type: 'line', stack: 'Total', smooth: true, areaStyle: {} },
            ],
          }),
        }),
        codigo: `series: [
  { name: 'Email', data: [...], type: 'line', stack: 'Total', areaStyle: {} },
  { name: 'Push',  data: [...], type: 'line', stack: 'Total', areaStyle: {} },
  { name: 'SMS',   data: [...], type: 'line', stack: 'Total', areaStyle: {} },
]`,
      })],
    }),

    Seccion({
      titulo: '5 · Doble eje Y',
      descripcion: 'Dos métricas con escalas distintas — ej. usuarios (miles) y duración media (minutos). Cada serie referencia su `yAxisIndex`.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Usuarios', 'Sesión media (min)'] },
            xAxis: { type: 'category', data: MESES, boundaryGap: false },
            yAxis: [
              { type: 'value', name: 'Usuarios' },
              { type: 'value', name: 'Min', position: 'right' },
            ],
            series: [
              { name: 'Usuarios',          data: usuariosActivos,  type: 'line', smooth: true, yAxisIndex: 0, lineStyle: { width: 3 } },
              { name: 'Sesión media (min)', data: sesionesPromedio, type: 'line', smooth: true, yAxisIndex: 1, lineStyle: { width: 3, type: 'dashed' } },
            ],
          }),
        }),
        codigo: `yAxis: [
  { type: 'value', name: 'Usuarios' },
  { type: 'value', name: 'Min', position: 'right' },
],
series: [
  { name: 'Usuarios', data, type: 'line', yAxisIndex: 0 },
  { name: 'Sesión',   data, type: 'line', yAxisIndex: 1 },
]`,
      })],
    }),

    Seccion({
      titulo: '6 · Step line',
      descripcion: 'Línea escalonada — se mantiene horizontal hasta el siguiente punto. Útil para tarifas escalonadas, status changes, on/off.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES, boundaryGap: false },
            yAxis: { type: 'value' },
            series: [{
              data: [10, 10, 22, 22, 22, 35, 35, 50, 50, 75, 75, 100],
              type: 'line', step: 'end',
              lineStyle: { width: 3, color: PALETA[3] },
              symbol: 'circle', symbolSize: 8,
              itemStyle: { color: PALETA[3] },
            }],
          }),
        }),
        codigo: `series: [{
  data, type: 'line',
  step: 'end',                            // 'start' | 'middle' | 'end'
}]`,
      })],
    }),

    Seccion({
      titulo: '7 · Con markers (max · min · avg)',
      descripcion: 'Líneas/puntos de referencia: `markPoint` resalta puntos clave, `markLine` traza líneas (promedio, target, etc.).',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: MESES, boundaryGap: false },
            yAxis: { type: 'value' },
            series: [{
              data: ventasMensuales, type: 'line', smooth: true,
              lineStyle: { width: 3 }, areaStyle: {
                color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: PALETA[0] + '88' }, { offset: 1, color: PALETA[0] + '00' }],
                },
              },
              markPoint: {
                data: [
                  { type: 'max', name: 'Máximo' },
                  { type: 'min', name: 'Mínimo' },
                ],
              },
              markLine: {
                data: [{ type: 'average', name: 'Promedio' }],
                lineStyle: { color: PALETA[5] },
              },
            }],
          }),
        }),
        codigo: `series: [{
  data, type: 'line',
  markPoint: {
    data: [
      { type: 'max', name: 'Máximo' },
      { type: 'min', name: 'Mínimo' },
    ],
  },
  markLine: {
    data: [{ type: 'average', name: 'Promedio' }],
  },
}]`,
      })],
    }),

    Seccion({
      titulo: '8 · Con dataZoom (millones de puntos)',
      descripcion: 'Para datasets grandes — el dataZoom inferior permite navegar zoom-in/out con scroll o slider. ECharts maneja esto sin frame drops.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            grid: { bottom: 80 },
            xAxis: { type: 'category', data: Array.from({ length: 200 }, (_, i) => `Día ${i + 1}`), boundaryGap: false },
            yAxis: { type: 'value' },
            dataZoom: [
              { type: 'inside', start: 30, end: 70 },
              { type: 'slider', start: 30, end: 70, height: 24, bottom: 20 },
            ],
            series: [{
              data: Array.from({ length: 200 }, (_, i) => Math.round(50 + Math.sin(i * 0.1) * 30 + Math.random() * 20 + i * 0.5)),
              type: 'line', smooth: true, showSymbol: false,
              lineStyle: { width: 2, color: PALETA[2] },
              areaStyle: {
                color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: PALETA[2] + '88' }, { offset: 1, color: PALETA[2] + '00' }],
                },
              },
            }],
          }),
        }),
        codigo: `dataZoom: [
  { type: 'inside', start: 30, end: 70 },        // scroll/pinch
  { type: 'slider', start: 30, end: 70 },        // slider visual
],`,
      })],
    }),

    Seccion({
      titulo: '9 · Pulsing line — tráfico en vivo',
      descripcion: 'Patrón de monitoring: línea fina + glow. Combinado con `setInterval` para actualizar puntos y `mergeOption` simula tráfico real-time.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => `${i}h`), boundaryGap: false },
            yAxis: { type: 'value', max: 3000 },
            series: [{
              data: Array.from({ length: 24 }, (_, i) => trafico[i % trafico.length] + Math.random() * 200),
              type: 'line', smooth: true, showSymbol: false,
              lineStyle: { width: 2, color: PALETA[8], shadowColor: PALETA[8], shadowBlur: 12 },
              areaStyle: {
                color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{ offset: 0, color: PALETA[8] + '66' }, { offset: 1, color: PALETA[8] + '00' }],
                },
              },
            }],
          }),
        }),
        codigo: `series: [{
  data, type: 'line', smooth: true,
  lineStyle: {
    width: 2, color: '#0ea5e9',
    shadowColor: '#0ea5e9', shadowBlur: 12,    // glow
  },
}]

// Live update:
setInterval(() => {
  data.shift(); data.push(nuevoValor);
  inst.setOption({ series: [{ data }] });
}, 1000);`,
      })],
    }),

    Seccion({
      titulo: '10 · Línea + barras (mixed)',
      descripcion: 'Combina dos `type` distintos en la misma serie. Patrón clásico de informes financieros: barras para volumen, línea para tendencia.',
      hijos: [VistaCodigo({
        vista: Echart({
          opcion: merge(opcionesBase(), {
            legend: { data: ['Ingresos', 'Crecimiento %'] },
            xAxis: { type: 'category', data: MESES },
            yAxis: [
              { type: 'value', name: 'USD', axisLabel: { formatter: (v) => v / 1000 + 'K' } },
              { type: 'value', name: '%', position: 'right', max: 100, min: 0 },
            ],
            series: [
              {
                name: 'Ingresos', type: 'bar', yAxisIndex: 0,
                data: ventasMensuales,
                itemStyle: { borderRadius: [6, 6, 0, 0],
                  color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [{ offset: 0, color: PALETA[0] }, { offset: 1, color: PALETA[0] + '55' }],
                  },
                },
              },
              {
                name: 'Crecimiento %', type: 'line', yAxisIndex: 1, smooth: true,
                data: ventasMensuales.map((v, i, a) => i === 0 ? 0 : Math.round((v / a[i - 1] - 1) * 100)),
                lineStyle: { width: 3, color: PALETA[5] },
                itemStyle: { color: PALETA[5] },
              },
            ],
          }),
        }),
        codigo: `series: [
  { name: 'Ingresos',     type: 'bar',  yAxisIndex: 0, data: [...] },
  { name: 'Crecimiento %', type: 'line', yAxisIndex: 1, data: [...] },
]`,
      })],
    }),

  ],
});
