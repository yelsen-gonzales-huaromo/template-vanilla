import { crearEl } from '../../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../../components/ui/code-preview/code-preview.js';
import { Echart, opcionesBase, merge, PALETA, MESES } from '../_compartido.js';
import { corner1 } from '../../../../components/ui/card/card-decoraciones.js';

// Estilo base reutilizable para los ejes del radar (más limpio que el default)
const radarBase = (opts = {}) => ({
  splitArea: { areaStyle: { color: ['rgba(120,120,120,0.02)', 'rgba(120,120,120,0.06)'] } },
  splitLine: { lineStyle: { color: 'rgba(120,120,120,0.18)' } },
  axisLine:  { lineStyle: { color: 'rgba(120,120,120,0.22)' } },
  axisName:  { color: 'inherit', fontSize: 12, fontWeight: 600 },
  ...opts,
});

// Wrapper para grids de radares lado-a-lado
const grid = (...nodos) => crearEl('div', {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--space-3)',
  },
}, nodos);

const cell = (titulo, alto, opcion) => crearEl('div', {
  style: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
  },
}, [
  crearEl('div', {
    style: {
      padding: '10px 14px',
      borderBlockEnd: '1px solid var(--border)',
      fontSize: 'var(--text-xs)', fontWeight: 700,
      color: 'var(--muted-foreground)',
      textTransform: 'uppercase', letterSpacing: '0.05em',
    },
  }, [titulo]),
  Echart({ alto, opcion }),
]);

