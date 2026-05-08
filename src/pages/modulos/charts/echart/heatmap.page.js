import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA, DIAS } from '../_compartido.js';
import { corner2 } from '../../../../components/ui/card/card-decoraciones.js';

const HORAS = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

// Datos sintéticos de tráfico web por día/hora
const datosCalendario = [];
for (let d = 0; d < 7; d++) {
  for (let h = 0; h < 12; h++) {
    let valor;
    if (h < 3 || h > 10) valor = 5 + Math.random() * 15; // noche
    else if (d >= 5)     valor = 30 + Math.random() * 20; // fin de semana
    else                 valor = 50 + Math.random() * 40; // semana laboral
    datosCalendario.push([h, d, +valor.toFixed(1)]);
  }
}

// Datos para calendar heatmap (último año, formato GitHub)
const generarCalendarioAnual = () => {
  const out = [];
  const hoy = new Date();
  for (let i = 365; i >= 0; i--) {
    const f = new Date(hoy);
    f.setDate(hoy.getDate() - i);
    const fechaStr = f.toISOString().slice(0, 10);
    const dow = f.getDay();
    const baseValue = dow === 0 || dow === 6 ? 2 : 8;
    const valor = Math.max(0, Math.round(baseValue + (Math.random() - 0.5) * 8 + Math.sin(i / 30) * 4));
    out.push([fechaStr, valor]);
  }
  return out;
};

