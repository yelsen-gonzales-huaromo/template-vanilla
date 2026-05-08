import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { ChartJs, PALETA, MESES, DIAS, ventasMensuales, ventasMensualesAnt, usuariosActivos, sesionesPromedio } from './_compartido.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

const COLOR = '#ff6384';

export default async () => PaginaShowcase({
  titulo: 'Chart.js',
  descripcion: 'Librería de charts más popular de la web (~70K stars). Renderiza con Canvas — perfecto para datasets medianos (hasta ~10K puntos) con animaciones suaves y tooltips ricos. Cubre los 8 tipos clásicos: línea · barras · radar · doughnut · pie · scatter · bubble · polarArea. Carga lazy ~75KB gzipped sólo cuando un chart entra en viewport.',
  decoracion: corner1(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    Seccion({
      titulo: '1 · Línea con área gradiente',
      descripcion: 'Una sola serie con `fill: true` y un gradiente como `backgroundColor`. El más usado en dashboards SaaS para "MRR", "DAUs", "Pageviews".',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'line',
          alto: '320px',
          datos: {
            labels: MESES,
            datasets: [{
              label: 'Ingresos 2025',
              data: ventasMensuales,
              borderColor: PALETA[0],
              backgroundColor: (ctx) => {
                const { ctx: c, chartArea } = ctx.chart;
                if (!chartArea) return PALETA[0];
                const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                g.addColorStop(0, PALETA[0] + 'AA');
                g.addColorStop(1, PALETA[0] + '08');
                return g;
              },
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: PALETA[0],
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2,
            }],
          },
          opciones: { plugins: { legend: { display: false } } },
        }),
        codigo: `new Chart(canvas, {
  type: 'line',
  data: {
    labels: MESES,
    datasets: [{
      data: ventas,
      borderColor: '#3b82f6',
      backgroundColor: gradiente(ctx),  // canvas gradient
      fill: true,
      tension: 0.4,                     // curva suave
      pointRadius: 0,                   // sin puntos en reposo
      pointHoverRadius: 6,
    }],
  },
});`,
      })],
    }),

    Seccion({
      titulo: '2 · Multi-serie comparativa',
      descripcion: 'Dos series para comparar año vs año (current vs prior). La línea de comparativa va punteada con opacidad reducida.',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'line',
          alto: '320px',
          datos: {
            labels: MESES,
            datasets: [
              { label: 'Este año',     data: ventasMensuales,    borderColor: PALETA[0], backgroundColor: PALETA[0], borderWidth: 3, tension: 0.4, pointRadius: 0, pointHoverRadius: 6 },
              { label: 'Año anterior', data: ventasMensualesAnt, borderColor: PALETA[1], backgroundColor: PALETA[1], borderWidth: 2, borderDash: [6, 6], tension: 0.4, pointRadius: 0, pointHoverRadius: 5 },
            ],
          },
        }),
        codigo: `datasets: [
  { label: 'Este año',     data: actual, borderColor: '#3b82f6' },
  { label: 'Año anterior', data: prior,  borderColor: '#8b5cf6', borderDash: [6, 6] },
]`,
      })],
    }),

    Seccion({
      titulo: '3 · Barras agrupadas',
      descripcion: 'Comparativa por categoría — ej. ingresos por canal cada mes. Las barras agrupadas se setean con datasets separados; cada barra hereda su color.',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'bar',
          alto: '320px',
          datos: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
              { label: 'Web',    data: [12000, 15400, 18200, 22800], backgroundColor: PALETA[0], borderRadius: 6, borderSkipped: false },
              { label: 'Mobile', data: [8400, 11200, 14600, 19200],  backgroundColor: PALETA[1], borderRadius: 6, borderSkipped: false },
              { label: 'API',    data: [3200, 4400, 5800, 7400],     backgroundColor: PALETA[3], borderRadius: 6, borderSkipped: false },
            ],
          },
        }),
        codigo: `// Barras con borderRadius para look moderno
datasets: [
  { label: 'Web',    data: [...], backgroundColor: '#3b82f6', borderRadius: 6 },
  { label: 'Mobile', data: [...], backgroundColor: '#8b5cf6', borderRadius: 6 },
  { label: 'API',    data: [...], backgroundColor: '#10b981', borderRadius: 6 },
]`,
      })],
    }),

    Seccion({
      titulo: '4 · Barras apiladas (stacked)',
      descripcion: 'Cuando lo importante es el TOTAL por categoría y la composición secundaria. Activa con `stacked: true` en escalas.',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'bar',
          alto: '320px',
          datos: {
            labels: DIAS,
            datasets: [
              { label: 'Email',     data: [120, 95, 140, 165, 110, 60, 30],  backgroundColor: PALETA[0], borderRadius: 4 },
              { label: 'Push',      data: [80, 110, 95, 140, 95, 50, 25],    backgroundColor: PALETA[1], borderRadius: 4 },
              { label: 'In-app',    data: [60, 75, 85, 95, 70, 30, 15],      backgroundColor: PALETA[3], borderRadius: 4 },
              { label: 'SMS',       data: [40, 35, 50, 65, 45, 20, 10],      backgroundColor: PALETA[4], borderRadius: 4 },
            ],
          },
          opciones: {
            scales: { x: { stacked: true }, y: { stacked: true } },
          },
        }),
        codigo: `options: {
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
}`,
      })],
    }),

    Seccion({
      titulo: '5 · Doughnut con leyenda lateral',
      descripcion: 'Donut chart clásico. `cutout: 70%` para el agujero grande estilo moderno. Idéntico al chart de "Sources" en Stripe Dashboard.',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'doughnut',
          alto: '320px',
          datos: {
            labels: ['Orgánico', 'Pago', 'Referido', 'Email', 'Social'],
            datasets: [{
              data: [42, 18, 22, 12, 6],
              backgroundColor: PALETA.slice(0, 5),
              borderWidth: 0,
              hoverOffset: 12,
            }],
          },
          opciones: {
            cutout: '70%',
            plugins: {
              legend: { position: 'right', align: 'center' },
            },
          },
        }),
        codigo: `new Chart(canvas, {
  type: 'doughnut',
  data: { labels, datasets: [{ data, backgroundColor: PALETA }] },
  options: {
    cutout: '70%',                    // agujero grande
    plugins: { legend: { position: 'right' } },
  },
});`,
      })],
    }),

    Seccion({
      titulo: '6 · Radar — perfil de habilidades',
      descripcion: 'Para comparar dimensiones múltiples: skills, performance review, atributos de un producto.',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'radar',
          alto: '340px',
          datos: {
            labels: ['Velocidad', 'Diseño', 'Calidad', 'Precio', 'Soporte', 'Documentación'],
            datasets: [
              { label: 'Producto A', data: [88, 92, 85, 70, 78, 82], borderColor: PALETA[0], backgroundColor: PALETA[0] + '33', borderWidth: 2, pointBackgroundColor: PALETA[0] },
              { label: 'Producto B', data: [76, 88, 82, 90, 65, 70], borderColor: PALETA[5], backgroundColor: PALETA[5] + '33', borderWidth: 2, pointBackgroundColor: PALETA[5] },
            ],
          },
          opciones: {
            scales: {
              r: {
                beginAtZero: true, max: 100,
                grid: { color: 'rgba(120,120,120,0.15)' },
                angleLines: { color: 'rgba(120,120,120,0.15)' },
                pointLabels: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || '#64748b' },
              },
            },
          },
        }),
        codigo: `new Chart(canvas, {
  type: 'radar',
  data: {
    labels: ['Velocidad', 'Diseño', 'Calidad', 'Precio', 'Soporte', 'Documentación'],
    datasets: [
      { label: 'Producto A', data: [88, 92, 85, 70, 78, 82], borderColor: '#3b82f6' },
      { label: 'Producto B', data: [76, 88, 82, 90, 65, 70], borderColor: '#ef4444' },
    ],
  },
});`,
      })],
    }),

    Seccion({
      titulo: '7 · PolarArea — métricas radiales',
      descripcion: 'Variante visual del pie con sectores de ángulo igual pero radio variable. Útil para mostrar "fuerza" o "magnitud" de cada categoría.',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'polarArea',
          alto: '340px',
          datos: {
            labels: ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Data', 'AI'],
            datasets: [{
              data: [42, 38, 22, 28, 18, 14],
              backgroundColor: PALETA.slice(0, 6).map((c) => c + 'CC'),
              borderWidth: 0,
            }],
          },
          opciones: {
            scales: {
              r: { ticks: { backdropColor: 'transparent' }, grid: { color: 'rgba(120,120,120,0.15)' } },
            },
            plugins: { legend: { position: 'right' } },
          },
        }),
        codigo: `new Chart(canvas, {
  type: 'polarArea',
  data: { labels, datasets: [{ data, backgroundColor: PALETA }] },
});`,
      })],
    }),

    Seccion({
      titulo: '8 · Scatter — correlación con regresión visual',
      descripcion: 'Cada punto es un par (x, y). Útil para ver correlaciones (ej. precio vs satisfacción). Los puntos pueden tener tamaños distintos (bubble).',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'scatter',
          alto: '320px',
          datos: {
            datasets: [{
              label: 'Clientes',
              data: Array.from({ length: 60 }, () => ({
                x: 10 + Math.random() * 90,
                y: 20 + Math.random() * 80 + Math.random() * 20,
              })),
              backgroundColor: PALETA[0] + '99',
              borderColor: PALETA[0],
              pointRadius: 6,
              pointHoverRadius: 9,
            }],
          },
          opciones: {
            scales: {
              x: { title: { display: true, text: 'Tiempo de uso (min)' } },
              y: { title: { display: true, text: 'Satisfacción (NPS)' } },
            },
            plugins: { legend: { display: false } },
          },
        }),
        codigo: `new Chart(canvas, {
  type: 'scatter',
  data: {
    datasets: [{
      data: [{x: 12, y: 65}, {x: 24, y: 80}, ...],   // puntos (x, y)
      pointRadius: 6,
    }],
  },
});`,
      })],
    }),

    Seccion({
      titulo: '9 · Bubble — 3 dimensiones',
      descripcion: 'Como scatter, pero el `r` (radio) representa una tercera dimensión. Clásico para "Países" donde X=ingresos, Y=esperanza de vida, R=población.',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'bubble',
          alto: '320px',
          datos: {
            datasets: [
              {
                label: 'Producto A',
                data: [{ x: 20, y: 30, r: 14 }, { x: 40, y: 60, r: 24 }, { x: 25, y: 55, r: 18 }],
                backgroundColor: PALETA[0] + '99',
              },
              {
                label: 'Producto B',
                data: [{ x: 65, y: 45, r: 22 }, { x: 80, y: 75, r: 16 }, { x: 70, y: 25, r: 12 }],
                backgroundColor: PALETA[5] + '99',
              },
              {
                label: 'Producto C',
                data: [{ x: 50, y: 50, r: 30 }, { x: 35, y: 80, r: 14 }, { x: 90, y: 90, r: 20 }],
                backgroundColor: PALETA[3] + '99',
              },
            ],
          },
        }),
        codigo: `// Bubble: cada punto tiene { x, y, r }
data: [
  { x: 20, y: 30, r: 14 },        // x=eje, y=eje, r=tamaño del bubble
  { x: 40, y: 60, r: 24 },
]`,
      })],
    }),

    Seccion({
      titulo: '10 · Mixed — barras + línea',
      descripcion: 'Dos tipos en el mismo chart. Barras para volumen + línea para tendencia. Patrón Stripe / Mixpanel para "ingresos + cohorte".',
      hijos: [VistaCodigo({
        vista: ChartJs({
          tipo: 'bar',
          alto: '320px',
          datos: {
            labels: MESES,
            datasets: [
              {
                type: 'bar',
                label: 'Usuarios nuevos',
                data: usuariosActivos,
                backgroundColor: PALETA[0] + '99',
                borderRadius: 6, borderSkipped: false,
                yAxisID: 'y',
              },
              {
                type: 'line',
                label: 'Sesión promedio (min)',
                data: sesionesPromedio,
                borderColor: PALETA[5],
                backgroundColor: PALETA[5],
                tension: 0.4, borderWidth: 3,
                pointRadius: 4, pointHoverRadius: 6,
                yAxisID: 'y1',
              },
            ],
          },
          opciones: {
            scales: {
              y:  { type: 'linear', position: 'left' },
              y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } },
            },
          },
        }),
        codigo: `// Mixed: cada dataset puede definir su propio "type"
datasets: [
  { type: 'bar',  data: volumenes, yAxisID: 'y'  },
  { type: 'line', data: promedio,  yAxisID: 'y1' },
],
options: {
  scales: {
    y:  { position: 'left'  },
    y1: { position: 'right' },
  },
}`,
      })],
    }),

  ],
});