export default async () => PaginaShowcase({
  titulo: 'ECharts · Radar',
  descripcion: 'Radar charts (spider · star · web charts) para mostrar perfiles multivariables. 11 patrones que superan al template Falcon original: multi-grid lado-a-lado, anual de 12 meses con markers, capas con profundidad, gradient radial, perfiles de skills, gap analysis, marketing positioning. Todos con animación de entrada y dark-mode automático.',
  decoracion: corner1(),
  migas: [
    { etiqueta: 'Módulos', href: '#/modulos' },
    { etiqueta: 'Gráficos', href: '#/modulos/graficos' },
  ],
  hijos: [

    // ============== 1. BÁSICO ==============
    Seccion({
      titulo: '1 · Radar básico — perfil de producto',
      descripcion: 'Una serie con relleno semi-transparente y línea sólida. El más limpio para mostrar un solo perfil sin ruido visual.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '380px',
          opcion: merge(opcionesBase(), {
            radar: radarBase({
              indicator: [
                { name: 'Velocidad',     max: 100 },
                { name: 'Diseño',        max: 100 },
                { name: 'Calidad',       max: 100 },
                { name: 'Precio',        max: 100 },
                { name: 'Soporte',       max: 100 },
                { name: 'Documentación', max: 100 },
              ],
            }),
            series: [{
              type: 'radar',
              data: [{
                value: [88, 92, 85, 70, 78, 82], name: 'Producto',
                areaStyle: { color: PALETA[0] + '40' },
                lineStyle: { color: PALETA[0], width: 2.5 },
                itemStyle: { color: PALETA[0] },
                symbol: 'circle', symbolSize: 6,
              }],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `radar: {
  indicator: [
    { name: 'Velocidad', max: 100 },
    { name: 'Diseño',    max: 100 },
    // ...
  ],
},
series: [{
  type: 'radar',
  data: [{ value: [88, 92, 85, 70, 78, 82] }],
  areaStyle: {}, lineStyle: { width: 2.5 },
}]`,
      })],
    }),

    // ============== 2. MULTI-GRID (3 charts lado-a-lado) ==============
    Seccion({
      titulo: '2 · Multi-radar grid (4 · 5 · 6 ejes)',
      descripcion: 'Tres formas distintas en una sola fila: diamante (4 ejes para evaluación rápida), pentágono (5 ejes para feature comparison), hexágono (6 ejes para skills). Cada uno con varias series superpuestas creando profundidad.',
      hijos: [grid(
        // Diamante 4 ejes — UX evaluation
        cell('Brand · diamante 4 ejes', '320px', merge(opcionesBase(), {
          radar: radarBase({
            indicator: [
              { name: 'Brand',     max: 100 },
              { name: 'Features',  max: 100 },
              { name: 'Usability', max: 100 },
              { name: 'Content',   max: 100 },
            ],
          }),
          series: [{
            type: 'radar',
            data: [
              { value: [95, 90, 92, 85], name: 'Outer',  areaStyle: { color: '#94a3b8' + '33' }, lineStyle: { color: '#94a3b8' + '88', width: 1 }, symbol: 'none' },
              { value: [70, 75, 78, 65], name: 'Mid',    areaStyle: { color: PALETA[2] + '55' }, lineStyle: { color: PALETA[2], width: 2 }, itemStyle: { color: PALETA[2] }, symbol: 'circle', symbolSize: 5 },
              { value: [40, 50, 48, 38], name: 'Inner',  areaStyle: { color: PALETA[0] + '88' }, lineStyle: { color: PALETA[0], width: 2 }, itemStyle: { color: PALETA[0] }, symbol: 'circle', symbolSize: 5 },
            ],
          }],
          legend: undefined, xAxis: undefined, yAxis: undefined, grid: undefined,
        })),
        // Pentágono 5 ejes — Phone review
        cell('Smartphone · pentágono 5 ejes', '320px', merge(opcionesBase(), {
          radar: radarBase({
            indicator: [
              { name: 'Exterior',     max: 100 },
              { name: 'Pantalla',     max: 100 },
              { name: 'Performance',  max: 100 },
              { name: 'Sistema',      max: 100 },
              { name: 'Cámara',       max: 100 },
            ],
          }),
          series: [{
            type: 'radar',
            data: [
              { value: [98, 95, 96, 92, 98], name: 'iPhone 15 Pro', areaStyle: { color: PALETA[2] + '66' }, lineStyle: { color: PALETA[2], width: 2 }, itemStyle: { color: PALETA[2] }, symbol: 'circle', symbolSize: 5 },
              { value: [92, 96, 94, 88, 95], name: 'Galaxy S24',    areaStyle: { color: PALETA[3] + '66' }, lineStyle: { color: PALETA[3], width: 2 }, itemStyle: { color: PALETA[3] }, symbol: 'circle', symbolSize: 5 },
              { value: [88, 92, 95, 86, 92], name: 'Pixel 8 Pro',   areaStyle: { color: PALETA[5] + '66' }, lineStyle: { color: PALETA[5], width: 2 }, itemStyle: { color: PALETA[5] }, symbol: 'circle', symbolSize: 5 },
            ],
          }],
          xAxis: undefined, yAxis: undefined, grid: undefined,
        })),
        // Hexágono 6 ejes — Dev skills
        cell('Dev skills · hexágono 6 ejes', '320px', merge(opcionesBase(), {
          radar: radarBase({
            indicator: [
              { name: 'JS',     max: 10 },
              { name: 'CSS',    max: 10 },
              { name: 'React',  max: 10 },
              { name: 'Tests',  max: 10 },
              { name: 'A11y',   max: 10 },
              { name: 'Perf',   max: 10 },
            ],
          }),
          series: [{
            type: 'radar',
            data: [
              { value: [9, 8, 9, 7, 6, 8], name: 'Tu', areaStyle: { color: PALETA[0] + '55' }, lineStyle: { color: PALETA[0], width: 2.5 }, itemStyle: { color: PALETA[0] }, symbol: 'circle', symbolSize: 5 },
              { value: [8, 8, 8, 9, 8, 8], name: 'Senior',  areaStyle: { color: '#94a3b833' }, lineStyle: { color: '#94a3b8', width: 1.5, type: 'dashed' }, itemStyle: { color: '#94a3b8' }, symbol: 'circle', symbolSize: 4 },
            ],
          }],
          xAxis: undefined, yAxis: undefined, grid: undefined,
        })),
      )],
    }),

    // ============== 3. ANUAL 12 MESES ==============
    Seccion({
      titulo: '3 · Anual 12 meses — comparativa mensual',
      descripcion: 'Radar de 12 ejes (uno por mes) — el patrón ESTRELLA de Falcon, mejorado: año actual con relleno azul, año anterior con línea naranja punteada y markers visibles. Marca diferencias estacionales de un vistazo.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '460px',
          opcion: merge(opcionesBase(), {
            legend: { data: ['2025', '2024'], top: 10, right: 20, orient: 'horizontal' },
            radar: radarBase({
              shape: 'polygon',
              indicator: MESES.map((m) => ({ name: m, max: 12000 })),
              radius: '70%',
            }),
            series: [{
              type: 'radar',
              data: [
                {
                  value: [4200, 5100, 4750, 5800, 6420, 7150, 7890, 8240, 7680, 8820, 9250, 10540].map((v) => v),
                  name: '2025',
                  areaStyle: { color: PALETA[0] + '55' },
                  lineStyle: { color: PALETA[0], width: 2.5 },
                  itemStyle: { color: PALETA[0], borderColor: '#fff', borderWidth: 2 },
                  symbol: 'circle', symbolSize: 7,
                  emphasis: { areaStyle: { color: PALETA[0] + '88' } },
                },
                {
                  value: [3800, 4400, 4250, 5100, 5620, 6200, 6590, 6940, 6780, 7520, 7950, 8940],
                  name: '2024',
                  areaStyle: { color: '#f9731633' },
                  lineStyle: { color: '#f97316', width: 2, type: 'dashed' },
                  itemStyle: { color: '#f97316', borderColor: '#fff', borderWidth: 2 },
                  symbol: 'circle', symbolSize: 6,
                },
              ],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined,
          }),
        }),
        codigo: `radar: {
  indicator: MESES.map(m => ({ name: m, max: 12000 })),
  radius: '70%',
},
series: [{
  type: 'radar',
  data: [
    { value: [...12 valores...], name: '2025', symbol: 'circle', symbolSize: 7,
      areaStyle: { color: '#3b82f655' }, lineStyle: { width: 2.5 } },
    { value: [...12 valores...], name: '2024',
      lineStyle: { color: '#f97316', type: 'dashed' } },
  ],
}]`,
      })],
    }),

    // ============== 4. LAYERED DEPTH ==============
    Seccion({
      titulo: '4 · Capas con profundidad (multi-segment)',
      descripcion: 'Cuatro series concéntricas con opacidad progresiva creando un efecto "topográfico" — útil para mostrar percentiles (P25/P50/P75/P95), bands de confianza, o niveles de calidad.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '420px',
          opcion: merge(opcionesBase(), {
            legend: { data: ['P95', 'P75', 'P50', 'P25'], top: 10 },
            radar: radarBase({
              indicator: [
                { name: 'Latencia',    max: 100 },
                { name: 'Throughput',  max: 100 },
                { name: 'Reliability', max: 100 },
                { name: 'Disponibilidad', max: 100 },
                { name: 'Escalabilidad',  max: 100 },
                { name: 'Recovery',    max: 100 },
              ],
              radius: '72%',
            }),
            series: [{
              type: 'radar',
              data: [
                { value: [95, 92, 96, 98, 90, 94], name: 'P95', areaStyle: { color: PALETA[0] + '20' }, lineStyle: { color: PALETA[0] + '60', width: 1 }, symbol: 'none' },
                { value: [82, 78, 85, 88, 76, 80], name: 'P75', areaStyle: { color: PALETA[0] + '40' }, lineStyle: { color: PALETA[0] + '90', width: 1.5 }, symbol: 'none' },
                { value: [65, 60, 70, 75, 58, 64], name: 'P50', areaStyle: { color: PALETA[0] + '70' }, lineStyle: { color: PALETA[0], width: 2 }, itemStyle: { color: PALETA[0] }, symbol: 'circle', symbolSize: 5 },
                { value: [42, 38, 48, 52, 35, 40], name: 'P25', areaStyle: { color: PALETA[5] + '60' }, lineStyle: { color: PALETA[5], width: 2 }, itemStyle: { color: PALETA[5] }, symbol: 'circle', symbolSize: 5 },
              ],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined,
          }),
        }),
        codigo: `// Capas de afuera hacia adentro con opacidad progresiva
data: [
  { value: [95, 92, ...], name: 'P95', areaStyle: { color: '#3b82f620' } },  // muy translúcido
  { value: [82, 78, ...], name: 'P75', areaStyle: { color: '#3b82f640' } },
  { value: [65, 60, ...], name: 'P50', areaStyle: { color: '#3b82f670' } },
  { value: [42, 38, ...], name: 'P25', areaStyle: { color: '#ef444460' } },  // núcleo
]`,
      })],
    }),

    // ============== 5. CON MARKERS PROMINENTES ==============
    Seccion({
      titulo: '5 · Con markers prominentes (estilo Falcon mejorado)',
      descripcion: 'Símbolos grandes (rect/diamond/circle) con borde blanco — destacan los valores exactos en cada eje. Patrón Falcon, ahora con paleta moderna y línea con shadow.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '420px',
          opcion: merge(opcionesBase(), {
            legend: { data: ['Math', 'Science', 'Languages'], top: 10 },
            radar: radarBase({
              indicator: [
                { name: 'Inglés',     max: 130 },
                { name: 'Química',    max: 130 },
                { name: 'Física',     max: 130 },
                { name: 'Biología',   max: 130 },
                { name: 'Matemáticas', max: 130 },
                { name: 'Computación', max: 130 },
              ],
              radius: '70%',
            }),
            series: [{
              type: 'radar',
              data: [
                {
                  value: [120, 95, 110, 105, 130, 125], name: 'Math',
                  areaStyle: { color: PALETA[5] + '40' },
                  lineStyle: { color: PALETA[5], width: 2.5, shadowColor: PALETA[5], shadowBlur: 8 },
                  itemStyle: { color: PALETA[5], borderColor: '#fff', borderWidth: 3 },
                  symbol: 'rect', symbolSize: 9, symbolRotate: 45,
                },
                {
                  value: [95, 130, 120, 125, 110, 90], name: 'Science',
                  areaStyle: { color: PALETA[3] + '40' },
                  lineStyle: { color: PALETA[3], width: 2.5, shadowColor: PALETA[3], shadowBlur: 8 },
                  itemStyle: { color: PALETA[3], borderColor: '#fff', borderWidth: 3 },
                  symbol: 'circle', symbolSize: 10,
                },
                {
                  value: [130, 80, 75, 88, 92, 100], name: 'Languages',
                  areaStyle: { color: PALETA[1] + '40' },
                  lineStyle: { color: PALETA[1], width: 2.5, shadowColor: PALETA[1], shadowBlur: 8 },
                  itemStyle: { color: PALETA[1], borderColor: '#fff', borderWidth: 3 },
                  symbol: 'diamond', symbolSize: 11,
                },
              ],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined,
          }),
        }),
        codigo: `data: [{
  value: [...],
  symbol: 'rect',                    // 'circle' | 'rect' | 'diamond' | 'triangle'
  symbolSize: 9,
  itemStyle: {
    color: '#ef4444',
    borderColor: '#fff',
    borderWidth: 3,                  // borde blanco grueso = look moderno
  },
  lineStyle: {
    width: 2.5,
    shadowColor: '#ef4444',
    shadowBlur: 8,                   // glow sutil
  },
}]`,
      })],
    }),

    // ============== 6. GRADIENT FILL ==============
    Seccion({
      titulo: '6 · Gradient fill radial — efecto glow',
      descripcion: 'Relleno con gradiente radial desde el centro — visualmente impactante para hero charts y landings. Combina con shadow blur en la línea para look "neón".',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '420px',
          opcion: merge(opcionesBase(), {
            radar: radarBase({
              indicator: [
                { name: 'Awareness', max: 100 },
                { name: 'Consideration', max: 100 },
                { name: 'Conversion', max: 100 },
                { name: 'Retention', max: 100 },
                { name: 'Advocacy',  max: 100 },
                { name: 'Lifetime',  max: 100 },
              ],
              radius: '72%',
            }),
            series: [{
              type: 'radar',
              data: [{
                value: [88, 76, 62, 78, 92, 84], name: 'Marketing funnel',
                areaStyle: {
                  color: {
                    type: 'radial', x: 0.5, y: 0.5, r: 0.7,
                    colorStops: [
                      { offset: 0, color: '#06b6d4CC' },
                      { offset: 0.5, color: '#3b82f699' },
                      { offset: 1, color: '#8b5cf644' },
                    ],
                  },
                },
                lineStyle: {
                  width: 3,
                  color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
                    colorStops: [
                      { offset: 0, color: '#06b6d4' },
                      { offset: 1, color: '#8b5cf6' },
                    ],
                  },
                  shadowColor: '#3b82f6', shadowBlur: 18,
                },
                itemStyle: { color: '#06b6d4', borderColor: '#fff', borderWidth: 3, shadowColor: '#06b6d4', shadowBlur: 8 },
                symbol: 'circle', symbolSize: 9,
              }],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
          }),
        }),
        codigo: `data: [{
  value: [...],
  areaStyle: {
    color: {
      type: 'radial', x: 0.5, y: 0.5, r: 0.7,    // ← gradiente radial
      colorStops: [
        { offset: 0,   color: '#06b6d4CC' },     // centro intenso
        { offset: 0.5, color: '#3b82f699' },
        { offset: 1,   color: '#8b5cf644' },     // borde tenue
      ],
    },
  },
  lineStyle: {
    color: { type: 'linear', colorStops: [...] },// línea con gradient
    shadowColor: '#3b82f6', shadowBlur: 18,
  },
}]`,
      })],
    }),

    // ============== 7. CIRCLE SHAPE ==============
    Seccion({
      titulo: '7 · Polygon vs Circle — el shape importa',
      descripcion: 'Los polígonos transmiten precisión (6 vértices definidos); los círculos transmiten suavidad y completitud. Same data, two messages.',
      hijos: [grid(
        cell('Shape: polygon (default)', '320px', merge(opcionesBase(), {
          radar: radarBase({
            shape: 'polygon',
            indicator: [
              { name: 'Comunicación', max: 5 },
              { name: 'Liderazgo',    max: 5 },
              { name: 'Técnico',      max: 5 },
              { name: 'Producto',     max: 5 },
              { name: 'Colaboración', max: 5 },
              { name: 'Iniciativa',   max: 5 },
            ],
          }),
          series: [{
            type: 'radar',
            data: [{
              value: [4.2, 3.8, 4.5, 4.0, 4.4, 3.9], name: 'Q4',
              areaStyle: { color: PALETA[3] + '40' }, lineStyle: { color: PALETA[3], width: 2.5 },
              itemStyle: { color: PALETA[3] }, symbol: 'circle', symbolSize: 6,
            }],
          }],
          xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
        })),
        cell('Shape: circle', '320px', merge(opcionesBase(), {
          radar: radarBase({
            shape: 'circle',
            indicator: [
              { name: 'Comunicación', max: 5 },
              { name: 'Liderazgo',    max: 5 },
              { name: 'Técnico',      max: 5 },
              { name: 'Producto',     max: 5 },
              { name: 'Colaboración', max: 5 },
              { name: 'Iniciativa',   max: 5 },
            ],
          }),
          series: [{
            type: 'radar',
            data: [{
              value: [4.2, 3.8, 4.5, 4.0, 4.4, 3.9], name: 'Q4',
              areaStyle: { color: PALETA[2] + '40' }, lineStyle: { color: PALETA[2], width: 2.5 },
              itemStyle: { color: PALETA[2] }, symbol: 'circle', symbolSize: 6,
            }],
          }],
          xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
        })),
      )],
    }),

    // ============== 8. PERFORMANCE REVIEW (HR) ==============
    Seccion({
      titulo: '8 · Performance review — Q vs Q anterior',
      descripcion: 'Patrón HR clásico. Verde = trimestre actual con relleno; gris punteado = trimestre anterior. La diferencia visualizada al instante.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '420px',
          opcion: merge(opcionesBase(), {
            legend: { data: ['Q4 2025', 'Q3 2025'], top: 10 },
            radar: radarBase({
              indicator: [
                { name: 'Comunicación', max: 5 },
                { name: 'Liderazgo',    max: 5 },
                { name: 'Técnico',      max: 5 },
                { name: 'Producto',     max: 5 },
                { name: 'Colaboración', max: 5 },
                { name: 'Iniciativa',   max: 5 },
                { name: 'Aprendizaje',  max: 5 },
              ],
            }),
            series: [{
              type: 'radar',
              data: [
                { value: [4.2, 3.8, 4.5, 4.0, 4.4, 3.9, 4.6], name: 'Q4 2025',
                  areaStyle: { color: PALETA[3] + '50' },
                  lineStyle: { color: PALETA[3], width: 3, shadowColor: PALETA[3], shadowBlur: 6 },
                  itemStyle: { color: PALETA[3], borderColor: '#fff', borderWidth: 2 },
                  symbol: 'circle', symbolSize: 7 },
                { value: [3.8, 3.4, 4.2, 3.5, 4.0, 3.5, 4.0], name: 'Q3 2025',
                  areaStyle: { color: '#94a3b820' },
                  lineStyle: { color: '#94a3b8', width: 1.5, type: 'dashed' },
                  itemStyle: { color: '#94a3b8' },
                  symbol: 'circle', symbolSize: 5 },
              ],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined,
          }),
        }),
        codigo: `// Q actual destacado, Q previo en gris punteado
data: [
  { value: [4.2, 3.8, ...], name: 'Q4 2025',
    lineStyle: { width: 3, shadowColor: '#10b981', shadowBlur: 6 } },
  { value: [3.8, 3.4, ...], name: 'Q3 2025',
    lineStyle: { color: '#94a3b8', type: 'dashed' } },
]`,
      })],
    }),

    // ============== 9. COVERAGE / GAP ANALYSIS ==============
    Seccion({
      titulo: '9 · Coverage analysis — actual vs requerido vs ideal',
      descripcion: 'Tres líneas: lo que TIENES (relleno), lo que NECESITAS (dashed), lo que SERÍA IDEAL (dotted). Los gaps quedan en evidencia.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '420px',
          opcion: merge(opcionesBase(), {
            legend: { data: ['Stack actual', 'Requerido', 'Stack ideal'], top: 10 },
            radar: radarBase({
              indicator: [
                { name: 'Auth',      max: 100 },
                { name: 'Storage',   max: 100 },
                { name: 'Database',  max: 100 },
                { name: 'Realtime',  max: 100 },
                { name: 'Functions', max: 100 },
                { name: 'CDN',       max: 100 },
                { name: 'Analytics', max: 100 },
                { name: 'CI/CD',     max: 100 },
              ],
            }),
            series: [{
              type: 'radar',
              data: [
                { value: [85, 70, 95, 30, 60, 90, 55, 80], name: 'Stack actual',
                  areaStyle: { color: PALETA[0] + '50' },
                  lineStyle: { color: PALETA[0], width: 2.5 },
                  itemStyle: { color: PALETA[0], borderColor: '#fff', borderWidth: 2 },
                  symbol: 'circle', symbolSize: 6 },
                { value: [80, 75, 80, 75, 70, 85, 80, 80], name: 'Requerido',
                  areaStyle: { opacity: 0 },
                  lineStyle: { color: PALETA[5], width: 2, type: 'dashed' },
                  itemStyle: { color: PALETA[5] },
                  symbol: 'rect', symbolSize: 6 },
                { value: [95, 95, 95, 90, 90, 95, 95, 95], name: 'Stack ideal',
                  areaStyle: { opacity: 0 },
                  lineStyle: { color: PALETA[3], width: 1.5, type: 'dotted' },
                  itemStyle: { color: PALETA[3] },
                  symbol: 'triangle', symbolSize: 5 },
              ],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined,
          }),
        }),
        codigo: `data: [
  { value: [85, 70, ...], name: 'Stack actual',  lineStyle: { type: 'solid'  }, areaStyle: {} },
  { value: [80, 75, ...], name: 'Requerido',     lineStyle: { type: 'dashed' }, symbol: 'rect' },
  { value: [95, 95, ...], name: 'Stack ideal',   lineStyle: { type: 'dotted' }, symbol: 'triangle' },
]`,
      })],
    }),

    // ============== 10. SKILL PROFILES (4-up grid) ==============
    Seccion({
      titulo: '10 · Skill profiles — perfiles de equipo (4-up)',
      descripcion: 'Un radar mini por persona del equipo, en grilla. Útil para hiring panels, retro post-mortems, role calibration.',
      hijos: [grid(
        ...[
          ['María García',   PALETA[0], [9, 8, 9, 7, 6, 8]],
          ['Carlos Méndez',  PALETA[3], [7, 9, 6, 8, 9, 7]],
          ['Ana Torres',     PALETA[5], [8, 7, 8, 9, 7, 9]],
          ['Diego Ramos',    PALETA[1], [6, 8, 7, 6, 8, 9]],
        ].map(([nombre, color, valores]) => cell(nombre, '280px', merge(opcionesBase(), {
          radar: radarBase({
            indicator: [
              { name: 'JS', max: 10 }, { name: 'CSS', max: 10 }, { name: 'React', max: 10 },
              { name: 'BE', max: 10 }, { name: 'A11y', max: 10 }, { name: 'Tests', max: 10 },
            ],
            radius: '68%',
            axisName: { color: 'inherit', fontSize: 10, fontWeight: 600 },
          }),
          series: [{
            type: 'radar',
            data: [{
              value: valores, name: nombre,
              areaStyle: { color: color + '50' },
              lineStyle: { color, width: 2 },
              itemStyle: { color, borderColor: '#fff', borderWidth: 2 },
              symbol: 'circle', symbolSize: 5,
            }],
          }],
          xAxis: undefined, yAxis: undefined, grid: undefined, legend: undefined,
        }))),
      )],
    }),

    // ============== 11. MARKETING POSITIONING ==============
    Seccion({
      titulo: '11 · Marketing positioning — brand vs competidores',
      descripcion: 'Posicionamiento en 8 atributos clave. Tu marca destaca con relleno gradient + shadow; competidores como overlays sutiles. Ideal para presentaciones a board / RFPs.',
      hijos: [VistaCodigo({
        vista: Echart({
          alto: '480px',
          opcion: merge(opcionesBase(), {
            legend: { data: ['Tu marca', 'Competitor A', 'Competitor B'], top: 10 },
            radar: radarBase({
              indicator: [
                { name: 'Innovación',     max: 100 },
                { name: 'Precio',         max: 100 },
                { name: 'Calidad',        max: 100 },
                { name: 'Servicio',       max: 100 },
                { name: 'Brand',          max: 100 },
                { name: 'Market share',   max: 100 },
                { name: 'Distribución',   max: 100 },
                { name: 'Sostenibilidad', max: 100 },
              ],
              radius: '70%',
              axisName: { color: 'inherit', fontSize: 12, fontWeight: 700 },
            }),
            series: [{
              type: 'radar',
              data: [
                {
                  value: [92, 78, 88, 95, 82, 65, 80, 90], name: 'Tu marca',
                  areaStyle: {
                    color: { type: 'radial', x: 0.5, y: 0.5, r: 0.6,
                      colorStops: [
                        { offset: 0, color: PALETA[0] + 'CC' },
                        { offset: 1, color: PALETA[1] + '44' },
                      ],
                    },
                  },
                  lineStyle: { color: PALETA[0], width: 3, shadowColor: PALETA[0], shadowBlur: 12 },
                  itemStyle: { color: PALETA[0], borderColor: '#fff', borderWidth: 3 },
                  symbol: 'circle', symbolSize: 8,
                  emphasis: { lineStyle: { width: 4 } },
                },
                {
                  value: [70, 88, 76, 72, 90, 95, 92, 60], name: 'Competitor A',
                  areaStyle: { color: '#94a3b820' },
                  lineStyle: { color: '#94a3b8', width: 1.5, type: 'dashed' },
                  itemStyle: { color: '#94a3b8' },
                  symbol: 'rect', symbolSize: 5,
                },
                {
                  value: [60, 95, 68, 62, 78, 88, 85, 55], name: 'Competitor B',
                  areaStyle: { color: '#cbd5e120' },
                  lineStyle: { color: '#cbd5e1', width: 1.5, type: 'dotted' },
                  itemStyle: { color: '#cbd5e1' },
                  symbol: 'triangle', symbolSize: 5,
                },
              ],
            }],
            xAxis: undefined, yAxis: undefined, grid: undefined,
          }),
        }),
        codigo: `// Tu marca DESTACADA — competidores en gris/punteado
data: [
  { value: [...], name: 'Tu marca',
    areaStyle: { color: gradientRadial },
    lineStyle: { width: 3, shadowColor: '#3b82f6', shadowBlur: 12 },
    symbol: 'circle', symbolSize: 8,
  },
  { value: [...], name: 'Competitor A', lineStyle: { type: 'dashed' }, symbol: 'rect' },
  { value: [...], name: 'Competitor B', lineStyle: { type: 'dotted' }, symbol: 'triangle' },
]`,
      })],
    }),

  ],
});