export default async () => PaginaShowcase({
  titulo: 'ECharts · Heatmap',
  descripcion: 'Heatmaps representan valores como intensidad de color en una matriz. Variantes: cartesiano (día/hora), calendario (GitHub contributions), correlación (matriz simétrica), geográfico (sobre mapa). Cuando hay muchos puntos, son más legibles que scatter.',
  decoracion: corner2(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Heatmap día × hora (tráfico web)',
      descripcion: 'Patrón clásico de analytics: cuándo visitan tu sitio. Eje X = horas, Y = días, color = intensidad.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            tooltip: { position: 'top', formatter: (p) => `${DIAS[p.value[1]]} ${HORAS[p.value[0]]}<br><strong>${p.value[2]}</strong> visitas` },
            grid: { left: 60, right: 30, top: 70, bottom: 60 },
            xAxis: { type: 'category', data: HORAS, splitArea: { show: true } },
            yAxis: { type: 'category', data: DIAS, splitArea: { show: true } },
            visualMap: {
              min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 10,
              inRange: { color: ['#dbeafe', '#3b82f6', '#8b5cf6', '#312e81'] },
              textStyle: { color: 'inherit' },
            },
            series: [{
              type: 'heatmap', data: datosCalendario,
              label: { show: false },
              itemStyle: { borderRadius: 3, borderWidth: 1, borderColor: 'transparent' },
              emphasis: { itemStyle: { shadowBlur: 14, shadowColor: 'rgba(0,0,0,0.4)' } },
            }],
          }),
        }),
        codigo: `series: [{
  type: 'heatmap',
  data: [
    [horaIdx, diaIdx, valor],
    [0, 0, 5.2],
    [1, 0, 3.8],
    // ...
  ],
}],
visualMap: {
  min: 0, max: 100,
  inRange: { color: ['#dbeafe', '#3b82f6', '#312e81'] },
}`,
      })],
    }),

    Seccion({
      titulo: '2 · Calendar heatmap (GitHub contributions)',
      descripcion: 'El icónico chart de GitHub — un cuadradito por día, color según actividad. Muestra patrones de actividad anual.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '240px',
          opcion: merge(opcionesBase(), {
            tooltip: { position: 'top', formatter: (p) => `${p.value[0]}<br><strong>${p.value[1]}</strong> commits` },
            visualMap: {
              show: false, min: 0, max: 16,
              inRange: { color: ['#1e293b22', '#9be9a8', '#40c463', '#30a14e', '#216e39'] },
            },
            calendar: {
              top: 50, left: 30, right: 30,
              cellSize: ['auto', 14],
              range: [
                generarCalendarioAnual()[0][0],
                generarCalendarioAnual().slice(-1)[0][0],
              ],
              itemStyle: { borderWidth: 2, borderColor: 'var(--background)' },
              splitLine: { show: false },
              dayLabel: { color: 'inherit', fontSize: 10, nameMap: ['D', 'L', 'M', 'X', 'J', 'V', 'S'] },
              monthLabel: { color: 'inherit', fontSize: 10, nameMap: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'] },
              yearLabel: { show: false },
            },
            series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: generarCalendarioAnual() }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `calendar: {
  range: ['2025-01-01', '2025-12-31'],
  cellSize: ['auto', 14],
  dayLabel: { nameMap: ['D', 'L', 'M', 'X', 'J', 'V', 'S'] },
},
series: [{
  type: 'heatmap',
  coordinateSystem: 'calendar',
  data: [['2025-03-15', 8], ['2025-03-16', 12], ...],
}]`,
      })],
    }),

    Seccion({
      titulo: '3 · Matriz de correlación',
      descripcion: 'Heatmap simétrico mostrando correlaciones entre features. Valores [-1, 1]: rojo = correlación negativa, verde = positiva, blanco = neutra.',
      hijos: [VistaCodigo({
        vista: (() => {
          const features = ['Edad', 'Ingreso', 'Gasto', 'Sesiones', 'NPS', 'Tickets'];
          const matriz = [
            [1.00, 0.42, 0.38, -0.18, 0.22, 0.05],
            [0.42, 1.00, 0.78, -0.32, 0.45, -0.12],
            [0.38, 0.78, 1.00, -0.28, 0.52, -0.18],
            [-0.18, -0.32, -0.28, 1.00, 0.18, 0.62],
            [0.22, 0.45, 0.52, 0.18, 1.00, -0.42],
            [0.05, -0.12, -0.18, 0.62, -0.42, 1.00],
          ];
          const datos = [];
          for (let i = 0; i < features.length; i++) for (let j = 0; j < features.length; j++) datos.push([j, i, matriz[i][j]]);
          return Echart({
            alto: '420px',
            opcion: merge(opcionesBase(), {
              tooltip: { position: 'top' },
              grid: { left: 80, right: 30, top: 50, bottom: 80 },
              xAxis: { type: 'category', data: features, splitArea: { show: true } },
              yAxis: { type: 'category', data: features, splitArea: { show: true } },
              visualMap: {
                min: -1, max: 1, calculable: true, orient: 'horizontal', left: 'center', bottom: 10,
                inRange: { color: ['#ef4444', '#fef3c7', '#10b981'] },
                textStyle: { color: 'inherit' },
              },
              series: [{
                type: 'heatmap', data: datos,
                label: { show: true, formatter: (p) => p.value[2].toFixed(2), fontSize: 11, color: '#1e293b' },
                itemStyle: { borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
              }],
            }),
          });
        })(),
        codigo: `// Matriz NxN, valores [-1, 1]
visualMap: {
  min: -1, max: 1,
  inRange: { color: ['#ef4444', '#fef3c7', '#10b981'] },
},
series: [{
  type: 'heatmap',
  data: [[0, 0, 1.0], [0, 1, 0.42], ...],
  label: { show: true, formatter: p => p.value[2].toFixed(2) },
}]`,
      })],
    }),

    Seccion({
      titulo: '4 · Heatmap de cohortes (retención)',
      descripcion: 'Patrón "cohort retention" de Mixpanel/Amplitude. Cada fila es la cohorte semanal, cada columna semanas después, valor = % retención.',
      hijos: [VistaCodigo({
        vista: (() => {
          const semanas = 12;
          const cohortes = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
          const semanasNum = Array.from({ length: semanas }, (_, i) => `+${i}`);
          const datos = [];
          for (let c = 0; c < cohortes.length; c++) {
            for (let s = 0; s < semanas; s++) {
              if (s + c >= semanas) continue;
              const decay = Math.exp(-s * 0.18) * 100 + Math.random() * 6 - 3;
              datos.push([s, c, +decay.toFixed(1)]);
            }
          }
          return Echart({
            alto: '380px',
            opcion: merge(opcionesBase(), {
              tooltip: { position: 'top', formatter: (p) => `Cohorte ${cohortes[p.value[1]]}<br>Semana ${semanasNum[p.value[0]]}<br><strong>${p.value[2]}%</strong>` },
              grid: { left: 60, right: 30, top: 50, bottom: 80 },
              xAxis: { type: 'category', data: semanasNum, position: 'top', name: 'Semana' },
              yAxis: { type: 'category', data: cohortes, name: 'Cohorte' },
              visualMap: {
                min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 10,
                inRange: { color: ['#fef9c3', '#facc15', '#f97316', '#dc2626'] },
                textStyle: { color: 'inherit' },
              },
              series: [{
                type: 'heatmap', data: datos,
                label: { show: true, formatter: (p) => p.value[2] + '%', fontSize: 10, color: '#1e293b' },
                itemStyle: { borderRadius: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
              }],
            }),
          });
        })(),
        codigo: `// Retención semanal: filas = cohortes, columnas = semanas después
xAxis: { data: ['+0', '+1', '+2', '+3', ...] },
yAxis: { data: ['S1', 'S2', 'S3', ...] },
series: [{
  type: 'heatmap',
  data: [[semanaIdx, cohorteIdx, %retencion]],
  label: { show: true, formatter: p => p.value[2] + '%' },
}]`,
      })],
    }),

    Seccion({
      titulo: '5 · Punch card (commits por día/hora)',
      descripcion: 'Variante con bubbles en lugar de cuadrados — usa `scatter` con `symbolSize` por valor. Look "GitHub punch card".',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            tooltip: { position: 'top', formatter: (p) => `${DIAS[p.value[1]]} ${HORAS[p.value[0]]}<br><strong>${p.value[2]}</strong> commits` },
            grid: { left: 60, right: 30, top: 60, bottom: 40 },
            xAxis: { type: 'category', data: HORAS, splitLine: { show: true, lineStyle: { color: 'rgba(120,120,120,0.06)' } } },
            yAxis: { type: 'category', data: DIAS, splitLine: { show: true, lineStyle: { color: 'rgba(120,120,120,0.06)' } } },
            series: [{
              type: 'scatter', data: datosCalendario,
              symbolSize: (v) => Math.max(2, v[2] * 0.45),
              itemStyle: {
                color: { type: 'radial', x: 0.5, y: 0.5, r: 0.5,
                  colorStops: [{ offset: 0, color: PALETA[0] }, { offset: 1, color: PALETA[5] }],
                },
                opacity: 0.85,
              },
            }],
          }),
        }),
        codigo: `series: [{
  type: 'scatter',                              // scatter, no heatmap
  data: [[hora, dia, valor], ...],
  symbolSize: v => v[2] * 0.45,                 // radio según valor
  itemStyle: { color: gradiente },
}]`,
      })],
    }),

  ],
});
